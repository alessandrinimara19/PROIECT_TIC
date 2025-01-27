<template>
    <div class="like-section">
        <button @click="toggleLike" class="like-button">
            <i class="mdi mdi-heart" :class="{ 'liked': isLiked }"></i>
            {{ likes }} {{ likes === 1 ? 'like' : 'likes' }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    likes: {
        type: Number,
        default: 0
    }
});

const likes = ref(props.likes);
const isLiked = ref(false);

const toggleLike = () => {
    isLiked.value = !isLiked.value;
    likes.value += isLiked.value ? 1 : -1;
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