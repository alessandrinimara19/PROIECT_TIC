<template>
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
            <h3>Confirmare logout</h3>
            <p>Sigur vrei să te deloghezi?</p>
            <div class="modal-buttons">
                <button @click="closeModal">Anulează</button>
                <button @click="confirmLogout">Confirmă</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: "LogoutDialog",
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    setup(_, { emit }) {
        const store = useStore();
        const router = useRouter();

        const closeModal = () => {
            emit("close");
        };

        const confirmLogout = () => {
            emit("confirm");
            store.dispatch('logout');  // Actiune logout din Vuex store
            localStorage.removeItem("token");  // Stergere token din localStorage
            router.push('/login');  // Redirect la pagina de login
            closeModal(); // Inchidire dialog la confirmare
        };

        return {
            closeModal,
            confirmLogout
        };
    }
};
</script>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    max-width: 300px;
    width: 100%;
}

.modal-buttons {
    margin-top: 2.5rem;
}

.modal-buttons button {
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    background-color: #6a0dad;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
}

.modal-buttons button:hover {
    background-color: #540b9e;
}

.modal-buttons button:first-child {
    background-color: #ccc;
}

.modal-buttons button:first-child:hover {
    background-color: #999;
}
</style>