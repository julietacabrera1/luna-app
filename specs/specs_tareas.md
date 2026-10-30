# Funcionalidad: Gestión de tareas

## Constitución
El sistema debe permitir al usuario gestionar sus tareas de manera clara y accesible.

## Spec (EARS)
- Cuando el usuario crea una nueva tarea, el sistema debe guardarla en la base de datos y mostrarla en la lista de pendientes.
- Cuando el usuario marca una tarea como completada, el sistema debe actualizar su estado y reflejarlo en la interfaz.

## Clarificación
- ¿Las tareas pueden tener fecha límite opcional?
- ¿Qué pasa si el usuario intenta crear una tarea vacía?

## Plan técnico
- **Modelo:** Tabla `Tareas` con id, título, descripción, estado, fecha límite, categoría.
- **API:** Endpoints REST `/api/tareas` (CRUD).
- **UI:** Componente `ListaTareas.jsx` con checkboxes y botón ➕.

## Tareas (commits)
- T1: Crear tabla `Tareas`.
- T2: Endpoint `/api/tareas`.
- T3: Componente `ListaTareas.jsx`.
- T4: Validaciones (no permitir título vacío).
- T5: Tests CRUD.

## Implementación
Commits claros y tests en verde.

## Validación
Pruebas de creación, edición, completado y borrado.

## Cambio
Corrección de bug que permitía guardar tareas sin título.
