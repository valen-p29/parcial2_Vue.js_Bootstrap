# Fashion Store - E-commerce Vue.js Application

Aplicación web de e-commerce desarrollada con Vue.js 3, Firebase Authentication y Bootstrap 5.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Configuración](#configuración)
- [Componentes](#componentes)
- [Rutas](#rutas)
- [Autenticación](#autenticación)
- [Carrito de Compras](#carrito-de-compras)
- [Diseño y Estilos](#diseño-y-estilos)

## ✨ Características

### Funcionalidades Principales

- **Sistema de Autenticación con Firebase**
  - Registro de usuarios 
  - Inicio de sesión con email y contraseña
  - Detección automática de roles (solo admin@fashionstore.com es admin)
  - Gestión de sesiones persistente

- **Catálogo de Productos**
  - Visualización de productos con imágenes
  - Carga de productos desde Firestore (colección `products`)
  - Filtrado por categorías (Todos, Hombre, Mujer, Accesorios)
  - Búsqueda de productos en tiempo real
  - Vista rápida de productos (Quick View)
  - Productos con descuentos destacados
  - Cálculo automático de precios con descuentos

- **Carrito de Compras**
  - Agregar productos al carrito
  - Modificar cantidades
  - Eliminar productos
  - Cálculo automático del total
  - Persistencia en localStorage

- **Panel de Administración (solo para admin@fashionstore.com)**
  - Gestión de productos 
  - Agregar, editar y eliminar productos
  - Exportar productos a JSON
  - Vista de Firebase Analytics con estadísticas
  - Eventos de Analytics integrados

- **Diseño Responsivo**
  - Sidebar colapsable con animaciones
  - Diseño adaptativo para móviles y tablets
  - Interfaz moderna con gradientes y animaciones

## 🛠 Tecnologías

- **Frontend Framework**: Vue.js 3.2.13
- **Routing**: Vue Router 4.6.3
- **Autenticación**: Firebase Authentication 12.5.0
- **Analytics**: Firebase Analytics
- **Estilos**: CSS3 con variables CSS personalizadas
- **Iconos**: Bootstrap Icons 1.13.1
- **Build Tool**: Vue CLI 5.0.0

## 📁 Estructura del Proyecto

```
PARCIAL_2/
├── public/
│   ├── index.html
│   ├── favicon.ico
├── src/
│   ├── assets/
│   │   └── main.css          # Estilos globales y componentes
│   ├── components/
│   │   ├── NavbarComponent.vue    # Sidebar de navegación
│   │   ├── MainComponent.vue      # Componente principal con productos
│   │   └── FooterComponent.vue    # Pie de página
│   ├── firebase/
│   │   └── config.js        # Configuración de Firebase
│   ├── router/
│   │   └── index.js         # Configuración de rutas
│   ├── views/
│   │   ├── DashboardView.vue      # Vista principal
│   │   ├── RegisterView.vue        # Vista de registro
│   │   ├── LoginView.vue          # Vista de login
│   │   ├── ProductsView.vue        # Vista de productos
│   │   └── AdminPanelView.vue     # Panel de administración
│   ├── App.vue
│   └── main.js
├── package.json
└── README.md
```

### Navegación

- **Sidebar**: Se expande al pasar el mouse, mostrando etiquetas de navegación
- **Búsqueda**: Click en el icono de búsqueda para buscar productos
- **Carrito**: Click en el icono del carrito para ver/editar productos
- **Login/Registro**: Botones en el sidebar para autenticación

### Funcionalidades del Usuario

1. **Registro de Cuenta**
   - Click en "Registrarse" en el sidebar
   - Completar formulario con email, contraseña y tipo de usuario
   - El sistema detecta automáticamente si es admin o usuario

2. **Inicio de Sesión**
   - Click en "Entrar" en el sidebar
   - Ingresar email y contraseña
   - Redirección automática según el rol

3. **Navegación de Productos**
   - Filtrar por categorías desde el sidebar o los botones de filtro
   - Buscar productos usando la barra de búsqueda
   - Ver detalles rápidos con "Ver detalle"
   - Agregar productos al carrito

4. **Carrito de Compras**
   - Ver productos agregados
   - Modificar cantidades (+/-)
   - Eliminar productos
   - Ver total calculado automáticamente

## 🧩 Componentes

### NavbarComponent.vue
Sidebar de navegación lateral con:
- Logo y marca
- Búsqueda de productos
- Navegación por categorías
- Carrito de compras
- Botones de autenticación (Login/Registro/Logout)
- Modal de login integrado

**Características:**
- Sidebar colapsable (60px → 240px al hover)
- Animaciones suaves
- Diseño con gradientes
- Responsive (se convierte en navbar horizontal en móviles)

### MainComponent.vue
Componente principal que muestra:
- Hero section con imagen destacada
- Grid de productos
- Filtros por categoría
- Modales de vista rápida
- Modal de productos con descuento
- Carrito lateral (Cart Sidebar)

**Funcionalidades:**
- Carga de productos desde JSON o localStorage
- Filtrado y búsqueda reactiva
- Gestión del carrito
- Cálculo de precios con descuentos

**Funcionalidades:**
- Carga de productos desde Firestore (colección `products`) con fallback a `localStorage`
- Tarjetas del grid redimensionadas para ser más anchas (min-width: 320px) para mejorar la legibilidad en pantallas grandes; el diseño sigue siendo responsive y ajusta el número de columnas automáticamente.
- Filtrado y búsqueda reactiva
- Gestión del carrito
- Cálculo de precios con descuentos

### FooterComponent.vue
Pie de página con:
- Información de la tienda
- Enlaces de navegación
- Redes sociales
- Formulario de newsletter

### RegisterView.vue
Vista de registro con:
- Formulario de registro completo
- Validación de contraseñas
- Selección de tipo de usuario
- Integración con Firebase Auth
- Mensajes de error/success
- Diseño moderno con gradientes

## 🗺 Rutas

| Ruta | Componente | Descripción | Acceso |
|------|-----------|-------------|--------|
| `/` | DashboardView | Página principal con productos | Público |
| `/login` | LoginView | Página de inicio de sesión | Público |
| `/register` | RegisterView | Página de registro | Público |
| `/products` o `/productos` | ProductsView | Vista de productos | Público |
| `/admin` | AdminPanelView | Panel de administración | Solo Admin |

## 🔐 Autenticación

### Sistema de Roles

El sistema detecta automáticamente el rol del usuario basándose en:
- Email del usuario (solo `admin@fashionstore.com` es administrador)
- Todos los demás registros son usuarios regulares

### Roles Disponibles

- **Usuario**: Acceso a productos y carrito (todos los registros son usuarios por defecto)
- **Administrador**: Acceso completo + panel de administración (solo `admin@fashionstore.com`)

### Sistema de Registro

- **Todos los registros son usuarios regulares** por defecto
- Solo el email `admin@fashionstore.com` tiene privilegios de administrador
- No hay selección de tipo de cuenta en el formulario de registro

### Credenciales de Prueba

**Administrador:**
- Email: `admin@fashionstore.com`
- Contraseña: `admin123`

**Usuario por defecto:**
- Email: `usuario@fashionstore.com`
- Contraseña: `usuario123`

> **Nota**: Las credenciales deben crearse usando el formulario de registro.

## 🛒 Carrito de Compras

### Funcionalidades

- **Agregar productos**: Desde cualquier tarjeta de producto
- **Modificar cantidad**: Botones +/- en el sidebar del carrito
- **Eliminar productos**: Botón de eliminar en cada item
- **Cálculo automático**: Total actualizado en tiempo real
- **Persistencia**: Los productos se guardan en localStorage
- **Diseño**: Sidebar deslizable con diseño moderno
- **Apertura automática**: El carrito se abre automáticamente al agregar un producto

## 📊 Gestión de Productos

### Panel de Administración

El panel de administración permite:

- **Agregar productos**: Crear nuevos productos con todos sus detalles
- **Editar productos**: Modificar información existente
- **Eliminar productos**: Remover productos del catálogo
  - **Gestión en Firestore**: El catálogo se almacena en la colección `products` de Firestore
  - El botón de exportar JSON fue eliminado; las operaciones de CRUD se realizan directamente contra Firestore

### Flujo de Datos

1. **Carga inicial**: Los productos se cargan desde la colección `products` en Firestore
2. **Modificaciones**: Las operaciones de crear/editar/eliminar actualizan Firestore directamente y se mantiene un respaldo en `localStorage` para offline
3. **Exportación**: La exportación a JSON fue eliminada de la interfaz; si necesitas un dump, exporta los documentos desde Firebase Console

## 📈 Firebase Analytics

### Vista de Analytics en el Panel de Admin

El panel de administración incluye una vista de Firebase Analytics con:

- **Vistas de Página**: Contador de visitas
- **Usuarios Activos**: Estadísticas de usuarios
- **Productos en Carrito**: Cantidad total de items en carritos
- **Enlace a Firebase Console**: Acceso directo a datos detallados
- **Measurement ID**: Identificador de Analytics

### Eventos Registrados

La aplicación registra automáticamente los siguientes eventos en Firebase Analytics:

- `admin_panel_view`: Vista del panel de administración
- `product_created`: Creación de un nuevo producto
- `product_updated`: Actualización de un producto
- `product_deleted`: Eliminación de un producto
- `analytics_viewed`: Visualización de la vista de analytics
- `admin_logout`: Cierre de sesión del administrador

### Estructura de Datos

```javascript
[
  {
    id: "product-id",
    title: "Nombre del producto",
    descriction: "Descripcion del producto"
    price: 99.99,
    discount: 10%, 
    quantity: 0,
    image: "url",
    
  }
]
```

## 🎨 Diseño y Estilos

### Paleta de Colores

```css
--primary-color: #50C878    /* Verde Esmeralda */
--secondary-color: #FFD700   /* Dorado */
--accent-color: #2E8B57      /* Verde Oscuro */
--detail-color: #FDF6E3      /* Beige Suave */
```

### Características de Diseño

- **Gradientes**: Uso extensivo de gradientes lineales
- **Animaciones**: Transiciones suaves en todos los elementos
- **Sombras**: Sombras sutiles para profundidad
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **Sidebar**: Navegación lateral con efecto hover
- **Modales**: Diseño moderno con backdrop blur

### Componentes Estilizados

- **Quick View Cards**: Modales con gradientes y animaciones
- **Cart Sidebar**: Sidebar con header verde y diseño limpio
- **Product Cards**: Tarjetas con hover effects
- **Buttons**: Botones con gradientes y efectos hover
- **Forms**: Formularios con inputs estilizados

### Almacenamiento de Datos

**localStorage:**
- Carrito de compras (`cart`)
- Usuario activo (`usuarioActivo`)
- Rol del usuario (`userRole`)
- Productos del administrador (`admin_products`) - solo como respaldo temporal
- Estadísticas de Analytics (`pageViews`, `activeUsers`)

**Almacenamiento principal:**
- **Firestore**: La aplicación usa Firestore como almacenamiento principal (colección `products`).
  - Documentos con los campos: `name`, `category`, `description`, `price`, `stock`, `discount`, `image`.
  - Recomendado: habilitar reglas que permitan escrituras solo a administradores autenticados.

**Respaldo local:**
- `localStorage` mantiene un respaldo temporal de `admin_products` usado cuando Firestore no está disponible.
