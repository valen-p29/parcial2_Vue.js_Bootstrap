<template>
	<div v-if="isOpen" class="admin-modal-overlay" @click.self="closeModal">
		<div class="admin-modal-card">
			<button class="admin-modal-close" @click="closeModal">&times;</button>
			
			<div class="admin-modal-header">
				<h2><i class="bi bi-shield-lock me-2"></i>Crear Cuenta Administrador</h2>
				<p class="text-muted">Ingresa los datos para crear una nueva cuenta de administrador</p>
			</div>

			<form @submit.prevent="createAdmin" class="admin-modal-form">
				<div class="form-group">
					<label for="adminEmail">Correo Electrónico</label>
					<input
						v-model.trim="formData.email"
						type="email"
						class="form-control"
						id="adminEmail"
						placeholder="admin@ejemplo.com"
						required
					/>
					<small class="form-text text-muted">Será utilizado para iniciar sesión</small>
				</div>

				<div class="form-group">
					<label for="adminPassword">Contraseña</label>
					<input
						v-model="formData.password"
						type="password"
						class="form-control"
						id="adminPassword"
						placeholder="Mínimo 6 caracteres"
						minlength="6"
						required
					/>
					<small class="form-text text-muted">Mínimo 6 caracteres</small>
				</div>

				<div class="form-group">
					<label for="adminConfirmPassword">Confirmar Contraseña</label>
					<input
						v-model="formData.confirmPassword"
						type="password"
						class="form-control"
						id="adminConfirmPassword"
						placeholder="Confirma tu contraseña"
						minlength="6"
						required
					/>
				</div>

				<div class="form-group">
					<label for="adminName">Nombre Completo</label>
					<input
						v-model.trim="formData.fullName"
						type="text"
						class="form-control"
						id="adminName"
						placeholder="Nombre del administrador"
						required
					/>
				</div>

				<div v-if="error" class="alert alert-danger py-2">
					<i class="bi bi-exclamation-circle me-2"></i>{{ error }}
				</div>

				<div v-if="successMessage" class="alert alert-success py-2">
					<i class="bi bi-check-circle me-2"></i>{{ successMessage }}
				</div>

				<div class="admin-modal-actions">
					<button type="button" class="btn btn-outline-secondary" @click="closeModal">
						Cancelar
					</button>
					<button type="submit" class="btn btn-danger" :disabled="isLoading">
						<span v-if="!isLoading">
							<i class="bi bi-person-plus me-1"></i>Crear Administrador
						</span>
						<span v-else>
							<i class="bi bi-hourglass-split me-1"></i>Creando...
						</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export default {
	name: 'CreateAdminModal',
	props: {
		isOpen: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			formData: {
				email: '',
				password: '',
				confirmPassword: '',
				fullName: ''
			},
			error: '',
			successMessage: '',
			isLoading: false
		}
	},
	methods: {
		async createAdmin() {
			// Validaciones
			this.error = ''
			this.successMessage = ''

			if (!this.formData.email) {
				this.error = 'El correo electrónico es requerido'
				return
			}

			if (!this.formData.password) {
				this.error = 'La contraseña es requerida'
				return
			}

			if (this.formData.password.length < 6) {
				this.error = 'La contraseña debe tener mínimo 6 caracteres'
				return
			}

			if (this.formData.password !== this.formData.confirmPassword) {
				this.error = 'Las contraseñas no coinciden'
				return
			}

			if (!this.formData.fullName) {
				this.error = 'El nombre completo es requerido'
				return
			}

			this.isLoading = true

			try {
				// Crear usuario en Firebase Authentication
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					this.formData.email,
					this.formData.password
				)

				const user = userCredential.user

				// Guardar información adicional en Firestore
				const userRef = doc(db, 'users', user.uid)
				await setDoc(userRef, {
					uid: user.uid,
					email: user.email,
					fullName: this.formData.fullName,
					role: 'admin',
					isAdmin: true,
					createdAt: new Date().toISOString(),
					createdBy: auth.currentUser.email,
					status: 'active'
				})

				this.successMessage = `Administrador "${this.formData.fullName}" creado exitosamente`

				// Mostrar notificación
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: `Administrador creado: ${this.formData.email}`,
						type: 'success',
						duration: 3000
					}
				}))

				// Limpiar formulario después de 1.5 segundos
				setTimeout(() => {
					this.resetForm()
					this.closeModal()
				}, 1500)
			} catch (error) {
				console.error('Error al crear administrador:', error)
				this.isLoading = false

				// Mostrar error específico según el código
				if (error.code === 'auth/email-already-in-use') {
					this.error = 'Este correo electrónico ya está registrado'
				} else if (error.code === 'auth/invalid-email') {
					this.error = 'El correo electrónico no es válido'
				} else if (error.code === 'auth/weak-password') {
					this.error = 'La contraseña es muy débil'
				} else {
					this.error = 'Error al crear el administrador: ' + error.message
				}

				// Mostrar notificación de error
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: this.error,
						type: 'error',
						duration: 3000
					}
				}))
			}
		},
		resetForm() {
			this.formData = {
				email: '',
				password: '',
				confirmPassword: '',
				fullName: ''
			}
			this.error = ''
			this.successMessage = ''
			this.isLoading = false
		},
		closeModal() {
			this.$emit('close')
			this.resetForm()
		}
	}
}
</script>

