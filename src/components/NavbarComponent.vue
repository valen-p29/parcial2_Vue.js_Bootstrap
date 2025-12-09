<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-custom">
		<div class="container-fluid">
			<!-- Brand -->
			<router-link to="/" class="navbar-brand fw-bold">
				<i class="bi bi-shop me-2"></i>
				FASHION STORE
			</router-link>

			<!-- Toggler button for mobile -->
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" 
				aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<!-- Navbar content -->
			<div class="collapse navbar-collapse" id="navbarContent">
				<!-- Categories (center) -->
				<ul class="navbar-nav mx-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a href="#" class="nav-link" @click.prevent="scrollToProducts('all')">
							<i class="bi bi-grid-3x3-gap me-1"></i> Todos
						</a>
					</li>
					<li class="nav-item">
						<a href="#" class="nav-link" @click.prevent="scrollToProducts('hombre')">
							<i class="bi bi-person me-1"></i> Hombre
						</a>
					</li>
					<li class="nav-item">
						<a href="#" class="nav-link" @click.prevent="scrollToProducts('mujer')">
							<i class="bi bi-gender-female me-1"></i> Mujer
						</a>
					</li>
					<li class="nav-item">
						<a href="#" class="nav-link" @click.prevent="scrollToProducts('accesorios')">
							<i class="bi bi-bag me-1"></i> Accesorios
						</a>
					</li>
				</ul>

				<!-- Actions (right) -->
				<div class="navbar-nav">
					<!-- Cart -->
					<button class="btn btn-nav-action position-relative me-2" @click="toggleCart" title="Carrito">
						<i class="bi bi-cart3 fs-5"></i>
						<span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
							{{ cartCount }}
						</span>
					</button>

					<!-- Profile (when logged in) -->
					<button v-if="currentUser" class="btn btn-nav-action me-2" @click="openProfile" title="Perfil">
						<i class="bi bi-person-circle fs-5"></i>
						<span class="d-lg-inline d-none ms-1">Perfil</span>
					</button>

					<!-- Login / Register (when not logged in) -->
					<button v-if="!currentUser" class="btn btn-nav-action me-2" @click="openLogin" title="Iniciar Sesión">
						<i class="bi bi-person-circle fs-5"></i>
						<span class="d-lg-inline d-none ms-1">Entrar</span>
					</button>

					<!-- Register (only on desktop and when not logged in) -->
					<router-link v-if="!currentUser" to="/register" class="btn btn-nav-action me-2 text-decoration-none">
						<i class="bi bi-person-plus fs-5"></i>
						<span class="d-lg-inline d-none ms-1">Registrar</span>
					</router-link>

					<!-- Logout -->
					<button v-if="currentUser" class="btn btn-nav-action btn-danger me-2" @click="logout" title="Cerrar Sesión">
						<i class="bi bi-box-arrow-right fs-5"></i>
						<span class="d-lg-inline d-none ms-1">Salir</span>
					</button>

					<!-- Admin Panel (only for admins) -->
					<router-link v-if="isAdmin" to="/admin" class="btn btn-nav-action btn-success text-decoration-none">
						<i class="bi bi-shield-lock fs-5"></i>
						<span class="d-lg-inline d-none ms-1">Panel Admin</span>
					</router-link>
				</div>
			</div>
		</div>
	</nav>

	<!-- Login Modal -->
	<div v-if="loginOpen" class="login-modal-overlay" @click.self="loginOpen = false">
		<div class="login-modal-card">
			<button class="login-modal-close" @click="loginOpen = false">&times;</button>
			
			<div class="login-modal-header">
				<i class="bi bi-person-circle"></i>
				<h2>Iniciar Sesión</h2>
				<p class="login-modal-subtitle">Accede a tu cuenta de Fashion Store</p>
			</div>

			<form @submit.prevent="login" class="login-modal-form">
				<div class="login-form-group">
					<label for="loginEmail">Correo Electrónico</label>
					<div class="login-input-wrapper">
						<i class="bi bi-envelope"></i>
						<input 
							v-model.trim="email" 
							type="email" 
							id="loginEmail"
							class="login-input"
							placeholder="tu@email.com" 
							required 
						/>
					</div>
				</div>

				<div class="login-form-group">
					<label for="loginPassword">Contraseña</label>
					<div class="login-input-wrapper">
						<i class="bi bi-lock"></i>
						<input 
							v-model="password" 
							type="password" 
							id="loginPassword"
							class="login-input"
							placeholder="Ingresa tu contraseña" 
							required 
						/>
					</div>
				</div>

				<div v-if="loginError" class="login-alert login-alert-error">
					<i class="bi bi-exclamation-circle"></i>
					<span>{{ loginError }}</span>
				</div>

				<button class="login-btn-submit" type="submit" :disabled="loading">
					<span v-if="!loading">
						<i class="bi bi-box-arrow-in-right me-2"></i>Entrar
					</span>
					<span v-else>
						<i class="bi bi-hourglass-split me-2"></i>Iniciando sesión...
					</span>
				</button>

				<div class="login-divider">
					<span>¿No tienes cuenta?</span>
				</div>

				<router-link to="/register" class="login-btn-register" @click="loginOpen = false">
					<i class="bi bi-person-plus me-2"></i>Crear una cuenta
				</router-link>
			</form>
		</div>
	</div>

	<!-- Profile Modal -->
	<ProfileModal 
		:isOpen="profileOpen" 
		:currentUser="currentUser"
		@close="closeProfile"
	/>
