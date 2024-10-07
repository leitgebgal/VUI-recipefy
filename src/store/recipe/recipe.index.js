import { CREATE_RECIPE, ADD_COMMENT, ADD_LIKE, DELETE_RECIPE, EDIT_RECIPE } from "./recipe.actions";
import { SET_RECIPE, SET_COMMENTS, SET_LIKES } from "./recipe.mutations";
import { db, storage } from '../../firebase/init'
import { updateDoc, arrayUnion, doc, setDoc, getDoc, deleteDoc, arrayRemove } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const recipe = {
  state: {
    title: '',
    image: null,
    categories: [],
    description: '',
    ingredients: [{ quantity: 0, unit: '', name: '' }],
    prepTime: 0,
    createdBy: null,
    likes: [],
    comments: [],
  },
  mutations: {
    [SET_RECIPE](state, payload) {
      const fileUrl = payload.email + "/" + payload.image;
      const storageRef = ref(storage, fileUrl);
      getDownloadURL(storageRef).then((url) => {
        state.image = url;
      });
      state.title = payload.title
      state.categories = payload.categories
      state.description = payload.description
      state.ingredients = payload.ingredients
      state.prepTime = payload.prepTime
      state.createdBy = payload.email;
    },
    [SET_COMMENTS](state, payload) {
      state.comments.push(payload);
    },
    [SET_LIKES](state, payload) {
      state.likes.push(payload);
    }
  },
  actions: {
    [CREATE_RECIPE]({ commit }, payload) {
      // add image to Cloud Storage
      const fileUrl = payload.email + "/" + payload.recipe.image[0].name
      const storageRef = ref(storage, fileUrl);
      uploadBytes(storageRef, payload.recipe.image[0]).then(() => {
        // add recipe to Firestore
        const dataObj = {
          title: payload.recipe.title,
          image: payload.recipe.image[0].name,
          description: payload.recipe.description,
          prepTime: payload.recipe.prepTime,
          categories: payload.recipe.categories,
          ingredients: payload.recipe.ingredients,
          likes: [],
          comments: [],
          createdBy: payload.email,
          flag: false
        }
        const docRef = doc(db, "recipes", payload.recipe.title);
        setDoc(docRef, dataObj).then(() => {
          // after adding recipe to collection, add recipe to user prop 'createdRecipes'
          const userDocRef = doc(db, "users", payload.email);
          const recipeRef = doc(db, "recipes", payload.recipe.title);

          updateDoc(userDocRef, {
            createdRecipes: arrayUnion(recipeRef)
          });
        })
      })
    },
    [DELETE_RECIPE]({ commit }, payload) {
      // remove recipe document
      const recipeRef = doc(db, "recipes", payload.title);
      const userRef = doc(db, "users", payload.email);
      deleteDoc(recipeRef).then(() => {
        // remove recipe field from user/createdRecipes
        updateDoc(userRef, { createdRecipes: arrayRemove(recipeRef) }).then(() => {
          // remove image from storage
          const fileRef = ref(storage, payload.email + "/" + payload.image);
          deleteObject(fileRef)
        });
      })
    },
    [EDIT_RECIPE]({ commit }, payload) {
      const recipeRef = doc(db, "recipes", payload.recipe.title);
      if (payload.newImage != null) {
        // add new image to storage
        const fileUrl = payload.email + "/" + payload.newImage[0].name
        const storageRef = ref(storage, fileUrl);
        uploadBytes(storageRef, payload.newImage[0]).then(() => {
          //update document
          updateDoc(recipeRef, {
            image: payload.newImage[0].name,
            description: payload.recipe.description,
            prepTime: payload.recipe.prepTime,
            categories: payload.recipe.categories,
            ingredients: payload.recipe.ingredients,
          }).then(() => {
            // delete old image
            const oldImageRef = ref(storage, payload.email + "/" + payload.recipe.image)
            deleteObject(oldImageRef);
          });
        })
      } else {
        updateDoc(recipeRef, {
          description: payload.recipe.description,
          prepTime: payload.recipe.prepTime,
          categories: payload.recipe.categories,
          ingredients: payload.recipe.ingredients,
        });
      }
    },
    [ADD_COMMENT]({ commit }, payload) {
      const recipeRef = doc(db, "recipes", payload.title);
      updateDoc(recipeRef, {
        comments: arrayUnion(payload.comment)
      }).then(() => {
        commit(SET_COMMENTS, payload.comment);
      })
    },
    [ADD_LIKE]({ commit }, payload) {
      const recipeRef = doc(db, "recipes", payload.title);

      getDoc(recipeRef).then((snapshot) => {
        const ratingArray = snapshot.data().likes || [];

        const newArray = ratingArray.filter(o => o.user !== payload.rating.user);
        newArray.push(payload.rating)

        return updateDoc(recipeRef, { likes: newArray })
      }).then(() => {
        commit(SET_LIKES, payload.rating);
      })
    },
  }
};

export default recipe;