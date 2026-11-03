const fs = require("fs");
const path = require("path");

async function generarImagen(descripcion,id) {
        const respuesta = await fetch(process.env.IMAGEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.IMAGEN_API_KEY}`
            },

            body: JSON.stringify({
            prompt: descripcion,
            seed: 0,
            }),
        });
            
            if (!respuesta.ok) {
            const error = await respuesta.text();

            console.log("Estado:", respuesta.status);
            console.log("Detalle:", error);

            throw new Error("Error al generar la imagen.");
            }


        
        const datos = await respuesta.json();
        const imagenBase64 = datos.artifacts[0].base64;
        const imagenBuffer = Buffer.from(imagenBase64, "base64");

        const carpeta = path.join(__dirname, "..", "imagenes");
        fs.mkdirSync(carpeta, { recursive: true });

        const ruta = path.join(carpeta, `mundo_${id}.jpg`);
        fs.writeFileSync(ruta, imagenBuffer);

         return ruta;
}

module.exports={
    generarImagen
};
       
