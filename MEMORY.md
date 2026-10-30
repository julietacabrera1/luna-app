# MEMORY – LUNA

## ¿Que guarda?
- Tareas creadas por el usuario (titulo, descripcion, fecha, estado).
- Recordatorios con fecha y hora.
- Eventos en el calendario.
- Listas de pendientes(completas o pendientes).
- Estadisticas de uso (tareas completadas, dias organizados, tareas pospuestas).

---

## ¿Que olvida?
- Tareas eliminadas por el usuario.
- Recordatorios vencidos que ya no son relevantes.
- Sesiones cerradas (no se guarda la contraseña en texto plano).
-Datos temporales de navegacion dentro de la app, que se eliminan al cerrar sesion o tras un tiempo determinado.


---

## Persistencia
- Los datos se almacenan en la base de datos PostgreSQL.
- Cada usuario tiene su propio espacio de memoria aislado.
- Se utilizan tokens JWT para mantener sesiones seguras.
- Las variables sensibles (DB_URL, JWT_SECRET, API_KEY) se guardan en `.env`.
- La base de datos cuenta con respaldos periodicos para evitar perdida de datos.

---

## Seguridad de la memoria
- Contraseñas encriptadas con hash (bcrypt).
- Validacion de entradas para evitar inyecciones SQL o XSS.
- Acceso restringido: cada usuario solo puede ver sus propios datos.
- Logs de actividad para detectar accesos sospechosos.
- Uso de protocolos HTTPS para la transmision segura de datos.

---

## Ejemplo de uso de memoria
Usuario:  
- Crea una tarea: "Estudiar para el examen – 20 de octubre".  
- LUNA guarda la tarea en la base de datos y la muestra en la pantalla de Inicio.  
- El usuario completa la tarea → se actualiza el estado a "completada".  
- El usuario elimina una tarea → se elimina de la base de datos y la vista.
- En el perfil, LUNA refleja el progreso: **Tareas completadas: +1**.  
