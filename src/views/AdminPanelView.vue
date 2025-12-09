<template class="adminp">
	<div class="admin-panel-wrapper">
		<!-- Navbar de Bootstrap 5 con hamburguesa -->
		<nav class="navbar navbar-expand-lg admin-navbar">
			<div class="container-fluid">
				<a class="navbar-brand admin-brand" href="#">
					<i class="bi bi-shield-lock me-2"></i>
					<span>Panel de Administración</span>
				</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar"
					aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="adminNavbar">
					<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<button class="btn btn-nav-admin" @click="showAnalytics = !showAnalytics">
								<i class="bi bi-graph-up me-1"></i> Analytics
							</button>
						</li>
						<li class="nav-item">
							<button class="btn btn-nav-admin" @click="$router.push('/productos')">
								<i class="bi bi-shop me-1"></i> Ir a tienda
							</button>
						</li>
						<li class="nav-item">
							<button class="btn btn-nav-admin btn-logout-admin" @click="cerrarSesion">
								<i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		<div class="admin-panel container py-4">

		<!-- Panel De Analytics View User -->
		<div v-if="showAnalytics" class="analytics-panel mb-4">
			<div class="card">
				<div class="card-header bg-primary text-white">
					<h5 class="mb-0"><i class="bi bi-graph-up me-2"></i>Firebase Analytics</h5>
				</div>
				<div class="card-body">
					<div class="row g-3">
						<div class="col-md-4">
							<div class="stat-card">
								<div class="stat-icon bg-primary">
									<i class="bi bi-eye"></i>
								</div>
								<div class="stat-info">
									<h6>Vistas de Página</h6>
									<p class="stat-value">{{ analyticsData.pageViews || 'N/A' }}</p>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="stat-card">
								<div class="stat-icon bg-success">
									<i class="bi bi-people"></i>
								</div>
								<div class="stat-info">
									<h6>Usuarios Activos</h6>
									<p class="stat-value">{{ analyticsData.activeUsers || 'N/A' }}</p>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="stat-card">
								<div class="stat-icon bg-warning">
									<i class="bi bi-cart-check"></i>
								</div>
								<div class="stat-info">
									<h6>Productos en Carrito</h6>
									<p class="stat-value">{{ analyticsData.cartItems || 0 }}</p>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-4">
						<h6>Información de Analytics</h6>
						<p class="text-muted small">
							Para ver datos detallados de Firebase Analytics, visita el 
							<a href="https://console.firebase.google.com/project/dexapp-8e56c/analytics" 
							target="_blank" class="text-primary">Firebase Console</a>.
						</p>
						<p class="text-muted small mb-0">
							<strong>Measurement ID:</strong> {{ measurementId }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2 admin-actions-header">
			<div class="d-flex gap-2">
				<button class="btn btn-primary admin-btn-add" @click="openForm()">
					<i class="bi bi-plus-circle me-1"></i> Añadir producto
				</button>
				<button class="btn btn-danger admin-btn-add" @click="openCreateAdminModal">
					<i class="bi bi-shield-lock me-1"></i> Crear Administrador
				</button>
			</div>
			<small class="text-muted admin-subtitle">Gestiona stock, precio y descuentos</small>
		</div>

		<div class="table-responsive">
			<table class="table table-dark table-striped align-middle" style="border:1px solid var(--border-color)">
				<thead>
					<tr>
						<th>ID</th>
						<th>Nombre</th>
						<th>Categoría</th>
						<th>Stock</th>
						<th>Precio</th>
						<th>Descuento (%)</th>
						<th>Precio Final</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="p in items" :key="p.id">
						<td>{{ p.id }}</td>
						<td>{{ p.name }}</td>
						<td>{{ p.category }}</td>
						<td>{{ p.stock }}</td>
						<td>${{ Number(p.price).toFixed(2) }}</td>
						<td>{{ p.discount }}</td>
						<td>
							${{ (Number(p.price) * (1 - (Number(p.discount || 0) / 100))).toFixed(2) }}
						</td>
						<td>
							<button class="btn btn-sm btn-warning me-2" @click="openForm(p)"><i
									class="bi bi-pencil-square"></i></button>
							<button class="btn btn-sm btn-danger" @click="removeItem(p.id)"><i
									class="bi bi-trash3"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Formulario para añadir items/producto -->
		<div v-if="formOpen" class="quickview-overlay" @click.self="closeForm">
			<div class="quickview-card" style="max-width:640px;width:90%">
				<button class="quickview-close" @click="closeForm"><i class="bi bi-x-lg"></i></button>
				<div class="p-3">
					<h4 style="margin-top:0">{{ editing ? 'Editar producto' : 'Añadir producto' }}</h4>
					<form @submit.prevent="saveForm">
						<div class="row g-3">
							<div class="col-md-6">
								<label class="form-label">Nombre</label>
								<input v-model.trim="form.name" type="text" class="form-control" required>
							</div>
							<div class="col-md-6">
								<label class="form-label">Categoría</label>
								<select v-model="form.category" class="form-select" required>
									<option value="hombre">Hombre</option>
									<option value="mujer">Mujer</option>
									<option value="accesorios">Accesorios</option>
								</select>
							</div>
							<div class="col-md-4">
								<label class="form-label">Precio</label>
								<input v-model.number="form.price" type="number" step="0.01" min="0"
									class="form-control" required>
							</div>
							<div class="col-md-4">
								<label class="form-label">Stock</label>
								<input v-model.number="form.stock" type="number" min="0" class="form-control" required>
							</div>
							<div class="col-md-4">
								<label class="form-label">Descuento (%)</label>
								<input v-model.number="form.discount" type="number" min="0" max="100"
									class="form-control">
							</div>
							<div class="col-12">
								<label class="form-label">Descripción</label>
								<textarea v-model.trim="form.description" class="form-control" rows="3"
									placeholder="Descripción del producto..."></textarea>
							</div>
							<div class="col-12">
								<label class="form-label">Imagen (URL)</label>
								<input v-model.trim="form.image" type="url" class="form-control"
									placeholder="https://...">
							</div>
						</div>
						<div class="d-flex justify-content-end gap-2 mt-3">
							<button type="button" class="btn btn-outline-secondary" @click="closeForm">Cancelar</button>
							<button type="submit" class="btn btn-primary">Guardar</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	</div>

	<!-- Create Admin Modal -->
	<CreateAdminModal 
		:isOpen="createAdminModalOpen" 
		@close="closeCreateAdminModal"
	/>
</template>

<script>
import { analytics, db, auth } from '../firebase/config'
import { logEvent } from 'firebase/analytics'
import { signOut } from 'firebase/auth'
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from 'firebase/firestore'
import CreateAdminModal from '../components/CreateAdminModal.vue'

export default {
	name: 'AdminPanelView',
	components: {
		CreateAdminModal
	},
	data() {
		return {
			items: [],
			formOpen: false,
			editing: false,
			showAnalytics: false,
			createAdminModalOpen: false,
			analyticsData: {
				pageViews: 0,
				activeUsers: 0,
				cartItems: 0
			},
			measurementId: 'G-GVM0JKHXDB',
			form: {
				id: '',
				name: '',
				category: 'hombre',
				description: '',
				price: 0,
				stock: 0,
				discount: 0,
				image: ''
			}
		}
	},
	created() {
		this.loadItems()
	},
	mounted() {
		this.loadAnalyticsData()
		// Registrar vista del panel de admin
		if (analytics) {
			logEvent(analytics, 'admin_panel_view')
		}
	},
	methods: {
		async loadItems() {
			try {
				// Intentar cargar desde Firestore
				const col = collection(db, 'products')
				const snapshot = await getDocs(col)
				if (!snapshot.empty) {
					this.items = snapshot.docs.map(d => {
						const p = d.data()
						return {
							id: d.id,
							name: p.name || p.title || 'Sin nombre',
							category: p.category || 'hombre',
							description: p.description || '',
							price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
							stock: Number(p.stock ?? 10),
							discount: Number(p.discount ?? 0),
							image: p.image || ''
						}
					})
					this.saveItems()
					return
				}
				// Si Firestore no tiene documentos, dejar lista vacía (se usa localStorage como respaldo)
				this.items = []
				this.saveItems()
			} catch (err) {
				console.error('Error al cargar productos en admin:', err)
				// Fallback a localStorage si no se puede cargar el JSON/Firestore
				const saved = localStorage.getItem('admin_products')
				if (saved) {
					this.items = JSON.parse(saved)
				} else {
					this.items = []
				}
			}
		},
		saveItems() {
			// Guardar en localStorage como respaldo
			localStorage.setItem('admin_products', JSON.stringify(this.items))
		},
		// Nota: Se eliminó la función de exportar JSON. Los productos se almacenan en Firestore.
		openForm(item) {
			if (item) {
				this.editing = true
				this.form = { ...item }
			} else {
				this.editing = false
				this.form = {
					id: '',
					name: '',
					category: 'hombre',
					description: '',
					price: 0,
					stock: 0,
					discount: 0,
					image: ''
				}
			}
			this.formOpen = true
		},
		closeForm() {
			this.formOpen = false
		},
		openCreateAdminModal() {
			this.createAdminModalOpen = true
		},
		closeCreateAdminModal() {
			this.createAdminModalOpen = false
		},
		async saveForm() {
			if (!this.form.name) return
			const payload = {
				name: this.form.name,
				category: this.form.category,
				description: this.form.description || '',
				price: Number(this.form.price) || 0,
				stock: Number(this.form.stock) || 0,
				discount: Number(this.form.discount) || 0,
				image: this.form.image || ''
			}
			try {
				if (this.editing) {
					const docRef = doc(db, 'products', this.form.id)
					await setDoc(docRef, payload, { merge: true })
					const idx = this.items.findIndex(i => i.id === this.form.id)
					if (idx > -1) this.items.splice(idx, 1, { id: this.form.id, ...payload })
					if (analytics) logEvent(analytics, 'product_updated', { product_id: this.form.id })
					
					// Mostrar notificación de éxito
					window.dispatchEvent(new CustomEvent('show-notification', {
						detail: {
							message: `Producto "${this.form.name}" actualizado correctamente`,
							type: 'success',
							duration: 3000
						}
					}))
				} else {
					const colRef = collection(db, 'products')
					const newDoc = await addDoc(colRef, payload)
					this.form.id = newDoc.id
					this.items.push({ id: newDoc.id, ...payload })
					if (analytics) logEvent(analytics, 'product_created', { product_id: newDoc.id })
					
					// Mostrar notificación de éxito
					window.dispatchEvent(new CustomEvent('show-notification', {
						detail: {
							message: `Producto "${this.form.name}" creado correctamente`,
							type: 'success',
							duration: 3000
						}
					}))
				}
				this.saveItems()
				this.formOpen = false
			} catch (err) {
				console.error('Error guardando producto en Firestore:', err)
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: 'Error al guardar el producto. Intenta nuevamente',
						type: 'error',
						duration: 3000
					}
				}))
			}
		},
		async removeItem(id) {
			if (!confirm('¿Eliminar este producto?')) return
			try {
				// Obtener nombre del producto para la notificación
				const product = this.items.find(i => i.id === id)
				const productName = product ? product.name : 'Producto'
				
				await deleteDoc(doc(db, 'products', id))
				this.items = this.items.filter(i => i.id !== id)
				this.saveItems()
				if (analytics) logEvent(analytics, 'product_deleted', { product_id: id })
				
				// Mostrar notificación de éxito
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: `Producto "${productName}" eliminado correctamente`,
						type: 'success',
						duration: 3000
					}
				}))
			} catch (err) {
				console.error('Error eliminando producto en Firestore:', err)
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: 'Error al eliminar el producto. Intenta nuevamente',
						type: 'error',
						duration: 3000
					}
				}))
			}
		},
		loadAnalyticsData() {
			// Obtener datos del carrito para analytics
			try {
				const cart = localStorage.getItem('cart')
				if (cart) {
					const cartItems = JSON.parse(cart)
					this.analyticsData.cartItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
				}
			} catch (err) {
				console.error('Error cargando datos del carrito:', err)
			}

			// Obtener usuarios activos (simulado - en producción usarías la API de Analytics)
			const activeUsers = localStorage.getItem('activeUsers') || 0
			this.analyticsData.activeUsers = activeUsers

			// Obtener vistas de página (simulado)
			const pageViews = parseInt(localStorage.getItem('pageViews') || '0') + 1
			localStorage.setItem('pageViews', pageViews.toString())
			this.analyticsData.pageViews = pageViews

			// Registrar evento en Firebase Analytics
			if (analytics) {
				logEvent(analytics, 'analytics_viewed', {
					cart_items: this.analyticsData.cartItems,
					page_views: this.analyticsData.pageViews
				})
			}
		},
		async cerrarSesion() {
			try {
				// Cerrar sesión en Firebase
				await signOut(auth);
				
				// Limpiar localStorage completamente
				localStorage.removeItem('usuarioActivo');
				localStorage.removeItem('userRole');
				localStorage.removeItem('cart');
				localStorage.removeItem('activeUsers');
				localStorage.removeItem('pageViews');
				
				// Registrar evento de logout
				if (analytics) {
					logEvent(analytics, 'admin_logout');
				}
				
				// Mostrar notificación
				window.dispatchEvent(new CustomEvent('show-notification', {
					detail: {
						message: 'Sesión cerrada correctamente',
						type: 'success',
						duration: 2000
					}
				}));
				
				// Reemplazar el historial de navegación para evitar el botón atrás
				window.history.replaceState(null, '', '/');
				
				// Redirigir a página principal
				this.$router.push('/').catch(() => {
					window.location.href = '/';
				});
			} catch (err) {
				console.error('Error al cerrar sesión:', err);
				
				// Aún así redirigir aunque haya error en Firebase
				localStorage.clear();
				window.history.replaceState(null, '', '/');
				this.$router.push('/').catch(() => {
					window.location.href = '/';
				});
			}
		}
	}
}
</script>

