<template>
  <div>
    <section class="hero">
      <div class="hero-background">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
          alt="Fashion Store" class="hero-bg-image">
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <h2 class="hero-title">Nueva Colección</h2>
        <p class="hero-subtitle">Descubre las últimas tendencias en moda</p>
        <button class="btn-primary" id="viewCollectionBtn" @click="openDiscountsModal">Ver Colección</button>
      </div>
    </section>

    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <h3>Productos Destacados</h3>
          <div class="filters">
            <button class="filter-btn" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">Todos</button>
            <button class="filter-btn" :class="{ active: currentFilter === 'hombre' }"
              @click="setFilter('hombre')">Hombre</button>
            <button class="filter-btn" :class="{ active: currentFilter === 'mujer' }"
              @click="setFilter('mujer')">Mujer</button>
            <button class="filter-btn" :class="{ active: currentFilter === 'accesorios' }"
              @click="setFilter('accesorios')">Accesorios</button>
          </div>
        </div>
        <div class="products-grid" id="productsGrid">
          <div class="product-card" v-for="p in visibleProducts" :key="p.id">
            <div class="product-image">
              <div v-if="p.discount && p.discount > 0" class="discount-badge">-{{ Math.round(p.discount) }}%</div>
              <img :src="p.image || getPlaceholder()" :alt="p.name || p.title" />
            </div>
            <div class="product-info">
              <h4 class="product-title">{{ p.title || p.name }}</h4>
              <p class="product-category">{{ p.author || p.category }}</p>
              <p class="product-price">
                <span v-if="p.discount && p.discount > 0"
                  style="color: #6B6B9B;text-decoration:line-through;margin-right:8px">
                  ${{ formatPrice(p.price) }}
                </span>
                <span>${{ formatPrice(discountedPrice(p)) }}</span>
              </p>
              <p class="product-desc">{{ p.description }}</p>
              <div class="product-actions">
                <button class="btn btn-outline-secondary me-2" @click="openQuickView(p)">Ver detalle</button>
                <button class="btn btn-primary" @click="addToCart(p)">Añadir al carrito</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Login Modal -->
    <div class="modal" id="loginModal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="auth-container">
          <form class="auth-form" id="loginForm">
            <h3>Iniciar Sesión</h3>
            <div class="credentials-info">
              <p><strong>Credenciales de prueba:</strong></p>
              <p>Email: <code>admin@fashionstore.com</code></p>
              <p>Contraseña: <code>admin123</code></p>
            </div>
            <div class="form-group">
              <input type="email" id="loginEmail" placeholder="Correo electrónico" required>
            </div>
            <div class="form-group">
              <input type="password" id="loginPassword" placeholder="Contraseña" required>
            </div>
            <button type="submit" class="btn-primary btn-full">Ingresar</button>
            <div class="login-error" id="loginError" style="display: none;">
              <p>Credenciales incorrectas. Usa las credenciales de prueba.</p>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Quick View Modal (reactive) -->
    <div v-if="showQuickView" class="quickview-overlay" @click.self="closeQuickView">
      <div class="quickview-card">
        <button class="quickview-close" @click="closeQuickView"><i class="bi bi-x-lg"></i></button>
        <div class="quickview-body">
          <div class="quickview-left">
            <img :src="selectedProduct.image || getPlaceholder()" :alt="selectedProduct.title" />
          </div>
          <div class="quickview-right">
            <h3>{{ selectedProduct.title }}</h3>
            <p class="text-muted">{{ selectedProduct.author }}</p>
            <p class="quickview-price">${{ formatPrice(selectedProduct.price) }}</p>
            <p>{{ selectedProduct.description }}</p>
            <div class="mt-3" style="display:flex;justify-content:center;gap:0.75rem">
              <button class="btn btn-primary" @click="addToCart(selectedProduct)"><i class="bi bi-bag-plus me-1"></i>
                Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collection Modal -->
    <div v-if="showDiscountsModal" class="quickview-overlay" @click.self="closeDiscountsModal">
      <div class="quickview-card collection-modal-content" style="max-width:1000px">
        <button class="quickview-close" @click="closeDiscountsModal"><i class="bi bi-x-lg"></i></button>
        <div class="collection-container">
          <h2>Productos con Descuento</h2>
          <div class="products-grid">
            <div class="product-card" v-for="p in discountedProducts" :key="p.id">
              <div class="product-image">
                <div v-if="p.discount && p.discount > 0" class="discount-badge">-{{ Math.round(p.discount) }}%</div>
                <img :src="p.image || getPlaceholder()" :alt="p.title" />
              </div>
              <div class="product-info">
                <h4 class="product-title">{{ p.title }}</h4>
                <p class="product-category">{{ p.author }}</p>
                <p class="product-price">
                  <span style="color:#b8b8b8;text-decoration:line-through;margin-right:8px">
                    ${{ formatPrice(p.price) }}
                  </span>
                  <span>${{ formatPrice(discountedPrice(p)) }}</span>
                </p>
                <div class="product-actions" style="justify-content:center">
                  <button class="btn btn-primary" @click="addToCart(p)"><i class="bi bi-bag-plus me-1"></i>
                    Añadir</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Sidebar -->
    <div class="cart-sidebar" :class="{ active: cartOpen }">
      <div class="cart-header">
        <h3>Carrito de Compras</h3>
        <button class="close-cart" @click="closeCart">&times;</button>
      </div>
      <div class="cart-items">
        <div v-if="cartItems.length === 0" class="cart-empty">
          <i class="bi bi-cart-x"></i>
          <p>Tu carrito está vacío</p>
          <p class="cart-empty-subtitle">Agrega productos para comenzar</p>
        </div>
        <div v-else>
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <div class="cart-item-image">
              <img :src="item.image || getPlaceholder()" :alt="item.title || item.name" />
            </div>
            <div class="cart-item-info">
              <h4 class="cart-item-title">{{ item.title || item.name }}</h4>
              <p class="cart-item-category">{{ item.author || item.category }}</p>
              <div class="cart-item-price-row">
                <span class="cart-item-price">${{ formatPrice(discountedPrice(item)) }}</span>
                <div class="cart-item-quantity">
                  <button class="qty-btn" @click="decreaseQuantity(item.id)">-</button>
                  <span class="qty-value">{{ item.quantity || 1 }}</span>
                  <button class="qty-btn" @click="increaseQuantity(item.id)">+</button>
                </div>
              </div>
              <div class="cart-item-subtotal">
                Subtotal: ${{ formatPrice((discountedPrice(item) * (item.quantity || 1))) }}
              </div>
            </div>
            <button class="cart-item-remove" @click="removeFromCart(item.id)" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="cart-total">
          <span>Total:</span>
          <span class="cart-total-amount">${{ formatPrice(cartTotal) }}</span>
        </div>
        <button class="btn-primary btn-full" @click="proceedToCheckout">Proceder al Pago</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

