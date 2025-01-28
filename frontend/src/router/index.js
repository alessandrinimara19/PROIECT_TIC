import { createRouter, createWebHistory } from "vue-router";
import DiscoverPage from "../views/DiscoverPage.vue";
import BlogItPage from "../views/BlogItPage.vue";
import ArticlePage from "../views/ArticlePage.vue";
import RegisterForm from "../views/RegisterForm.vue";
import LoginForm from "../views/LoginForm.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/register",
            name: "register",
            component: RegisterForm,
        },
        {
            path: "/login",
            name: "login",
            component: LoginForm,
        },
        {
            path: "/",
            name: "discover",
            component: DiscoverPage, // Discover page - home, pagina principala
        },
        {
            path: "/blogit",
            name: "blogit",
            component: BlogItPage, // Adaugă ruta pentru BlogItPage
        },
        {
            path: '/article/:id',
            name: 'article',
            component: ArticlePage,
            props: true, // permite pasarea de params in componenta
        },
    ],
});

export default router;

