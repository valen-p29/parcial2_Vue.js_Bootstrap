import { createRouter, createWebHistory } from 'vue-router';

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
		component: AdminPanelView
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;
