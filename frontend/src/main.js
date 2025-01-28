import { createApp } from 'vue';
import App from './App.vue'
import { VueFire } from 'vuefire';

import router from "./router"
import userStore from "./state/userStore.js"

import { firebaseApp } from "./firebaseConfig"

import Vue3Toastify from 'vue3-toastify';

const app = createApp(App);

app.use(router); // Utilizează router-ul
app.use(userStore) // Utilizează "userStore" pentru gestionarea stării (Vuex)

app.use(VueFire, {
    firebaseApp
})

app.use(Vue3Toastify, {
    autoclose: 3000,
    position: "bottom-right",
    theme: "colored",
});

app.mount('#app');

