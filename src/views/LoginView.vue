<template>
	<div class="login-container d-flex justify-content-center align-items-center vh-100">
		<div class="card shadow p-4" style="width: 22rem;">
			<h3 class="text-center mb-4">Iniciar Sesión</h3>

			<form @submit.prevent="login">
				<div class="mb-3">
					<label for="email" class="form-label">Correo Electrónico</label>
					<input
						v-model.trim="email"
						type="email"
						class="form-control"
						id="email"
						placeholder="correo@ejemplo.com"
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

				<button type="submit" class="btn btn-primary w-100" :disabled="loading">
					<span v-if="!loading">Entrar</span>
					<span v-else>Iniciando sesión...</span>
				</button>

				<p class="text-center mt-3">
					¿No tienes cuenta? <router-link to="/register" class="text-decoration-none">Regístrate aquí</router-link>
				</p>
			</form>
		</div>
	</div>
</template>

<script>
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export default {
	name: "LoginView",
	data() {
		return {
			email: "",
			password: "",
			error: "",
			loading: false,
			currentUser: null
		};
	},
	mounted() {
		// Verificar si el usuario ya está autenticado
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Obtener rol de Firestore
				const userRole = await this.getUserRole(user.uid)
				localStorage.setItem('usuarioActivo', user.email)
				localStorage.setItem('userRole', userRole)
				
				this.$router.push(userRole === 'admin' ? '/admin' : '/productos')
			}
		})
	},
	methods: {
		async getUserRole(uid) {
			try {
				const userDocRef = doc(db, 'users', uid)
				const userDoc = await getDoc(userDocRef)
				if (userDoc.exists()) {
					return userDoc.data().role || 'user'
				}
			} catch (error) {
				console.error('Error al obtener rol:', error)
			}
			return 'user'
		},
		async login() {
			this.error = "";
			this.loading = true;

			try {
				// Usar Firebase Authentication
				const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
				const user = userCredential.user;
				
				// Obtener rol de Firestore
				const userRole = await this.getUserRole(user.uid)
				
				// Guardar información del usuario
				localStorage.setItem('usuarioActivo', user.email);
				localStorage.setItem('userRole', userRole);
				
				// Mostrar notificación de éxito
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: `¡Bienvenido, ${user.email}!`,
						type: 'success',
						duration: 3000
					}
				}));
				
				// Redirigir según el rol
				if (userRole === 'admin') {
					this.$router.push('/admin');
				} else {
					this.$router.push('/productos');
				}
			} catch (error) {
				this.loading = false;
				console.error('Error de autenticación:', error);
				
				// Mostrar mensajes de error específicos
				if (error.code === 'auth/user-not-found') {
					this.error = 'El correo electrónico no está registrado';
				} else if (error.code === 'auth/wrong-password') {
					this.error = 'Contraseña incorrecta';
				} else if (error.code === 'auth/invalid-email') {
					this.error = 'Correo electrónico inválido';
				} else if (error.code === 'auth/user-disabled') {
					this.error = 'Usuario deshabilitado';
				} else {
					this.error = 'Error al iniciar sesión. Verifica tus credenciales.';
				}
				
				// Mostrar notificación de error
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: this.error,
						type: 'error',
						duration: 3000
					}
				}));
			}
		}
	}
}
</script>

<style scoped>
.login-container { 
	background: var(--primary-bg); 
}
</style>