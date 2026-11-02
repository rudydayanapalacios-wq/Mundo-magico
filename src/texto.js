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

    const respuesta = await fetch(process.env.TEXTO_URL, {
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

    if (!respuesta.ok) {
        throw new Error("Error al conectar con la API de Groq.");
    }

    const datos = await respuesta.json();
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