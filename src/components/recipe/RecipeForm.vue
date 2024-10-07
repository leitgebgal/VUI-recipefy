<template>
    <v-form @submit.prevent="submitForm">
        <h2 class="mb-2">{{ title }} RECIPE</h2>
         <v-container align="center">
            <v-row class="row-medium" v-if="route.params.method === 'add'">
                <v-text-field type="text" label="Title" variant="outlined" required v-model="recipe.title"></v-text-field>
            </v-row>
            <v-row class="row-large" v-if="route.params.method === 'add'">
                <v-col>
                    <v-file-input clearable label="Upload Image" variant="outlined" v-model="recipe.image"></v-file-input>
                </v-col>
                <v-col cols="3">
                    <v-text-field type="number" variant="outlined" label="Prep time (min)" required v-model="recipe.prepTime"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="row-large" v-else>
                <v-col cols="6">
                    <v-file-input clearable label="Upload New Image" variant="outlined" v-model="newImg"></v-file-input>
                </v-col>
                <v-col cols="2">
                    <v-btn class="bg-light-green-darken-2 text-white mt-1" icon="mdi-file-find" @click="dialog = true"/>
                </v-col>
                <v-col cols="4">
                    <v-text-field type="number" variant="outlined" label="Prep time (min)" required v-model="recipe.prepTime"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="row-medium">
                <v-select chips multiple clearable label="Category" variant="outlined"
                :items="categoryList" v-model="recipe.categories"></v-select>
            </v-row>
            <v-row class="row-medium">
                <v-textarea label="Description" variant="outlined" v-model="recipe.description"></v-textarea>
            </v-row>
            <h3 class="my-3">Ingredients</h3>
            <v-row v-for="(ingredient, index) in recipe.ingredients" :key="index" class="row-medium">
                <v-col>
                    <v-text-field type="text" variant="outlined" label="Name" required v-model="ingredient.name"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field type="number" variant="outlined" label="Quantity" required v-model="ingredient.quantity"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field type="text" variant="outlined" label="Unit" required v-model="ingredient.unit"></v-text-field>
                </v-col>
                <v-col>
                    <v-btn class="bg-deep-orange text-white mt-1 me-2" icon="mdi-minus" @click="removeIngredient(index)"/>
                    <v-btn class="bg-light-green-darken-2 text-white mt-1 ms-2" icon="mdi-plus" @click="addIngredient"/>
                </v-col>

            </v-row>
            <v-row class="row-small">
                <v-btn class="bg-grey-darken-3 text-white mt-2" type="submit" block>{{ title }} RECIPE</v-btn>
            </v-row>
         </v-container>
         <v-dialog v-model="dialog" width="auto">
            <v-img :src="recipe.imageUrl" :alt="recipe.title"/>
        </v-dialog>
    </v-form>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute();

const email = computed(() => store.state.user.email)

const title = computed(() => route.params.method.toUpperCase())

const recipe = ref({
            title: '',
            image: null,
            categories: [],
            description: '',
            ingredients: [{ quantity: 0, unit: '', name: '' }],
            prepTime: 0,
            createdBy: null
});

const newImg = ref(null);
const dialog = ref(false);

const categoryList = ['fast-food', 'vegan', 'vegetarian', 'seafood', 'dessert', 'beef', 'chicken', 'pasta', 'bread & doughs']

const addIngredient = () => {
    recipe.value.ingredients.push({ quantity: 0, unit: '', name: '' });
};

const removeIngredient = (index) => {
    recipe.value.ingredients.splice(index, 1);
};

function submitForm(){
    if(route.params.method === "add"){
        const payloadObj = {
            email: email.value,
            recipe: recipe.value
        }
        store.dispatch("recipe/createRecipe", payloadObj)
        router.push({ path: '/recipes' })
    } else if(route.params.method === "edit"){
        //check if new image was added
        //otherwise dispatch recipe object ref
        const payloadObj = {
            email: email.value,
            recipe: recipe.value,
            newImage: newImg.value
        }
        store.dispatch("recipe/editRecipe", payloadObj)
        router.push({ path: '/recipes' })
    }
};

onMounted(() => {
    if(route.params.method === "edit"){
        let r = store.state.myRecipes.filter(recipe => recipe.title == decodeURI(route.params.title))
        recipe.value = r[0];
    }
})
</script>

<style scoped>
.row-small {
    width: 30%;
}
.row-medium {
    width: 58%;
}
.row-large {
    width: 60%;
}
</style>
