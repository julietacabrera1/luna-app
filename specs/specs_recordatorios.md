# Funcionalidad: Recordatorios

## Constitución
El sistema debe notificar al usuario sobre tareas o eventos próximos.

## Spec (EARS)
- Cuando se acerca la fecha/hora de un evento, el sistema debe enviar un recordatorio al usuario.
- Cuando el usuario configura un recordatorio, el sistema debe respetar la anticipación elegida.

## Clarificación
- ¿Los recordatorios son notificaciones internas o emails?
- ¿Qué pasa si el usuario configura dos recordatorios iguales?

## Plan técnico
- **Modelo:** Tabla `Recordatorios` con id, tipo, fecha/hora, anticipación, referencia a tarea/evento.
- **API:** Endpoint `/api/recordatorios`.
- **UI:** Componente `Recordatorios.jsx` con lista y configuración.

## Tareas (commits)
- T1: Crear tabla `Recordatorios`.
- T2: Endpoint `/api/recordatorios`.
- T3: Componente `Recordatorios.jsx`.
- T4: Validaciones (evitar duplicados).
- T5: Tests de creación y disparo de recordatorios.

## Implementación
Commits claros, tests en verde.

## Validación
Prueba de recordatorios configurados y disparados.

## Cambio
Corrección de bug que duplicaba recordatorios.
