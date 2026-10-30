---
name: verificar-criterios
description: Verifica que las funcionalidades y requisitos del proyecto LUNA cumplan con sus criterios de aceptación, utilizando evidencias reales del código, las pruebas y la documentación.
---

# Skill: Verificar criterios de aceptación

## Objetivo

Comprobar que las funcionalidades y los requerimientos del sistema LUNA cumplen con las condiciones establecidas en sus especificaciones y documentación.

La verificación debe basarse en evidencias reales. No se deben inventar resultados ni considerar una funcionalidad como completada sin comprobarla.

## Documentos de referencia

Antes de realizar una verificación, consultar cuando estén disponibles:

- `CONSTITUCION.md`: principios y reglas del proyecto.
- `docs/`: documentación y requerimientos.
- `specs/`: especificaciones de las funcionalidades.
- `tests/`: pruebas automatizadas.
- `README.md`: descripción general y forma de ejecutar el proyecto.

## Procedimiento

### 1. Identificar los requisitos

- Leer los requerimientos funcionales y no funcionales.
- Identificar los criterios de aceptación de la funcionalidad que se desea verificar.
- Comprobar que los criterios sean claros y verificables.

### 2. Revisar la implementación

- Examinar el código relacionado con la funcionalidad.
- Comprobar que la implementación corresponda con lo especificado.
- Revisar que no existan errores evidentes o comportamientos contradictorios.
- Verificar que se respeten los principios definidos en la Constitución del proyecto.

### 3. Ejecutar pruebas

- Revisar si existen pruebas automatizadas relacionadas con la funcionalidad.
- Ejecutar las pruebas disponibles cuando sea posible.
- Comprobar manualmente los comportamientos que no estén cubiertos por pruebas.
- No afirmar que una prueba fue ejecutada si solamente se revisó el código.

### 4. Registrar los resultados

Clasificar cada criterio utilizando uno de estos estados:

- **Cumple:** existe evidencia suficiente de que el criterio funciona correctamente.
- **No cumple:** se comprobó que el criterio presenta un error o no está implementado.
- **No verificado:** no hay evidencia suficiente para determinar su cumplimiento.

### 5. Presentar el informe

El resultado debe incluir:

- Requisito o criterio evaluado.
- Estado de cumplimiento.
- Evidencia encontrada.
- Problemas detectados.
- Mejoras recomendadas.

## Reglas importantes

1. No inventar funcionalidades, pruebas ni resultados.
2. No marcar un requisito como cumplido únicamente porque exista código relacionado.
3. Diferenciar entre revisar el código y probar el funcionamiento real.
4. Informar claramente cuando no se pueda realizar una verificación.
5. Priorizar la detección de errores antes que realizar modificaciones.
6. No modificar archivos sin autorización del usuario.

## Resultado esperado

Generar un informe claro y organizado que permita conocer qué requisitos de LUNA están cumplidos, cuáles presentan problemas y cuáles necesitan verificaciones adicionales.