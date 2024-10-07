<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

const store = useStore();
const router = useRouter();
const user = computed(() => store.state.user)
const authIsReady = computed(() => store.state.authIsReady)

function logOut(){
  store.dispatch("logoutUser");
  store.dispatch("setMyRecipes", []);
  router.push('/home');
}

</script>

<template>
  <v-layout>
    <v-app-bar app color="#528265">
      <v-img
        class="mx-4"
        src="/logo-white.png"
        max-height="70"
        max-width="70"
        contain
      ></v-img>
      <v-spacer></v-spacer>
      <template v-if="!user">
        <v-btn class="mx-2" @click="$router.push('/home')">Home</v-btn>
        <v-btn class="mx-2" @click="$router.push('/login')">Login</v-btn>
        <v-btn class="mx-2" @click="$router.push('/signup')">Signup</v-btn>
      </template>
      <template v-else-if="user && user.email != 'admin@gmail.com'">
            <v-btn class="mx-2" @click="$router.push('/home')">Home</v-btn>
            <v-btn class="mx-2" @click="$router.push('/profile')">Profile</v-btn> 
            <v-btn class="mx-2" @click="$router.push('/recipes')">My Recipes</v-btn>
            <v-btn v-if="user.email == 'admin@gmail.com'" class="mx-2" @click="$router.push('/admin')">Admin</v-btn>
        <v-spacer></v-spacer>
        <p class="mx-2">{{ user.displayName }}</p>
        <v-btn class="mx-2" @click="logOut">Logout</v-btn>
      </template>
      <template v-else>
        <v-btn class="mx-2" @click="$router.push('/home')">Home</v-btn>
        <v-btn class="mx-2" @click="$router.push('/admin')">Admin</v-btn>
        <v-btn class="mx-2" @click="logOut">Logout</v-btn>
      </template>
    </v-app-bar>
    <v-main v-if="authIsReady">
      <router-view />
    </v-main>    
  </v-layout>
</template>
