<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import convertTimestamp from '../../utils/formatters';
import CommentsSection from '../components/CommentsSection.vue'

// API_URL din .env
const API_URL = import.meta.env.VITE_API_URL;

const route = useRoute(); // pentru a obține parametrii din URL
const articleId = route.params.id;

// State-ul pentru articol
const article = ref({});
const loading = ref(true);  // Definire loading
const error = ref('');  // Definire error

// Fetch articol din backend
const fetchArticle = async () => {
    try {
        const response = await fetch(`${API_URL}/articles/${articleId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        article.value = data.article;

    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchArticle);
</script>

<template>
    <div class="article-page">
        <div v-if="loading">Loading...</div>

        <div v-if="error">{{ error }}</div>

        <div v-if="!loading && !error">
            <h1>{{ article.title }}</h1>
            <p class="author">De {{ article.author }} | {{ convertTimestamp(article.createdAt) }}</p>
            <div class="content">
                <p>{{ article.content }}</p>
            </div>
            <CommentsSection></CommentsSection>
        </div>
    </div>
</template>

<style scoped>
.article-page {
    padding: 20px;
}

h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.author {
    font-size: 1rem;
    color: #888;
    margin-bottom: 20px;
}

.content {
    font-size: 1.125rem;
    line-height: 1.6;
}

.loading {
    font-size: 1.2rem;
    color: #007bff;
}

.error {
    color: red;
}
</style>
