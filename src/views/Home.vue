<template>
  <div class="home">
    <h1>Welcome to AktivTracker</h1>
    <p>This is the home page of your application.</p>
    <router-link to="/about">Go to About</router-link>
  </div>
</template>

<script setup>
// You can add your component logic here
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

h1 {
  color: #42b983;
  margin-bottom: 1rem;
}

a {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  text-decoration: underline;
}
</style>
