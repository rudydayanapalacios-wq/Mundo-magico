
# Registro del uso de inteligencia artificial

## 1. Herramientas utilizadas

- ChatGPT (OpenAI): apoyo para comprender los requisitos, desarrollar el código y corregir errores.
- Groq: modelo `openai/gpt-oss-20b`, utilizado para generar descripciones de los mundos.
- NVIDIA: modelo FLUX.1-schnell, utilizado para intentar generar imágenes.

## 2. Prompt inicial

Prompt utilizado como base:

"Mira tengo un problema y es que mi pc me la estan mandando a arreglar y ahi tenia git , visual y node descargados y demas herramientas utiles para programr , el punto es que estoy en una nueva y tengo que hacer trabajos con todas esas herramientas sobre todo node y git , pero tamoico tengo el dictor de codigo en esta y npo se si me dr tiempo de desvaragrlo , me podrias dar ptra alternaitiva??"

## 3. Prompts de seguimiento

### Seguimiento 1
**Pista de rutas:** construye las rutas de `data/`, `descripciones/` e `imagenes/` a partir de la ubicación del archivo, no del lugar desde donde se ejecuta: `path.join(__dirname, '..', 'data')` en CommonJS o `path.join(import.meta.dirname, '..', 'data')` en ES Modules &#x20;
explicamee


### Seguimiento 2
" Que te parece mejor que use common.js o module.js"

### Seguimiento 3
"Listo , ya tengo mi estructura base con src que tinen lops sarchivos logicos de js , el la riaz .env , gitignore, readme y package.json , los unicos que estan vacios soj los archivos js que contendran la loigica y el readme"

## 4. Correcciones realizadas por la usuaria

1. Yo misma complete partes del codigo para probarme.
2. Como tenia problemas con invidia , le dije a la ia que dejaramos de seguir trabajando sobre ese error y avanzaramos.
3. Corregi unos errores que me salian en terminal por mi cuenta , unos de sintaxis y otros de ortografia.

## 5. Una línea de código que inicialmente no comprendía

`const imagenBuffer = Buffer.from(imagenBase64, "base64");`
seed: 0,

Esta línea es la encargada de generar un nùmero que se utilza para controlar como la ai genera una imagen .Al mantener un mismo valor, se intenta obtener un resultado parecido cuando se repiten los datos de la generacion-

## 6. Error encontrado y solución

**Error:** La API de NVIDIA tardaba demasiado en responder y se producía un error de tiempo de espera.

**Solución aplicada:** Se agregó un control con `AbortSignal.timeout(60000)` y un bloque `try/catch` para identificar el tiempo de espera y mostrar un mensaje entendible.

El problema de respuesta de NVIDIA continúa pendiente de revisión.
