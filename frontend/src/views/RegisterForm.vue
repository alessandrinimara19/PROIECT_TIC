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

export default {
    name: 'RegisterForm',
    setup() {
        const form = ref({
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        });

        const errors = ref({
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        });

        const router = useRouter();

        // Validare formular
        const validateForm = () => {
            errors.value.firstName = form.value.firstName ? '' : 'Prenumele este obligatoriu';
            errors.value.lastName = form.value.lastName ? '' : 'Numele este obligatoriu';
            errors.value.email = form.value.email && /\S+@\S+\.\S+/.test(form.value.email) ? '' : 'Email invalid';
            errors.value.password =
                form.value.password && form.value.password.length >= 6 ? '' : 'Parola trebuie să aibă cel puțin 6 caractere';
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

        const handleSubmit = () => {
            validateForm();
            if (isFormValid.value) {
                // Dacă formularul este valid, navighează către discover
                console.log('Formular trimis:', form.value);
                router.push('/');
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