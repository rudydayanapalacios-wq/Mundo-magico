
const fs = require("fs");
const path = require("path");

async function generarImagen(descripcion,id) {
    const descripcionGuardada = fs.readFileSync(descripcion, "utf-8");

    let respuesta;

    try {
        respuesta = await fetch(process.env.IMAGEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.IMAGEN_API_KEY}`
            },

            body: JSON.stringify({
                prompt: descripcionGuardada
            }),

            signal: AbortSignal.timeout(60000)
        });
    } catch (error) {
        if (error.name === "TimeoutError" || error.name === "AbortError") {
            throw new Error("La API de Cloudflare tardó demasiado en responder.");
        }

        if (error.name === "TypeError") {
            throw new Error("No se pudo conectar con la API de Cloudflare.");
        }

        throw error;
    }

    if (!respuesta.ok) {
        if (respuesta.status === 401 || respuesta.status === 403) {
            throw new Error("La clave de la API de Cloudflare no es válida o no tiene permisos.");
        }

        if (respuesta.status === 402 || respuesta.status === 429) {
            throw new Error("Se alcanzó el límite o la cuota de la API de Cloudflare.");
        }

        if (respuesta.status === 404 || respuesta.status === 410) {
            throw new Error("La URL o el modelo de Cloudflare no está disponible.");
        }

        throw new Error(`Error de la API de Cloudflare. Código: ${respuesta.status}`);
    }

    let datos;
    try {
        datos = await respuesta.json();
    } catch (error) {
        throw new Error("La respuesta de Cloudflare no tiene un formato JSON válido.");
    }

    if (
        !datos.success ||
        !datos.result ||
        !datos.result.image
    ) {
        throw new Error("Cloudflare no devolvió ninguna imagen.");
    }

    const imagenBase64 = datos.result.image;
    const imagenBuffer = Buffer.from(imagenBase64, "base64");

    if (imagenBuffer.length === 0) {
        throw new Error("La imagen generada está vacía.");
    }

    const carpeta = path.join(__dirname, "..", "imagenes");
    fs.mkdirSync(carpeta, { recursive: true });

    const ruta = path.join(carpeta, `mundo_${id}.jpg`);
    fs.writeFileSync(ruta, imagenBuffer);

    return ruta;
}

module.exports = {
    generarImagen
};
