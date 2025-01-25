import { createStore } from 'vuex';
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore
import { db } from '../firebaseConfig'; // Config Firebase

const store = createStore({
  state() {
    return {
      users: [], // Lista de utilizatori
    };
  },
  mutations: {
    setUsers(state, users) {
      state.users = users; // Salvează lista de utilizatori
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      try {
        const usersCollection = collection(db, 'users'); // Obține colecția "users"
        const snapshot = await getDocs(usersCollection); // Fetch date
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        commit('setUsers', users); // Salvează utilizatorii în state
      } catch (error) {
        console.error('Eroare la fetch-ul utilizatorilor:', error);
      }
    },
  },
});

export default store;
