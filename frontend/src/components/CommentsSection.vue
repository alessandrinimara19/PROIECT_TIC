<template>
  <div class="comments-section">
    <h3>Comentarii</h3>
    <form @submit.prevent="addComment" class="comment-form">
      <textarea v-model="newComment" placeholder="Adaugă un comentariu..." required class="comment-input"></textarea>
      <button type="submit" class="comment-button">Trimite</button>
    </form>
    <ul class="comments-list">
      <li v-for="comment in localComments" :key="comment.commentId" class="comment-item">
        <strong class="comment-author">{{ comment.authorName }}</strong>
        <span class="comment-content">{{ comment.content }}</span>
        <div v-if="comment.userId === userId" class="buttons-container">
          <button class="edit-button">
            <i class="mdi mdi-pencil icon"></i> Edit
          </button>
          <button class="delete-button" @click="deleteComment(comment.commentId)">
            <i class="mdi mdi-trash-can icon"></i> Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";

const store = useStore();
const API_URL = import.meta.env.VITE_API_URL;

const props = defineProps({
  comments: { type: Array, default: () => [] },
  articleId: String,
});

// Copie reactiva locala comentarii
const localComments = ref([...props.comments]);

// Sortare comentarii la incarcarea componentei
localComments.value.sort((a, b) => {
  // comparare dupa _seconds
  if (b.createdAt._seconds !== a.createdAt._seconds) {
    return b.createdAt._seconds - a.createdAt._seconds; // Newest first
  }
  // daca sec sunt la fel comparare dupa _nanoseconds
  return b.createdAt._nanoseconds - a.createdAt._nanoseconds;
});

// Sync comentarii local cand se schimba prop si sortare
watch(() => props.comments, (newComments) => {
  localComments.value = [...newComments]
});


const userId = computed(() => store.getters.userId)
const firstName = computed(() => store.getters.userFirstName)
const lastName = computed(() => store.getters.userLastName)

const newComment = ref("");

const addComment = async () => {
  if (!userId.value) {
    toast.error("Pentru a continua trebuie sa te autentifici!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/articles/${props.articleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.state.token}`, // Trimitere token pentru autentificare
      },
      body: JSON.stringify({
        userId: userId.value,
        content: newComment.value,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      toast.success("Comentariu adăugat cu succes!");

      // Adaugare comment in lista locala
      localComments.value.unshift({
        commentId: data.commentId, // preluare id din API response
        authorName: `${firstName.value} ${lastName.value}`,
        content: newComment.value,
      });

      // Resetare sectiune comments
      newComment.value = "";
    } else {
      toast.error(data.message || "A aparut o eroare la adăugarea comentariului.");
      toast.error("A aparut o eroare la adăugarea comentariului.");
    }
  } catch (error) {
    console.log(error);
    toast.error("Eroare de rețea. Încearcă din nou.");
  }
};

const deleteComment = async (commentId) => {
  if (!userId.value) {
    toast.error("Pentru a continua trebuie sa te autentifici!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/articles/${props.articleId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.state.token}`,
      }
    });

    const data = await response.json();

    if (data.status === "success") {
      toast.success("Comentariu șters cu succes!");
      //Stergere comment din lista - update UI
      localComments.value = localComments.value.filter(comment => comment.commentId !== commentId);
    } else {
      console.log(data.message || "Eroare la ștergerea comentariului.");
      toast.error("Eroare la ștergerea comentariului.");
    }
  } catch (error) {
    console.log(error)
    toast.error("Eroare de rețea. Încearcă din nou.");
  }
};

</script>
<style scoped>
.comments-section {
  padding: 20px;
  border: 1px solid #ddd;
  max-width: 100%;
  margin: 20px auto;
  overflow: hidden;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
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

.comment-content {
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
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.comment-button:hover {
  background-color: #540b9e;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 10px;
}

.edit-button,
.delete-button {
  margin-bottom: 5px;
  background-color: #4CAF50;
  color: white;
  padding: 8px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}

.delete-button {
  background-color: #f44336;
  margin-left: 20px;
}

.edit-button:hover,
.delete-button:hover {
  opacity: 0.8;
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
