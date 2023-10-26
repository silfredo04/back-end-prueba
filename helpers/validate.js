const validator = require("validator");


const validate = (parametros) => {
    let nombre = !validator.isEmpty(parametros.nombre) &&
        validator.isLength(parametros.nombre, { min: 3, max: undefined }) &&
        validator.isAlpha(parametros.nombre, "es-ES");

    let apellido = !validator.isEmpty(parametros.apellido) &&
        validator.isLength(parametros.apellido, { min: 3, max: undefined }) &&
        validator.isAlpha(parametros.apellido, "es-ES");

    let nick = !validator.isEmpty(parametros.nick) &&
        validator.isLength(parametros.nick, { min: 2, max: undefined });

    let correo = !validator.isEmpty(parametros.correo) &&
        validator.isEmail(parametros.correo);

    let password = !validator.isEmpty(parametros.password);

    let confirmar = !validator.isEmpty(parametros.confirmar);

    let telefono = !validator.isEmpty(parametros.telefono) &&
        validator.isLength(parametros.telefono, { min: 7, max: 10 });

    let numero_documento = !validator.isEmpty(parametros.numero_documento) &&
        validator.isLength(parametros.numero_documento, { min: 2, max: undefined });


    let tipo_documento = !validator.isEmpty(parametros.tipo_documento);


    if (!nombre || !apellido || !nick || !correo || !password || !telefono || !numero_documento || !tipo_documento || !confirmar) {
        throw new Error("No se ha superado la validacion");
    } else {
        console.log("Validacion superada");
    }
}

module.exports = validate;