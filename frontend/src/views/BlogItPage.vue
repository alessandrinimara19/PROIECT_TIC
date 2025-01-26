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

import { ref } from "vue";
import TopNav from "../components/TopNav.vue";

const form = ref({
    title: "",
    content: "",
});

// Funcție pentru trimiterea articolului - TODO
const submitArticle = async () => {
    console.log("Articol adăugat:", form.value);
    // Resetarea formularului
    form.value = { title: "", content: "" };
};
</script>

<style scoped>
.blog-it-page {
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
