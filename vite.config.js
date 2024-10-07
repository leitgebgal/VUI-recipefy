import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import dotenv from 'dotenv'

dotenv.config();

export default defineConfig({
  plugins: [
    vue(),
    vuetify()
  ],
  server: {
    port: process.env.PORT || 3000,
  }
})
