/**
 * Utilidad para mostrar notificaciones en la aplicación
 * Uso: notify.success('Mensaje'), notify.error('Mensaje'), etc.
 */

export const notify = {
	/**
	 * Muestra una notificación de éxito
	 * @param {string} message - Mensaje a mostrar
	 * @param {number} duration - Duración en milisegundos (default: 3000)
	 */
	success(message, duration = 3000) {
		window.dispatchEvent(new CustomEvent('show-notification', {
			detail: {
				message,
				type: 'success',
				duration
			}
		}))
	},

	/**
	 * Muestra una notificación de error
	 * @param {string} message - Mensaje a mostrar
	 * @param {number} duration - Duración en milisegundos (default: 3000)
	 */
	error(message, duration = 3000) {
		window.dispatchEvent(new CustomEvent('show-notification', {
			detail: {
				message,
				type: 'error',
				duration
			}
		}))
	},

	/**
	 * Muestra una notificación de advertencia
	 * @param {string} message - Mensaje a mostrar
	 * @param {number} duration - Duración en milisegundos (default: 3000)
	 */
	warning(message, duration = 3000) {
		window.dispatchEvent(new CustomEvent('show-notification', {
			detail: {
				message,
				type: 'warning',
				duration
			}
		}))
	},

	/**
	 * Muestra una notificación de información
	 * @param {string} message - Mensaje a mostrar
	 * @param {number} duration - Duración en milisegundos (default: 3000)
	 */
	info(message, duration = 3000) {
		window.dispatchEvent(new CustomEvent('show-notification', {
			detail: {
				message,
				type: 'info',
				duration
			}
		}))
	}
}

export default notify
