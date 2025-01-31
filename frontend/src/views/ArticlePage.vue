<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from "vuex";
import { convertTimestamp } from '../../utils/formatters.js';
import CommentsSection from '../components/CommentsSection.vue';
import LikesSection from '../components/LikesSection.vue';

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const articleId = route.params.id;

const article = ref({});
const loading = ref(true);
const error = ref('');
const usersMap = ref({});

const store = useStore()
const userId = computed(() => store.getters.userId)
const userLikedArticle = ref(false)

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

        userLikedArticle.value = article.value.likes.some((like) => like.userId === userId.value);

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
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="!loading && !error" class="content-container">
            <!-- Continut/text articol-->
            <div class="article-card">
                <h1 class="article-title">{{ article.title }}</h1>
                <p class="author">{{ article.author }} | {{ convertTimestamp(article.createdAt) }}</p>
                <div class="content">
                    <p>{{ article.content }}</p>
                </div>
            </div>

            <!-- Sectiune like-uri -->
            <LikesSection :articleId=articleId :likes="article.likes.length" :isLiked="userLikedArticle" />

            <!-- Sectiune comentarii -->
            <div class="right-column">
                <CommentsSection :comments="article.comments" :articleId=articleId />
            </div>
        </div>
    </div>
</template>

<style scoped>
.article-page {
    padding: 20px;
    max-width: 100%;
    margin: 0 auto;
}

.loading {
    font-size: 1.2rem;
    color: black;
}

.error {
    color: red;
    font-size: 1rem;
}

.content-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.article-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
}

.article-title {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 10px;
}

.author {
    font-size: 1rem;
    color: #555;
}

.content {
    font-size: 1.125rem;
    line-height: 1.6;
    color: #333;
}

.like-section {
    text-align: center;
    margin: 1rem 0;
}

.like-button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.mdi-heart {
    font-size: 2rem;
    transition: color 0.2s, transform 0.2s;
}

.mdi-heart.liked {
    color: red;
    transform: scale(1.2);
}

.mdi-heart:not(.liked) {
    color: gray;
}

/* Comments Section */
.right-column {
    margin-top: 20px;
}

@media (min-width: 768px) {
    .content-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        background-color: white;
    }

    .right-column {
        margin-top: 0;
    }
}

@media (max-width: 768px) {
    .content-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        border-radius: 8px;
    }

    .right-column {
        margin-top: 20px;
    }
}
</style>