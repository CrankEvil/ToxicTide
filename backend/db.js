
// Load environment variables
require("dotenv").config();

const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Load Aiven CA certificate
let caCertificate;

if (process.env.DB_CA_CERT_BASE64) {
    // Render: Read certificate from environment variable
    caCertificate = Buffer.from(
        process.env.DB_CA_CERT_BASE64,
        "base64"
    );
} else {
    // Local development: Read certificate from backend/ca.pem
    const caPath = path.join(__dirname, "ca.pem");
    caCertificate = fs.readFileSync(caPath);
}

// Create Aiven MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: caCertificate,
        rejectUnauthorized: true
    }
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error(
            "Aiven MySQL connection failed:",
            err.message
        );
        return;
    }

    console.log(
        "Connected to ToxicTide Aiven MySQL database!"
    );
});

module.exports = db;