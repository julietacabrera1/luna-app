# Funcionalidad: Gestión de tareas

## 1. Constitución

El sistema debe permitir al usuario crear, consultar, editar, eliminar y completar tareas de manera sencilla y organizada.

La funcionalidad debe facilitar la organización de actividades personales, laborales y académicas, permitiendo administrar las tareas desde una interfaz intuitiva.

La información debe almacenarse en Supabase y estar asociada a la cuenta del usuario correspondiente.

## 2. Spec (notación EARS)

- CUANDO el usuario crea una tarea con un texto válido, EL SISTEMA DEBERÁ guardar la información en la base de datos y mostrarla en la lista de tareas.
- CUANDO el usuario edita una tarea, EL SISTEMA DEBERÁ actualizar la información y reflejar los cambios en la interfaz.
- CUANDO el usuario elimina una tarea, EL SISTEMA DEBERÁ eliminarla de su lista.
- CUANDO el usuario marca una tarea como completada, EL SISTEMA DEBERÁ actualizar su estado y registrar la fecha de finalización.
- CUANDO el usuario desmarca una tarea completada, EL SISTEMA DEBERÁ actualizar nuevamente su estado como pendiente.
- CUANDO el usuario selecciona una categoría, EL SISTEMA DEBERÁ mostrar las tareas correspondientes a esa categoría.
- SI el usuario intenta crear una tarea sin texto, EL SISTEMA DEBERÁ impedir su registro.
- CUANDO un usuario consulta sus tareas, EL SISTEMA DEBERÁ mostrar únicamente la información correspondiente a su cuenta.

## 3. Clarificación

Durante la definición de esta funcionalidad se contemplaron las siguientes cuestiones:

- Las tareas pueden organizarse mediante categorías Laboral, Académico y Personal, además de permitir categorías personalizadas.
- El texto de la tarea es obligatorio.
- Las tareas pueden editarse, eliminarse y marcarse como completadas o pendientes.
- La información debe mantenerse asociada al usuario que inició sesión.
- Las tareas completadas deben conservar su fecha de finalización para permitir el cálculo de estadísticas de progreso.

## 4. Plan técnico

- **Modelo de datos:** Tabla `tareas` en Supabase, con campos para identificar la tarea, su contenido, categoría, estado de finalización, usuario propietario y fechas correspondientes.
- **Persistencia:** Operaciones de consulta, inserción, actualización y eliminación mediante el cliente de Supabase.
- **Interfaz:** Componente `ListaTareas.jsx`, encargado de mostrar y administrar las tareas.
- **Estilos:** Hoja de estilos `ListaTareas.css`, integrada con las variables visuales generales de LUNA.
- **Integración:** Conexión con el sistema de categorías y el módulo Mi progreso.

## 5. Tareas de desarrollo

- T1: Definir la estructura de almacenamiento de las tareas.
- T2: Conectar el módulo con Supabase.
- T3: Implementar la creación de tareas.
- T4: Implementar la edición y eliminación.
- T5: Incorporar la opción de marcar tareas como completadas o pendientes.
- T6: Integrar la clasificación por categorías.
- T7: Incorporar el registro de fechas de finalización para las estadísticas de progreso.
- T8: Comprobar el funcionamiento de las operaciones y el aislamiento de datos entre usuarios.

## 6. Implementación

Se desarrolló el componente `ListaTareas.jsx` utilizando React y se integró con Supabase para almacenar y administrar la información.

Se implementaron las operaciones de creación, edición, eliminación y actualización del estado de las tareas.

También se incorporó la organización por categorías y el registro de la fecha de finalización para su utilización en el módulo Mi progreso.

## 7. Validación (/verificar)

Se realizaron pruebas funcionales manuales para comprobar:

- Creación de nuevas tareas.
- Edición de tareas existentes.
- Eliminación de tareas.
- Cambio entre estados pendiente y completada.
- Visualización y filtrado por categorías.
- Persistencia de la información.
- Aislamiento de los datos entre diferentes cuentas de usuario.

Los resultados obtenidos permitieron comprobar el funcionamiento esperado de la funcionalidad.

## 8. Cambio

Durante el desarrollo se realizaron ajustes en la lógica de administración de tareas para mejorar su funcionamiento y su integración con el resto de la aplicación.

Se incorporó el registro de la fecha de finalización de las tareas, permitiendo que el módulo Mi progreso pueda calcular las estadísticas semanales y los porcentajes de cumplimiento.

Los cambios fueron revisados mediante pruebas funcionales para comprobar que las operaciones existentes continuaran funcionando correctamente.
