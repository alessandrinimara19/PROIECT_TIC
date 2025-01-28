<template>
    <nav class="top-nav">
        <ul class="nav-list">
            <!--Optiuni meniu - pagini principale-->
            <li v-for="tab in tabs" :key="tab.name" :class="{ active: activeTab === tab.name }"
                @click="navigate(tab.route, tab.name)">
                {{ tab.label }}
            </li>

            <!-- Iconița de logout -->
            <li @click="handleLogout" class="logout">
                <i class="mdi mdi-logout icon"></i>
            </li>
        </ul>

        <!-- Logout - modala de confirmare -->
        <LogoutDialog :show="showLogoutDialog" @close="closeLogoutDialog" @confirm="confirmLogout" />
    </nav>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import LogoutDialog from "./LogoutDialog.vue";

export default {
    name: "TopNav",
    components: {
        LogoutDialog
    },
    setup() {
        const router = useRouter(); // Hook pentru router
        const route = useRoute(); // Hook pentru ruta curentă
        const activeTab = ref(route.name || "Descopera"); // Tab-ul activ este bazat pe ruta curentă

        const tabs = [
            { name: "discover", label: "Descoperă", route: "/" },
            { name: "profil", label: "Profil", route: "/profil" },
            { name: "blogit", label: "Blog it", route: "/blogit" },
        ];

        // Observa schimbarea rutei si actualizeaza activeTab
        watch(() => route.name, (newRoute) => {
            activeTab.value = newRoute;
        });

        const navigate = (route, tabName) => {
            activeTab.value = tabName;
            router.push(route);
        };

        // Modal state
        const showLogoutDialog = ref(false);

        // Afisare modalei de confirmare la apasarea iconitei de logout
        const handleLogout = () => {
            showLogoutDialog.value = true;
        };

        // Inchidere modala
        const closeLogoutDialog = () => {
            showLogoutDialog.value = false;
        };

        // Confirmare logout si redirectare la login
        const confirmLogout = () => {
            // De adaugat logica logout TODO
            router.push("/login");
        };

        return {
            tabs,
            activeTab,
            navigate,
            showLogoutDialog,
            handleLogout,
            closeLogoutDialog,
            confirmLogout
        };
    },
};
</script>

<style scoped>
.top-nav {
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
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

.logout {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #333;
    transition: color 0.3s ease;
    margin-left: auto;
}

.logout:hover {
    color: #6a0dad;
}

.icon {
    font-size: 1.5rem;
}
</style>