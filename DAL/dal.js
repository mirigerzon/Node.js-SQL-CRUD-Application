// DAL/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
};

const getAll = async (table) => {
  const connection = await createConnection();
  const [results] = await connection.query(`SELECT * FROM ${table}`);
  await connection.end();
  return results;
};

const getItemsById = async(type, typeForComparing ,id) =>{
  const connection = await createConnection();
  const [results] = await connection.query(`SELECT * FROM ${type} WHERE ${typeForComparing} = ${id}`);
  await connection.end();
  return results;
}

module.exports = {
  getAll,
  getItemsById
};
