const objectHash = require("object-hash");
const fs = require("fs");
const path = require("path");

function crearMundo(args) {
    const situacion = args[0];
    const mundo = args[1];
    const colores = args.slice(2);

    const id = objectHash({
        situacion,
        mundo,
        colores
    }).slice(0, 8);

    const creadoEn = new Date().toISOString();

    const mundoCreado = {
        id,
        situacion,
        mundo,
        colores,
        creadoEn
    };

    return mundoCreado;
}


function guardarMundo(mundo) {
    const carpeta = path.join(__dirname, "..", "data");
    fs.mkdirSync(carpeta, { recursive: true });

    const ruta = path.join(carpeta, `mundo_${mundo.id}.json`);

    if (fs.existsSync(ruta)) {
        return ruta;
    }

    fs.writeFileSync(ruta, JSON.stringify(mundo, null, 2));

    return ruta;
}


function leerMundo(ruta) {
    const contenido = fs.readFileSync(ruta, "utf-8");

    return JSON.parse(contenido);
}

module.exports = {
    crearMundo,
    guardarMundo,
    leerMundo
};

