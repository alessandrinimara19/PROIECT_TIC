<template>
    <div class="home">
      <h1>{{ message }}</h1> <!-- Afișează mesajul din Vuex -->
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'HomePage',
    setup() {
      const store = useStore(); // Crearea instanței store-ului 
  
      // Crearea unei variabile computed care obține mesajul de test din state-ul Vuex
      const message = computed(() => store.state.message);
  
      return { message }; // Returnarea variabilei pentru a fi utilizată în template
    },
  };
  </script>
  