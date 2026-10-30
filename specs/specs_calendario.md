# Funcionalidad: Calendario de eventos

## Constitución
El sistema debe permitir registrar y visualizar eventos en un calendario interactivo.

## Spec (EARS)
- Cuando el usuario crea un evento con fecha y hora, el sistema debe guardarlo y mostrarlo en el calendario.
- Cuando el usuario consulta el calendario, el sistema debe mostrar todos los eventos registrados en su fecha correspondiente.

## Clarificación
- ¿Se permiten eventos recurrentes?
- ¿Qué pasa si se ingresan fechas inválidas?

## Plan técnico
- **Modelo:** Tabla `Eventos` con id, título, fecha, hora, descripción.
- **API:** Endpoints `/api/eventos`.
- **UI:** Componente `Calendario.jsx` con vista mensual/semanal.

## Tareas (commits)
- T1: Crear tabla `Eventos`.
- T2: Endpoint `/api/eventos`.
- T3: Componente `Calendario.jsx`.
- T4: Validaciones de fecha/hora.
- T5: Tests de creación y visualización.

## Implementación
Commits por tarea, tests en verde.

## Validación
Prueba de creación y visualización en calendario.

## Cambio
Corrección de bug que permitía guardar eventos sin fecha.
