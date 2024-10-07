<template>
    <v-container align="center">
        <v-row class="pb-5" justify="center">
            <h2>Home</h2>
        </v-row>
        <v-row style="width: 50%;">
            <v-text-field rounded variant="solo" v-model="searchQuery" label="Search for recipes" append-inner-icon="mdi-magnify"></v-text-field>
        </v-row>
        <v-row justify="center" v-if="isDataLoaded && recipes.length > 0">
            <div class="d-flex flex-wrap justify-center">
                <v-card class="ma-5 rounded-xl" v-for="recipe in filteredItems" :key="recipe.title" @click="fetchRecipe(recipe.title)">
                    <v-img
                    :src="recipe.imageUrl"
                    height="200px"
                    width="300px"
                    cover
                    ></v-img>
                    <v-card-title>
                        {{ recipe.title }}
                    </v-card-title>
                    <v-card-subtitle class="pb-3">
                        <div class="d-flex flex-column">
                            <span class="pb-2" v-if="recipe.likes.length > 0">
                                <v-icon color="amber" icon="mdi-star" /> {{displayAverageRating(recipe.likes) + " (" + recipe.likes.length + ")"}}
                            </span>
                            <span class="pb-2" v-else>
                                <v-icon color="amber" icon="mdi-star" /> 0 (0)
                            </span>
                            <div>
                                <v-chip class="mx-1 my-1" v-for="category in recipe.categories" :key="category" :color="getCategoryColor(category)" :prepend-icon="getCategoryIcon(category)" variant="outlined">
                                    {{ category }}
                                </v-chip>
                            </div>
                        </div>
                        
                    </v-card-subtitle>
                    <v-card-text>
                        Created by: {{ recipe.createdBy }}
                    </v-card-text>
                </v-card>
            </div>
        </v-row>
        <v-row justify="center" v-else-if="isDataLoaded && recipes.length < 1">
            <p>No Recipes Available</p>
        </v-row>
        <v-row justify="center" v-else>
            <p>Loading recipes...</p>
        </v-row>
       
    </v-container>
</template>
<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';
import { getCategoryColor, getCategoryIcon } from '../helperFunctions';

const store = useStore()
const router = useRouter();
const recipes = ref([]);
const isDataLoaded = ref(false);

// search filter
const searchQuery = ref("");

const filteredItems = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();

    if(query === ""){
        return recipes.value;
    }
    else {
        return recipes.value.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(query);
            const categoryMatch = item.categories.some(category => category.toLowerCase().includes(query));

            return titleMatch || categoryMatch;
        })
    }
})

async function fetchAll() {
   await store.dispatch("loadAllRecipes")
}

async function fetchRecipe(title){
    router.push({
        name: 'recipeDetail',
        params: { title: title }
    })
}

const displayAverageRating = (likes) => {
    let sum = 0;
    for(let i = 0; i < likes.length; i++){
        sum += likes[i].value;
    }
    return sum / likes.length;
}

watch(
    () => store.state.recipes,
    (newData) => {
        recipes.value = newData;
        isDataLoaded.value = true;
    }
);

onMounted(async() => {
    if(store.state.recipes.length != 0){
        recipes.value = store.state.recipes;
        isDataLoaded.value = true;
    }
    await fetchAll();
    
})
</script>