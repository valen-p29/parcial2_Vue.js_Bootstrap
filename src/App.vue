<template>
  <div class="d-flex flex-column min-vh-100" id="app">
    <NotificationComponent />
    <router-view />
  </div>
</template>

<script>
import NotificationComponent from './components/NotificationComponent.vue'

export default {
  components: {
    NotificationComponent
  }
}
</script>


<style>
body {
  background: #650000;
}



</style>
<style src="../src/assets/main.css">
</style>