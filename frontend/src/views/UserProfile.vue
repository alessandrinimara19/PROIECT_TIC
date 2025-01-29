<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import TopNav from "../components/TopNav.vue";
import ArticleCard from "../components/ArticleCard.vue";
import { convertTimestamp } from "../../utils/formatters.js"
import ConfirmationDialog from "../components/ConfirmationDialog.vue";

const API_URL = import.meta.env.VITE_API_URL;

const store = useStore()
//preluare user data din userStore
const userId = computed(() => store.getters.userId)
const firstName = computed(() => store.getters.userFirstName);
const lastName = computed(() => store.getters.userLastName);
const profilePicture = computed(() => store.getters.userProfilePicture)

const articles = ref([]);
const loading = ref(true);
const error = ref({});

// Dialog confirmare stergere articol state
const showDeleteDialog = ref(false);
const selectedArticleId = ref(null);

const fetchUserArticles = async () => { //fetch toate articolele user-ului
  try {
    const response = await fetch(`${API_URL}/users/${userId.value}/articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    const data = await response.json();

    // Adaugare nume prenume autor fiecarui articol
    articles.value = data.articles.map((article) => {
      return {
        ...article,
        author: "Me!",
        createdAt: convertTimestamp(article.createdAt)
      };
    });

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Metoda apelata la click delete icno -> afisare dialog de confirmare stergere
const confirmDelete = (articleId) => {
  selectedArticleId.value = articleId;
  showDeleteDialog.value = true;
};

// Metoda pentru a sterge articol
const deleteArticle = async () => {
  if (!selectedArticleId.value) return;
  try {
    const response = await fetch(`${API_URL}/articles/${selectedArticleId.value}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete article");

    articles.value = articles.value.filter(article => article.id !== selectedArticleId.value);
    showDeleteDialog.value = false;
  } catch (error) {
    console.error("Error deleting article:", error);
  }
};

onMounted(fetchUserArticles)

</script>

<template>
  <TopNav></TopNav>
  <div class="profile-page">
    <!-- Poza profil -->
    <div class="profile-header">
      <img :src=profilePicture alt="Profil" class="profile-picture" />
      <h1>{{ firstName }} {{ lastName }}</h1>
    </div>

    <!-- Articolele utilizatorului -->
    <div class="article-cards">
      <ArticleCard v-for="article in articles" :key="article.id" :id="article.id" :title="article.title"
        :content="article.content" :author="article.author" :createdAt="article.createdAt" :canEditDelete=true
        @delete="confirmDelete" />
    </div>

    <!--Dialog confirmare stergere articol-->
    <ConfirmationDialog :show="showDeleteDialog" @close="showDeleteDialog = false" @confirm="deleteArticle" />
  </div>
</template>

<style scoped>
.profile-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 10px;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.article-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
