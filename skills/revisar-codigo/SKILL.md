---
name: revisar-codigo
description: Analiza el código fuente de LUNA para identificar errores, problemas de organización, posibles mejoras y aspectos que afecten su funcionamiento.
---

# Skill: Revisar código

## Objetivo

Analizar el código fuente del proyecto LUNA para detectar errores, mejorar su calidad y mantener una estructura organizada, clara y fácil de mantener.

La revisión debe priorizar la estabilidad del sistema y evitar cambios innecesarios que puedan afectar funcionalidades existentes.

## Documentos de referencia

Antes de realizar una revisión, consultar cuando estén disponibles:

- `CONSTITUCION.md`: principios de desarrollo.
- `AGENTS.md`: instrucciones generales para trabajar en el proyecto.
- `README.md`: información técnica y estructura del sistema.
- `specs/`: especificaciones de las funcionalidades.
- `tests/`: pruebas disponibles.

## Procedimiento

### 1. Analizar el código

- Identificar los archivos relacionados con el cambio o problema.
- Comprender cómo se relacionan los componentes.
- Revisar la organización del código.
- Identificar dependencias y funciones relacionadas.

### 2. Detectar posibles problemas

Revisar especialmente:

- Errores de sintaxis.
- Variables o funciones innecesarias.
- Importaciones duplicadas o incorrectas.
- Componentes repetidos.
- Problemas en la comunicación entre componentes.
- Errores en la gestión de estados.
- Problemas de conexión con Supabase.
- Posibles fallos en la interfaz y navegación.

### 3. Evaluar la calidad del código

- Comprobar que el código sea legible y comprensible.
- Mantener nombres claros para variables, funciones y componentes.
- Evitar duplicaciones innecesarias.
- Respetar la estructura existente del proyecto.
- Mantener coherencia con las tecnologías utilizadas en LUNA.

### 4. Proponer mejoras

- Explicar los problemas encontrados.
- Indicar en qué archivo se encuentran.
- Describir por qué podrían afectar al sistema.
- Proponer una solución adecuada.
- Priorizar los errores que comprometan el funcionamiento.

### 5. Comprobar los cambios

Cuando se realicen modificaciones:

- Revisar que no se hayan introducido nuevos errores.
- Ejecutar las pruebas disponibles.
- Comprobar que las funcionalidades relacionadas continúen funcionando.
- Verificar que los cambios respeten las especificaciones.

## Reglas importantes

1. No modificar archivos sin autorización del usuario.
2. No eliminar funcionalidades existentes sin consultar.
3. Evitar cambios que no sean necesarios para resolver el problema.
4. No afirmar que el código funciona correctamente sin haberlo comprobado.
5. Priorizar la seguridad, estabilidad y legibilidad.
6. Respetar las tecnologías y la estructura del proyecto.

## Resultado esperado

Presentar un informe con los problemas detectados, su ubicación, las posibles consecuencias y las mejoras recomendadas.

Si se autorizan modificaciones, explicar qué archivos fueron modificados y qué cambios se realizaron.