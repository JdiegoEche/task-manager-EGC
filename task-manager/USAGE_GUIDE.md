# Guía de Uso - Task Manager

## Comenzar

Una vez que la aplicación está en ejecución (http://localhost:4200), verás la interfaz principal del Task Manager.

## Interfaz Principal

La aplicación está dividida en dos secciones principales:

### 1. Sección de Formulario (Izquierda)
Aquí puedes crear nuevas tareas o editar tareas existentes.

#### Crear una nueva tarea:
1. Escribe el título de la tarea en el campo de texto (mínimo 3 caracteres)
2. Opcionalmente, marca el checkbox "Marcar como completada" si deseas que comience como completada
3. Haz clic en el botón "Crear tarea"
4. La página mostrará un mensaje de validación si hay errores

#### Editar una tarea existente:
1. Haz clic en el botón "Editar" en cualquier tarea del listado
2. El formulario se llenará con los datos de la tarea seleccionada
3. Modifica el título o el estado según sea necesario
4. Haz clic en "Actualizar tarea" para guardar los cambios
5. Usa "Cancelar" para descartar los cambios

### 2. Sección de Listado (Derecha)
Aquí se muestran las tareas de acuerdo al filtro seleccionado.

## Filtros

En la parte superior de la aplicación, encontrarás tres botones de filtro:

- **Todas**: Muestra todas las tareas del listado
- **Pendientes**: Muestra solo las tareas que aún no están completadas
- **Completadas**: Muestra solo las tareas que han sido marcadas como completadas

### Cambiar estado de una tarea:
- Marca o desmarca el checkbox al lado del título de la tarea para cambiar su estado de completado
- Las tareas completadas aparecerán con un estilo visual diferente (tachadas y más opacas)

### Acciones sobre tareas:

- **Editar**: Abre la tarea en el formulario para modificarla
- **Eliminar**: Elimina la tarea del listado (te pedirá confirmación)

## Validaciones

El formulario incluye las siguientes validaciones:

✓ El título es obligatorio
✓ El título debe tener al menos 3 caracteres
✓ Los botones de acción se desactivan si el formulario no es válido
✓ Los errores se muestran en rojo debajo del campo de entrada

## Datos

La aplicación obtiene las tareas iniciales desde la API pública JSONPlaceholder (https://jsonplaceholder.typicode.com/todos).

Al cargar por primera vez, se mostrarán 20 tareas de ejemplo que puedes usar para explorar la funcionalidad.

## Características de la Interfaz

### Indicadores Visuales:
- Las tareas pendientes aparecen con fondo blanco
- Las tareas completadas aparecen con fondo gris y texto tachado
- El estado actual se muestra como "Completado" o "Pendiente" bajo el título
- El botón de filtro activo se resalta en azul

### Responsividad:
En dispositivos móviles o pantallas pequeñas:
- El layout se adapta a una sola columna
- Los botones se reorganizan para mejor usabilidad
- Los textos se ajustan para optimizar el espacio

## Consejos de Uso

1. **Crear plantillas**: Crea tareas con títulos descriptivos para recordar fácilmente qué es cada una
2. **Usar filtros**: Los filtros te ayudan a enfocarte en tareas específicas (solo ver pendientes mientras trabajas)
3. **Editar en lugar de borrar**: No borre finalmente una tarea, simplement actualiza su información
4. **Completar tareas regularmente**: Marca las tareas como completadas para mantener un registro de lo hecho

## Solución de Problemas

### Las tareas no cargan:
- Verifica tu conexión a Internet
- Recarga la página (F5)
- Abre la consola del navegador (F12) para ver si hay errores

### El formulario no funciona:
- Asegúrate de escribir un título con al menos 3 caracteres
- Intenta recargar la página si los datos no se guardan

### La aplicación se ve extraña:
- Borra el cache del navegador
- Prueba con otro navegador
- Asegúrate de que JavaScript esté habilitado

## Contacto y Soporte

Para reportar problemas o sugerencias, por favor revisa el archivo README.md en la raíz del proyecto.
