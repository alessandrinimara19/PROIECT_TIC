import { createRouter, createWebHistory } from "vue-router";
import DiscoverPage from "../views/DiscoverPage.vue";
import BlogItPage from "../views/BlogItPage.vue";
import ArticlePage from "../views/ArticlePage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/register",
            name: "register",
            component: RegisterPage,
        },
        {
            path: "/login",
            name: "login",
            component: LoginPage,
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

