const fs = require("fs");
const path = require("path");

const situacion = process.argv[2];
const mundo = process.argv[3];
const colores = process.argv.slice(4);

const { crearMundo, guardarMundo, leerMundo } = require("./mundo");
const { describirMundo } = require("./texto");
const { generarImagen } = require("./imagen");

async function main() {
    try {

        const argumentos = process.argv.slice(2);

        if (argumentos.length !== 7) {
            console.log("Error: debes ingresar una situación, un mundo y cinco colores.");
            console.log('Ejemplo: npm start "un capibara montando un unicornio" "un lago de delfines" rosa azul blanco lila verde');
            process.exitCode = 1;
            return;
}

        for (let i = 0; i < argumentos.length; i++) {
            if (argumentos[i].trim() === "") {
                console.log("Error: ningún argumento puede estar vacío.");
                process.exitCode = 1;
                return;
            }
        }

        for (let i = 0; i < colores.length; i++) {
            for (let j = i + 1; j < colores.length; j++) {
                if (colores[i].toLowerCase() === colores[j].toLowerCase()) {
                    console.log("Error: no puedes ingresar colores repetidos.");
                    process.exitCode = 1;
                    return;
                }
            }
        }

const mundoCreado = crearMundo(argumentos);

const ruta = guardarMundo(mundoCreado);
console.log(`Mundo guardado en: ${ruta}`);

const mundoLeido = leerMundo(ruta);
console.log("Mundo leído:", mundoLeido);

        const rutaDescripcion = path.join(
            __dirname,
            "..",
            "descripciones",
            `mundo_${mundoLeido.id}.txt`
        );

        if (fs.existsSync(rutaDescripcion)) {
            console.log("La descripción ya existe, se reutilizará.");
        } else {
            const rutaNueva = await describirMundo(mundoLeido);
            console.log(`Descripción guardada en: ${rutaNueva}`);
        }


        const rutaImagen = path.join(
            __dirname,
            "..",
            "imagenes",
            `mundo_${mundoLeido.id}.jpg`
        );

        if (fs.existsSync(rutaImagen)) {
            console.log("La imagen ya existe, se reutilizará.");
        } else {
            console.log("Generando imagen, espera un momento...");
            const rutaNueva = await generarImagen(rutaDescripcion, mundoLeido.id);
            console.log(`Imagen guardada en: ${rutaNueva}`);
        }



    } catch (error) {
        console.log("Error:", error.message);
        process.exitCode = 1;
    }
}

main();