import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.Vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "homepage",
      component: HomePage,
    }
  ],
});

export default router;
