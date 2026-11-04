
// ======================================================
// TOXICTIDE DATABASE CONNECTION
// Aiven MySQL connection pool
// ======================================================

// Load environment variables
require("dotenv").config();

const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// ======================================================
// LOAD AIVEN SSL CERTIFICATE
// ======================================================

let caCertificate;

if (process.env.DB_CA_CERT_BASE64) {

    // Render: Load certificate from environment variable
    caCertificate = Buffer.from(
        process.env.DB_CA_CERT_BASE64,
        "base64"
    );

} else {

    // Local development: Load backend/ca.pem
    const caPath = path.join(__dirname, "ca.pem");

    if (!fs.existsSync(caPath)) {
        throw new Error(
            "Aiven CA certificate not found. " +
            "Set DB_CA_CERT_BASE64 or provide backend/ca.pem."
        );
    }

    caCertificate = fs.readFileSync(caPath);
}

// ======================================================
// CREATE MYSQL CONNECTION POOL
// ======================================================

const db = mysql.createPool({

    // Database connection details
    host: process.env.DB_HOST,

    port: Number(process.env.DB_PORT || 3306),

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    // SSL configuration for Aiven
    ssl: {
        ca: caCertificate,
        rejectUnauthorized: true
    },

    // Connection pool settings
    waitForConnections: true,

    connectionLimit: 5,

    queueLimit: 0,

    // Connection timeout
    connectTimeout: 15000,

    // Keep connections alive when supported
    enableKeepAlive: true,

    keepAliveInitialDelay: 0
});

// ======================================================
// VERIFY DATABASE CONNECTION
// ======================================================

db.getConnection((err, connection) => {

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

    // Return the connection to the pool
    connection.release();
});

// ======================================================
// EXPORT DATABASE POOL
// ======================================================

module.exports = db;
