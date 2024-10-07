<template>
    <v-form @submit.prevent="signUp">
        <h2 style="margin-bottom: 15px;">Sign Up</h2>
        <v-container align="center">
            <v-row style="width: 30%;">
                <v-text-field  type="text" label="Username" required v-model="username"></v-text-field>
            </v-row>
            <v-row style="width: 30%;">
                <v-text-field type="email" label="Email" required v-model="email"></v-text-field>
            </v-row>
            <v-row style="width: 30%;">
                <v-text-field type="password" label="Password" required v-model="password"></v-text-field>
            </v-row>
            <v-row style="width: 30%;">
                <v-btn class="bg-grey-darken-3 text-white mt-2" type="submit" block>Sign Up</v-btn>
            </v-row>
         </v-container>
        <p className='error' v-if="error">{{ error }}</p>
    </v-form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.state.user)
const error = computed(() => store.state.error)


const username = ref("")
const email = ref("")
const password = ref("")

function signUp(){
    store.dispatch("createUser", {username: username.value, email: email.value, password: password.value})
    // If auth is successful, redirect user to home page
    if(user){
        router.push({ path: '/home' })
    }
};
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}
</style>