</template>

<script>
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import ProfileModal from './ProfileModal.vue'

export default {
	name: 'NavbarComponent',
	components: {
		ProfileModal
	},
	data() {
		return {
			searchOpen: false,
			searchQuery: '',
			cartCount: 0,
			loginOpen: false,
			profileOpen: false,
			email: '',
			password: '',
			loginError: '',
			loading: false,
			currentUser: null
		}
	},
	mounted() {
		this.updateCartCount()
		window.addEventListener('storage', this.updateCartCount)
		
		// Listen to auth state changes
		onAuthStateChanged(auth, async (user) => {
			this.currentUser = user
			if (user) {
				// Obtener rol de Firestore
				const userRole = await this.getUserRole(user.uid)
				localStorage.setItem('usuarioActivo', user.email)
				localStorage.setItem('userRole', userRole)
			} else {
				localStorage.removeItem('usuarioActivo')
				localStorage.removeItem('userRole')
			}
		})
	},
	beforeUnmount() {
		window.removeEventListener('storage', this.updateCartCount)
	},
	methods: {
		scrollToProducts(category) {
			// Primero establecer la categoría
			window.dispatchEvent(new CustomEvent('set-category', { detail: category }))
			
			// Luego hacer scroll suave al contenedor de productos
			setTimeout(() => {
				const productsSection = document.querySelector('.products-section')
				if (productsSection) {
					productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
				}
			}, 50)
		},
		toggleSearch() {
			this.searchOpen = !this.searchOpen
			if (!this.searchOpen) {
				this.searchQuery = ''
				this.emitSearch()
			}
		},
		closeSearch() {
			this.searchOpen = false
			this.searchQuery = ''
			this.emitSearch()
		},
		emitSearch() {
			window.dispatchEvent(new CustomEvent('set-search', { detail: this.searchQuery }))
		},
		toggleCart() {
			window.dispatchEvent(new CustomEvent('toggle-cart'))
		},
		updateCartCount() {
			try {
				const saved = localStorage.getItem('cart')
				const cart = saved ? JSON.parse(saved) : []
				this.cartCount = cart.reduce((acc, it) => acc + (it.quantity || 1), 0)
			} catch {
				this.cartCount = 0
			}
		},
		openLogin() {
			this.loginOpen = true
			this.email = ''
			this.password = ''
			this.loginError = ''
			this.loading = false
		},
		openProfile() {
			this.profileOpen = true
		},
		closeProfile() {
			this.profileOpen = false
		},
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
			this.loginError = ''
			this.loading = true
			
			try {
				const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password)
				const user = userCredential.user
				
				// Obtener rol de Firestore
				const userRole = await this.getUserRole(user.uid)
				
				localStorage.setItem('usuarioActivo', user.email)
				localStorage.setItem('userRole', userRole)
				
				this.loginOpen = false
				this.loading = false
				
				// Mostrar notificación de éxito
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: `¡Bienvenido, ${user.email}!`,
						type: 'success',
						duration: 3000
					}
				}))
				
				// Redirect based on role
				if (userRole === 'admin') {
					this.$router.push('/admin')
				} else {
					this.$router.push('/productos')
				}
			} catch (error) {
				this.loading = false
				console.error('Error de autenticación:', error)
				
				// Mostrar notificación de error
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: 'Credenciales incorrectas',
						type: 'error',
						duration: 3000
					}
				}))
				
				// User-friendly error messages
				switch (error.code) {
					case 'auth/user-not-found':
						this.loginError = 'Usuario no encontrado'
						break
					case 'auth/wrong-password':
						this.loginError = 'Contraseña incorrecta'
						break
					case 'auth/invalid-email':
						this.loginError = 'Correo electrónico inválido'
						break
					case 'auth/user-disabled':
						this.loginError = 'Usuario deshabilitado'
						break
					default:
						this.loginError = 'Error al iniciar sesión. Verifica tus credenciales.'
				}
			}
		},
		async logout() {
			try {
				// Cerrar sesión en Firebase primero
				await signOut(auth)
				
				// Limpiar almacenamiento local
				localStorage.removeItem('usuarioActivo')
				localStorage.removeItem('userRole')
				localStorage.removeItem('cart')
				
				// Mostrar notificación de logout
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: 'Sesión cerrada correctamente',
						type: 'success',
						duration: 2000
					}
				}))
				
				// Redirigir a página principal inmediatamente
				this.$router.push('/').catch(() => {
					// Ignorar error si ya estamos en home
					window.location.href = '/'
				})
			} catch (error) {
				console.error('Error al cerrar sesión:', error)
				
				// Limpiar almacenamiento local aunque haya error
				localStorage.removeItem('usuarioActivo')
				localStorage.removeItem('userRole')
				localStorage.removeItem('cart')
				
				// Mostrar notificación de error
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: 'Sesión cerrada',
						type: 'info',
						duration: 2000
					}
				}))
				
				// Redirigir de todas formas
				this.$router.push('/').catch(() => {
					window.location.href = '/'
				})
			}
		}
	}
	,computed: {
		isAdmin() {
			try {
				const role = localStorage.getItem('userRole')
				if (role === 'admin') return true
				return this.currentUser && this.currentUser.email === 'admin@fashionstore.com'
			} catch (e) {
				return false
			}
		}
	}
}
</script>

