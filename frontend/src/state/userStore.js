import { createStore } from "vuex";
import { toast } from "vue3-toastify";
import * as jwt_decode from "jwt-decode";
import router from '../router/index.js';

const API_URL = import.meta.env.VITE_API_URL;

const store = createStore({
  state: {
    token: localStorage.getItem("token") || null, //stocare token-ul JWT
    userData: null, //datele user-ului
  },
  getters: { //verificare daca user-ul este logat si decodare userId din token JWT
    isLogged: (state) => !!state.token,
    userId: (state) => {
      try {
        const decodedToken = jwt_decode(state.token);
        return decodedToken.userId;
      } catch (err) {
        return null;
      }
    },
  },
  mutations: {
    SET_TOKEN(state, token) {//actualizare token si stocare in localStorage
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },
    SET_USER_DATA(state, userData) {//actualizare date utilizator
      state.userData = userData;
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
          commit("SET_USER_DATA", data.userData);
        } else {
          commit("SET_USER_DATA", null);
        }
      } catch (err) {
        commit("SET_USER_DATA", null);
      }
    },
    logout({ commit }) { //stergere token si notificare user
      commit("SET_TOKEN", null);
      toast.success("Successfully logged out");
    },
    goToDiscover() {
      if (id) {
        router.push("/"); //navigare catre ruta principala -> Discover
      }
    }
  },
});

export default store;
