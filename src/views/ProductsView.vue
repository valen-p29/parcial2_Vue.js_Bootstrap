<template>
	<div>
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
	name: 'ProductsView',
	components: { NavbarComponent, MainComponent, FooterComponent }
}
</script>

