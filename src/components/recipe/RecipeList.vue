<template>
    <div class="d-flex flex-wrap justify-center">
        <v-card class="ma-5 rounded-xl" v-for="recipe in recipes" :key="recipe.title" @click="fetchRecipe(recipe.title)">
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
            <v-card-actions>
                <v-btn color="green-lighten-2" variant="text" @click.stop.prevent="editRecipe(recipe.title)">
                    Edit
                </v-btn>
                <v-btn color="red-lighten-2" variant="text" @click.stop.prevent="openDialog(recipe)">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="dialog" width="auto">
            <v-card>
                <v-card-text>
                    Are you sure you want to delete this recipe?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red-lighten-2" block @click="deleteRecipe">Delete</v-btn>
                    <v-btn color="grey-lighten-1" block @click="dialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { getCategoryColor, getCategoryIcon } from '../../helperFunctions';

defineProps({
    recipes: Array
})

const store = useStore();
const router = useRouter();
const dialog = ref(false);

const currentRecipe = ref(null);

const email = computed(() => store.state.user.email)

const displayAverageRating = (likes) => {
    let sum = 0;
    for(let i = 0; i < likes.length; i++){
        sum += likes[i].value;
    }
    return sum / likes.length;
}

async function fetchRecipe(title){
    router.push({
        name: 'recipeDetail',
        params: { title: title }
    })
}

async function editRecipe(title){
    router.push({
        name: 'recipeForm',
        params: { method: 'edit', title: title }
    })
}

async function deleteRecipe(){
    await store.dispatch("recipe/deleteRecipe", {email: email.value, title: currentRecipe.value.title, image: currentRecipe.value.image });
    dialog.value = false;
    router.go();
}

function openDialog(recipe){
    dialog.value = true;
    currentRecipe.value = recipe;
}
</script>