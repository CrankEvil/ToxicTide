
// Load environment variables from the .env file
require("dotenv").config();

const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Locate the Aiven CA certificate inside the backend folder
const caPath = path.join(__dirname, "ca.pem");

// Read the Aiven CA certificate
const caCertificate = fs.readFileSync(caPath);

// Create the connection to the ToxicTide Aiven MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // Secure SSL connection required by Aiven
    ssl: {
        ca: caCertificate,
        rejectUnauthorized: true
    }
});

// Check the database connection
db.connect((err) => {
    if (err) {
        console.error("Aiven MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to ToxicTide Aiven MySQL database!");
});

module.exports = db;
