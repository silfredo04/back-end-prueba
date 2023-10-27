const {conexion} = require("../database/conexion");



// Insertar registro
const registro = async (nombre,apellido,correo,telefono,password,nick,id_tipo_documento,numero_documento) =>{
    // Obtengo la conexión
    const connection = await conexion();
    const [result] = await connection.query(
        'INSERT INTO usuario (nombre, apellido, correo, telefono, password, nick, id_tipo_documento,numero_documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, correo, telefono, password, nick, id_tipo_documento,numero_documento]
      );
      return result;
};


// Control de usuarios duplicado 

const usuariosDuplicado = async (correo,nick,numero_documento) =>{
    // Obtengo la conexión
    const connection = await conexion();
    const [cantidad] = await connection.query(
        'SELECT * , COUNT(*) cantidad FROM usuario WHERE correo = ? OR nick = ? OR numero_documento = ?',
        [correo, nick, numero_documento]
        );
    return cantidad;
}


// buscar en la base de datos si existe el usuario 

const existeUsuario = async (correo) =>{
    // Obtengo la conexión
    const connection = await conexion();
    const [respuesta] = await connection.query(
        'SELECT * , COUNT(*) cantidad FROM usuario WHERE correo = ? and estado = 1',
        [correo]
        );
    return respuesta;
}

const existeUsuarioId = async (id) =>{
    // Obtengo la conexión
    const connection = await conexion();
    const [respuesta] = await connection.query(
        'SELECT * , COUNT(*) cantidad FROM usuario WHERE id = ? and estado = 1',
        [id]
        );
    return respuesta;
}

const listarUsuariosPaginacion = async (offset,itemsPerpage) =>{
    // Obtengo la conexión
    const connection = await conexion();
    const [respuesta] = await connection.query(
        'SELECT id, numero_documento, nombre, apellido, telefono, nick, image, correo, ultima_fecha_sesion, id_rol, id_tipo_documento, fecha_registra  FROM usuario WHERE estado = 1  ORDER BY id LIMIT ?, ?',
        [offset, itemsPerpage]
        );
    return respuesta;
}

// Actualizar datos usuario

const actualizarDatosUsuario = async(id,numero_documento,nombre,apellido,correo,telefono,nick,password,id_tipo_documento) =>{
    const connection = await conexion();
    const [respuesta] = await connection.query(
        'UPDATE usuario SET numero_documento = ?, nombre = ?, apellido = ?, correo = ?, telefono = ?, nick = ?, password = ?, id_tipo_documento = ? WHERE id = ?',
        [numero_documento,nombre,apellido,correo,telefono,nick,password,id_tipo_documento,id]
        );
    return respuesta;
}

// Actualizar campo imagen

const actualizarImagen = async(id,image) =>{
    const connection = await conexion();
    const [respuesta] = await connection.query(
        'UPDATE usuario SET image = ? WHERE id = ?',
        [image,id]
        );
    return respuesta;
}


module.exports = {
    registro,
    usuariosDuplicado,
    existeUsuario,
    existeUsuarioId,
    listarUsuariosPaginacion,
    actualizarDatosUsuario,
    actualizarImagen
}