# Funcionalidad: Gestión de recordatorios

## 1. Constitución

El sistema debe permitir al usuario consultar y administrar sus próximos compromisos mediante un módulo de recordatorios integrado en LUNA.

Su objetivo es facilitar el seguimiento de eventos próximos, presentando la información de manera ordenada y accesible.

Los recordatorios se visualizan dentro de la aplicación. No se implementan notificaciones automáticas, correos electrónicos ni notificaciones push.

La información debe mantenerse asociada a la cuenta del usuario.

## 2. Spec (notación EARS)

- CUANDO el usuario ingresa al módulo Recordatorios, EL SISTEMA DEBERÁ mostrar los próximos eventos registrados.
- CUANDO existen varios eventos próximos, EL SISTEMA DEBERÁ ordenarlos según su fecha y hora, mostrando primero los más cercanos.
- CUANDO el usuario selecciona la opción de editar un recordatorio, EL SISTEMA DEBERÁ permitir modificar su información.
- CUANDO el usuario pospone un recordatorio, EL SISTEMA DEBERÁ actualizar la fecha u horario correspondiente según la opción seleccionada.
- CUANDO el usuario elimina un recordatorio, EL SISTEMA DEBERÁ quitarlo de la lista correspondiente.
- CUANDO un evento ya pasó, EL SISTEMA DEBERÁ dejar de mostrarlo entre los próximos recordatorios.
- CUANDO el usuario consulta sus recordatorios, EL SISTEMA DEBERÁ mostrar únicamente la información correspondiente a su cuenta.

## 3. Clarificación

Durante la definición de esta funcionalidad se contemplaron las siguientes cuestiones:

- Los recordatorios se presentan dentro de la aplicación, sin utilizar notificaciones externas.
- La información de próximos compromisos se organiza según su fecha y hora.
- Los eventos más cercanos deben aparecer primero.
- El usuario puede editar, posponer o eliminar los recordatorios disponibles.
- Los eventos que ya pasaron no deben permanecer en la lista de próximos recordatorios.
- La información debe corresponder exclusivamente al usuario que inició sesión.

## 4. Plan técnico

- **Modelo de datos:** Utilización de la información de eventos almacenada en Supabase, de acuerdo con la estructura existente del proyecto.
- **Persistencia:** Conexión con Supabase mediante el cliente utilizado por la aplicación.
- **Interfaz:** Componente `Recordatorios.jsx`, encargado de mostrar y administrar los próximos compromisos.
- **Estilos:** Hoja de estilos `Recordatorios.css`, manteniendo la identidad visual de LUNA.
- **Integración:** Relación con el módulo Calendario para recuperar los eventos registrados y mostrar los próximos compromisos.

## 5. Tareas de desarrollo

- T1: Definir la información necesaria para mostrar los próximos recordatorios.
- T2: Integrar el módulo con los datos almacenados en Supabase.
- T3: Implementar la visualización de próximos eventos.
- T4: Incorporar el ordenamiento por fecha y hora.
- T5: Implementar la edición de recordatorios.
- T6: Incorporar la opción de posponer.
- T7: Implementar la eliminación de recordatorios.
- T8: Controlar la visualización de eventos pasados.
- T9: Comprobar el funcionamiento y el aislamiento de datos entre usuarios.

## 6. Implementación

Se desarrolló el componente `Recordatorios.jsx` utilizando React y se integró con la información almacenada en Supabase.

Se implementó una lista de próximos compromisos ordenados por fecha y hora, permitiendo al usuario editar, posponer y eliminar elementos.

También se incorporó el control de fechas para evitar que los eventos pasados continúen apareciendo entre los próximos recordatorios.

El módulo funciona como una herramienta de consulta y administración interna de compromisos, sin enviar notificaciones automáticas al dispositivo ni correos electrónicos.

## 7. Validación (/verificar)

Se realizaron pruebas funcionales manuales para comprobar:

- Visualización de los próximos recordatorios.
- Ordenamiento según fecha y hora.
- Edición de recordatorios.
- Posposición de compromisos.
- Eliminación de elementos.
- Ocultamiento de eventos pasados.
- Persistencia de los cambios.
- Aislamiento de datos entre diferentes cuentas.

Las pruebas permitieron comprobar el funcionamiento esperado del módulo.

## 8. Cambio

Durante el desarrollo se realizaron ajustes en la organización y administración de los próximos compromisos.

Se trabajó en el ordenamiento de los elementos por fecha y hora y en el control de eventos pasados, con el objetivo de mantener una lista actualizada y útil para el usuario.

También se incorporaron las opciones de edición, posposición y eliminación para mejorar la administración de los recordatorios.