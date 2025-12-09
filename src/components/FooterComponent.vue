<template>

	<div v-if="subscribed" class="login-true" style="margin-top:10px">
		<p>¡Suscripción exitosa! Te enviaremos nuevas novedades a {{ emailSaved }}.</p>
	</div>

	<footer class="footer">
		<div class="footer-content">
			<div class="footer-section">
				<h4>FASHION STORE</h4>
				<p>Tu tienda de moda favorita. Encuentra las últimas tendencias y los mejores precios.</p>
				<div class="social-links">
					<a href="https://facebook.com" target="_blank" rel="noopener" class="social-link"
						aria-label="Facebook"><i class="bi bi-facebook"></i></a>
					<a href="https://instagram.com" target="_blank" rel="noopener" class="social-link"
						aria-label="Instagram"><i class="bi bi-instagram"></i></a>
					<a href="https://twitter.com" target="_blank" rel="noopener" class="social-link"
						aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
					<a href="https://youtube.com" target="_blank" rel="noopener" class="social-link"
						aria-label="YouTube"><i class="bi bi-youtube"></i></a>
				</div>
			</div>

			<div class="footer-section">
				<h4>Atención al Cliente</h4>
				<ul class="footer-links">
					<li><a href="#">Contacto</a></li>
					<li><a href="#">Envíos y Devoluciones</a></li>
					<li><a href="#">Guía de Tallas</a></li>
					<li><a href="#">Preguntas Frecuentes</a></li>
				</ul>
			</div>

			<div class="footer-section">
				<h4>Información</h4>
				<ul class="footer-links">
					<li><a href="#">Sobre Nosotros</a></li>
					<li><a href="#">Términos y Condiciones</a></li>
					<li><a href="#">Política de Privacidad</a></li>
					<li><a href="#">Trabaja con Nosotros</a></li>
				</ul>
			</div>

			<div class="footer-section">
				<h4>Newsletter</h4>
				<p>Suscríbete para recibir ofertas exclusivas</p>
				<div class="newsletter-form">
					<input v-model.trim="email" type="email" placeholder="Tu email" class="newsletter-input">
					<button class="newsletter-btn" id="suscribe" @click="subscribe">Suscribirse</button>
				</div>
			</div>
		</div>


		<div class="footer-bottom">
			<p>&copy; 2024 Fashion Store. Todos los derechos reservados.</p>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'FooterComponent',
	data() {
		return {
			email: '',
			emailSaved: '',
			subscribed: false
		}
	},
	methods: {
		setCategory(category) {
			window.dispatchEvent(new CustomEvent('set-category', { detail: category }))
			window.scrollTo({ top: 0, behavior: 'smooth' })
		},

		subscribe() {
			if (!this.email) return
			this.emailSaved = this.email
			this.subscribed = true
			this.email = ''
			setTimeout(() => { this.subscribed = false }, 4000)
		}
	}
}
</script>
