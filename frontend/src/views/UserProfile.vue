<template>
  <div class="user-profile">
    <img :src="profilePicture" alt="Profile Picture" class="profile-picture" />
    <h2>{{ name }}</h2>
    <p>Articole publicate: {{ articlesCount }}</p>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  profilePicture: String,
  articlesCount: Number,
});
</script>

<style scoped>
/* Stiluri pentru profil TODO */
</style>