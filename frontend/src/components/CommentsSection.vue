<template>
  <div class="comments-section">
    <h3>Comentarii</h3>
    <form @submit.prevent="addComment" class="comment-form">
      <textarea v-model="newComment" placeholder="Adaugă un comentariu..." required class="comment-input"></textarea>
      <button type="submit" class="comment-button">Trimite</button>
    </form>
    <ul class="comments-list">
      <!-- <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <strong class="comment-author">{{ comment.author }}</strong>: 
        <span class="comment-text">{{ comment.text }}</span>
      </li> -->
      <li class="comment-item">
        <strong class="comment-author">Test autor</strong>
        <span class="comment-text">Test comentariu</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  comments: { type: Array, default: () => [] },
});

const newComment = ref("");

const addComment = () => {
  console.log("Comentariu adăugat:", newComment.value);
  newComment.value = "";
};
</script>

<style scoped>
.comments-section {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  max-width: 100%;
  margin: 20px auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.comments-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.comment-item {
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 5px;
}

.comment-text {
  font-size: 1rem;
  color: #555;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-input {
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
}

.comment-button {
  align-self: flex-end;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #6a0dad;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.comment-button:hover {
  background-color: #540b9e;
}

/* Responsiveness */
@media (max-width: 768px) {
  .comments-section {
    padding: 15px;
  }

  .comment-input {
    font-size: 0.9rem;
  }

  .comment-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
