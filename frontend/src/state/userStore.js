import { createStore } from "vuex";
import { toast } from "vue3-toastify";
import jwt_decode from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const store = createStore({
  state: {
    token: localStorage.getItem("token") || null, //stocare token-ul JWT
    userId: null,
    firstName: null,
    lastName: null,
    profilePicture: "https://plchldr.co/i/200x200?&bg=f2f2f2&fc=111111&text=BLOG%20IT"
  },
  getters: { //verificare daca user-ul este logat si decodare userId din token JWT
    isLogged: (state) => !!state.token,
    userId: (state) => {
      try {
        const decodedToken = jwt_decode(state.token);
        return decodedToken.userId;
      } catch (err) {
        console.error("Eroare la decodificarea token-ului", err);
        return null;
      }
    },
    userFirstName: (state) => state.firstName,
    userLastName: (state) => state.lastName,
    userProfilePicture: (state) => state.profilePicture,
  },
  mutations: {
    SET_TOKEN(state, token) {//actualizare token si stocare in localStorage
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
        // Decodare token si setare userId
        const decodedToken = jwt_decode(state.token);
        state.userId = decodedToken.userId;  // Stocare userId
      } else {
        localStorage.removeItem("token");
        state.userId = null;
      }
    },
    SET_USER_DATA(state, userData) { // Actualizare dateutilizator 
      if (userData.name && userData.surname && userData.profilePicture) {
        state.firstName = userData.name;
        state.lastName = userData.surname;
        state.profilePicture = userData.profilePicture
      } else {
        state.firstName = null;
        state.lastName = null;
        state.profilePicture = "https://plchldr.co/i/200x200?&bg=f2f2f2&fc=111111&text=BLOG%20IT"
      }
    },
  },
  actions: {
    async fetchUserData({ getters, commit }) {//preluare date user
      const userId = getters.userId;
      if (!userId) {
        commit("SET_USER_DATA", null);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data.status === "success") {
          commit("SET_USER_DATA", { name: data.profile.name, surname: data.profile.surname, profilePicture: data.profile.profilePicture });
        } else {
          console.log("SET_USER_DATA null")
          commit("SET_USER_DATA", null);
        }
      } catch (err) {
        commit("SET_USER_DATA", null);
      }
    },
    logout({ commit }) {//stergere token si notificare user
      commit("SET_TOKEN", null);
      toast.success("Successfully logged out");
    },
  },
});

export default store;
