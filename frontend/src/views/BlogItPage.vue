<template>
    <TopNav></TopNav>
    <div class="blog-it-page">
        <h1>Adaugă un nou articol</h1>

        <form class="blog-form" @submit.prevent="submitArticle">
            <div class="form-group">
                <label for="title">Titlu</label>
                <input id="title" v-model="form.title" type="text" placeholder="Scrie titlul articolului..." required />
            </div>

            <div class="form-group">
                <label for="content">Conținut</label>
                <textarea id="content" v-model="form.content" placeholder="Scrie conținutul articolului..." rows="6"
                    required></textarea>
            </div>

            <button type="submit" class="submit-button">Blog It!</button>
        </form>
    </div>
</template>

<script setup>

import { computed, ref } from "vue";
import TopNav from "../components/TopNav.vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const store = useStore();

const userId = computed(() => store.getters.userId);  // Obținere userId din store

const form = ref({
    title: "",
    content: "",
});

// Funcție pentru trimiterea articolului
const submitArticle = async () => {
    console.log("userId in BlogIt: " + userId.value)
    console.log("isLogged in: " + store.getters.isLogged)
    if (!userId) {
        toast.error("Trebuie să fii autentificat pentru a publica un articol.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/articles/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.state.token}`, // Trimitere token pentru autentificare
            },
            body: JSON.stringify({
                title: form.value.title,
                content: form.value.content,
                authorId: userId.value,
            }),
        });

        const data = await response.json();

        if (data.status === "success") {
            toast.success("Articol publicat cu succes!");
            // Resetare formular
            form.value = { title: "", content: "" };
        } else {
            toast.error(data.message || "Eroare la publicarea articolului.");
        }
    } catch (error) {
        toast.error("Eroare de rețea. Încearcă din nou.: " + error);
    }
};
</script>

<style scoped>
.blog-it-page {
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 50px;
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: #333;
}

.blog-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-size: 1rem;
    font-weight: 500;
    color: #555;
}

input,
textarea {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    resize: none;
    background-color: #fff;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.submit-button {
    color: white;
    border: bold;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 8px;
    background-color: #6a0dad;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #540b9e;
}
</style>
