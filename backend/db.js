// Load database settings from the .env file
require("dotenv").config();

const mysql = require("mysql2");

// Create the connection to the ToxicTide MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check the database connection when the backend starts
db.connect((err) => {

    if (err) {
        console.error(
            "MySQL connection failed:",
            err.message
        );

        return;
    }

    console.log(
        "Connected to ToxicTide MySQL database!"
    );
});

module.exports = db;