export default {
  name: 'MainComponent',
  data() {
    return {
      products: []
      , showQuickView: false
      , selectedProduct: null
      , currentFilter: 'all'
      , searchQuery: ''
      , showDiscountsModal: false
      , cartOpen: false
      , cartItems: []
    }
  },
  mounted() {
    this.loadProducts()
    this.loadCart()
    window.addEventListener('set-category', this.onSetCategory)
    window.addEventListener('set-search', this.onSetSearch)
    window.addEventListener('toggle-cart', this.onToggleCart)
    window.addEventListener('storage', this.loadCart)
  },
  beforeUnmount() {
    window.removeEventListener('set-category', this.onSetCategory)
    window.removeEventListener('set-search', this.onSetSearch)
    window.removeEventListener('toggle-cart', this.onToggleCart)
    window.removeEventListener('storage', this.loadCart)
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        const price = this.discountedPrice(item)
        const quantity = item.quantity || 1
        return total + (price * quantity)
      }, 0)
    },
    visibleProducts() {
      const q = (this.searchQuery || '').toLowerCase().trim()
      return this.products.filter(p => {
        const matchesCategory = this.currentFilter === 'all' || (p.author || p.category || '').toLowerCase() === this.currentFilter
        const matchesQuery = !q || [
          p.title, p.name, p.author, p.category, p.description
        ].filter(Boolean).some(v => String(v).toLowerCase().includes(q))
        return matchesCategory && matchesQuery
      })
    },
    discountedProducts() {
      return this.products.filter(p => Number(p.discount || 0) > 0)
    }
  },
  methods: {
    async loadProducts() {
      try {
        // Cargar productos desde Firestore (colección: 'products')
        const col = collection(db, 'products')
        const snapshot = await getDocs(col)
        if (!snapshot.empty) {
          this.products = snapshot.docs.map(d => {
            const p = d.data()
            return {
              id: d.id,
              title: p.name || p.title || 'Sin título',
              author: p.category || 'Desconocido',
              description: p.description || '',
              price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
              image: p.image || null,
              stock: Number(p.stock ?? 0),
              discount: Number(p.discount ?? 0)
            }
          })
          return
        }
        // Si no hay documentos en Firestore, usar respaldo local si existe
        const savedAdmin = localStorage.getItem('admin_products')
        if (savedAdmin) {
          const items = JSON.parse(savedAdmin)
          this.products = items.map(p => ({
            id: String(p.id),
            title: p.name,
            author: p.category,
            description: p.description || '',
            price: Number(p.price) || 0,
            image: p.image || null,
            stock: Number(p.stock ?? 0),
            discount: Number(p.discount ?? 0)
          }))
        } else {
          this.products = []
        }
      } catch (err) {
        console.error('Error cargando productos en MainComponent:', err)
        // Fallback a localStorage si falla la conexión a Firestore
        try {
          const savedAdmin = localStorage.getItem('admin_products')
          if (savedAdmin) {
            const items = JSON.parse(savedAdmin)
            this.products = items.map(p => ({
              id: String(p.id),
              title: p.name,
              author: p.category,
              description: p.description || '',
              price: Number(p.price) || 0,
              image: p.image || null,
              stock: Number(p.stock ?? 0),
              discount: Number(p.discount ?? 0)
            }))
          } else {
            this.products = []
          }
        } catch (fallbackErr) {
          console.error('Error en fallback:', fallbackErr)
          this.products = []
        }
      }
    },
    openDiscountsModal() {
      this.showDiscountsModal = true
    },
    closeDiscountsModal() {
      this.showDiscountsModal = false
    },
    setFilter(f) {
      this.currentFilter = f
    },
    onSetCategory(e) {
      this.currentFilter = e.detail || 'all'
      const el = document.querySelectorAll('.filter-btn')
      if (el && el.length) {
        // visual state handled by :class, nothing to do
      }
    },
    onSetSearch(e) {
      this.searchQuery = e.detail || ''
    },
    onToggleCart() {
      this.cartOpen = !this.cartOpen
    },
    closeCart() {
      this.cartOpen = false
    },
    loadCart() {
      try {
        const saved = localStorage.getItem('cart')
        this.cartItems = saved ? JSON.parse(saved) : []
      } catch (err) {
        console.error('Error cargando carrito:', err)
        this.cartItems = []
      }
    },
    increaseQuantity(productId) {
      const item = this.cartItems.find(i => i.id === productId)
      if (item) {
        item.quantity = (item.quantity || 1) + 1
        this.saveCart()
      }
    },
    decreaseQuantity(productId) {
      const item = this.cartItems.find(i => i.id === productId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity = item.quantity - 1
        } else {
          this.removeFromCart(productId)
          return
        }
        this.saveCart()
      }
    },
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(i => i.id !== productId)
      this.saveCart()
    },
    saveCart() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.cartItems))
        window.dispatchEvent(new Event('storage'))
      } catch (err) {
        console.error('Error guardando carrito:', err)
      }
    },
    proceedToCheckout() {
      alert('Funcionalidad de pago próximamente disponible')
    },
    formatPrice(val) {
      if (typeof val !== 'number') return val
      return val.toFixed(2)
    },
    getPlaceholder() {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE3MmE0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODkyYjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg=='
    },
    discountedPrice(p) {
      const d = Number(p.discount || 0)
      if (!d) return Number(p.price || 0)
      return Number(p.price || 0) * (1 - d / 100)
    },
    viewProduct() {
      this.$router.push({ name: 'Products' })
    },
    openQuickView(p) {
      this.selectedProduct = p
      this.showQuickView = true
    },
    closeQuickView() {
      this.showQuickView = false
      this.selectedProduct = null
    },
    addToCart(product) {
      try {
        const idx = this.cartItems.findIndex(i => i.id === product.id)
        if (idx > -1) {
          this.cartItems[idx].quantity = (this.cartItems[idx].quantity || 1) + 1
        } else {
          this.cartItems.push({ ...product, quantity: 1 })
        }
        this.saveCart()
        // Open cart sidebar when item is added
        this.cartOpen = true
        // Small feedback (you can replace this with a toast notification)
        const productName = product.title || product.name
        console.log(`"${productName}" agregado al carrito`)
      } catch (err) {
        console.error('Error al agregar al carrito:', err)
      }
    }
  }
}
</script>
