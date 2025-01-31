<template>
    <div class="like-section">
        <button @click="toggleLike" class="like-button">
            <i class="mdi mdi-heart" :class="{ 'liked': isLiked }"></i>
            {{ likes }} {{ likes === 1 ? 'like' : 'likes' }}
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from "vuex";
import { toast } from "vue3-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const store = useStore()
const userId = computed(() => store.getters.userId)

const props = defineProps({
    articleId: String,
    likes: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    }
});

const likes = ref(props.likes);
const isLiked = ref(props.isLiked);
const articleId = ref(props.articleId)

const toggleLike = async () => {
    let method = ""
    let route = ""
    if (isLiked.value) {
        method = "DELETE"
        route = `${API_URL}/articles/${props.articleId}/dislike/${userId.value}`
    } else {
        method = "POST"
        route = `${API_URL}/articles/${props.articleId}/like/${userId.value}`
    }

    if (!userId.value) {
        toast.error("Pentru a continua trebuie sa te autentifici!");
        return;
    }

    try {
        const response = await fetch(route, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.state.token}`, // Trimitere token pentru autentificare
            }
        });

        const data = await response.json();

        if (data.status === "success") {
            if (isLiked.value) {
                toast.success("Articol dezapreciat cu succes!");
            } else {
                toast.success("Articol apreciat cu succes!");
            }

            isLiked.value = !isLiked.value;
            likes.value += isLiked.value ? 1 : -1;
        } else {
            toast.error("A aparut o eroare.");
        }
    } catch (error) {
        console.log(error);
        toast.error("Eroare de rețea. Încearcă din nou.");
    }
};
</script>

<style scoped>
.like-section {
    text-align: center;
    margin: 1rem 0;
}

.like-button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #555;
}

.mdi-heart {
    font-size: 1.8rem;
    transition: color 0.2s, transform 0.2s;
}

.mdi-heart.liked {
    color: red;
    transform: scale(1.2);
}

.mdi-heart:not(.liked) {
    color: gray;
}

@media (max-width: 768px) {
    .like-button {
        font-size: 1.1rem;
    }

    .mdi-heart {
        font-size: 1.5rem;
    }
}
</style>