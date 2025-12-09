<template>
	<div class="notification-container">
		<transition-group name="notification" tag="div">
			<div
				v-for="notification in notifications"
				:key="notification.id"
				:class="['notification', `notification-${notification.type}`]"
				role="alert"
			>
				<div class="notification-content">
					<i :class="getIcon(notification.type)"></i>
					<span>{{ notification.message }}</span>
				</div>
				<button class="notification-close" @click="removeNotification(notification.id)">
					<i class="bi bi-x"></i>
				</button>
			</div>
		</transition-group>
	</div>
</template>

<script>
export default {
	name: 'NotificationComponent',
	data() {
		return {
			notifications: [],
			nextId: 0
		}
	},
	mounted() {
		// Escuchar eventos de notificación globales
		window.addEventListener('show-notification', this.handleNotification)
	},
	beforeUnmount() {
		window.removeEventListener('show-notification', this.handleNotification)
	},
	methods: {
		handleNotification(event) {
			const { message, type = 'info', duration = 3000 } = event.detail
			this.addNotification(message, type, duration)
		},
		addNotification(message, type = 'info', duration = 3000) {
			const id = this.nextId++
			const notification = { id, message, type }
			
			this.notifications.push(notification)
			
			// Auto-remover después del tiempo especificado
			if (duration > 0) {
				setTimeout(() => {
					this.removeNotification(id)
				}, duration)
			}
		},
		removeNotification(id) {
			const index = this.notifications.findIndex(n => n.id === id)
			if (index !== -1) {
				this.notifications.splice(index, 1)
			}
		},
		getIcon(type) {
			const icons = {
				success: 'bi bi-check-circle-fill',
				error: 'bi bi-exclamation-circle-fill',
				warning: 'bi bi-exclamation-triangle-fill',
				info: 'bi bi-info-circle-fill'
			}
			return icons[type] || icons.info
		}
	}
}
</script>

<style scoped>
.notification-container {
	position: fixed;
	top: 80px;
	right: 20px;
	z-index: 9999;
	max-width: 400px;
	pointer-events: none;
}

.notification {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.5rem;
	margin-bottom: 1rem;
	border-radius: 10px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	animation: slideInRight 0.3s ease-out;
	pointer-events: auto;
	min-width: 300px;
	font-weight: 500;
}

.notification-content {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex: 1;
}

.notification-content i {
	font-size: 1.2rem;
	flex-shrink: 0;
}

.notification-close {
	background: none;
	border: none;
	color: inherit;
	cursor: pointer;
	padding: 0.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.7;
	transition: opacity 0.2s;
	margin-left: 1rem;
	flex-shrink: 0;
}

.notification-close:hover {
	opacity: 1;
}

/* Estilos por tipo */
.notification-success {
	background: linear-gradient(135deg, #50C878 0%, #40a85f 100%);
	color: white;
	border-left: 4px solid #2E8B57;
}

.notification-error {
	background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
	color: white;
	border-left: 4px solid #990000;
}

.notification-warning {
	background: linear-gradient(135deg, #FFD700 0%, #ffb347 100%);
	color: #333;
	border-left: 4px solid #ff9800;
}

.notification-info {
	background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
	color: white;
	border-left: 4px solid #1e40af;
}

/* Animaciones */
@keyframes slideInRight {
	from {
		transform: translateX(400px);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

@keyframes slideOutRight {
	from {
		transform: translateX(0);
		opacity: 1;
	}
	to {
		transform: translateX(400px);
		opacity: 0;
	}
}

.notification-enter-active {
	animation: slideInRight 0.3s ease-out;
}

.notification-leave-active {
	animation: slideOutRight 0.3s ease-in;
}

/* Responsivo */
@media (max-width: 576px) {
	.notification-container {
		left: 10px;
		right: 10px;
		top: 70px;
		max-width: none;
	}

	.notification {
		min-width: auto;
		width: 100%;
	}

	.notification-content {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.notification-close {
		align-self: flex-start;
	}
}
</style>
