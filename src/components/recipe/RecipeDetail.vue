<template>
<v-container>
    <v-card :class="(recipe.flag) ? 'recipe-card flagged' : 'recipe-card'" >
      <v-row>
        <v-col class="pa-4">
          <v-row class="align-center justify-center">
            <v-card-title class="recipe-title">{{ recipe.title }}<v-icon v-if="recipe.flag" icon="mdi-flag" color="red"></v-icon></v-card-title>
          </v-row>
          <v-row class="align-center justify-center">
            <v-img :src="recipe.imageUrl" cover
              max-width="600px" height="350px" :alt="recipe.title" class="recipe-image mb-6" />
          </v-row>
          <v-chip v-for="cat in recipe.categories" :key="cat" :color="getCategoryColor(cat)" :prepend-icon="getCategoryIcon(cat)" class="category-chip">{{ cat }}</v-chip>
          
          <div class="ingredients-section">
            <h2 class="recipe-section-title my-4">Ingredients</h2>
            <ul class="recipe-list">
                <li v-for="ingredient, index in recipe.ingredients" :key="ingredient" class="recipe-list-item">{{ displayIngredient(ingredient, index) }}</li>
            </ul>
          </div>
          <ul class="recipe-details-list">
              <li class="recipe-details-item"><strong>Preparation Time:</strong> {{ recipe.prepTime }} minutes</li>
          </ul>
        </v-col>
        <v-col class="pa-4 d-flex align-center">
          <p class="recipe-description text-left">{{ transformDescription(recipe.description) }}</p>
        </v-col>
      </v-row>
      <div v-if="user != null && user.email != recipe.createdBy" class="d-flex flex-column">
        <div class="ma-2 pa-2">
          <span v-for="star in stars" :key="star" @click="selectRating(star)">
            <v-icon :color="star <= selectedRating ? 'amber' : ''">
              {{ star <= selectedRating ? 'mdi-star' : 'mdi-star-outline' }}
            </v-icon>
          </span>
        </div>
        <div class="align-center justify-center">
          <v-btn size="small" class="rating-button bg-grey-darken-3 text-white" @click="addRating">Rate</v-btn>
        </div>
      </div>
    </v-card>
    <v-row class="align-center justify-center">
      <v-card class="recipe-card ml-3" style="width: 100%;">
        <v-card-title class="text-left mb-3"><b>Comments</b></v-card-title>
        <v-row v-if="user != null" class="ml-1">
          <v-text-field  type="text" label="Add comment" variant="outlined" v-model="comment">
            <template v-slot:append>
              <v-btn icon="mdi-send" class="bg-light-green-darken-2" @click="addComment"></v-btn>
            </template>
          </v-text-field>
        </v-row>
        <div class="my-4 pa-2 text-left bg-green-lighten-5" v-for="comment in recipe.comments" :key="comment">
          <p><b>{{ comment.createdBy }}</b> <i class="pl-5">{{ formatDate(comment.createdOn) }}</i></p>
          <p>{{ comment.comment }}</p>
        </div>
      </v-card>
    </v-row>
</v-container>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'
import { getCategoryColor, getCategoryIcon } from '../../helperFunctions';

const store = useStore();
const route = useRoute();
const user = computed(() => store.state.user)
const recipe = computed(() => {
  let r = store.state.recipes.filter(recipe => recipe.title == decodeURI(route.params.title))
  return r[0];
});

const comment = ref("");
const selectedRating = ref(0);
const stars = [1, 2, 3, 4, 5];

function displayIngredient(ingredient){
  if(ingredient.quantity == 0){
    return ingredient.name +  ' (' + ingredient.unit + ')'
  } else {
    return ingredient.quantity + ingredient.unit + ' ' + ingredient.name
  }
}

function transformDescription(description){
  let steps = description.split(".");
  let transformed = "";

  for(let i = 1; i < steps.length; i++){
    if(steps[i-1].includes("\n")){
      steps[i-1] = steps[i-1].substring(1)
    }
    transformed = transformed + i + ". " + steps[i - 1] + "\n"
  }
  return transformed;
}

function formatDate(date){
  let format = date.toDate();
  return format.toLocaleString('en-GB', {
    hour12: false
  });
}

const selectRating = (rating) => {
  selectedRating.value = rating;
}

const addComment = () => {
  const commentPayload = {
    title: recipe.value.title,
    comment: {
      createdBy: user.value.displayName,
      createdOn: new Date(),
      comment: comment.value
    }
  }

  store.dispatch("recipe/addComment", commentPayload);
}

const addRating = () => {
  const ratingPayload = {
    title: recipe.value.title,
    rating: {
      user: user.value.displayName,
      value: selectedRating.value
    }
  }

  store.dispatch("recipe/addLike", ratingPayload);
}

async function fetchAll() {
   await store.dispatch("loadAllRecipes")
}

onMounted(async() => {
  await fetchAll();
  let rating = recipe.value.likes.filter(o => o.user == user.value.displayName);
  selectedRating.value = (rating.length > 0) ? rating[0].value : 0;
})
</script>

<style scoped>
.rating-button {
  width: 20%;
}
.recipe-card {
  margin-top: 32px;
  padding: 24px;
  border-radius: 15px;
}

.flagged {
  background-color: orange;
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


</style>