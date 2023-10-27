const express = require("express");
const usuRutas = express.Router();
const usuarioControllers = require("../controlador/usuarioControllers");
const check = require("../middlewares/auth"); // metodos de autenticacion 
const multer = require("multer"); // se encarga subir archivos o imagenes al servidor 


// Configuracion de suvida
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/avatares/");
    },
    filename:(req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const subida = multer({storage:almacenamiento});


//ruta util

usuRutas.post('/usuario/registro',usuarioControllers.registro);
usuRutas.post('/usuario/login',usuarioControllers.login);
usuRutas.get("/usuario/obtenerusuario/:id",check.auth,usuarioControllers.obtenerUsuarioId);
usuRutas.get("/usuario/listarusuarios/:page?",check.auth,usuarioControllers.listarUsuarios);
usuRutas.put("/usuario/actualizarusuario",check.auth,usuarioControllers.actualizarUsuario);
usuRutas.post("/usuario/montarfotousuario",[check.auth, subida.single("file0")], usuarioControllers.motarFotoUsuario);
usuRutas.get("/usuario/obtenerimagenavatar/:file",usuarioControllers.obtenerImagenAvatar);




// exportar rura

module.exports = usuRutas;