# Sistema de Seguimiento - Parroquia San Pedro

## Mapas con Leaflet y OpenStreetMap

El sistema utiliza **Leaflet** con **OpenStreetMap** que es completamente **GRATUITO** y no requiere API keys.

### Ventajas de Leaflet + OpenStreetMap:
- ✅ **Completamente gratuito**
- ✅ **Sin límites de uso**
- ✅ **No requiere API keys**
- ✅ **Mapas actualizados por la comunidad**
- ✅ **Funcionalidades avanzadas de dibujo**
- ✅ **Marcadores personalizables**

### Funcionalidades Implementadas

#### Gestión de Zonas
- ✅ Crear zonas con nombre, descripción y color
- ✅ Dibujar áreas de zonas directamente en el mapa
- ✅ Editar y eliminar zonas existentes
- ✅ Visualización de todas las zonas en el mapa
- ✅ Colores personalizables para cada zona
- ✅ Herramientas de dibujo interactivas

#### Gestión de Locales
- ✅ Registro de locales con ubicación exacta
- ✅ Selección de coordenadas mediante clic en mapa
- ✅ Marcadores personalizados por zona
- ✅ Navegación GPS desde ubicación actual
- ✅ Información completa de cada local
- ✅ Popups informativos en marcadores

#### Sistema de Usuarios y Autenticación
- ✅ Login diferenciado para admin y usuarios
- ✅ Roles y permisos específicos
- ✅ Gestión completa de usuarios
- ✅ Asignación de zonas por usuario

#### Seguimiento de Oficios
- ✅ Estados: Entregado, Seguimiento, Completado, Denegado, Pendiente
- ✅ Historial completo de visitas
- ✅ Asignación de responsables
- ✅ Observaciones detalladas por visita

### Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard.tsx          # Panel principal
│   ├── LoginForm.tsx          # Autenticación
│   ├── ZonesManager.tsx       # Gestión de zonas (NUEVO)
│   ├── LocalesManager.tsx     # Gestión de locales (MEJORADO)
│   ├── MapView.tsx           # Vista de mapa
│   ├── SeguimientoManager.tsx # Seguimiento de oficios
│   ├── UsersManager.tsx      # Gestión de usuarios
│   └── NotificationsPanel.tsx # Notificaciones
├── App.tsx                   # Componente principal
└── main.tsx                  # Punto de entrada
```

### Credenciales de Prueba

- **Administrador**: admin@parroquia.com / admin123
- **Usuario**: juan.perez@parroquia.com / 123456

### Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### Características PWA

- ✅ Instalable en dispositivos móviles
- ✅ Funciona offline (básico)
- ✅ Notificaciones push
- ✅ Diseño responsive
- ✅ Colores de la parroquia (azul oscuro y rojo)

### Próximas Mejoras

- [ ] Integración con base de datos real
- [ ] Notificaciones push avanzadas
- [ ] Reportes y estadísticas
- [ ] Exportación de datos
- [ ] Sincronización offline