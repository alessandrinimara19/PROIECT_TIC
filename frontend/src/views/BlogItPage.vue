<template>
    <TopNav></TopNav>
    <div class="blog-it-page">
        <h1>Adaugă un nou articol</h1>

        <form class="blog-form" @submit.prevent="submitArticle">
            <div class="form-group">
                <label for="title">Titlu</label>
                <input id="title" v-model="form.title" type="text" placeholder="Scrie titlul articolului..."
                    :class="{ 'is-invalid': errors.title }" />
                <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
            </div>

            <div class="form-group">
                <label for="content">Conținut</label>
                <textarea id="content" v-model="form.content" placeholder="Scrie conținutul articolului..." rows="6"
                    :class="{ 'is-invalid': errors.content }"></textarea>
                <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
            </div>

            <button type="submit" class="submit-button" :disabled="!isFormValid">Blog It!</button>
        </form>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import TopNav from "../components/TopNav.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const store = useStore();
const router = useRouter()

const userId = computed(() => store.getters.userId);  // Obținere userId din store

const form = ref({
    title: "",
    content: "",
});

const errors = ref({
    title: "",
    content: "",
});

// Validarea formularului
const validateForm = () => {
    errors.value.title = form.value.title.trim() ? "" : "Titlul este obligatoriu";
    errors.value.content = form.value.content.trim() ? "" : "Conținutul este obligatoriu";
};

// Verificare dacă formularul este valid
const isFormValid = computed(() => {
    return !errors.value.title && !errors.value.content;
});

// Observare schimbari si validare în timp real
watch(() => form.value.title, validateForm);
watch(() => form.value.content, validateForm);

const submitArticle = async () => {
    validateForm();
    if (!isFormValid.value) return;

    if (!userId.value) {
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
            // Navigare profil
            router.push("/profil")
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
    font-family: Arial, sans-serif;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    resize: none;
    background-color: #fff;
}

input::placeholder,
textarea::placeholder {
    font-family: Arial, sans-serif;
    font-size: 1rem;
    color: #999;
}

input.is-invalid,
textarea.is-invalid {
    border-color: red;
}

.error-message {
    font-size: 0.9rem;
    color: red;
}

.submit-button {
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 8px;
    background-color: #6a0dad;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
    background-color: #540b9e;
}
</style>
