<template>
    <v-container align="center">
        <v-row justify="center">
            <h2>My Recipes</h2>
        </v-row>
        <v-row justify="center">
            <v-btn class="bg-grey-darken-3 text-white mt-2" prepend-icon="mdi-plus" @click="router.push({ path: '/recipeForm/add' })">Add Recipe</v-btn>
        </v-row>
        <v-row justify="center" v-if="isDataLoaded && recipes.length > 0">
            <RecipeList :recipes="recipes"/>
        </v-row>
        <v-row justify="center" v-else-if="recipes === undefines || recipes.length === 0">
            <p>No recipes...</p>
        </v-row>
        <v-row justify="center" v-else>
            <p>Loading recipes...</p>
        </v-row>
       
    </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex'
import RecipeList from './recipe/RecipeList.vue'

const router = useRouter()
const store = useStore()
const email = ref('');

const recipes = ref([]);
const isDataLoaded = ref(false);

async function fetchRecipes(){
    email.value = store.state.user.email;
    await store.dispatch("loadRecipes", {email: email.value })
}

watch(
    () => store.state.myRecipes,
    (newData) => {
        recipes.value = newData;
        isDataLoaded.value = true;
    }
);

onMounted(() => {
    if(store.state.myRecipes.length != 0){
        recipes.value = store.state.myRecipes;
        isDataLoaded.value = true;
    }
    fetchRecipes();
})
</script>