// DAL/db.js
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
};

const GET = async (table, conditions = []) => {
  const connection = await createConnection();
  let query = `SELECT * FROM ${table}`;
  query+= ' WHERE is_active = 1';
  const values = [];
  if (conditions.length > 0) {
    const whereClauses = conditions.map(cond => {
      values.push(cond.value);
      return `${cond.field} = ?`;
    });
    query += ` AND ${whereClauses.join(' AND ')}`;
  }
  const [results] = await connection.query(query, values);
  await connection.end();

  return results;
};

const DELETE = async (table, conditions = []) => {
  const connection = await createConnection();

  const whereClauses = conditions.map(c => `${c.field} = ?`).join(' AND ');
  const whereValues = conditions.map(c => c.value);

  const sql = `UPDATE ${table} SET is_active = FALSE WHERE ${whereClauses}`;
  const [result] = await connection.query(sql, whereValues);

  await connection.end();
  return result;
};

const POST = async (table, data) => {
  const connection = await createConnection();
  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map(() => '?');

  const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
  const [result] = await connection.query(sql, values);

  await connection.end();
  return result;
};

const PUT = async (table, data, conditions = []) => {
  const connection = await createConnection();
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const whereClauses = conditions.map(c => `${c.field} = ?`).join(' AND ');
  const whereValues = conditions.map(c => c.value);
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClauses}`;
  const [result] = await connection.query(sql, [...values, ...whereValues]);
  await connection.end();
  return result;
};



module.exports = {
  GET,
  DELETE,
  POST,
  PUT
};
