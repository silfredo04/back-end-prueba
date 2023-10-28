// modelo
const usuarioModels = require("../modelos/usuarioModels");
// método de encriptación 
const bcrypt = require("bcrypt");
// metodos para borrar archivos y dar respuestas
const fs = require("fs");
const path = require("path");
// helpers 
const validate = require("../helpers/validate");
// importar servicios 
const jwt = require("../servicios/jwt");



function esCorreoElectronicoValido(correo) {
    // Expresión regular para validar un correo electrónico
    const expresionRegularCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return expresionRegularCorreo.test(correo);
}

// Registra usuarios

const registro = async (req, res) => {
    try {
        // recogemos parametros del body
        let parametros = req.body;


        // Comprobar que me llega bien (+ validacion)
        if (!parametros.nombre || !parametros.apellido || !parametros.correo || !parametros.telefono || !parametros.numero_documento || !parametros.tipo_documento || !parametros.nick || !parametros.password || !parametros.confirmar) {
            // devolver resultado
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        } else if (parametros.password.length <= 7) {
            return res.status(400).json({
                status: "error",
                message: "Tu contraseña debe ser mayor a 7 dígitos"
            });
        } else if (parametros.password != parametros.confirmar) {
            return res.status(400).json({
                status: "error",
                message: "No coincide la contraseña"
            });
        }else if(parametros.numero_documento < 0){
            return res.status(400).json({
                status: "error",
                message: "Numero de documento invalido"
            });
        }else if(!esCorreoElectronicoValido(parametros.correo)){
            return res.status(400).json({
                status: "error",
                message: "Por favor ingresa un correo valido"
            });
        }

        // Validacion avansada
        try {
            validate(parametros);
        } catch (error) {
            return res.status(400).json({
                status: "error",
                message: "Validacion no superada"+error
            });
        }

        // Control de usuarios duplicados 
        const [cantidad] = await usuarioModels.usuariosDuplicado(parametros.correo.toLowerCase(), parametros.nick.toLowerCase(), parametros.numero_documento);
        if (cantidad.cantidad == 1) {
            return res.status(404).json({
                status: "error",
                message: "El susuario ya existe"
            });
        }

        // Cifrar la contraseña
        let pwd = await bcrypt.hash(parametros.password, 10);
        parametros.password = pwd;
        //parametros.confirmar = pwd;

        // Guardar usuario en la base de datos
        try {
            let usuarioGuardado = await usuarioModels.registro(parametros.nombre.toLowerCase(), parametros.apellido.toLowerCase(), parametros.correo.toLowerCase(), parametros.telefono, parametros.password, parametros.nick.toLowerCase(), parametros.tipo_documento, parametros.numero_documento);

            if (usuarioGuardado) {
                // devolver respuesta
                return res.status(200).json({
                    status: "success",
                    message: "Usuario registrado con exito a Prueba...",
                    usuarioGuardado
                });
            } else {
                // devolver respuesta
                return res.status(400).json({
                    status: "error",
                    message: "No se a podido regitrar el usuario...",
                    usuarioGuardado
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: 'Ocurrió un error, contacte al administrador de sistemas.' + error
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: 'Ocurrió un error, contacte al administrador de sistemas.' + error
        });
    }
}


// login

const login = async (req, res) => {

    // recoger los parametros del body 

    let parametros = req.body;

    // validar si los datos llegan 

    if (!parametros.correo || !parametros.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }
    try {
        // buscar en la base de datos si existe el usuario 
        let [respuesta] = await usuarioModels.existeUsuario(parametros.correo.toLowerCase());
        if (respuesta.cantidad == 0) {
            return res.status(404).json({
                status: "error",
                message: "No existe el usuario "
            });
        }

        // Comprobar su contraseña
        let pwd = await bcrypt.compare(parametros.password, respuesta.password);
        if (!pwd) {
            return res.status(404).json({
                status: "error",
                message: "no te has identificado correctamente"
            });
        }

        // Conseguir Token
        const token = jwt.createToken(respuesta);

        return res.status(200).send({
            status: "success",
            message: "Te has identificado correctamente",
            usuario: {
                id: respuesta.id,
                name: respuesta.nombre,
                apellido: respuesta.apellido,
                nick: respuesta.nick,
                image:respuesta.image,
                fecha_registra:respuesta.fecha_registra
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: 'Ocurrió un error, contacte al administrador de sistemas.'
        });
    }

}

// obtener usuaio por id

const obtenerUsuarioId = async (req, res) => {
    // Recibir  el parametro del id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    try {
        // buscar en la base de datos si existe el usuario 
        let [respuesta] = await usuarioModels.existeUsuarioId(id);
        if (respuesta.cantidad == 0) {
            return res.status(404).json({
                status: "error",
                message: "No existe el usuario "
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Usuario encontrado",
            usuario: {
                id: respuesta.id,
                numero_documento: respuesta.numero_documento,
                nombre: respuesta.nombre,
                apellido: respuesta.apellido,
                telefono: respuesta.telefono,
                nick: respuesta.nick,
                image: respuesta.image,
                ultima_fecha_sesion: respuesta.ultima_fecha_sesion,
                id_rol: respuesta.id_rol,
                id_tipo_documento: respuesta.id_tipo_documento,
                fecha_registra: respuesta.fecha_registra
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: 'Ocurrió un error, contacte al administrador de sistemas.'
        });
    }
}


const listarUsuarios = async (req, res) => {

    // Controlar en que pagina estamos
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    page = parseInt(page);

    // Consultar 
    let itemsPerpage = 20;

    let offset = (page - 1) * itemsPerpage;

    // Consulta para sacar los datos del usuario
    try {
        // buscar en la base de datos si existe el usuario 
        let respuesta = await usuarioModels.listarUsuariosPaginacion(offset, itemsPerpage);
        // cantidad de usuarios 
        let total = respuesta.length;
        if (respuesta.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "No hay usuarios"
            });
        }


        return res.status(200).send({
            status: "success",
            respuesta,
            page,
            itemsPerpage,
            total,
            pages: Math.ceil(total / itemsPerpage),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: 'Ocurrió un error, contacte al administrador de sistemas.' + error
        });
    }

}

const actualizarUsuario = async (req, res) => {
    // Recoger info del usuario a actualizar 
    let identidaUsuario = req.user;

    // Recoger info del body
    let UsuarioActualizar = req.body;
    console.log(UsuarioActualizar)

    //Eliminar campos sobrantes
    delete UsuarioActualizar.iat;
    delete UsuarioActualizar.exp;
    delete UsuarioActualizar.id_rol;
    delete UsuarioActualizar.image;

    // Comprobar si el usuario ya existe 
    const respuesta = await usuarioModels.usuariosDuplicado(UsuarioActualizar.correo.toLowerCase(), UsuarioActualizar.nick.toLowerCase(), UsuarioActualizar.numero_documento);
    
    if (respuesta.cantidad == 1) {
        return res.status(404).json({
            status: "error",
            message: "El susuario ya existe"
        });
    }
    // esta validacion me ayuda a a restringir la actualizacion solo el usuario que esta en sección puede actualizar sus datos.
    let userIsset = false;
    respuesta.forEach(user => {
        if (user && user.id != identidaUsuario.id) userIsset = true;
    });
    if (userIsset) {
        return res.status(200).json({
            status: "success",
            message: "El susuario ya existe"
        });
    }
    // Cifrar la contraseña
    if (UsuarioActualizar.password) {
        let pwd = await bcrypt.hash(UsuarioActualizar.password, 10);
        UsuarioActualizar.password = pwd;
    } else {
        delete UsuarioActualizar.password;
    }

    // Buscar y actualizar 

    let usuarioActualizado = await usuarioModels.actualizarDatosUsuario(identidaUsuario.id, UsuarioActualizar.numero_documento,UsuarioActualizar.nombre, UsuarioActualizar.apellido,UsuarioActualizar.correo, UsuarioActualizar.telefono,UsuarioActualizar.nick,UsuarioActualizar.password,UsuarioActualizar.id_tipo_documento);

    if (!usuarioActualizado) {
        return res.status(500).json({
            status: "error",
            message: "error al actualizar el usuario"
        });
    }

    // devolver respuesta
    return res.status(200).json({
        status: "success",
        message:"usuario actualizado",
        usuarioActualizado
    });
}

// Montar foto Usuario

const motarFotoUsuario = async (req, res) => {

    // Recoger el fichero de imagen subido y comprobar que exixte
    let archivo = req.file;

    if (!archivo && !req.files) {
        return res.status(404).json({
            status: "error",
            message: "No olvides cargar tu imagen antes de guardar"
        });
    }

    // Conseguir el Nombre del archivo 
    let nombreArchivo = archivo.originalname;

    //Sacar la Extension del archivo

    let extensionArchivo_split = nombreArchivo.split("\.");
    let extension = extensionArchivo_split[1];

    // Comprobar extension correcta
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        // Borrar archivo y dar respuesta
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);
        return res.status(400).json({
            status: "error",
            message: "Imagen invalida"
        });
    } else {
        try {
            // Recoger id usuario a editar
            let usuarioId = req.user.id;
            // Si todo va bien, actualizar el articulo
            let respuesta = await usuarioModels.actualizarImagen(usuarioId, req.file.filename);
            // Devolver respuesta
            if (respuesta) {
                return res.status(200).json({
                    status: "success",
                    respuesta,
                    fichero: req.file
                });
            } else {
                return res.status(500).json({
                    status: "error",
                    message: "Usuario no encontrado!!"
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                status:"error",
                message: 'Ocurrió un error, contacte al administrador de sistemas.' 
            });
        }

    }

} // fin montar foto a usuario

// Obtener imagen de usuario 
const obtenerImagenAvatar = (req,res) =>{

    // Sacar el parametro de la url
    let file = req.params.file;

    // Montar el paht real de la imagen
    let ruta_fisica = "./imagenes/avatares/"+file;

    // Comprobar si el archivo existe 

    fs.stat(ruta_fisica, (error, existe) =>{
        if(existe){
            // Devolver un file
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe"
            });
        }
    });
} // fin imagen



// Exportar acciones 

module.exports = {
    registro,
    login,
    obtenerUsuarioId,
    listarUsuarios,
    actualizarUsuario,
    motarFotoUsuario,
    obtenerImagenAvatar
}