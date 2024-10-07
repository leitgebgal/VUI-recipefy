<template>
    <v-container align="center">
        <v-row justify="center">
            <h2>Profile</h2>
        </v-row>
        <p class="mt-3" v-if="isLoading && myRecipes === undefined">Loading...</p>
        <p class="mt-3" v-else-if="!isLoading && myRecipes.length === 0">No statistics available</p>
        <v-row justify="center" v-else-if="dataReady">
            <v-col>
                <h3>Personal Data</h3>
                <v-row>
                    <v-col>
                        <p><i>Username:</i> {{ user.displayName }}</p>
                        <p><i>Email:</i> {{ user.email }}</p>
                        <p><i>Created On:</i> {{ user.metadata.creationTime }}</p>
                    </v-col>
                </v-row>
            </v-col>
            <v-col>
                <h3>Statistics</h3>
                <v-row>
                    <v-col>
                        <p>Recipes Created: {{ myRecipes.length }}</p>
                        <p>Most Rated Recipe: {{ mostRated }}</p>
                        <p>Top Rated Recipe: {{ topRated }}</p>
                        <p>Most Commented Recipe: {{ mostCommented }}</p>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useStore } from 'vuex'

const isLoading = ref(true);
const dataReady = ref(false);

const store = useStore()
const user = computed(() => store.state.user)
const myRecipes = ref(null);

const topRated = ref(null);
const mostRated = ref(null);
const mostCommented = ref(null);

const displayAverageRating = (likes) => {
    if (!likes || likes.length === 0) {
        return 0; // Handle cases when there are no likes
    }

    let sum = 0;
    for(let i = 0; i < likes.length; i++){
        sum += likes[i].value;
    }
    return sum / likes.length;
}

const sortByAverageRating = () => {
    const recipesCopy = [...myRecipes.value];
    return recipesCopy.sort((a, b) => {
        const ratingA = displayAverageRating(a.likes);
        const ratingB = displayAverageRating(b.likes);

        return ratingB - ratingA;
    });
};

const sortByNumberOfRatings = () => {
    const recipesCopy = [...myRecipes.value];
    return recipesCopy.sort((a, b) => b.likes.length - a.likes.length);
}

const sortByNumberOfComments = () => {
    const recipesCopy = [...myRecipes.value];
    return recipesCopy.sort((a, b) => b.comments.length - a.comments.length);
}


async function fetchRecipes(){
    try {
        await store.dispatch("loadRecipes", { email: user.value.email });
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}


watch(dataReady, () => {
  if (dataReady.value) {
    myRecipes.value = store.state.myRecipes;
    console.log(store.state.myRecipes);
    const sortedByAverageRating = sortByAverageRating();
    const sortedByNumberOfRatings = sortByNumberOfRatings();
    const sortedByNumberOfComments = sortByNumberOfComments();
    

    topRated.value = sortedByAverageRating[0].title;
    mostRated.value = sortedByNumberOfRatings[0].title;
    mostCommented.value = sortedByNumberOfComments[0].title;
      
    isLoading.value = false;
  }
})

onMounted(async () => {
    await fetchRecipes();
    dataReady.value = true;
})
</script>

<style scoped>
p {
    margin: 10px;
}
</style>