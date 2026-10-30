---
name: crear-especificaciones
description: Permite analizar y documentar los requerimientos y las funcionalidades de LUNA mediante especificaciones claras, estructuradas y verificables.
---

# Skill: Crear especificaciones

## Objetivo

Definir especificaciones detalladas para las funcionalidades del sistema LUNA, estableciendo qué debe hacer cada módulo y cómo debe comportarse.

Las especificaciones deben servir como guía para el desarrollo, evitando ambigüedades y reduciendo errores durante la implementación.

## Documentos de referencia

Antes de crear una especificación, consultar cuando estén disponibles:

- `CONSTITUCION.md`: principios y restricciones del proyecto.
- `docs/`: documentación y requerimientos generales.
- `specs/`: especificaciones existentes.
- `README.md`: descripción general del sistema.

## Procedimiento

### 1. Comprender la funcionalidad

- Identificar qué funcionalidad se necesita desarrollar o modificar.
- Analizar el problema que busca resolver.
- Identificar quién utilizará la funcionalidad.
- Consultar las especificaciones existentes para evitar contradicciones.

### 2. Identificar los requerimientos

- Definir los requerimientos funcionales.
- Identificar los requerimientos no funcionales relacionados.
- Establecer las condiciones y restricciones de la funcionalidad.
- Detectar información faltante o ambigua.

### 3. Redactar los criterios de aceptación

Los criterios deben ser claros, específicos y comprobables.

Se recomienda utilizar la notación EARS para expresar los requerimientos.

Ejemplo:

**Cuando** el usuario acceda al módulo de tareas,  
**el sistema deberá** mostrar las tareas registradas.

### 4. Documentar la especificación

Cada especificación debe incluir:

- Nombre de la funcionalidad.
- Objetivo.
- Descripción general.
- Requerimientos relacionados.
- Criterios de aceptación.
- Reglas de funcionamiento.
- Casos alternativos y posibles errores.

### 5. Revisar la especificación

- Comprobar que los requisitos sean comprensibles.
- Verificar que no existan contradicciones.
- Confirmar que los criterios puedan comprobarse.
- Mantener coherencia con la estructura y el funcionamiento de LUNA.

## Reglas importantes

1. No inventar requisitos que no hayan sido solicitados o acordados.
2. Consultar al usuario cuando existan decisiones importantes sin definir.
3. Mantener las especificaciones actualizadas ante cambios en el proyecto.
4. Evitar requisitos ambiguos o difíciles de verificar.
5. No modificar el comportamiento existente sin considerar sus especificaciones.

## Resultado esperado

Generar una especificación organizada y completa que pueda utilizarse como referencia durante la planificación, implementación y verificación de una funcionalidad de LUNA.