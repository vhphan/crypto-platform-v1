<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>My App</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">Overview</router-link>
      <router-link to="/multiple" class="nav-link" :class="{ active: $route.path === '/multiple' }">Multiple Charts</router-link>
      <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">About</router-link>
    </v-app-bar>
    <v-main class="main-container">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { VApp, VAppBar, VToolbarTitle, VSpacer, VMain } from 'vuetify/components'
import { ref, onMounted, watch } from 'vue';


</script>

<style scoped>
@import '@/style.css';

/* Neo Brutalist style */
.v-app-bar {
  background-color: var(--v-theme-primary);
  color: var(--v-theme-accent);
  border-bottom: 4px solid var(--v-theme-accent);
}

.v-toolbar-title {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.5rem;
}

.nav-link {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  color: var(--v-theme-accent);
  background-color: var(--v-theme-primary);
  border: 2px solid var(--v-theme-accent);
  border-radius: 0;
  padding: 0.5rem 1rem;
  text-decoration: none;
}

.nav-link:hover {
  background-color: var(--v-theme-secondary);
}

.nav-link.active {
  background-color: lightblue;
}

.main-container {
  margin-top: 50px;
  /* Adjust this value if your app bar height is different */
}

.v-main {
  padding: 2rem;
  background-color: var(--v-theme-background);
  color: var(--v-theme-accent);
  font-family: 'Courier New', Courier, monospace;
  border: 4px solid var(--v-theme-accent);
}
</style>
