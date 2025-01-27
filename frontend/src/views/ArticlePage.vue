<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { convertTimestamp } from '../../utils/formatters.js';
import CommentsSection from '../components/CommentsSection.vue';

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const articleId = route.params.id;

const article = ref({});
const loading = ref(true);
const error = ref('');
const usersMap = ref({});

// Fetch articol si useri (pentru afisarea autorului articolului si a autorilor comentariilor)
const fetchArticle = async () => {
    try {
        const response = await fetch(`${API_URL}/articles/${articleId}`, { //fetch articol dupa id
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
        console.log(article.value)

        // Fetch useri si populare usersMap
        await fetchAllUsers();

        // Setarea numelui autorului articolului folosind userMap
        const authorId = article.value.authorId;
        article.value.author = getUserNameById(authorId);

        // Setarea numelor autorului pentru fiecare comentariu folosind userMap
        for (let comment of article.value.comments) {
            comment.authorName = getUserNameById(comment.userId);
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

// Fetch useri si salvare in userMap
const fetchAllUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, { //fetch toti userii
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        // Mapare useri dupa userId
        usersMap.value = data.users.reduce((acc, user) => {
            acc[user.id] = `${user.name} ${user.surname}`;
            return acc;
        }, {});
    } catch (err) {
        console.error("Error fetching users:", err);
    }
};

// Metoda ajutatoare pentru preluarea numelui din usersMap in functie de userId
const getUserNameById = (userId) => {
    return usersMap.value[userId] || "Autor necunoscut";
};

onMounted(fetchArticle);
</script>

<template>
    <div class="article-page">
        <div v-if="loading">Loading...</div>
        <div v-if="error">{{ error }}</div>

        <div v-if="!loading && !error">
            <h1>{{ article.title }}</h1>
            <p class="author">Scris de {{ article.author }} | {{ convertTimestamp(article.createdAt) }}</p>
            <div class="content">
                <p>{{ article.content }}</p>
            </div>
            <!-- Pasare comentarii si numele autorilor catre componenta CommentsSection -->
            <CommentsSection :comments="article.comments" />
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
