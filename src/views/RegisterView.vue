<template>
  <div class="register-view">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="register-icon">
            <i class="bi bi-person-plus"></i>
          </div>
          <h2>Crear Cuenta</h2>
          <p class="register-subtitle">Únete a Fashion Store</p>
        </div>

        <form @submit.prevent="register" class="register-form" v-if="!loading">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input 
              v-model.trim="email" 
              type="email" 
              id="email"
              placeholder="tu@email.com" 
              required 
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              v-model="password" 
              type="password" 
              id="password"
              placeholder="Mínimo 6 caracteres" 
              required 
              minlength="6"
              :disabled="loading"
            />
            <small class="form-hint">La contraseña debe tener al menos 6 caracteres</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              id="confirmPassword"
              placeholder="Repite tu contraseña" 
              required 
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="error-message">
            <i class="bi bi-exclamation-triangle"></i>
            <p>{{ error }}</p>
          </div>

          <div v-if="success" class="success-message">
            <i class="bi bi-check-circle"></i>
            <p>{{ success }}</p>
          </div>

          <button type="submit" class="btn-register" :disabled="loading || !isFormValid">
            <span v-if="!loading">Crear Cuenta</span>
            <span v-else>
              <i class="bi bi-arrow-repeat spin"></i> Creando cuenta...
            </span>
          </button>

          <div class="register-footer">
            <p>¿Ya tienes una cuenta? <router-link to="/login" class="login-link">Inicia sesión</router-link></p>
            <p class="back-link">
              <router-link to="/" class="back-home">
                <i class="bi bi-arrow-left"></i> Volver al inicio
              </router-link>
            </p>
          </div>
        </form>

        <div v-else class="loading-container">
          <div class="spinner"></div>
          <p>Creando tu cuenta...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  computed: {
    isFormValid() {
      return this.email && 
             this.password.length >= 6 && 
             this.password === this.confirmPassword
    }
  },
  methods: {
    async register() {
      this.error = ''
      this.success = ''

      // Validar que las contraseñas coincidan
      if (this.password !== this.confirmPassword) {
        this.error = 'Las contraseñas no coinciden'
        return
      }

      // Validar longitud de contraseña
      if (this.password.length < 6) {
        this.error = 'La contraseña debe tener al menos 6 caracteres'
        return
      }

      this.loading = true

      try {
        // Crear usuario en Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          this.email, 
          this.password
        )
        
        const user = userCredential.user

        // Todos los registros son usuarios regulares
        // Solo el email admin@fashionstore.com será admin
        const isAdmin = this.email === 'admin@fashionstore.com'

        // Guardar información del usuario
        localStorage.setItem('usuarioActivo', user.email)
        localStorage.setItem('userRole', isAdmin ? 'admin' : 'user')

        this.success = '¡Cuenta creada exitosamente! Redirigiendo...'
        
        // Esperar un momento antes de redirigir
        setTimeout(() => {
          if (isAdmin) {
            this.$router.push('/admin')
          } else {
            this.$router.push('/productos')
          }
        }, 1500)

      } catch (error) {
        this.loading = false
        console.error('Error al registrar:', error)
        
        // Mensajes de error amigables
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.error = 'Este correo electrónico ya está en uso'
            break
          case 'auth/invalid-email':
            this.error = 'Correo electrónico inválido'
            break
          case 'auth/weak-password':
            this.error = 'La contraseña es muy débil'
            break
          case 'auth/operation-not-allowed':
            this.error = 'Operación no permitida'
            break
          default:
            this.error = 'Error al crear la cuenta. Por favor, intenta de nuevo.'
        }
      }
    }
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.register-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  padding: 2.5rem 2rem;
  text-align: center;
  color: white;
}

.register-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.register-icon i {
  font-size: 2.5rem;
  color: white;
}

.register-header h2 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.register-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.register-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.95rem;
}

.form-group input,
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid rgba(80, 200, 120, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: var(--text-color);
  box-sizing: border-box;
}

.form-group input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(80, 200, 120, 0.1);
}

.form-group input:disabled,
.form-select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2350C878' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.error-message,
.success-message {
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-message {
  background: rgba(255, 0, 0, 0.1);
  color: #d32f2f;
  border: 2px solid rgba(255, 0, 0, 0.2);
}

.success-message {
  background: rgba(80, 200, 120, 0.1);
  color: var(--accent-color);
  border: 2px solid rgba(80, 200, 120, 0.2);
}

.error-message i,
.success-message i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.error-message p,
.success-message p {
  margin: 0;
  font-weight: 500;
}

.btn-register {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(80, 200, 120, 0.4);
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.register-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.register-footer p {
  margin: 0.5rem 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.back-home {
  color: var(--text-muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.back-home:hover {
  color: var(--primary-color);
}

.loading-container {
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(80, 200, 120, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@media (max-width: 768px) {
  .register-view {
    padding: 1rem;
  }

  .register-header {
    padding: 2rem 1.5rem;
  }

  .register-form {
    padding: 1.5rem;
  }
}
</style>

