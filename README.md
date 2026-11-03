
# Mundo Mágico

## Descripción
Mundo Mágico es una aplicación de consola desarrollada con Node.js que permite crear mundos imaginarios a partir de una situación, un mundo y cinco colores. Utiliza inteligencia artificial para generar una descripción visual y, posteriormente, intenta generar una imagen basada en esa descripción.

## Requisitos
- Node.js
- npm
- Una clave de API de Groq.
- Una clave de API de NVIDIA.

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/rudydayanapalacios-wq/Mundo-magico.git
   ```

2. Entrar a la carpeta:
   ```bash
   cd Mundo-magico
   ```

3. Instalar las dependencias:
   ```bash
   npm install
   ```

4. Crear un archivo `.env` a partir de `.env.example` y agregar las claves de las API.

## Configuración

El archivo `.env` debe contener:

```env
TEXTO_API_KEY=tu_clave_de_groq
TEXTO_URL=https://api.groq.com/openai/v1/chat/completions
TEXTO_MODELO=openai/gpt-oss-20b
IMAGEN_API_KEY=tu_clave_de_nvidia
IMAGEN_URL=https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell
```

No compartas ni subas el archivo `.env` a GitHub.

## Uso

Ejecutar el programa desde la terminal:

```bash
npm start "un capibara montando un unicornio" "un lago de delfines" rosa azul blanco lila verde
```

El programa recibe:
- Una situación imaginaria.
- Un mundo donde ocurre la situación.
- Cinco colores diferentes.

## Funcionamiento

1. Valida los argumentos ingresados por el usuario.
2. Crea un identificador para el mundo usando `object-hash`.
3. Guarda la información del mundo en un archivo JSON.
4. Lee nuevamente la información guardada.
5. Envía los datos a Groq para generar una descripción visual.
6. Guarda la descripción en un archivo TXT.
7. Envía la descripción a NVIDIA para intentar generar una imagen JPG.
8. Reutiliza los archivos existentes para evitar repetir solicitudes a las API.

## Tecnologías utilizadas

- Node.js
- JavaScript
- API de Groq: `openai/gpt-oss-20b`
- API de NVIDIA: FLUX.1-schnell
- `object-hash`
- Módulos nativos: `fs`, `path`
- `fetch`, `async/await` y `Buffer`

## Reflexión

### 1. ¿Por qué el ID se genera sin incluir la fecha?
Porque el identificador debe depender de la situación, el mundo y los colores. Así, los mismos datos generan el mismo ID. Si incluyera la fecha, cada ejecución produciría un identificador diferente.

### 2. ¿Por qué se solicita la descripción en inglés?
Porque se busca que el modelo de generación de imágenes interprete con claridad los elementos visuales. También se puede comparar el resultado con una descripción en español para observar posibles diferencias.

### 3. ¿Qué diferencia hay entre una respuesta JSON y los bytes de una imagen? ¿Qué es Base64?
Una respuesta JSON contiene información organizada en propiedades y valores. Los bytes representan los datos reales de una imagen. Base64 es una forma de representar esos datos binarios mediante texto para poder transportarlos.

### 4. ¿Qué pasaría si se guarda una imagen usando UTF-8?
La imagen podría dañarse porque UTF-8 interpreta los datos como texto. Para conservarla correctamente se utiliza un Buffer, que permite trabajar con los datos binarios.

### 5. ¿Qué pasos consumen la cuota gratuita y cómo se evitó repetirlos?
Las solicitudes a Groq y NVIDIA consumen recursos de sus respectivas API. Para evitar repetirlas, el programa verifica si los archivos de descripción e imagen ya existen y los reutiliza.

### 6. Si se utilizó inteligencia artificial, ¿qué fue lo más difícil de pedirle y qué parte se corrigió?
Lo más difícil fue conseguir que la generación de imágenes funcionara correctamente y manejar los errores de conexión y respuesta. Se revisaron las validaciones y el manejo de errores para que el programa informe los problemas de manera clara.
