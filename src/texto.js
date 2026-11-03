const fs = require("fs");
const path = require("path");

process.loadEnvFile();

async function describirMundo(mundo) {
    const mensajeSistema = `
    You are an expert visual world designer.
    Create a single paragraph in English between 80 and 120 words.
    Describe an image, including the scene, elements, lighting, composition, and artistic style.
    Mention all five colors provided in the world data.
    Do not write a story, title, markdown, or any text inside the image.
    `;

    const mensajeUsuario = JSON.stringify(mundo);

    let respuesta;

    try {
        respuesta = await fetch(process.env.TEXTO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.TEXTO_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.TEXTO_MODELO,
                messages: [
                    {
                        role: "system",
                        content: mensajeSistema
                    },
                    {
                        role: "user",
                        content: mensajeUsuario
                    }
                ]
            }),
            signal: AbortSignal.timeout(30000)
        });
    } catch (error) {
        if (error.name === "TimeoutError") {
            throw new Error("La API de Groq tardó demasiado en responder.");
        }

        if (error.name === "TypeError") {
            throw new Error("No se pudo conectar con la API de Groq.");
        }

        throw error;
    }


    if (!respuesta.ok) {
        if (respuesta.status === 401 || respuesta.status === 403) {
            throw new Error("Error: la clave de la API de Groq no es válida o no tiene permisos.");
        }

        if (respuesta.status === 402 || respuesta.status === 429) {
            throw new Error("Error: se alcanzó el límite o la cuota de la API de Groq.");
        }

        if (respuesta.status === 404 || respuesta.status === 410) {
            throw new Error("Error: la URL o el recurso de la API de Groq no está disponible.");
        }

        throw new Error(`Error de la API de Groq. Código: ${respuesta.status}`);
    }


    let datos;
    try {
        datos = await respuesta.json();
    } catch (error) {
        throw new Error("La respuesta de Groq no tiene un formato JSON válido.");
    }


    
    if (
        !datos.choices ||
        !datos.choices[0] ||
        !datos.choices[0].message ||
        typeof datos.choices[0].message.content !== "string"
    ) {
        throw new Error("Groq no devolvió una descripción válida.");
    }

    let descripcion = datos.choices[0].message.content;

    if (!descripcion || descripcion.trim() === "") {
        throw new Error("La IA no generó ninguna descripción.");
    }

    if (descripcion.length > 1500) {
        console.log("La descripción superó los 1500 caracteres y será recortada.");
        descripcion = descripcion.slice(0, 1500);
    }

    const carpeta = path.join(__dirname, "..", "descripciones");
    fs.mkdirSync(carpeta, { recursive: true });

    const ruta = path.join(carpeta, `mundo_${mundo.id}.txt`);
    fs.writeFileSync(ruta, descripcion, "utf-8");

    return ruta;
}

module.exports = {
    describirMundo
};