<template>
    <h2 class="pb-3">Admin</h2>
    <div v-if="isDataLoaded">
        <h4>List of Users</h4>
        <v-card class="ma-5 rounded-xl" v-for="user in usersList" :key="user.email">
            <v-card-title>
                {{ user.username }} 
            </v-card-title>
            <v-card-subtitle class="mb-4">{{ user.createdRecipes.length }} Recipes</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-card-subtitle @click="toggleCard(user.email)">{{ show === user.email ? 'Show less' : 'Show more' }}</v-card-subtitle>
                <v-btn :icon="show === user.email ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="toggleCard(user.email)"></v-btn>
            </v-card-actions>
            <v-expand-transition>
                <div v-show="show === user.email" class="recipe-list pb-5">
                    <p class="pb-1" v-for="(recipe) in user.createdRecipes" :key="recipe.id">
                        <v-btn class="mx-2 my-1" density="compact" icon="mdi-flag-outline" :color="isFlagActive(recipe.id) ? 'orange' : 'white'" @click="toggleFlag(recipe.id)"></v-btn>{{ recipe.id }}
                    </p>
                </div>
            </v-expand-transition>
        </v-card>
        <v-btn class="bg-grey-darken-3 text-white mt-2" @click="flagRecipes">Confirm Changes</v-btn>
    </div>
    
    <p v-else>Loading...</p>
</template>
<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useStore } from 'vuex'

const store = useStore()
const usersList = ref([]);
const recipes = computed(() => store.state.recipes);
const isDataLoaded = ref(false);
const show = ref(null);

const flaggedUsers = ref([]);

const toggleCard = (email) => {
  show.value = show.value === email ? null : email;
}

const toggleFlag = (recipe) => {
    if (flaggedUsers.value.length > 0 && isDataLoaded.value) {
        flaggedUsers.value.forEach(userFlags => {
            userFlags.flags.forEach(obj => {
                if (obj.recipe === recipe) {
                    obj.isFlagged = !obj.isFlagged;
                }
            });
        });
    }
}

const isFlagActive = (recipe) => {
    if(flaggedUsers.value.length > 0 && isDataLoaded.value) {
        let isFlagged = flaggedUsers.value;
        return isFlagged.some(userFlags =>
            userFlags.flags.some(obj => obj.recipe === recipe && obj.isFlagged === true)
        );
    }

    return false;
}

const flagRecipes = async () => {
    const payload = flaggedUsers.value
        .map(user => user.flags)
        .reduce((acc, flagsArray) => acc.concat(flagsArray), []);

    store.dispatch("setFlags", payload);
}

onMounted(() => {
    store.dispatch("getAllUsers");
    store.dispatch("loadAllRecipes");
})

watch(
    () => store.state.usersList,
    (newData) => {
        usersList.value = newData.filter(user => user.username != "Admin");
        // load flagging array
        let arr = [];
        let tempFlag = [];
        for(let i = 0; i < usersList.value.length; i++){
            for(let j = 0; j < usersList.value[i].createdRecipes.length; j++){
                tempFlag = recipes.value.filter(r => r.title === usersList.value[i].createdRecipes[j].id);
                arr.push({recipe: usersList.value[i].createdRecipes[j].id, isFlagged: tempFlag[0].flag})

                tempFlag = [];
            }
            flaggedUsers.value.push({flags: [...arr]});
            arr = [];
        }

        isDataLoaded.value = true;
    }
);

</script>

<style scoped>
.recipe-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}
    
</style>