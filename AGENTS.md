# AGENTS – LUNA

## Descripción breve

LUNA es una aplicación de organización personal que centraliza tareas, recordatorios, eventos y pendientes en un solo espacio. Su objetivo es ayudar a los usuarios a administrar mejor sus actividades cotidianas mediante una experiencia simple y accesible.

---

## Archivos de especificaciones

Los siguientes archivos se encuentran en la carpeta `docs/` y deben ser respetados por la IA:

- **IDENTIDAD-MARCA.md** → Define nombre, logo, paleta de colores, tipografías y tono de comunicación.
- **01-CONTEXTO.md** → Explica el problema, objetivo, público y alcance inicial.
- **02-REQUERIMIENTOS.md** → Lista de requerimientos funcionales y no funcionales.
- **03-TECNOLOGIAS.md** → Stack tecnológico elegido y justificación.
- **04-ARQUITECTURA.md** → Organización del código y estructura de carpetas.
- **05-DATOS.md** → Entidades, tablas y ejemplos de datos.
- **06-DISENO-UI.md** → Pantallas principales y aplicación de la identidad visual.
- **07-CONVENCIONES.md** → Normas de estilo de código, idioma y commits.
- **08-TAREAS.md** → Etapas de trabajo con casillas de verificación.
- **09-SEO.md** → Estrategia de posicionamiento en buscadores.
- **10-SEGURIDAD.md** → Manejo de datos sensibles y validaciones.
- **MEMORY.md** → Reglas de almacenamiento, persistencia y olvido de datos.

---

## Reglas generales para la IA

1. **No inventar precios ni datos de marcas reales.**
2. **Respetar la identidad visual:** colores, tipografías y logo definidos en `IDENTIDAD-MARCA.md`.
3. **Usar sintaxis Markdown real:** títulos, listas, tablas, bloques de código y casillas de tareas.
4. **Mantener coherencia:** lo definido en identidad debe reflejarse en el diseño y los demás archivos.
5. **No alterar el tono de comunicación:** debe ser cercano, claro y motivador.
6. **No ejecutar código ni realizar modificaciones importantes sin revisión y autorización humana previa.**
7. **Cada commit:** debe corresponder a una tarea pequeña y comprensible.
8. **No inventar resultados de pruebas:** toda verificación debe basarse en evidencias reales.

---

## Comandos disponibles

Los siguientes comandos se encuentran documentados en `commands/`:

- `/spec` → Solicitar o crear especificaciones detalladas de una funcionalidad o módulo.
- `/clarificar` → Pedir aclaraciones o detalles adicionales cuando algo no está claro.
- `/verificar` → Validar que ciertos criterios o condiciones se cumplan.

---

## Skills del agente

Las instrucciones especializadas se encuentran en la carpeta `skills/`:

- **verificar-criterios** → Revisa si una tarea o funcionalidad cumple con los criterios establecidos en la Constitución y las especificaciones.
- **crear-especificaciones** → Ayuda a analizar y documentar requerimientos y funcionalidades mediante criterios claros y verificables.
- **revisar-codigo** → Analiza el código fuente para identificar errores, problemas de organización y posibles mejoras.

La IA debe consultar la skill correspondiente cuando la tarea lo requiera.

---

## Interacción con la memoria

- La IA debe respetar las reglas de almacenamiento, persistencia y olvido definidas en `docs/MEMORY.md`.
- Mantener únicamente el contexto relevante para asegurar coherencia en la interacción.
- No almacenar información personal o sensible sin autorización.

---

## Validación y verificación

- Antes de finalizar una tarea, utilizar el procedimiento `/verificar` cuando corresponda.
- Consultar la skill `verificar-criterios` para realizar una revisión ordenada.
- Reportar cualquier inconsistencia o duda mediante `/clarificar`.
- No considerar una funcionalidad terminada sin comprobar sus criterios de aceptación.
- Registrar los resultados de las verificaciones con evidencias.

---

## Principios de desarrollo

- Mantener una estructura de código organizada y fácil de mantener.
- Respetar las tecnologías definidas para el proyecto.
- Priorizar la accesibilidad y la compatibilidad con dispositivos móviles.
- Evitar modificaciones innecesarias que puedan afectar funcionalidades existentes.
- Utilizar la IA como herramienta de apoyo, manteniendo la supervisión y las decisiones finales bajo responsabilidad humana.