<style scoped>
.admin-panel-wrapper {
	min-height: 100vh;
	background: var(--bg-color, #F5F5F5);
}

/* Navbar de Administración */
.admin-navbar {
	background: rgba(26, 26, 46, 0.95);
	backdrop-filter: blur(20px);
	box-shadow: var(--shadow);
	border-bottom: 1px solid var(--border-color);
	padding: 1rem 0;
}

.admin-brand {
	font-size: 1.5rem;
	font-weight: 700;
	background: var(--gradient);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
	text-decoration: none;
	display: flex;
	align-items: center;
}

.admin-brand i {
	color: var(--primary-color);
	-webkit-text-fill-color: var(--primary-color);
}

.navbar-toggler {
	border: 2px solid var(--primary-color);
	border-radius: 8px;
	padding: 0.5rem 0.75rem;
}

.navbar-toggler:focus {
	box-shadow: 0 0 0 0.25rem rgba(80, 200, 120, 0.25);
}

.navbar-toggler-icon {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2880, 200, 120, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.btn-nav-admin {
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid var(--border-color);
	color: rgba(255, 255, 255, 0.85);
	padding: 0.5rem 1rem;
	border-radius: 8px;
	margin: 0 0.25rem;
	transition: all 0.3s ease;
	font-weight: 500;
}

.btn-nav-admin:hover {
	background: var(--primary-color);
	color: white;
	border-color: var(--primary-color);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(80, 200, 120, 0.3);
}

.btn-logout-admin {
	background: rgba(255, 68, 68, 0.1);
	border-color: rgba(255, 68, 68, 0.3);
}

.btn-logout-admin:hover {
	background: #ff4444;
	border-color: #ff4444;
	box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
}

/* Panel de Administración */
.admin-panel {
	background: transparent;
}

.admin-panel h2 {
	margin: 0;
}

/* Analytics Panel */
.analytics-panel {
	animation: slideDown 0.3s ease;
	margin-bottom: 2rem;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.analytics-panel .card {
	background: var(--bg-card, #FFFFFF);
	border: 1px solid var(--border-color);
	border-radius: 15px;
	box-shadow: var(--shadow);
	overflow: hidden;
}

.analytics-panel .card-header {
	background: var(--gradient) !important;
	border-bottom: 2px solid rgba(80, 200, 120, 0.2);
	padding: 1.25rem 1.5rem;
}

.analytics-panel .card-body {
	padding: 1.5rem;
	background: var(--bg-card, #FFFFFF);
}

.stat-card {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: var(--bg-secondary, #FDF6E3);
	border-radius: 12px;
	border: 2px solid var(--border-color);
	transition: all 0.3s ease;
	height: 100%;
}

.stat-card:hover {
	transform: translateY(-5px);
	box-shadow: var(--shadow-hover);
	border-color: var(--primary-color);
}

.stat-icon {
	width: 60px;
	height: 60px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 1.75rem;
	flex-shrink: 0;
}

.stat-icon.bg-primary {
	background: var(--gradient) !important;
}

.stat-icon.bg-success {
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%) !important;
}

.stat-icon.bg-warning {
	background: linear-gradient(135deg, var(--secondary-color) 0%, #ffb347 100%) !important;
}

.stat-info {
	flex: 1;
}

.stat-info h6 {
	margin: 0;
	font-size: 0.9rem;
	color: var(--text-muted);
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.stat-value {
	margin: 0.5rem 0 0;
	font-size: 2rem;
	font-weight: 700;
	color: var(--text-color);
	background: var(--gradient);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

/* Tabla de Productos */
.table-responsive {
	border-radius: 15px;
	overflow: hidden;
	box-shadow: var(--shadow);
	background: var(--bg-card, #FFFFFF);
}

.table-dark {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: white;
	margin: 0;
}

.table-dark thead {
	background: rgba(80, 200, 120, 0.1);
	border-bottom: 2px solid var(--primary-color);
}

.table-dark thead th {
	border-bottom: 2px solid var(--primary-color);
	padding: 1rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-size: 0.9rem;
	color: var(--primary-color);
}

.table-dark tbody tr {
	border-bottom: 1px solid rgba(80, 200, 120, 0.1);
	transition: all 0.3s ease;
}

.table-dark tbody tr:hover {
	background: rgba(80, 200, 120, 0.1);
	transform: scale(1.01);
}

.table-dark tbody td {
	padding: 1rem;
	vertical-align: middle;
}

/* Botones de Acción */
.btn-sm {
	padding: 0.4rem 0.75rem;
	border-radius: 8px;
	font-weight: 500;
	transition: all 0.3s ease;
	border: none;
}

.btn-warning {
	background: linear-gradient(135deg, var(--secondary-color) 0%, #ffb347 100%);
	color: white;
}

.btn-warning:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.btn-danger {
	background: linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%);
	color: white;
}

.btn-danger:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
}

.btn-primary {
	background: var(--gradient);
	border: none;
	color: white;
	padding: 0.75rem 1.5rem;
	border-radius: 10px;
	font-weight: 600;
	transition: all 0.3s ease;
}

.btn-primary:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow-hover);
}

/* Formulario */
.form-control,
.form-select {
	border: 2px solid var(--border-color);
	border-radius: 8px;
	padding: 0.75rem;
	transition: all 0.3s ease;
	background: var(--bg-card, #FFFFFF);
}

.form-control:focus,
.form-select:focus {
	border-color: var(--primary-color);
	box-shadow: 0 0 0 0.25rem rgba(80, 200, 120, 0.25);
	outline: none;
}

.form-label {
	font-weight: 600;
	color: var(--text-color);
	margin-bottom: 0.5rem;
}

/* Admin Actions Header */
.admin-actions-header {
	padding: 1.5rem;
	background: var(--bg-card, #FFFFFF);
	border-radius: 12px;
	box-shadow: var(--shadow);
	border: 1px solid var(--border-color);
}

.admin-btn-add {
	box-shadow: 0 4px 12px rgba(80, 200, 120, 0.2);
}

.admin-subtitle {
	color: var(--text-muted);
	font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
	.admin-brand span {
		font-size: 1.2rem;
	}

	.btn-nav-admin {
		width: 100%;
		margin: 0.25rem 0;
		text-align: left;
	}

	.navbar-nav {
		padding-top: 1rem;
	}

	.table-responsive {
		font-size: 0.85rem;
	}

	.table-dark thead th,
	.table-dark tbody td {
		padding: 0.75rem 0.5rem;
	}

	.stat-card {
		flex-direction: column;
		text-align: center;
	}

	.admin-actions-header {
		flex-direction: column;
		align-items: flex-start !important;
	}
}
</style>