<style scoped>
/* Navbar Customization */
.navbar-custom {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	padding: 1rem 0;
	position: sticky;
	top: 0;
	z-index: 1030;
}

.navbar-brand {
	font-size: 1.5rem;
	color: #50C878 !important;
	transition: all 0.3s ease;
}

.navbar-brand:hover {
	transform: scale(1.05);
	color: #40a85f !important;
}

.navbar-brand i {
	color: #50C878;
}

.nav-link {
	color: rgba(255, 255, 255, 0.8) !important;
	font-weight: 500;
	transition: all 0.3s ease;
	margin: 0 0.5rem;
}

.nav-link:hover {
	color: #50C878 !important;
	transform: translateY(-2px);
}

.nav-link i {
	color: #50C878;
}

/* Action Buttons */
.btn-nav-action {
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: rgba(255, 255, 255, 0.85);
	transition: all 0.3s ease;
	border-radius: 8px;
	padding: 0.5rem 0.75rem;
}

.btn-nav-action:hover {
	background: #50C878;
	border-color: #50C878;
	color: white;
	transform: translateY(-2px);
}

.btn-nav-action.btn-danger {
	background: rgba(220, 53, 69, 0.1);
	border-color: rgba(220, 53, 69, 0.3);
	color: #dc3545;
}

.btn-nav-action.btn-danger:hover {
	background: #dc3545;
	border-color: #dc3545;
	color: white;
}

.btn-nav-action.btn-success {
	background: rgba(80, 200, 120, 0.1);
	border-color: #50C878;
	color: #50C878;
}

.btn-nav-action.btn-success:hover {
	background: #50C878;
	border-color: #50C878;
	color: white;
}

/* Badge */
.badge {
	font-size: 0.7rem;
	top: -8px !important;
	right: -8px !important;
}

