<template>
  <div class="dashboard-view d-flex flex-column min-vh-100">
    <!-- Mostrar los tres componentes: Navbar, Main y Footer -->
    <NavbarComponent />

    <div class="page-content">
      <MainComponent />
      <FooterComponent />
    </div>

  </div>
</template>

<script>
import NavbarComponent from '../components/NavbarComponent.vue'
import MainComponent from '../components/MainComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

export default {
  name: 'DashboardView',
  components: {
    NavbarComponent,
    MainComponent,
    FooterComponent
  }
}
</script>

<style scoped>

.dashboard-view {
  background: var(--primary-bg);
}


</style>