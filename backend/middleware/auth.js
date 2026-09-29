// Load .env so JWT_SECRET is available even if this file is loaded first
require("dotenv").config();

const jwt = require("jsonwebtoken");

// The secret is used to sign and check login tokens.
// If it is missing we stop immediately, because running without it
// would mean anyone could create a valid token.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET is missing. Add it to your .env file (see setup steps)."
    );
}

// How long an admin login stays valid (default: 2 hours)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";


// Create a signed token after a successful admin login
function createAdminToken(admin) {
    return jwt.sign(
        {
            id: admin.ADMIN_ID,
            username: admin.USERNAME
        },
        JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: JWT_EXPIRES_IN
        }
    );
}


// Middleware: only allow the request if it carries a valid admin token
function requireAdmin(req, res, next) {

    // The frontend sends:  Authorization: Bearer <token>
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    // No token at all -> not logged in
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: "Admin login required"
        });
    }

    try {
        // Throws if the token is fake, changed, or expired
        req.admin = jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"]
        });

        // Token is valid, continue to the real route
        next();

    } catch (err) {
        return res.status(401).json({
            error: "Session expired or invalid. Please log in again."
        });
    }
}

module.exports = { createAdminToken, requireAdmin };