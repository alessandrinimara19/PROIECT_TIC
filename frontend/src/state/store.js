import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      message: 'Mesaj test home page prin variabilă globală',
    };
  },
  mutations: {
    setMessage(state, newMessage) {
      state.message = newMessage;
    },
  },
  actions: {
    updateMessage({ commit }, newMessage) {
      commit('setMessage', newMessage);
    },
  },
});

export default store;
