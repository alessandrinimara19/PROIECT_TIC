import { createApp } from 'vue';
import App from './App.vue'
import { VueFire } from 'vuefire';

import router from "./router"
import userStore from "./state/userStore.js"

import { firebaseApp } from "./firebaseConfig"

import Vue3Toastify from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const app = createApp(App);

app.use(router); // Utilizează router-ul
app.use(userStore) // Utilizează "userStore" pentru gestionarea stării (Vuex)

app.use(VueFire, {
    firebaseApp
})

app.use(Vue3Toastify, {
    autoClose: 3000, // Auto close dupa 3 secunde
    position: "bottom-right",
    theme: "colored",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    newestOnTop: true,
});

app.mount('#app');

