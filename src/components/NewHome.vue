<template>
    <v-container align="center">
      <v-row class="pb-5" justify="center">
        <h2>Home</h2>
      </v-row>
  
      <!-- Iskalno polje z izboljšano interakcijo -->
      <v-row style="width: 50%;">
        <v-text-field
          rounded
          variant="solo"
          v-model="searchQuery"
          label="Search for recipes"
          append-inner-icon="mdi-magnify"
          class="search-field"
        />
      </v-row>
  
      <!-- Prikaz receptov z novim načinom kartic -->
      <v-row justify="center" v-if="isDataLoaded && recipes.length > 0">
        <div class="d-flex flex-wrap justify-center">
          <v-card
            class="ma-5 rounded-xl recipe-card"
            v-for="recipe in filteredItems"
            :key="recipe.title"
            @click="fetchRecipe(recipe.title)"
          >
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
                  <v-icon color="amber" icon="mdi-star" />
                  {{ displayAverageRating(recipe.likes) + " (" + recipe.likes.length + ")" }}
                </span>
                <span class="pb-2" v-else>
                  <v-icon color="amber" icon="mdi-star" /> 0 (0)
                </span>
                <div>
                  <v-chip
                    class="mx-1 my-1"
                    v-for="category in recipe.categories"
                    :key="category"
                    :color="getCategoryColor(category)"
                    :prepend-icon="getCategoryIcon(category)"
                    variant="outlined"
                  >
                    {{ category }}
                  </v-chip>
                </div>
              </div>
            </v-card-subtitle>
            
            <!-- Dodano: prikaz več podrobnosti o receptu -->
            <v-card-text>
              <div>Created by: {{ recipe.createdBy }}</div>
              <div class="recipe-summary">
                <strong>Preparation Time:</strong> {{ recipe.prepTime }} min
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-row>
  
      <!-- Prikaz sporočila, če ni receptov -->
      <v-row justify="center" v-else-if="isDataLoaded && recipes.length < 1">
        <p>No Recipes Available</p>
      </v-row>
  
      <!-- Sporočilo, ko se nalagajo recepti -->
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
          name: 'newRecipeDetail',
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
  
  <style scoped>
  .search-field {
    width: 100%;
  }
  
  .recipe-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .recipe-card:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .rating-button {
    width: 20%;
  }
  
  .recipe-card {
    margin-top: 32px;
    padding: 24px;
    border-radius: 15px;
  }
  
  .recipe-title {
    font-size: 28px;
    margin-bottom: 16px;
  }
  
  .recipe-image {
    width: 100%;
    height: auto;
    margin-bottom: 16px;
    border-radius: 25px;
  }
  
  .recipe-description {
    font-size: 16px;
    white-space: pre-line;
    line-height: 200%;
  }
  
  .recipe-summary {
    font-size: 14px;
    margin-top: 8px;
  }
  
  .ingredients-section {
    background-color: beige;
    border-radius: 15px;
    padding: 1px;
    margin: 15px;
  }
  
  .recipe-section-title {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  .recipe-list {
    margin-bottom: 16px;
    list-style: none;
    padding-left: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
  }
  
  .recipe-list-item {
    margin-bottom: 8px;
    white-space: pre-wrap;
  }
  
  .recipe-details-list {
    list-style: none;
    padding-left: 0;
  }
  
  .recipe-card .v-chip {
    margin-top: 5px;
  }
  
  </style>
  