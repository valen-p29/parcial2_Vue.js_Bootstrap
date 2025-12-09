<template>
	<div v-if="isOpen" class="profile-overlay" @click.self="closeModal">
		<div class="profile-card">
			<button class="profile-close" @click="closeModal">&times;</button>
			
			<div class="profile-header">
				<i class="bi bi-person-circle profile-avatar"></i>
				<h2 class="profile-email">{{ currentUser?.email }}</h2>
			</div>

			<div v-if="!editing" class="profile-content">
				<div class="profile-info">
					<div class="info-group">
						<label>Nombre Completo</label>
						<p>{{ userProfile.fullName || 'No especificado' }}</p>
					</div>
					<div class="info-group">
						<label>Teléfono</label>
						<p>{{ userProfile.phone || 'No especificado' }}</p>
					</div>
					<div class="info-group">
						<label>Dirección</label>
						<p>{{ userProfile.address || 'No especificado' }}</p>
					</div>
				</div>

				<button class="btn btn-primary btn-edit" @click="startEditing">
					<i class="bi bi-pencil-square me-2"></i>Editar Perfil
				</button>
			</div>

			<div v-else class="profile-form">
				<form @submit.prevent="saveProfile">
					<div class="form-group">
						<label for="fullName">Nombre Completo</label>
						<input
							v-model.trim="userProfile.fullName"
							type="text"
							class="form-control"
							id="fullName"
							placeholder="Ingrese su nombre completo"
						/>
					</div>

					<div class="form-group">
						<label for="phone">Teléfono</label>
						<input
							v-model.trim="userProfile.phone"
							type="tel"
							class="form-control"
							id="phone"
							placeholder="Ingrese su teléfono"
						/>
					</div>

					<div class="form-group">
						<label for="address">Dirección</label>
						<input
							v-model.trim="userProfile.address"
							type="text"
							class="form-control"
							id="address"
							placeholder="Ingrese su dirección"
						/>
					</div>

					<div v-if="saveError" class="alert alert-danger py-2 text-center">
						{{ saveError }}
					</div>

					<div class="form-actions">
						<button type="button" class="btn btn-secondary" @click="cancelEditing">
							Cancelar
						</button>
						<button type="submit" class="btn btn-primary" :disabled="isSaving">
							<span v-if="!isSaving">Guardar Cambios</span>
							<span v-else>Guardando...</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
	name: 'ProfileModal',
	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		currentUser: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			editing: false,
			saving: false,
			isSaving: false,
			saveError: '',
			userProfile: {
				fullName: '',
				phone: '',
				address: ''
			}
		}
	},
	watch: {
		isOpen(newVal) {
			if (newVal && this.currentUser) {
				this.loadProfile()
			}
		}
	},
	methods: {
		async loadProfile() {
			try {
				const userDocRef = doc(db, 'users', this.currentUser.uid)
				const userDoc = await getDoc(userDocRef)
				
				if (userDoc.exists()) {
					const data = userDoc.data()
					this.userProfile = {
						fullName: data.fullName || '',
						phone: data.phone || '',
						address: data.address || ''
					}
				} else {
					// Si no existe, inicializar valores vacíos
					this.userProfile = {
						fullName: '',
						phone: '',
						address: ''
					}
				}
			} catch (error) {
				console.error('Error al cargar perfil:', error)
				this.saveError = 'Error al cargar los datos del perfil'
			}
		},
		startEditing() {
			this.editing = true
			this.saveError = ''
		},
		cancelEditing() {
			this.editing = false
			this.saveError = ''
			this.loadProfile()
		},
		async saveProfile() {
			if (!this.userProfile.fullName.trim()) {
				this.saveError = 'El nombre completo es requerido'
				return
			}

			this.isSaving = true
			this.saveError = ''

			try {
				const userDocRef = doc(db, 'users', this.currentUser.uid)
				await setDoc(userDocRef, {
					email: this.currentUser.email,
					fullName: this.userProfile.fullName,
					phone: this.userProfile.phone,
					address: this.userProfile.address,
					updatedAt: new Date().toISOString()
				}, { merge: true })

				this.editing = false
				this.isSaving = false

				// Mostrar notificación de éxito
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: 'Perfil actualizado correctamente',
						type: 'success',
						duration: 2000
					}
				}))
			} catch (error) {
				console.error('Error al guardar perfil:', error)
				this.saveError = 'Error al guardar el perfil. Intenta nuevamente.'
				this.isSaving = false
			}
		},
		closeModal() {
			this.$emit('close')
			this.editing = false
			this.saveError = ''
		}
	}
}
</script>

