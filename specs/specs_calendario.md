# Funcionalidad: Calendario de eventos

## 1. Constitución

El sistema debe permitir al usuario registrar, consultar, editar y eliminar eventos mediante un calendario interactivo.

La funcionalidad tiene como objetivo facilitar la organización de compromisos y actividades, permitiendo visualizar los eventos según su fecha correspondiente.

La información debe almacenarse en Supabase y mantenerse asociada a la cuenta del usuario.

## 2. Spec (notación EARS)

- CUANDO el usuario selecciona una fecha y registra un evento con los datos requeridos, EL SISTEMA DEBERÁ guardar el evento en la base de datos.
- CUANDO el usuario consulta el calendario, EL SISTEMA DEBERÁ mostrar los eventos correspondientes a las fechas registradas.
- CUANDO una fecha contiene uno o más eventos, EL SISTEMA DEBERÁ destacarla visualmente en el calendario.
- CUANDO el usuario selecciona un evento existente, EL SISTEMA DEBERÁ permitir consultar y modificar su información.
- CUANDO el usuario elimina un evento, EL SISTEMA DEBERÁ quitarlo de la información almacenada y de la visualización del calendario.
- CUANDO el usuario consulta sus eventos, EL SISTEMA DEBERÁ mostrar únicamente los correspondientes a su cuenta.
- SI el usuario intenta registrar un evento sin completar los datos obligatorios, EL SISTEMA DEBERÁ impedir su registro.

## 3. Clarificación

Durante la definición de esta funcionalidad se contemplaron las siguientes cuestiones:

- Los eventos se registran seleccionando una fecha en el calendario.
- Cada evento debe contar con la información necesaria para identificarlo y organizarlo.
- Las fechas que contienen eventos deben destacarse visualmente mediante el color celeste de la interfaz.
- El usuario debe poder modificar o eliminar eventos existentes.
- Los eventos deben mantenerse asociados a la cuenta del usuario.
- Los eventos se visualizan dentro del calendario y pueden consultarse desde el módulo Recordatorios cuando corresponda.

## 4. Plan técnico

- **Modelo de datos:** Almacenamiento de los eventos en Supabase, utilizando la estructura de datos definida para el proyecto.
- **Persistencia:** Operaciones de consulta, creación, actualización y eliminación mediante el cliente de Supabase.
- **Interfaz:** Componente `Calendario.jsx`, encargado de representar el calendario y gestionar los eventos.
- **Estilos:** Hoja de estilos `Calendario.css`, manteniendo la identidad visual de LUNA.
- **Integración:** Comunicación con el módulo Recordatorios para la consulta de próximos eventos.

## 5. Tareas de desarrollo

- T1: Definir la estructura de almacenamiento de los eventos.
- T2: Conectar el calendario con Supabase.
- T3: Implementar la visualización del calendario.
- T4: Incorporar la selección de fechas.
- T5: Implementar la creación de eventos.
- T6: Incorporar la edición y eliminación de eventos.
- T7: Destacar visualmente las fechas que contienen eventos.
- T8: Integrar la información con el módulo Recordatorios.
- T9: Comprobar el funcionamiento y el aislamiento de datos entre usuarios.

## 6. Implementación

Se desarrolló el componente `Calendario.jsx` utilizando React y se integró con Supabase para almacenar y recuperar los eventos.

Se implementó la selección de fechas, la creación y administración de eventos, y la identificación visual de los días que contienen actividades registradas.

También se integró la información con el módulo Recordatorios para facilitar la consulta de próximos compromisos.

## 7. Validación (/verificar)

Se realizaron pruebas funcionales manuales para comprobar:

- Visualización del calendario.
- Selección de diferentes fechas.
- Creación de eventos.
- Visualización de eventos en sus fechas correspondientes.
- Identificación visual de fechas con eventos.
- Edición y eliminación de eventos.
- Persistencia de la información.
- Aislamiento de datos entre diferentes cuentas.

Las pruebas permitieron comprobar el funcionamiento esperado del calendario.

## 8. Cambio

Durante el desarrollo se realizaron ajustes en la visualización y administración de eventos para mejorar la interacción con el calendario.

También se trabajó en la integración con Recordatorios, de manera que los eventos próximos puedan consultarse desde ese módulo.

Las modificaciones se comprobaron mediante pruebas funcionales para verificar que no afectaran las operaciones principales del calendario.