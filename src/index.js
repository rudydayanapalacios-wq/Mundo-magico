const situacion = process.argv[2];
const mundo = process.argv[3];
const colores = process.argv.slice(4);

const { crearMundo, guardarMundo, leerMundo } = require("./mundo");
const { describirMundo } = require("./texto");

async function main() {

    console.log(situacion);
    console.log(mundo);
    console.log(colores);

    const argumentos = process.argv.slice(2);

    if (argumentos.length !== 7) {
        console.log("Error: debes ingresar una situación, un mundo y cinco colores.");
        process.exit(1);
    }

    for (let i = 0; i < argumentos.length; i++) {
        if (argumentos[i].trim() === "") {
            console.log("Error: ningún argumento puede estar vacío.");
            process.exit(1);
        }
    }

    for (let i = 0; i < colores.length; i++) {
        for (let j = i + 1; j < colores.length; j++) {
            if (colores[i].toLowerCase() === colores[j].toLowerCase()) {
                console.log("Error: no puedes ingresar colores repetidos.");
                process.exit(1);
            }
        }
    }

    const mundoCreado = crearMundo(argumentos);
    console.log(mundoCreado);

    const ruta = guardarMundo(mundoCreado);
    console.log(`Mundo guardado en: ${ruta}`);

    const mundoLeido = leerMundo(ruta);
    console.log("Mundo leído:", mundoLeido);

    const rutaDescripcion = await describirMundo(mundoLeido);
    console.log(`Descripción guardada en: ${rutaDescripcion}`);
}

main();