<style scoped>
.admin-modal-overlay {
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

.admin-modal-card {
	background: white;
	border-radius: 12px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	max-width: 500px;
	width: 100%;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
	animation: slideUp 0.3s ease;
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

.admin-modal-close {
	position: absolute;
	top: 15px;
	right: 15px;
	background: none;
	border: none;
	font-size: 2rem;
	cursor: pointer;
	color: #666;
	transition: color 0.2s;
	padding: 0;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.admin-modal-close:hover {
	color: #000;
}

.admin-modal-header {
	background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
	color: white;
	padding: 30px 20px;
	border-radius: 12px 12px 0 0;
}

.admin-modal-header h2 {
	margin: 0 0 10px 0;
	font-size: 1.5rem;
	font-weight: 600;
}

.admin-modal-header .text-muted {
	color: rgba(255, 255, 255, 0.8) !important;
	margin: 0;
	font-size: 0.95rem;
}

.admin-modal-form {
	padding: 30px 20px;
}

.form-group {
	margin-bottom: 20px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	font-weight: 600;
	color: #333;
	font-size: 0.95rem;
}

.form-control {
	width: 100%;
	padding: 10px 12px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 1rem;
	transition: border-color 0.3s, box-shadow 0.3s;
	box-sizing: border-box;
}

.form-control:focus {
	outline: none;
	border-color: #dc3545;
	box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-text {
	display: block;
	margin-top: 5px;
	font-size: 0.85rem;
}

.alert {
	margin-bottom: 20px;
	border-radius: 6px;
	border: none;
	padding: 12px 15px;
	font-size: 0.95rem;
}

.alert-danger {
	background-color: #f8d7da;
	color: #721c24;
}

.alert-success {
	background-color: #d4edda;
	color: #155724;
}

.admin-modal-actions {
	display: flex;
	gap: 12px;
	margin-top: 30px;
	padding-top: 20px;
	border-top: 1px solid #f0f0f0;
}

.admin-modal-actions button {
	flex: 1;
	padding: 12px;
	font-size: 1rem;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 600;
	transition: all 0.3s;
}

.admin-modal-actions .btn-outline-secondary {
	background: transparent;
	color: #666;
	border: 1px solid #ddd;
}

.admin-modal-actions .btn-outline-secondary:hover {
	background: #f0f0f0;
	border-color: #999;
}

.admin-modal-actions .btn-danger {
	background: #dc3545;
	color: white;
}

.admin-modal-actions .btn-danger:hover:not(:disabled) {
	background: #c82333;
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.admin-modal-actions button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

@media (max-width: 576px) {
	.admin-modal-card {
		margin: 0;
		max-height: 95vh;
	}

	.admin-modal-header {
		padding: 20px 15px;
	}

	.admin-modal-header h2 {
		font-size: 1.25rem;
	}

	.admin-modal-form {
		padding: 20px 15px;
	}

	.admin-modal-actions {
		flex-direction: column;
	}

	.admin-modal-actions button {
		width: 100%;
	}
}
</style>
