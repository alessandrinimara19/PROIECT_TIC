<script setup>
import { ref, onMounted } from "vue";
import ArticleCard from "../components/ArticleCard.vue";
import TopNav from "../components/TopNav.vue";
import convertTimestamp from "../../utils/formatters";

// API_URL din .env
const API_URL = import.meta.env.VITE_API_URL;

// State variabile
const articles = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch articole din backend
const fetchArticles = async () => {
    try {
        const response = await fetch(`${API_URL}/articles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch articles");
        }

        const data = await response.json();
        console.log(data)

        // Procesare articolele pentru a adăuga id-ul și a formata data
        articles.value = data.articles.map((article) => {
            return {
                ...article,
                createdAt: article.createdAt ?
                    convertTimestamp(article.createdAt)
                    : "Data indisponibilă", // Dacă createdAt nu există, afișez un mesaj fallback
            };
        });

    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchArticles);
</script>

<template>
    <TopNav></TopNav>
    <div class="discover-page">
        <h1>Discover Articles</h1>

        <!-- Loading -->
        <div v-if="loading" class="loading">Loading articles...</div>

        <!-- Eroare -->
        <div v-else-if="error" class="error">{{ error }}</div>

        <!-- Afisare articole -->
        <div v-else class="articles-container">
            <ArticleCard v-for="article in articles" :key="article.id" :id="article.id" :title="article.title"
                :content="article.content" :author="article.author" :createdAt="article.createdAt"
                :maxContentLength="120" />
        </div>
    </div>
</template>

<style scoped>
.discover-page {
    padding: 1rem;
}

.articles-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.articles-container>* {
    flex: 1 1 calc(33.33% - 1rem);
    /* 3 articole pe fiecare rand pe ecrane mari */
    max-width: calc(33.33% - 1rem);
    box-sizing: border-box;
    transition: all 0.3s ease;
}

@media (max-width: 1024px) {
    .articles-container>* {
        flex: 1 1 calc(50% - 1rem);
        /* 2 articles pe fiecare rand pe ecrane medii */
        max-width: calc(50% - 1rem);
    }
}

@media (max-width: 600px) {
    .articles-container>* {
        flex: 1 1 100%;
        /* 1 articol pe fiecare rand pe ecrane mici */
        max-width: 100%;
    }
}

.loading,
.error {
    text-align: center;
    margin-top: 2rem;
}
</style>