/* Navbar toggler */
.navbar-toggler {
	border: 2px solid #50C878;
	border-radius: 6px;
	padding: 0.4rem 0.6rem;
}

.navbar-toggler:focus {
	box-shadow: 0 0 0 0.25rem rgba(80, 200, 120, 0.25);
}

.navbar-toggler-icon {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2880, 200, 120, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Login Modal Styles */
.login-modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
	padding: 20px;
}

.login-modal-card {
	background: white;
	border-radius: 16px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	max-width: 420px;
	width: 100%;
	overflow: hidden;
	animation: slideUp 0.3s ease;
	position: relative;
}

@keyframes slideUp {
	from {
		transform: translateY(50px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.login-modal-close {
	position: absolute;
	top: 15px;
	right: 15px;
	background: none;
	border: none;
	font-size: 2rem;
	cursor: pointer;
	color: #999;
	transition: color 0.2s;
	padding: 0;
	width: 40px;
	height: 40px;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-modal-close:hover {
	color: #333;
}

.login-modal-header {
	background: linear-gradient(135deg, #50C878 0%, #40a85f 100%);
	color: white;
	padding: 40px 30px 30px;
	text-align: center;
}

.login-modal-header i {
	font-size: 3.5rem;
	display: block;
	margin-bottom: 15px;
	opacity: 0.9;
}

.login-modal-header h2 {
	margin: 0 0 8px 0;
	font-size: 1.8rem;
	font-weight: 700;
}

.login-modal-subtitle {
	margin: 0;
	font-size: 0.95rem;
	opacity: 0.95;
}

.login-modal-form {
	padding: 35px 30px;
}

.login-form-group {
	margin-bottom: 22px;
}

.login-form-group label {
	display: block;
	margin-bottom: 8px;
	font-weight: 600;
	color: #333;
	font-size: 0.95rem;
}

.login-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.login-input-wrapper i {
	position: absolute;
	left: 14px;
	color: #50C878;
	font-size: 1.1rem;
}

.login-input {
	width: 100%;
	padding: 12px 14px 12px 42px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 1rem;
	transition: all 0.3s;
	background: white;
	box-sizing: border-box;
	font-family: inherit;
}

.login-input:focus {
	outline: none;
	border-color: #50C878;
	box-shadow: 0 0 0 4px rgba(80, 200, 120, 0.1);
	background: #fafafa;
}

.login-input::placeholder {
	color: #bbb;
}

.login-alert {
	padding: 12px 15px;
	border-radius: 8px;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 0.95rem;
}

.login-alert-error {
	background: #fee;
	border: 1px solid #fcc;
	color: #c33;
}

.login-alert i {
	font-size: 1.1rem;
	flex-shrink: 0;
}

.login-btn-submit {
	width: 100%;
	padding: 14px;
	background: linear-gradient(135deg, #50C878 0%, #40a85f 100%);
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1.05rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
}

.login-btn-submit:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(80, 200, 120, 0.35);
}

.login-btn-submit:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.login-divider {
	text-align: center;
	margin: 25px 0 20px;
	color: #999;
	font-size: 0.9rem;
	position: relative;
}

.login-divider::before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 50%;
	height: 1px;
	background: #e0e0e0;
	z-index: 0;
}

.login-divider span {
	background: white;
	padding: 0 10px;
	position: relative;
	z-index: 1;
}

.login-btn-register {
	width: 100%;
	padding: 12px;
	background: #f5f5f5;
	color: #333;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	text-decoration: none;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-size: 1rem;
}

.login-btn-register:hover {
	border-color: #50C878;
	color: #50C878;
	background: #f0fdf5;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
	.navbar-collapse {
		margin-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1rem;
	}

	.nav-link {
		padding: 0.5rem 0 !important;
		margin: 0.25rem 0 !important;
	}

	.navbar-nav {
		flex-direction: column;
		gap: 0.5rem;
	}

	.btn-nav-action {
		width: 100%;
		text-align: left;
		display: flex;
		align-items: center;
	}

	.btn-nav-action .d-lg-inline {
		display: inline !important;
	}
}

@media (max-width: 576px) {
	.navbar-brand {
		font-size: 1.2rem;
	}

	.navbar-brand i {
		display: none;
	}

	.btn-nav-action {
		width: 100%;
	}
}
</style>
