import { createStore } from 'vuex'
import recipe from './recipe/recipe.index'
import { CREATE_USER, LOGIN_USER, LOGOUT_USER, LOAD_RECIPES, ADD_USER, LOAD_ALL_RECIPES, GET_ALL_USERS, SET_FLAGS } from './actions'
import { SET_USER, SET_AUTH_IS_READY, SET_ERROR, SET_RECIPES, CLEAR_ERROR, SET_MY_RECIPES, SET_USERS_LIST, SET_IS_LOADING } from './mutations'

// firestore
import { auth, db, storage } from '../firebase/init.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth'
import { ref, getDownloadURL } from 'firebase/storage'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'

const store = createStore({
    state: {
        usersList: [],
        user: null,
        authIsReady: false,
        recipes: [],
        myRecipes: [],
        error: null,
        isLoading: true
    },
    mutations: {
        [SET_USER](state, payload) {
            state.user = payload;
        },
        [SET_USERS_LIST](state, payload){
            state.usersList = payload;
        },
        [SET_AUTH_IS_READY](state, payload) {
            state.authIsReady = payload;
        },
        [SET_RECIPES](state, payload) {
            state.recipes = payload;
        },
        [SET_MY_RECIPES](state, payload) {
            state.myRecipes = payload;
        },
        [SET_IS_LOADING](state, payload){
            state.isLoading = payload;
        },
        [SET_ERROR](state, payload) {
            switch (payload) {
                case 'auth/email-already-exists':
                    state.error = "The provided email is already in use by an existing user.";
                    break;
                case 'auth/invalid-email':
                    state.error = "Invalid email address";
                    break;
                case 'auth/weak-password':
                    state.error = "Password must be at least 6 characters long.";
                    break;
                case 'auth/wrong-password':
                    state.error = "The provided password is incorrect.";
                    break;
                case 'auth/user-not-found':
                    state.error = "The provided user does not exist.";
                    break;
                default:
                    state.error = payload;
                    break;
            }
        },
        [CLEAR_ERROR](state) {
            state.error = null;
        }
    },
    actions: {
        [ADD_USER]({ commit }, payload) {
            setDoc(doc(db, "users", payload.email), {
                email: payload.email,
                username: payload.username,
                createdRecipes: [],
                likedRecipes: []
            }).catch((error) => {
                commit(SET_ERROR, error.code);
            });
        },
        [CREATE_USER]({ commit }, payload) {
            createUserWithEmailAndPassword(auth, payload.email, payload.password)
                .then((credential) => {
                    // Set username
                    updateProfile(auth.currentUser, { displayName: payload.username })
                        .then(() => {
                            // Add user to state
                            commit(SET_USER, credential.user);
                            commit(CLEAR_ERROR);
                        }).then(() => {
                            this.dispatch(ADD_USER, { email: payload.email, username: payload.username })
                        })
                })
                .catch((error) => {
                    commit(SET_ERROR, error.code);
                })
        },
        [LOGIN_USER]({ commit }, payload) {
            signInWithEmailAndPassword(auth, payload.email, payload.password)
                .then((credential) => {
                    // Add user to state
                    commit(SET_USER, credential.user);
                    commit(CLEAR_ERROR);
                })
                .catch((error) => {
                    commit(SET_ERROR, error.code);
                })
        },
        [LOGOUT_USER]({ commit }) {
            signOut(auth)
                .then(() => {
                    commit(SET_USER, null);
                    commit(CLEAR_ERROR);
                })
                .catch((error) => {
                    commit(SET_ERROR, error.code);
                })
        },
        [GET_ALL_USERS]({ commit }){
            getDocs(collection(db, "users")).then(async (snapshots) => {
                const users = [];
                for (const user of snapshots.docs) {
                    users.push(user.data());
                }
                return users;
            }).then((users) => {
                commit(SET_USERS_LIST, users);
            }).catch((error) => {
                commit(SET_ERROR, error.code);
            })
        },
        [LOAD_RECIPES]({ commit }, payload) {
            return getDoc(doc(db, "users", payload.email))
                .then(async (snapshot) => {
                    const recipeRefs = snapshot.data().createdRecipes;
                    const recipePromises = recipeRefs.map(async (recipeRef) => {
                        const recipeSnapshot = await getDoc(recipeRef);
                        const fileUrl = payload.email + "/" + recipeSnapshot.data().image;
                        const storageRef = ref(storage, fileUrl);
                        const url = await getDownloadURL(storageRef);

                        return {
                            ...recipeSnapshot.data(),
                            imageUrl: url,
                        };
                    });

                    // Wait for all recipePromises to be resolved
                    return Promise.all(recipePromises);
                })
                .then((recipes) => {
                    commit(SET_MY_RECIPES, recipes);
                    return recipes;
                })
                .catch((error) => {
                    commit(SET_ERROR, error.code);
                    return Promise.reject(error.code);
                });
        },
        [LOAD_ALL_RECIPES]({ commit }) {
            getDocs(collection(db, "recipes")).then(async (snapshots) => {
                const recipes = [];
                for (const element of snapshots.docs) {
                    const fileUrl = element.data().createdBy + "/" + element.data().image
                    const storageRef = ref(storage, fileUrl);
                    const url = await getDownloadURL(storageRef);
                    recipes.push({ ...element.data(), imageUrl: url })
                }
                return recipes;
            }).then((recipes) => {
                commit(SET_RECIPES, recipes);
            }).catch((error) => {
                commit(SET_ERROR, error.code);
            })
        },
        async [SET_FLAGS]({ commit }, payload) {
            commit(SET_IS_LOADING, true);
            
            const promises = [];
            for (const item of payload) {
                const { recipe, isFlagged } = item;
                const docRef = doc(db, 'recipes', recipe);
                const updatePromise = updateDoc(docRef, {
                    flag: isFlagged
                }).catch((error) => {
                    console.log("Error");
                    commit(SET_ERROR, error.code);
                });
        
                promises.push(updatePromise);
            }
        
            Promise.all(promises).then(() => {
                console.log("Done");
                commit(SET_IS_LOADING, false);
            }).catch((error) => {
                console.log("Error");
                commit(SET_ERROR, error.code);
            });
        }
    },
    modules: {
        recipe: {
            namespaced: true,
            ...recipe
        }
    }
})

// checks if user is logged in or not
const unsub = onAuthStateChanged(auth, (user) => {
    store.commit(SET_AUTH_IS_READY, true);
    store.commit(SET_USER, user);

    // This makes it only fire once
    unsub();
});

export default store;