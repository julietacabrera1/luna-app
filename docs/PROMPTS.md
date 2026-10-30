# Registro de prompts y uso de inteligencia artificial – LUNA

## 1. Introducción

Durante el desarrollo de LUNA se utilizaron herramientas de inteligencia artificial como apoyo para la programación, la generación de imágenes y la creación de contenido audiovisual.

La principal herramienta utilizada para el desarrollo fue ChatGPT, que permitió resolver dudas, analizar errores, proponer soluciones y mejorar distintas funcionalidades de la aplicación.

También se utilizaron Microsoft Copilot para generar imágenes y Vidogrid para crear el video promocional.

Las respuestas y los resultados generados por estas herramientas fueron revisados y adaptados durante el proceso. Los siguientes prompts son ejemplos representativos de las instrucciones utilizadas, reconstruidos a partir de las tareas realizadas y no necesariamente transcripciones literales.

## 2. Prompts utilizados

### Prompt 1: Desarrollo del módulo de tareas

**Objetivo:** Implementar las funcionalidades principales del módulo de tareas.

**Prompt:**

> Estoy desarrollando una aplicación web llamada LUNA con React y Vite. Necesito implementar el módulo de tareas, permitiendo crear, editar y eliminar tareas, asignarles categorías (Laboral, Académico y Personal) y marcar las tareas como completadas. Quiero que las funcionalidades se integren con la estructura existente del proyecto y que se mantenga el diseño visual actual.

### Prompt 2: Corrección de categorías duplicadas

**Objetivo:** Resolver un problema en la creación y visualización de categorías.

**Prompt:**

> Tengo un problema en mi aplicación LUNA. Cuando intento crear una nueva categoría, las categorías predeterminadas (Laboral, Personal y Académico) aparecen duplicadas. Necesito que revises la lógica de creación y visualización para evitar que se repitan y que las categorías nuevas se integren correctamente.

### Prompt 3: Configuración de Supabase en Netlify

**Objetivo:** Solucionar un error que impedía visualizar la aplicación luego de publicarla.

**Prompt:**

> Publiqué mi aplicación React en Netlify, pero al ingresar aparece la pantalla en blanco y en la consola se muestra el error `supabaseKey is required`. Necesito que me expliques qué significa, dónde puedo encontrar la clave correspondiente en Supabase y cómo configurarla correctamente en Netlify.

## 3. Dificultades detectadas durante el uso de IA

Durante el desarrollo se identificaron algunas respuestas de la inteligencia artificial que no resolvían completamente lo solicitado. Fue necesario revisar el código, probar las funcionalidades y realizar correcciones.

### Incidencia 1: Botón flotante sin funcionalidad

- **Problema:** La IA generó visualmente el botón flotante para agregar tareas, pero inicialmente no implementó correctamente la acción que debía realizar al hacer clic.
- **Detección:** Al probar la aplicación, se comprobó que el botón aparecía en pantalla, pero no abría el formulario para crear una nueva tarea.
- **Corrección:** Se revisó la lógica de interacción del botón y se ajustó su comportamiento para que ejecutara la acción correspondiente.
- **Aprendizaje:** Es importante comprobar que los elementos visuales también tengan implementada la funcionalidad esperada.

### Incidencia 2: Categorías duplicadas o predeterminadas

- **Problema:** La IA interpretó las categorías como elementos visuales o ejemplos predeterminados, sin integrarlas inicialmente de manera adecuada con la lógica de creación y administración.
- **Detección:** Al intentar agregar nuevas categorías, algunas opciones aparecían duplicadas.
- **Corrección:** Se revisó la lógica de gestión y visualización de categorías para evitar repeticiones y permitir su correcta integración.
- **Aprendizaje:** Es necesario especificar cómo deben comportarse los datos y no limitarse únicamente a describir cómo deben verse en pantalla.

### Incidencia 3: Tareas de ejemplo en lugar de tareas dinámicas

- **Problema:** En algunas respuestas, la IA interpretó las tareas como ejemplos que debían mostrarse visualmente, en lugar de implementar una gestión dinámica de tareas.
- **Detección:** Al probar el módulo, se identificó que mostrar ejemplos no cumplía con la necesidad de crear y administrar tareas reales desde la aplicación.
- **Corrección:** Se revisó la implementación para adaptar el módulo al funcionamiento esperado y permitir la gestión de las tareas desde la interfaz.
- **Aprendizaje:** Es importante diferenciar entre mostrar información de ejemplo y desarrollar una funcionalidad que permita trabajar con datos reales.

## 4. Uso responsable de la inteligencia artificial

La inteligencia artificial se utilizó como herramienta de apoyo durante el desarrollo de LUNA, pero las decisiones finales fueron revisadas por la desarrolladora.

Se tuvieron en cuenta las siguientes prácticas:

- Revisar el código sugerido antes de incorporarlo al proyecto.
- Probar las funcionalidades para comprobar que cumplan con los requisitos.
- Corregir las respuestas que no se ajustaban a lo solicitado.
- Evitar compartir información sensible, como claves y credenciales.
- Mantener el control humano sobre las decisiones de diseño y desarrollo.

## 5. Conclusión

El uso de herramientas de inteligencia artificial permitió agilizar distintas etapas del desarrollo de LUNA y facilitó la resolución de problemas técnicos y visuales.

Sin embargo, la experiencia también demostró que las respuestas generadas no siempre interpretan correctamente los requerimientos. Por eso, fue fundamental revisar, probar y adaptar cada resultado.

La inteligencia artificial funcionó como una herramienta de acompañamiento, mientras que el analisis, las decisiones y la validación del producto estuvieron a mi cargo.