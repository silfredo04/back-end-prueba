const {conexion} = require("../database/conexion");



const listarTipoDocumento = async () =>{
    // Obtengo la conexión
    const connection = await conexion();
    const [respuesta] = await connection.query(
        'SELECT * FROM tipo_documento WHERE estado = 1'
        );
    return respuesta;
};


module.exports = {
    listarTipoDocumento
}