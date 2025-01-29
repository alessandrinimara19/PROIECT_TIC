<template>
    <div class="login-form">
        <h2>Autentificare</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="form.email" :class="{ 'is-invalid': errors.email }"
                    placeholder="Email" />
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
                <label for="password">Parolă</label>
                <input type="password" id="password" v-model="form.password" :class="{ 'is-invalid': errors.password }"
                    placeholder="Parola" />
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <button type="submit" class="submit-button" :disabled="!isFormValid">Autentifică-te</button>
        </form>

        <!-- Link pentru a naviga către pagina de înregistrare -->
        <p class="register-link">
            Nu ai cont? <router-link to="/register">Înregistrează-te!</router-link>
        </p>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify"
const API_URL = import.meta.env.VITE_API_URL;

export default {
    name: 'LoginForm',
    setup() {
        const store = useStore();

        const form = ref({
            email: '',
            password: ''
        });

        const errors = ref({
            email: '',
            password: ''
        });

        const router = useRouter();

        // Validare date formular
        const validateForm = () => {
            errors.value.email =
                form.value.email && /\S+@\S+\.\S+/.test(form.value.email) ? '' : 'Email invalid';
            errors.value.password = form.value.password ? '' : 'Parola este obligatorie';
        };

        // Verificare formular valid
        const isFormValid = computed(() => {
            return !Object.values(errors.value).some(error => error);
        });

        // Validare in timp real
        watch(() => form.value.email, validateForm);
        watch(() => form.value.password, validateForm);

        const handleSubmit = async () => {
            validateForm();
            if (isFormValid.value) {
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email.value,
                            password: password.value,
                        }),
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (data.status === "fail") {
                        toast.error(data.message);
                    } else if (data.status === "success") {
                        localStorage.setItem("token", data.token);
                        store.commit('SET_TOKEN', data.token);
                        //fetchUserData pentru a prelua datele user-ului
                        await store.dispatch('fetchUserData');
                        router.push("/"); // Navigare catre discover
                    }
                } catch (err) {
                    toast.error(err.message);
                }
            }
        };

        return {
            form,
            errors,
            handleSubmit,
            isFormValid
        };
    }
};
</script>

<style scoped>
.login-form {
    max-width: 400px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 100px;
}

h2 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    font-size: 1rem;
    display: block;
    margin-bottom: 0.5rem;
}

input {
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
}

input.is-invalid {
    border-color: red;
}

.error-message {
    font-size: 0.9rem;
    color: red;
}

.submit-button {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    background-color: #6a0dad;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-button:disabled {
    background-color: #ddd;
}

.submit-button:hover:not(:disabled) {
    background-color: #540b9e;
}

.register-link {
    text-align: center;
    margin-top: 10px;
    font-size: 1rem;
}

.register-link a {
    color: #6a0dad;
    text-decoration: none;
}

.register-link a:hover {
    text-decoration: underline;
}
</style>