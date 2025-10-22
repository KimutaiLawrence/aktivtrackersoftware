<template>
  <div class="about">
    <h1>About AktivTracker</h1>
    <p>This is the about page where you can describe your application.</p>
    <router-link to="/">Back to Home</router-link>
  </div>
</template>

<script setup>
// You can add your component logic here
</script>

<style scoped>
.about {
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
