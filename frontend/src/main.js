import { createApp } from 'vue'; 
import App from './App.vue'
import router from "./router"
import store from "./state/store"

const app = createApp(App);

app.use(router); // Utilizează router-ul
app.use(store) // Utilizează "store" pentru gestionarea stării (Vuex)

app.mount('#app');

