<script setup>
import { useRouter } from 'vue-router';
import { truncateContent } from '../../utils/formatters';
import { defineEmits } from 'vue';

const props = defineProps({
    id: String,
    title: String,
    content: String,
    author: String,
    createdAt: String,
    canEditDelete: { // Prop pentru a decide dacă vor apărea iconițele de editare și ștergere
        type: Boolean,
        default: false,
    },
    maxContentLength: {
        type: Number,
        default: 100, // Lungimea maximă a conținutului
    },
});

//instantiere router pentru navigare 
const router = useRouter()
const emit = defineEmits(["delete"]); //emitere eveniment de stergere

// Funcție pentru a naviga la pagina articolului
const navigateToArticle = () => {
    router.push(`/article/${props.id}`);
};

const displayDeleteArticleConfirmationDialog = () => {
    emit("delete", props.id); // emitere eveniment stergere, furnizare id articolul
}

</script>

<template>
    <div class="article-card" @click="navigateToArticle"> <!--Navigare catre articol-->
        <h2 class="title">{{ title }}</h2>
        <p class="content">{{ truncateContent(content, maxContentLength) }}</p>
        <div class="author">Scris de {{ author }} la {{ createdAt }}</div>

        <!-- Iconițe Edit și Delete, afisate doar dacă canEditDelete este true -->
        <div v-if="canEditDelete" class="actions">
            <button class="edit-button">
                <i class="mdi mdi-pencil icon"></i> Edit
            </button>
            <button class="delete-button" @click.stop="displayDeleteArticleConfirmationDialog">
                <i class="mdi mdi-trash-can icon"></i> Delete
            </button>
        </div>
    </div>
</template>

<style scoped>
.article-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    width: 300px;
    height: 200px;
    overflow: hidden;
}

.title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.content {
    flex: 1;
    font-size: 0.875rem;
    color: #555;
    margin-bottom: 0.5rem;
}

.author {
    font-size: 0.75rem;
    color: #888;
    text-align: right;
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 10px;
}

.edit-button,
.delete-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.edit-button:hover,
.delete-button:hover {
    color: #007bff;
}

.icon {
    font-size: 1.2rem;
}
</style>
