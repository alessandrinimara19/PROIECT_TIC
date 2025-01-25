<template>
    <div class="home">
        <h1>Useri</h1>
        <ul>
            <li v-for="user in users" :key="user.id">{{ user.name }}</li> <!-- Test afișare utilizatori din Firestore -->
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'HomePage',
    computed: {
        ...mapState(['users']), // Obține users din Vuex state
    },
    created() {
        this.$store.dispatch('fetchUsers'); // Fetch utilizatori din Firestore prin Vuex
    },
};
</script>