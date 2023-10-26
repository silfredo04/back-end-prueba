const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pruebaAmericana',
};

async function conexion() {
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log('Conexión exitosa a la base de datos!');
      return connection;
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error.message);
      throw error;
    }
  }


module.exports = {
  conexion
}



