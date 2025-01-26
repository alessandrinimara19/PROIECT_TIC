<template>
    <nav class="top-nav">
        <ul class="nav-list">
            <li v-for="tab in tabs" :key="tab.name" :class="{ active: activeTab === tab.name }"
                @click="navigate(tab.route)">
                {{ tab.label }}
            </li>
        </ul>
    </nav>
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
    name: "TopNav",
    setup() {
        const router = useRouter(); // Hook pentru router
        const route = useRoute(); // Hook pentru ruta curentă
        const activeTab = ref(route.name || "Descopera"); // Tab-ul activ este bazat pe ruta curentă

        const tabs = [
            { name: "Descopera", label: "Descoperă", route: "/" },
            { name: "Profil", label: "Profil", route: "/profil" },
            { name: "BlogIt", label: "Blog it", route: "/blogit" },
        ];

        const navigate = (route) => {
            activeTab.value = tabs.find((tab) => tab.route === route)?.name || "";
            router.push(route); // Navigare folosind router-ul Vue
        };

        return { tabs, activeTab, navigate };
    },
};
</script>

<style scoped>
.top-nav {
    background-color: #fff;
    display: flex;
    justify-content: center;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-list {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    padding: 0;
    margin: 0;
}

.nav-list li {
    cursor: pointer;
    padding: 0.5rem 1rem;
    font-weight: bold;
    color: #333;
    border-radius: 8px;
    transition: background-color 0.2s ease-in-out;
}

.nav-list li.active,
.nav-list li:hover {
    background-color: #6a0dad;
    color: #fff;
}
</style>
