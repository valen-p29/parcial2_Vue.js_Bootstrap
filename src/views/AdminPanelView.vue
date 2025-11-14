<template class="adminp">
	<div class="admin-panel container py-4">
		<nav class="d-flex justify-content-between align-items-center mb-4"
			style="border-bottom:1px solid var(--border-color);padding-bottom:0.75rem">
			<h2
				style="background:var(--gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin:0">
				Panel de Administración</h2>
			<div>
				<button class="btn btn-outline-info me-2" @click="showAnalytics = !showAnalytics">
					<i class="bi bi-graph-up me-1"></i> Analytics
				</button>
				<button class="btn btn-outline-secondary me-2" @click="$router.push('/productos')"><i
						class="bi bi-shop me-1"></i> Ir a tienda</button>
				<button class="btn btn-danger" @click="cerrarSesion"><i class="bi bi-box-arrow-right me-1"></i> Cerrar
					sesión</button>
			</div>
		</nav>

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

		<div class="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
			<div class="d-flex gap-2">
				<button class="btn btn-primary" @click="openForm()"><i class="bi bi-plus-circle me-1"></i> Añadir
					producto</button>
			</div>
			<small class="text-muted">Gestiona stock, precio y descuentos</small>
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
</template>

<script>
import { analytics, db } from '../firebase/config'
import { logEvent } from 'firebase/analytics'
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from 'firebase/firestore'

export default {
	name: 'AdminPanelView',
	data() {
		return {
			items: [],
			formOpen: false,
			editing: false,
			showAnalytics: false,
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
				} else {
					const colRef = collection(db, 'products')
					const newDoc = await addDoc(colRef, payload)
					this.form.id = newDoc.id
					this.items.push({ id: newDoc.id, ...payload })
					if (analytics) logEvent(analytics, 'product_created', { product_id: newDoc.id })
				}
				this.saveItems()
				this.formOpen = false
			} catch (err) {
				console.error('Error guardando producto en Firestore:', err)
				alert('Ocurrió un error guardando el producto. Revisa la consola.')
			}
		},
		async removeItem(id) {
			if (!confirm('¿Eliminar este producto?')) return
			try {
				await deleteDoc(doc(db, 'products', id))
				this.items = this.items.filter(i => i.id !== id)
				this.saveItems()
				if (analytics) logEvent(analytics, 'product_deleted', { product_id: id })
			} catch (err) {
				console.error('Error eliminando producto en Firestore:', err)
				alert('Ocurrió un error eliminando el producto. Revisa la consola.')
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
		cerrarSesion() {
			localStorage.removeItem('usuarioActivo')
			localStorage.removeItem('userRole')
			if (analytics) {
				logEvent(analytics, 'admin_logout')
			}
			this.$router.push('/login')
		}
	}
}
</script>

<style scoped>
body {
	background: #6b6b6b;
	min-height: 100vh;
}

.admin-panel h2 {
	margin: 0;
}

.analytics-panel {
	animation: slideDown 0.3s ease;
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

.stat-card {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: #f8f9fa;
	border-radius: 10px;
	border: 1px solid #dee2e6;
	transition: transform 0.2s ease;
}

.stat-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
	width: 50px;
	height: 50px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 1.5rem;
}

.stat-info {
	flex: 1;
}

.stat-info h6 {
	margin: 0;
	font-size: 0.9rem;
	color: #6c757d;
	font-weight: 500;
}

.stat-value {
	margin: 0.25rem 0 0;
	font-size: 1.5rem;
	font-weight: 700;
	color: #212529;
}
</style>
