const express = require("express");
const tipoRutas = express.Router();
const tipoControllers = require("../controlador/tipoControllers");



//ruta util

tipoRutas.get("/tipo_documento/listar",tipoControllers.listarTipoDocumento);


// exportar rura

module.exports = tipoRutas;