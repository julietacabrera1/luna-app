# Comando /verificar

## Objetivo

Validar que una funcionalidad implementada en LUNA cumpla con su especificación, sus criterios de aceptación y los principios establecidos en la Constitución del proyecto.

## Skill relacionada

Consultar la skill `skills/verificar-criterios/SKILL.md` para seguir el procedimiento de verificación.

## Instrucciones

1. Identificar la funcionalidad que se desea verificar.
2. Revisar su especificación y sus criterios de aceptación.
3. Comprobar que la implementación corresponda con lo solicitado.
4. Revisar el comportamiento esperado y los casos alternativos.
5. Ejecutar las pruebas automatizadas disponibles cuando sea posible.
6. Realizar pruebas manuales cuando sean necesarias.
7. Identificar errores, incumplimientos o comportamientos inesperados.
8. Registrar los resultados de la verificación con evidencias.

## Estados de verificación

Cada criterio debe clasificarse utilizando uno de estos estados:

- **Cumple:** existe evidencia suficiente de que funciona correctamente.
- **No cumple:** se comprobó que presenta errores o no está implementado.
- **No verificado:** no fue posible comprobar su funcionamiento.

## Formato de salida

El informe debe incluir:

- Funcionalidad verificada.
- Criterios evaluados.
- Resultado de cada prueba.
- Evidencias encontradas.
- Errores o incumplimientos detectados.
- Correcciones necesarias.
- Resultado final de la verificación.

## Restricciones

- No marcar una prueba como aprobada si no fue ejecutada.
- No afirmar que se cumple un requisito sin evidencia.
- Diferenciar entre revisar el código y comprobar su funcionamiento.
- No inventar resultados ni pruebas.
- Informar los errores encontrados.
- No modificar archivos sin autorización del usuario.