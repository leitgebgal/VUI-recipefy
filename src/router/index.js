import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'layout',
        redirect: { path: '/home' },
        component: () => import('../Layout.vue'),
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('../components/Home.vue'),
            },
            {
                path: '/admin',
                name: 'admin',
                component: () => import('../components/Admin.vue'),
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import('../components/Profile.vue'),
            },
            {
                path: '/recipes',
                name: 'recipes',
                component: () => import('../components/MyRecipes.vue'),
            },
            {
                path: '/recipeForm/:method/:title?',
                name: 'recipeForm',
                props: true,
                component: () => import('../components/recipe/RecipeForm.vue')
            },
            {
                path: '/recipeDetail/:title',
                name: 'recipeDetail',
                component: () => import('../components/recipe/RecipeDetail.vue')
            },
            {
                path: '/login',
                name: 'login',
                component: () => import('../components/authentication/LoginForm.vue'),
            },
            {
                path: '/signup',
                name: 'signup',
                component: () => import('../components/authentication/SignupForm.vue'),
            }
        ]
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;