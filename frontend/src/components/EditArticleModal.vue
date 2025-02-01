<template>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">

            <!-- Iconiță închidere modala -->
            <button class="close-button" @click="closeModal">
                <i class="mdi mdi-close"></i>
            </button>

            <!--Header-->
            <h2>Editează Articolul</h2>

            <!--Formular editare-->
            <form class="blog-form" @submit.prevent="submitArticle">
                <div class="form-group">
                    <label for="title">Titlu</label>
                    <input id="title" v-model="form.title" type="text" placeholder="Modifică titlul articolului..."
                        :class="{ 'is-invalid': errors.title }" />
                    <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
                </div>

                <div class="form-group">
                    <label for="content">Conținut</label>
                    <textarea id="content" v-model="form.content" placeholder="Modifică conținutul articolului..."
                        rows="6" :class="{ 'is-invalid': errors.content }"></textarea>
                    <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
                </div>

                <button type="submit" class="submit-button" :disabled="!isFormValid">
                    Salvează Modificările
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const store = useStore();

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    showModal: Boolean,
    onClose: Function,
    onUpdate: Function
});

// Formularul pentru editare articol
const form = ref({
    title: props.title || '',
    content: props.content || '',
});

// Erori pentru validare
const errors = ref({
    title: '',
    content: ''
});

// Validare formular în timp real
const validateForm = () => {
    errors.value.title = form.value.title.trim() ? "" : "Titlul este obligatoriu";
    errors.value.content = form.value.content.trim() ? "" : "Conținutul este obligatoriu";
};

// Computed pentru validarea formularului
const isFormValid = computed(() => {
    return !errors.value.title && !errors.value.content;
});

// Observare și validare în timp real
watch(() => form.value.title, validateForm);
watch(() => form.value.content, validateForm);

// Submit articol editat
const submitArticle = async () => {
    validateForm();
    if (!isFormValid.value) return;

    try {
        const response = await fetch(`${API_URL}/articles/${props.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.state.token}`,
            },
            body: JSON.stringify({
                title: form.value.title,
                content: form.value.content,
            }),
        });

        const data = await response.json();

        if (data.status === "success") {
            toast.success("Articol editat cu succes!");
            props.onUpdate({
                id: props.id,
                title: form.value.title,
                content: form.value.content,
            });  //Emitere date updated catre componeneta parinte
            props.onClose(); // Închidere modala
        } else {
            toast.error("Eroare la editarea articolului.");
        }
    } catch (error) {
        console.log(error)
        props.onClose();
        toast.error("Eroare de rețea. Încearcă din nou.");
    }
};

// Închidere modala
const closeModal = () => {
    props.onClose();
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    position: relative;
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #333;
}

.blog-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-size: 1rem;
    font-weight: 500;
    color: #555;
}

input,
textarea {
    padding: 0.75rem;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    resize: none;
    background-color: #fff;
}

textarea {
    padding: 0.75rem;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    resize: vertical;
    max-height: 40vh;
    min-height: 150px;
    background-color: #fff;
}

input::placeholder,
textarea::placeholder {
    font-family: Arial, sans-serif;
    font-size: 1rem;
    color: #999;
}

input.is-invalid,
textarea.is-invalid {
    border-color: red;
}

.error-message {
    font-size: 0.9rem;
    color: red;
}

.submit-button {
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 8px;
    background-color: #6a0dad;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
    background-color: #540b9e;
}

.close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: #666;
    transition: color 0.3s ease;
}

.close-button:hover {
    color: #333;
}
</style>
