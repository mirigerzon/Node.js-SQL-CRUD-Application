// DAL/db.js
const { text } = require('express');
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
  console.log(`i am in dal.GET func with table: ${table}`);
  const connection = await createConnection();
  let query = `SELECT * FROM ${table}`;
  const values = [];
  if (conditions.length > 0) {
    const whereClauses = conditions.map(cond => {
      values.push(cond.value);
      return `${cond.field} = ?`;
    });
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }
  const [results] = await connection.query(query, values);
  await connection.end();
  return results;
};

const DELETE = async (table, conditions = []) => {
  const connection = await createConnection();

  const whereClauses = conditions.map(c => `${c.field} = ?`);
  const whereValues = conditions.map(c => c.value);

  const sql = `DELETE FROM ${table} WHERE ${whereClauses.join(' AND ')}`;
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


module.exports = {
  GET,
  DELETE,
  POST
};
