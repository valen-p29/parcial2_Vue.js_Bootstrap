<template>
	<div class="login-container d-flex justify-content-center align-items-center vh-100">
		<div class="card shadow p-4" style="width: 22rem;">
			<h3 class="text-center mb-4">Iniciar Sesión</h3>

			<form @submit.prevent="login">
				<div class="mb-3">
					<label for="email" class="form-label">Usuario</label>
					<input
						v-model="email"
						type="text"
						class="form-control"
						id="email"
						placeholder="Ingrese su usuario (ej: admin o valentina)"
						required
					/>
				</div>

				<div class="mb-3">
					<label for="password" class="form-label">Contraseña</label>
					<input
						v-model="password"
						type="password"
						class="form-control"
						id="password"
						placeholder="Ingrese su contraseña"
						required
					/>
				</div>

				<div v-if="error" class="alert alert-danger py-2 text-center">
					{{ error }}
				</div>

				<button type="submit" class="btn btn-primary w-100">Entrar</button>

				<p class="text-center mt-3">
					Credenciales de prueba: <strong>admin/admin123</strong> o <strong>valentina/vale123</strong>
				</p>
			</form>
		</div>
	</div>
</template>

<script>
export default {
	name: "LoginView",
	data() {
		return {
			email: "",
			password: "",
			error: "",
		};
	},
	methods: {
		async login() {
			this.error = "";

			// Credenciales quemadas
			const admin = { username: 'admin', password: 'admin123' };
			const user = { username: 'valentina', password: 'vale123' };

			const input = this.email.trim();

			if (input === admin.username && this.password === admin.password) {
				localStorage.setItem('usuarioActivo', admin.username);
				localStorage.setItem('userRole', 'admin');
				this.$router.push('/admin');
				return;
			}

			if (input === user.username && this.password === user.password) {
				localStorage.setItem('usuarioActivo', user.username);
				localStorage.setItem('userRole', 'user');
				this.$router.push('/productos');
				return;
			}

			this.error = 'Usuario o contraseña incorrectos';
		}
	}
}
</script>

<style scoped>
.login-container { background: var(--primary-bg); }
</style>