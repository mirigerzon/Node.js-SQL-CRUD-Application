const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config({ path: '../.env' });

async function main() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    await createTables(db);
}

async function createTables(connection) {
    //users
    await connection.query(`
        CREATE TABLE users (
            is_active BOOLEAN DEFAULT TRUE,
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone INT NOT NULL
        )
    `);

    //passwords
    await connection.query(
        `CREATE TABLE passwords (
            is_active BOOLEAN DEFAULT TRUE,
            user_id INT PRIMARY KEY,
            hashed_password VARCHAR(255) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`
    );
    //todos
    await connection.query(
        `CREATE TABLE todos(
        is_active BOOLEAN DEFAULT TRUE,
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`
    );
    //posts
    await connection.query(
        `CREATE TABLE posts(
        is_active BOOLEAN DEFAULT TRUE,
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`
    );
    //comments
    await connection.query(
        `CREATE TABLE comments(
        is_active BOOLEAN DEFAULT TRUE,
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        body TEXT,
        FOREIGN KEY(post_id) REFERENCES posts(id)
    )`
    );
}

main();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
});

