// modelo
const tipoDocumentoModels = require("../modelos/tipoDocumentoModels");





const listarTipoDocumento = async (req, res) => {
    // Consulta para traer los documentos
    try {
        // buscar en la base de datos si existe documento
        let respuesta = await tipoDocumentoModels.listarTipoDocumento();


        if (respuesta.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "No hay documentos"
            });
        }


        return res.status(200).send({
            status: "success",
            respuesta,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: 'Ocurrió un error, contacte al administrador de sistemas.' + error
        });
    }
}

// exportar funciones 

module.exports = {
    listarTipoDocumento
}