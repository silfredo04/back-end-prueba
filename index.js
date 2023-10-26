// importar dependencias
const express = require("express");
const cors = require("cors");
// Importando base de datos
const {conexion} = require("./database/conexion");

// Conexion a la base de datos
conexion();

// Mensaje de bienvenida
console.log("API Prueba Americana arrancada!!");



// Crear servidor node
const app = express();
const puerto = 4000;

// Configurar cors
app.use(cors());

// Convertir los datos que lleguen en cada peticion datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// Cargar configuracion de rutas
const usuarioRutas = require("./rutas/usuarioRoutes");
const tipoDocRutas = require("./rutas/tipoDocumentoRoutes");
app.use("/api",usuarioRutas);
app.use("/api",tipoDocRutas);



// Poner el servidor a escuchar peticiones http
app.listen(puerto,() => {
    console.log("Servidor de node corriendo en el puerto: "+puerto)
});