import { createApp } from 'vue';
import App from './App.vue'
import { VueFire } from 'vuefire';

import router from "./router"
import store from "./state/store"

import { firebaseApp } from "./firebaseConfig"

const app = createApp(App);

app.use(router); // Utilizează router-ul
app.use(store) // Utilizează "store" pentru gestionarea stării (Vuex)

app.use(VueFire, {
    firebaseApp
})

app.mount('#app');

