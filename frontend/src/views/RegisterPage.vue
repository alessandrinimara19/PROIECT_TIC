<template>
    <div class="register-form">
        <h2>Înregistrare</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="firstName">Prenume</label>
                <input type="text" id="firstName" v-model="form.firstName" :class="{ 'is-invalid': errors.firstName }"
                    placeholder="Prenumele" />
                <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
            </div>

            <div class="form-group">
                <label for="lastName">Nume</label>
                <input type="text" id="lastName" v-model="form.lastName" :class="{ 'is-invalid': errors.lastName }"
                    placeholder="Numele" />
                <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
            </div>

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

            <div class="form-group">
                <label for="confirmedPassword">Confirmă Parolă</label>
                <input type="password" id="confirmedPassword" v-model="form.confirmedPassword"
                    :class="{ 'is-invalid': errors.confirmedPassword }" placeholder="Parola" />
                <span v-if="errors.confirmedPassword" class="error-message">{{ errors.confirmedPassword }}</span>
            </div>

            <button type="submit" class="submit-button" :disabled="!isFormValid">Înregistrează-te</button>
        </form>

        <!-- Link pentru a naviga către pagina de autentificare -->
        <p class="login-link">
            Ai deja cont? <router-link to="/login">Autentifică-te!</router-link>
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
    name: 'RegisterForm',
    setup() {
        const store = useStore()

        const form = ref({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmedPassword: ''
        });

        const errors = ref({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmedPassword: ''
        });

        const router = useRouter();

        // Validare formular
        const validateForm = () => {
            errors.value.firstName = form.value.firstName ? '' : 'Prenumele este obligatoriu';
            errors.value.lastName = form.value.lastName ? '' : 'Numele este obligatoriu';
            errors.value.email = form.value.email && /\S+@\S+\.\S+/.test(form.value.email) ? '' : 'Email invalid';
            errors.value.password =
                form.value.password && form.value.password.length >= 6 ? '' : 'Parola trebuie să aibă cel puțin 6 caractere';
            errors.value.confirmedPassword =
                form.value.confirmedPassword && form.value.password === form.value.confirmedPassword ? '' : "Parolele trebuie sa coincidă"
        };

        // Verificare daca formularul este valid
        const isFormValid = computed(() => {
            return !Object.values(errors.value).some(error => error);
        });

        // Validare in timp real
        watch(() => form.value.firstName, validateForm);
        watch(() => form.value.lastName, validateForm);
        watch(() => form.value.email, validateForm);
        watch(() => form.value.password, validateForm);
        watch(() => form.value.confirmedPassword, validateForm);

        const handleSubmit = async () => {
            validateForm();
            if (isFormValid.value) {
                try {
                    const response = await fetch(`${API_URL}/auth/register`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: firstName.value,
                            surname: lastName.value,
                            email: email.value,
                            password: password.value,
                            confirmedPassword: confirmedPassword.value,
                        }),
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (data.status === "fail") {
                        toast.error(data.message);
                    } else if (data.status === "success") {
                        localStorage.setItem("token", data.token);
                        store.commit('SET_TOKEN', data.token);
                        router.push("/");
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
.register-form {
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

.login-link {
    text-align: center;
    margin-top: 10px;
    font-size: 1rem;
}

.login-link a {
    color: #6a0dad;
    text-decoration: none;
}

.login-link a:hover {
    text-decoration: underline;
}
</style>