<style scoped>
/* CSS Variables from main.css */
:root {
	--primary-color: #50C878;
	--secondary-color: #FFD700;
	--accent-color: #2E8B57;
	--detail-color: #FDF6E3;
	--bg-color: #F5F5F5;
	--bg-secondary: #FDF6E3;
	--bg-card: #FFFFFF;
	--text-color: #000000;
	--text-light: #2E2E2E;
	--text-muted: #6b6b6b;
	--border-color: #E6E1D6;
	--shadow: 0 6px 20px rgba(0,0,0,0.08);
	--shadow-hover: 0 8px 30px rgba(93, 199, 121, 0.1);
	--gradient: linear-gradient(135deg, #0f5426 0%, #13924a 100%);
	--gradient-secondary: linear-gradient(135deg, #50C878 0%, #FFD700 100%);
}

.profile-overlay {
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

.profile-card {
	background: var(--bg-card);
	border-radius: 16px;
	box-shadow: var(--shadow);
	max-width: 500px;
	width: 100%;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
	animation: slideUp 0.3s ease;
	border: 1px solid var(--border-color);
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

.profile-close {
	position: absolute;
	top: 15px;
	right: 15px;
	background: none;
	border: none;
	font-size: 2rem;
	cursor: pointer;
	color: var(--text-muted);
	transition: all 0.2s;
	padding: 0;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	border-radius: 50%;
}

.profile-close:hover {
	color: var(--accent-color);
	background: rgba(80, 200, 120, 0.1);
	transform: rotate(90deg);
}

.profile-header {
	background: var(--gradient);
	color: white;
	padding: 40px 20px 30px;
	text-align: center;
	border-radius: 16px 16px 0 0;
	border-bottom: 3px solid var(--secondary-color);
}

.profile-avatar {
	font-size: 4rem;
	display: block;
	margin-bottom: 15px;
	opacity: 0.95;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.profile-email {
	margin: 0;
	font-size: 1.2rem;
	word-break: break-all;
	font-weight: 600;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.profile-content,
.profile-form {
	padding: 30px 25px;
}

.profile-info {
	margin-bottom: 25px;
}

.info-group {
	margin-bottom: 20px;
	padding-bottom: 15px;
	border-bottom: 2px solid var(--border-color);
}

.info-group:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.info-group label {
	display: block;
	font-size: 0.8rem;
	color: var(--accent-color);
	text-transform: uppercase;
	letter-spacing: 0.6px;
	margin-bottom: 8px;
	font-weight: 700;
}

.info-group p {
	margin: 0;
	font-size: 1.05rem;
	color: var(--text-light);
	font-weight: 500;
}

.btn-edit {
	width: 100%;
	background: var(--gradient-secondary);
	color: var(--text-color);
	border: none;
	padding: 13px 20px;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-top: 10px;
	box-shadow: var(--shadow);
}

.btn-edit:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow-hover);
	filter: brightness(1.05);
}

/* Form Styles */
.form-group {
	margin-bottom: 20px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	font-weight: 600;
	color: var(--accent-color);
	font-size: 0.9rem;
	text-transform: capitalize;
	letter-spacing: 0.3px;
}

.form-control {
	width: 100%;
	padding: 12px 14px;
	border: 2px solid var(--border-color);
	border-radius: 8px;
	font-size: 1rem;
	transition: all 0.3s;
	box-sizing: border-box;
	background: var(--bg-secondary);
	font-family: inherit;
	color: var(--text-light);
}

.form-control:focus {
	outline: none;
	border-color: var(--primary-color);
	box-shadow: 0 0 0 4px rgba(80, 200, 120, 0.15);
	background: white;
}

.form-control::placeholder {
	color: var(--text-muted);
}

.form-actions {
	display: flex;
	gap: 12px;
	margin-top: 25px;
	padding-top: 20px;
	border-top: 2px solid var(--border-color);
}

.form-actions button {
	flex: 1;
	padding: 12px;
	font-size: 1rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	transition: all 0.3s;
}

.form-actions .btn-secondary {
	background: var(--bg-secondary);
	color: var(--text-light);
	border: 2px solid var(--border-color);
}

.form-actions .btn-secondary:hover {
	background: var(--detail-color);
	border-color: var(--secondary-color);
	color: var(--accent-color);
}

.form-actions .btn-primary {
	background: var(--gradient-secondary);
	color: var(--text-color);
	border: none;
	box-shadow: var(--shadow);
}

.form-actions .btn-primary:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: var(--shadow-hover);
	filter: brightness(1.05);
}

.form-actions button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.alert {
	margin-bottom: 20px;
	border-radius: 8px;
	border: none;
	padding: 12px 15px;
	font-size: 0.95rem;
	display: flex;
	align-items: center;
	gap: 10px;
	border-left: 4px solid;
}

.alert-danger {
	background: rgba(200, 50, 50, 0.1);
	color: #c82332;
	border-left-color: #c82332;
}

.alert-success {
	background: rgba(80, 200, 120, 0.1);
	color: var(--accent-color);
	border-left-color: var(--primary-color);
}

@media (max-width: 576px) {
	.profile-card {
		margin: 0;
	}

	.profile-header {
		padding: 30px 20px 20px;
	}

	.profile-avatar {
		font-size: 3rem;
		margin-bottom: 10px;
	}

	.profile-email {
		font-size: 1.05rem;
	}

	.profile-content,
	.profile-form {
		padding: 20px 15px;
	}

	.form-actions {
		flex-direction: column;
	}

	.form-actions button {
		width: 100%;
	}
}
</style>
