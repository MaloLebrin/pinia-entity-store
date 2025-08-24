import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

// Création de l'application Vue
const app = createApp(App)

// Configuration de Pinia
const pinia = createPinia()
app.use(pinia)

// Montage de l'application
app.mount('#app')

console.log('🚀 Application Vue + Pinia démarrée avec succès!')
console.log('📊 Store utilisateur configuré avec l\'adaptateur Pinia')
