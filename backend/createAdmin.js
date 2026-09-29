// Load database settings from .env
require("dotenv").config();

const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

// Create a connection to the ToxicTide database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Admin account details
const username = "suravi007@gmail.com";
const password = "crankarun123";

// Convert the password into a secure hash
const passwordHash = bcrypt.hashSync(password, 10);

// Insert the admin account into MySQL
const sql = `
    INSERT INTO ADMIN_USERS
    (USERNAME, PASSWORD_HASH)
    VALUES (?, ?)
`;

db.query(sql, [username, passwordHash], (err, result) => {

    if (err) {
        console.error("Failed to create admin:", err.message);
        db.end();
        return;
    }

    console.log("Admin account created successfully!");
    console.log("Username:", username);
    console.log("Password:", password);

    db.end();
});