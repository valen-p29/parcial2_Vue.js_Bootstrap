<template>
	<aside class="sidebar">
		<div class="sidebar-brand">
			<div class="brand-icon">
				<i class="bi bi-shop"></i>
			</div>
			<h2>FASHION STORE</h2>
		</div>

		<button class="btn-search" @click="toggleSearch" :aria-pressed="searchOpen" title="Buscar">
			<i class="bi bi-search"></i>
			<span class="label">Buscar</span>
		</button>

		<nav class="sidebar-nav">
			<a href="#" class="sidebar-link" @click.prevent="setCategory('all')">
				<i class="bi bi-grid-3x3-gap"></i>
				<span class="label">Todos</span>
			</a>
			<a href="#" class="sidebar-link" @click.prevent="setCategory('hombre')">
				<i class="bi bi-person"></i>
				<span class="label">Hombre</span>
			</a>
			<a href="#" class="sidebar-link" @click.prevent="setCategory('mujer')">
				<i class="bi bi-gender-female"></i>
				<span class="label">Mujer</span>
			</a>
			<a href="#" class="sidebar-link" @click.prevent="setCategory('accesorios')">
				<i class="bi bi-bag"></i>
				<span class="label">Accesorios</span>
			</a>
		</nav>

		<div class="sidebar-actions">
			<button class="btn-cart" @click="toggleCart" title="Carrito">
				<i class="bi bi-cart3"></i>
				<span class="label">Carrito</span>
			</button>

			<button class="btn-login" @click="openLogin" title="Login" v-if="!currentUser">
				<i class="bi bi-person-circle"></i>
				<span class="label">Entrar</span>
			</button>

			<router-link to="/register" class="btn-register-link" v-if="!currentUser">
				<i class="bi bi-person-plus"></i>
				<span class="label">Registrarse</span>
			</router-link>

			<button class="btn-logout" @click="logout" title="Cerrar Sesión" v-if="currentUser">
				<i class="bi bi-box-arrow-right"></i>
				<span class="label">Salir</span>
			</button>

			<!-- Botón para ir al Panel de Administración (solo para admins) -->
			<router-link to="/admin" class="btn-admin" v-if="isAdmin">
				<i class="bi bi-shield-lock"></i>
				<span class="label">Panel Admin</span>
			</router-link>
		</div>

		<!-- Search popover -->
		<Transition name="search">
			<div v-if="searchOpen" class="search-container">
				<input v-model="searchQuery" type="text" class="search-input" placeholder="Buscar productos, categorías..."
					@input="emitSearch" autofocus />
				<button class="search-close" @click="closeSearch" title="Cerrar"><i class="bi bi-x-lg"></i></button>
			</div>
		</Transition>

		<!-- Login Modal -->
		<div v-if="loginOpen" class="quickview-overlay" @click.self="loginOpen = false">
			<div class="quickview-card" style="max-width:420px;width:90%">
				<button class="quickview-close" @click="loginOpen = false">&times;</button>
				<div class="p-3">
					<h3 style="margin-top:0">Iniciar Sesión</h3>
					<div class="credentials-info">
						<p><strong>Credenciales de prueba</strong></p>
						<p><strong>Administrador:</strong></p>
						<p>admin@fashionstore.com / admin123</p>
						<p><strong>Usuario:</strong></p>
						<p>usuario@fashionstore.com / usuario123</p>
					</div>
					<form @submit.prevent="login" v-if="!loading">
						<div class="form-group">
							<input v-model.trim="email" type="email" placeholder="Correo electrónico" required />
						</div>
						<div class="form-group">
							<input v-model="password" type="password" placeholder="Contraseña" required />
						</div>
						<button class="btn-primary btn-full" type="submit" :disabled="loading">
							<span v-if="!loading">Entrar</span>
							<span v-else>Iniciando sesión...</span>
						</button>
						<div v-if="loginError" class="login-error" style="margin-top:10px">
							<p>{{ loginError }}</p>
						</div>
					</form>
					<div v-else class="loading-spinner">
						<p>Iniciando sesión...</p>
					</div>
				</div>
			</div>
		</div>
	</aside>
</template>

<script>
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

export default {
	name: 'NavbarComponent',
	data() {
		return {
			searchOpen: false,
			searchQuery: '',
			cartCount: 0,
			loginOpen: false,
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
		onAuthStateChanged(auth, (user) => {
			this.currentUser = user
			if (user) {
				// Determine role based on email
				const isAdmin = user.email === 'admin@fashionstore.com'
				localStorage.setItem('usuarioActivo', user.email)
				localStorage.setItem('userRole', isAdmin ? 'admin' : 'user')
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
		setCategory(category) {
			window.dispatchEvent(new CustomEvent('set-category', { detail: category }))
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
		async login() {
			this.loginError = ''
			this.loading = true
			
			try {
				const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password)
				const user = userCredential.user
				
				// Determine role based on email
				const isAdmin = user.email === 'admin@fashionstore.com'
				
				localStorage.setItem('usuarioActivo', user.email)
				localStorage.setItem('userRole', isAdmin ? 'admin' : 'user')
				
				this.loginOpen = false
				this.loading = false
				
				// Redirect based on role
				if (isAdmin) {
					this.$router.push('/admin')
				} else {
					this.$router.push('/productos')
				}
			} catch (error) {
				this.loading = false
				console.error('Error de autenticación:', error)
				
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
				await signOut(auth)
				this.$router.push('/')
			} catch (error) {
				console.error('Error al cerrar sesión:', error)
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
.sidebar-actions .btn-admin {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, var(--primary-color, #50C878), #3aa86b);
  color: #ffffff;
  padding: 0.45rem 0.7rem;
  border-radius: 8px;
  border: none;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.sidebar-actions .btn-admin i {
  font-size: 1.05rem;
}

.sidebar-actions .btn-admin .label {
  display: inline-block;
  line-height: 1;
}

.sidebar-actions .btn-admin:hover {
  opacity: 0.95;
  transform: translateY(-2px);
}

/* Ajustes para que se vea consistente con otros botones del sidebar */
.sidebar-actions .btn-admin:active {
  transform: translateY(0);
}

/* En pantallas pequeñas mantener la visibilidad del icono y etiqueta */
@media (max-width: 576px) {
  .sidebar-actions .btn-admin {
    padding: 0.35rem 0.5rem;
    gap: 0.4rem;
  }
}
</style>
