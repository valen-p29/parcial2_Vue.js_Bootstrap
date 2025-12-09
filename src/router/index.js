import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

import DashboardView from '../views/DashboardView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProductsView from '../views/ProductsView.vue';
import AdminPanelView from '../views/AdminPanelView.vue';

const routes = [
	{
		path: '/',
		name: 'Dashboard',
		component: DashboardView
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginView
	},
	{
		path: '/register',
		name: 'Register',
		component: RegisterView
	},
	{
		path: '/products',
		name: 'Products',
		component: ProductsView,
		alias: ['/productos']
	},
	{
		path: '/admin',
		name: 'AdminPanel',
		component: AdminPanelView,
		meta: { requiresAuth: true, requiresAdmin: true }
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

// Route guard para proteger rutas
router.beforeEach((to, from, next) => {
	// Si la ruta requiere autenticación
	if (to.meta.requiresAuth) {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				// No está autenticado, redirigir a login
				next('/login');
			} else {
				// Verificar si requiere ser admin
				if (to.meta.requiresAdmin) {
					const isAdmin = user.email === 'admin@fashionstore.com' || 
						localStorage.getItem('userRole') === 'admin';
					
					if (!isAdmin) {
						// No es admin, redirigir a productos
						next('/productos');
					} else {
						next();
					}
				} else {
					next();
				}
			}
		});
	} else {
		next();
	}
});

export default router;
