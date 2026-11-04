const db = require("./db");

// Express handles our backend API
const express = require("express");

// CORS allows our React frontend to communicate with the backend
const cors = require("cors");

// Compression shrinks every JSON response before it is sent.
// Water-quality JSON compresses very well, so this makes the
// API several times faster without changing any data.
const compression = require("compression");

const bcrypt = require("bcryptjs");

// Admin login token helpers
const {
    createAdminToken,
    requireAdmin
} = require("./middleware/auth");

const app = express();


// ======================================================
// BASIC SERVER CONFIGURATION
// ======================================================

// Allow the backend to read JSON data sent by the frontend
app.use(express.json());

// Enable CORS for the React frontend
app.use(cors());

// Compress responses (gzip/deflate). Applied to every route.
app.use(compression());

const PORT = process.env.PORT || 5000;


// ======================================================
// HTTP CACHING HELPER FOR PUBLIC READ-ONLY DATA
// ======================================================

// Express already generates an ETag for every JSON response.
// This header tells the browser to always ask the server
// "has this changed?" before reusing it.
//
// Result:
// - Unchanged data returns 304 Not Modified with NO body,
//   so repeat page visits are almost free.
// - The data is NEVER stale, because the server is asked
//   every single time.
//
// This is used only on public read-only endpoints. Admin
// endpoints are deliberately left uncached.
function publicCaching(res) {
    res.set(
        "Cache-Control",
        "public, max-age=0, must-revalidate"
    );
}


// ======================================================
// PUBLIC SERVER TEST
// ======================================================

app.get("/", (req, res) => {
    res.send("ToxicTide backend is running!");
});


// ======================================================
// PUBLIC STATIONS API
// ======================================================

// Returns monitoring stations with water type and county information
app.get("/api/stations", (req, res) => {

    const sql = `
        SELECT
            s.STATION_ID,
            s.STATION_NAME,
            wt.TYPE_NAME,
            c.STATE,
            s.COUNTY_CODE,
            s.LATITUDE,
            s.LONGITUDE
        FROM station s
        JOIN water_types wt
            ON s.TYPE_ID = wt.TYPE_ID
        JOIN counties c
            ON s.COUNTY_CODE = c.COUNTY_CODE
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch stations"
            });
        }

        publicCaching(res);

        res.json(results);
    });
});


// ======================================================
// PUBLIC MEASUREMENTS API
// ======================================================

// Returns all recorded microcystin measurements for one station
app.get("/api/measurements", (req, res) => {

    const stationId = req.query.stationId;

    if (!stationId) {
        return res.status(400).json({
            error: "Station ID is required"
        });
    }

    const sql = `
        SELECT
            SAMPLE_ID,
            STATION_ID,
            SAMPLE_DATE,
            MICROCYSTIN_UGL
        FROM cyanotoxins_measurements
        WHERE STATION_ID = ?
        ORDER BY SAMPLE_DATE DESC
    `;

    db.query(sql, [stationId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch measurements"
            });
        }

        publicCaching(res);

        res.json(results);
    });
});


// ======================================================
// PUBLIC DASHBOARD MEASUREMENTS API
// ======================================================

// Returns all measurement records for the dashboard
app.get("/api/measurements/all", (req, res) => {

    const sql = `
        SELECT
            m.SAMPLE_ID,
            m.STATION_ID,
            s.STATION_NAME,
            m.SAMPLE_DATE,
            m.MICROCYSTIN_UGL
        FROM cyanotoxins_measurements m
        LEFT JOIN station s
            ON m.STATION_ID = s.STATION_ID
        ORDER BY m.SAMPLE_DATE DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch all measurements"
            });
        }

        publicCaching(res);

        res.json(results);
    });
});


// ======================================================
// PUBLIC LATEST-MEASUREMENT-PER-STATION API
// ======================================================

// Returns ONLY the newest non-null microcystin measurement
// for each station.
//
// Why this exists:
// The Water Map only ever displays the latest measurement
// per station, but it previously had to download the entire
// measurement history and reduce it inside the browser.
// Doing that reduction in SQL sends a few dozen rows instead
// of the whole table.
//
// The returned columns are IDENTICAL to /api/measurements/all,
// so this is a drop-in replacement for any caller that only
// needs the latest value per station.
app.get("/api/stations/latest", (req, res) => {

    const sql = `
        SELECT
            m.SAMPLE_ID,
            m.STATION_ID,
            s.STATION_NAME,
            m.SAMPLE_DATE,
            m.MICROCYSTIN_UGL
        FROM cyanotoxins_measurements m
        JOIN (
            SELECT
                STATION_ID,
                MAX(SAMPLE_DATE) AS LATEST_DATE
            FROM cyanotoxins_measurements
            WHERE MICROCYSTIN_UGL IS NOT NULL
            GROUP BY STATION_ID
        ) latest
            ON m.STATION_ID = latest.STATION_ID
           AND m.SAMPLE_DATE = latest.LATEST_DATE
        LEFT JOIN station s
            ON m.STATION_ID = s.STATION_ID
        WHERE m.MICROCYSTIN_UGL IS NOT NULL
        ORDER BY
            m.SAMPLE_DATE DESC,
            m.SAMPLE_ID DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch latest measurements"
            });
        }

        publicCaching(res);

        res.json(results);
    });
});


// ======================================================
// PUBLIC SAFETY STANDARDS API
// ======================================================

app.get("/api/safety-standards", (req, res) => {

    const sql = `
        SELECT
            STANDARD_ID,
            USER_GROUP,
            THRESHOLD_UGL,
            ADVISORY_MESSAGE,
            CITING_AGENCY
        FROM safety_standards
        ORDER BY STANDARD_ID
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch safety standards"
            });
        }

        publicCaching(res);

        res.json(results);
    });
});


// ======================================================
// PUBLIC WATER TYPES API
// ======================================================

app.get("/api/water-types", (req, res) => {

    const sql = `
        SELECT
            TYPE_ID,
            TYPE_NAME
        FROM water_types
        ORDER BY TYPE_ID
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch water types"
            });
        }

        publicCaching(res);

        res.json(results);
    });
});


// ======================================================
// PUBLIC COUNTIES API
// ======================================================

app.get("/api/counties", (req, res) => {

    const sql = `
        SELECT
            COUNTY_CODE,
            STATE
        FROM counties
        ORDER BY COUNTY_CODE
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch counties"
            });
        }

        publicCaching(res);

        res.json(results);
    });
});


// ======================================================
// PUBLIC DATABASE STATISTICS API
// ======================================================

// Returns one row containing the record count of every
// public data section shown by the Data Center.
//
// Why this exists:
// The Data Center previously downloaded all five public
// tables in full - including the entire measurement history -
// only to call .length on each one. This returns the same
// five numbers in a single tiny request.
//
// The station count deliberately mirrors the JOIN used by
// /api/stations, so the number shown is exactly the same as
// before.
app.get("/api/stats", (req, res) => {

    const sql = `
        SELECT
            (
                SELECT COUNT(*)
                FROM water_types
            ) AS waterTypes,

            (
                SELECT COUNT(*)
                FROM counties
            ) AS counties,

            (
                SELECT COUNT(*)
                FROM station s
                JOIN water_types wt
                    ON s.TYPE_ID = wt.TYPE_ID
                JOIN counties c
                    ON s.COUNTY_CODE = c.COUNTY_CODE
            ) AS stations,

            (
                SELECT COUNT(*)
                FROM cyanotoxins_measurements
            ) AS measurements,

            (
                SELECT COUNT(*)
                FROM safety_standards
            ) AS standards
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch database statistics"
            });
        }

        const stats = results[0] || {};

        publicCaching(res);

        res.json({
            waterTypes: Number(stats.waterTypes) || 0,
            counties: Number(stats.counties) || 0,
            stations: Number(stats.stations) || 0,
            measurements: Number(stats.measurements) || 0,
            standards: Number(stats.standards) || 0
        });
    });
});


// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

// Admin login remains public because the administrator
// needs to authenticate before accessing protected APIs.
app.post("/api/admin/login", (req, res) => {

    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Username and password are required"
        });
    }

    const sql = `
        SELECT
            ADMIN_ID,
            USERNAME,
            PASSWORD_HASH
        FROM admin_users
        WHERE USERNAME = ?
    `;

    db.query(sql, [username], async (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Login failed"
            });
        }

        // Do not reveal whether the username exists
        if (results.length === 0) {
            return res.status(401).json({
                error: "Invalid admin username or password"
            });
        }

        const admin = results[0];

        const passwordMatches = await bcrypt.compare(
            password,
            admin.PASSWORD_HASH
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid admin username or password"
            });
        }

        const token = createAdminToken(admin);

        res.json({
            message: "Admin login successful",

            token,

            admin: {
                id: admin.ADMIN_ID,
                username: admin.USERNAME
            }
        });
    });
});


// ======================================================
// ADMIN GUARD
// ======================================================

// Every route beginning with /api/admin now requires
// a valid administrator token.

// IMPORTANT:
// /api/admin/login was defined above this middleware,
// so login itself remains publicly accessible.
app.use("/api/admin", requireAdmin);


// ======================================================
// ADMIN - WATER TYPES MANAGEMENT
// ======================================================

app.get("/api/admin/water-types", (req, res) => {

    const sql = `
        SELECT
            TYPE_ID,
            TYPE_NAME
        FROM water_types
        ORDER BY TYPE_ID
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch water types"
            });
        }

        res.json(results);
    });
});


app.post("/api/admin/water-types", (req, res) => {

    const {
        typeId,
        typeName
    } = req.body;

    if (!typeId || !typeName) {
        return res.status(400).json({
            error: "Type ID and type name are required"
        });
    }

    const sql = `
        INSERT INTO water_types
        (
            TYPE_ID,
            TYPE_NAME
        )
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [
            typeId,
            typeName
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to add water type"
                });
            }

            res.json({
                message: "Water type added successfully",
                typeId,
                typeName
            });
        }
    );
});


app.put("/api/admin/water-types/:id", (req, res) => {

    const typeId = req.params.id;
    const { typeName } = req.body;

    if (!typeName) {
        return res.status(400).json({
            error: "Type name is required"
        });
    }

    const sql = `
        UPDATE water_types
        SET TYPE_NAME = ?
        WHERE TYPE_ID = ?
    `;

    db.query(
        sql,
        [
            typeName,
            typeId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to update water type"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Water type not found"
                });
            }

            res.json({
                message: "Water type updated successfully"
            });
        }
    );
});


app.delete("/api/admin/water-types/:id", (req, res) => {

    const typeId = req.params.id;

    const sql = `
        DELETE FROM water_types
        WHERE TYPE_ID = ?
    `;

    db.query(sql, [typeId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error:
                    "Unable to delete water type. It may be used by monitoring stations."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Water type not found"
            });
        }

        res.json({
            message: "Water type deleted successfully"
        });
    });
});


// ======================================================
// ADMIN - COUNTIES MANAGEMENT
// ======================================================

app.get("/api/admin/counties", (req, res) => {

    const sql = `
        SELECT
            COUNTY_CODE,
            STATE
        FROM counties
        ORDER BY COUNTY_CODE
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch counties"
            });
        }

        res.json(results);
    });
});


app.post("/api/admin/counties", (req, res) => {

    const {
        countyCode,
        state
    } = req.body;

    if (!countyCode || !state) {
        return res.status(400).json({
            error: "County code and state are required"
        });
    }

    const sql = `
        INSERT INTO counties
        (
            COUNTY_CODE,
            STATE
        )
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [
            countyCode,
            state
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to add county"
                });
            }

            res.json({
                message: "County added successfully",
                countyCode,
                state
            });
        }
    );
});


app.put("/api/admin/counties/:code", (req, res) => {

    const countyCode = req.params.code;
    const { state } = req.body;

    if (!state) {
        return res.status(400).json({
            error: "State is required"
        });
    }

    const sql = `
        UPDATE counties
        SET STATE = ?
        WHERE COUNTY_CODE = ?
    `;

    db.query(
        sql,
        [
            state,
            countyCode
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: "Failed to update county"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "County not found"
                });
            }

            res.json({
                message: "County updated successfully"
            });
        }
    );
});


app.delete("/api/admin/counties/:code", (req, res) => {

    const countyCode = req.params.code;

    const sql = `
        DELETE FROM counties
        WHERE COUNTY_CODE = ?
    `;

    db.query(sql, [countyCode], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error:
                    "Unable to delete county. It may be used by monitoring stations."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "County not found"
            });
        }

        res.json({
            message: "County deleted successfully"
        });
    });
});


// ======================================================
// ADMIN - MONITORING STATIONS MANAGEMENT
// ======================================================

app.get("/api/admin/stations", (req, res) => {

    const sql = `
        SELECT
            s.STATION_ID,
            s.STATION_NAME,
            s.TYPE_ID,
            wt.TYPE_NAME,
            s.COUNTY_CODE,
            c.STATE,
            s.LATITUDE,
            s.LONGITUDE
        FROM station s
        JOIN water_types wt
            ON s.TYPE_ID = wt.TYPE_ID
        JOIN counties c
            ON s.COUNTY_CODE = c.COUNTY_CODE
        ORDER BY s.STATION_ID
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Failed to fetch monitoring stations"
            });
        }

        res.json(results);
    });
});


app.post("/api/admin/stations", (req, res) => {

    const {
        stationId,
        stationName,
        typeId,
        countyCode,
        latitude,
        longitude
    } = req.body;

    if (
        !stationId ||
        !stationName ||
        !typeId ||
        !countyCode
    ) {
        return res.status(400).json({
            error:
                "Station ID, station name, water type, and county are required"
        });
    }

    const sql = `
        INSERT INTO station
        (
            STATION_ID,
            STATION_NAME,
            TYPE_ID,
            COUNTY_CODE,
            LATITUDE,
            LONGITUDE
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            stationId,
            stationName,
            typeId,
            countyCode,
            latitude || null,
            longitude || null
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to add monitoring station. Check station ID, water type, and county."
                });
            }

            res.json({
                message:
                    "Monitoring station added successfully"
            });
        }
    );
});


app.put("/api/admin/stations/:id", (req, res) => {

    const stationId = req.params.id;

    const {
        stationName,
        typeId,
        countyCode,
        latitude,
        longitude
    } = req.body;

    if (
        !stationName ||
        !typeId ||
        !countyCode
    ) {
        return res.status(400).json({
            error:
                "Station name, water type, and county are required"
        });
    }

    const sql = `
        UPDATE station
        SET
            STATION_NAME = ?,
            TYPE_ID = ?,
            COUNTY_CODE = ?,
            LATITUDE = ?,
            LONGITUDE = ?
        WHERE STATION_ID = ?
    `;

    db.query(
        sql,
        [
            stationName,
            typeId,
            countyCode,
            latitude || null,
            longitude || null,
            stationId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to update monitoring station"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Monitoring station not found"
                });
            }

            res.json({
                message:
                    "Monitoring station updated successfully"
            });
        }
    );
});


app.delete("/api/admin/stations/:id", (req, res) => {

    const stationId = req.params.id;

    const sql = `
        DELETE FROM station
        WHERE STATION_ID = ?
    `;

    db.query(sql, [stationId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error:
                    "Unable to delete station. It may have cyanotoxin measurements linked to it."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error:
                    "Monitoring station not found"
            });
        }

        res.json({
            message:
                "Monitoring station deleted successfully"
        });
    });
});


// ======================================================
// ADMIN - CYANOTOXIN MEASUREMENTS MANAGEMENT
// ======================================================

app.get("/api/admin/measurements", (req, res) => {

    const sql = `
        SELECT
            m.SAMPLE_ID,
            m.STATION_ID,
            s.STATION_NAME,
            m.SAMPLE_DATE,
            m.MICROCYSTIN_UGL
        FROM cyanotoxins_measurements m
        JOIN station s
            ON m.STATION_ID = s.STATION_ID
        ORDER BY
            m.SAMPLE_DATE DESC,
            m.SAMPLE_ID DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error:
                    "Failed to fetch cyanotoxin measurements"
            });
        }

        res.json(results);
    });
});


app.post("/api/admin/measurements", (req, res) => {

    const {
        sampleId,
        stationId,
        sampleDate,
        microcystin
    } = req.body;

    if (
        !sampleId ||
        !stationId ||
        !sampleDate
    ) {
        return res.status(400).json({
            error:
                "Sample ID, station ID, and sample date are required"
        });
    }

    const sql = `
        INSERT INTO cyanotoxins_measurements
        (
            SAMPLE_ID,
            STATION_ID,
            SAMPLE_DATE,
            MICROCYSTIN_UGL
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            sampleId,
            stationId,
            sampleDate,
            microcystin === "" ||
            microcystin === null
                ? null
                : Number(microcystin)
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to add cyanotoxin measurement. Check the sample ID and station ID."
                });
            }

            res.json({
                message:
                    "Cyanotoxin measurement added successfully"
            });
        }
    );
});


app.put("/api/admin/measurements/:id", (req, res) => {

    const sampleId = req.params.id;

    const {
        stationId,
        sampleDate,
        microcystin
    } = req.body;

    if (
        !stationId ||
        !sampleDate
    ) {
        return res.status(400).json({
            error:
                "Station ID and sample date are required"
        });
    }

    const sql = `
        UPDATE cyanotoxins_measurements
        SET
            STATION_ID = ?,
            SAMPLE_DATE = ?,
            MICROCYSTIN_UGL = ?
        WHERE SAMPLE_ID = ?
    `;

    db.query(
        sql,
        [
            stationId,
            sampleDate,
            microcystin === "" ||
            microcystin === null
                ? null
                : Number(microcystin),
            sampleId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to update cyanotoxin measurement"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Measurement record not found"
                });
            }

            res.json({
                message:
                    "Cyanotoxin measurement updated successfully"
            });
        }
    );
});


app.delete("/api/admin/measurements/:id", (req, res) => {

    const sampleId = req.params.id;

    const sql = `
        DELETE FROM cyanotoxins_measurements
        WHERE SAMPLE_ID = ?
    `;

    db.query(
        sql,
        [sampleId],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to delete cyanotoxin measurement"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Measurement record not found"
                });
            }

            res.json({
                message:
                    "Cyanotoxin measurement deleted successfully"
            });
        }
    );
});


// ======================================================
// ADMIN - SAFETY STANDARDS MANAGEMENT
// ======================================================

app.get("/api/admin/safety-standards", (req, res) => {

    const sql = `
        SELECT
            STANDARD_ID,
            USER_GROUP,
            THRESHOLD_UGL,
            ADVISORY_MESSAGE,
            CITING_AGENCY
        FROM safety_standards
        ORDER BY STANDARD_ID
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error:
                    "Failed to fetch safety standards"
            });
        }

        res.json(results);
    });
});


app.post("/api/admin/safety-standards", (req, res) => {

    const {
        standardId,
        userGroup,
        threshold,
        advisoryMessage,
        citingAgency
    } = req.body;

    if (
        !standardId ||
        !userGroup ||
        threshold === undefined ||
        threshold === null ||
        !advisoryMessage ||
        !citingAgency
    ) {
        return res.status(400).json({
            error:
                "All safety standard fields are required"
        });
    }

    const sql = `
        INSERT INTO safety_standards
        (
            STANDARD_ID,
            USER_GROUP,
            THRESHOLD_UGL,
            ADVISORY_MESSAGE,
            CITING_AGENCY
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            standardId,
            userGroup,
            Number(threshold),
            advisoryMessage,
            citingAgency
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to add safety standard. Check the standard ID."
                });
            }

            res.json({
                message:
                    "Safety standard added successfully"
            });
        }
    );
});


app.put("/api/admin/safety-standards/:id", (req, res) => {

    const standardId = req.params.id;

    const {
        userGroup,
        threshold,
        advisoryMessage,
        citingAgency
    } = req.body;

    if (
        !userGroup ||
        threshold === undefined ||
        threshold === null ||
        !advisoryMessage ||
        !citingAgency
    ) {
        return res.status(400).json({
            error:
                "All safety standard fields are required"
        });
    }

    const sql = `
        UPDATE safety_standards
        SET
            USER_GROUP = ?,
            THRESHOLD_UGL = ?,
            ADVISORY_MESSAGE = ?,
            CITING_AGENCY = ?
        WHERE STANDARD_ID = ?
    `;

    db.query(
        sql,
        [
            userGroup,
            Number(threshold),
            advisoryMessage,
            citingAgency,
            standardId
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to update safety standard"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Safety standard not found"
                });
            }

            res.json({
                message:
                    "Safety standard updated successfully"
            });
        }
    );
});


app.delete("/api/admin/safety-standards/:id", (req, res) => {

    const standardId = req.params.id;

    const sql = `
        DELETE FROM safety_standards
        WHERE STANDARD_ID = ?
    `;

    db.query(
        sql,
        [standardId],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to delete safety standard"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error:
                        "Safety standard not found"
                });
            }

            res.json({
                message:
                    "Safety standard deleted successfully"
            });
        }
    );
});


// ======================================================
// PUBLIC COMMUNITY REPORT SUBMISSION
// ======================================================

// IMPORTANT:
// This endpoint stays PUBLIC.
// Normal users must be able to submit community reports.
app.post("/api/community-reports", (req, res) => {

    const {
        stationId,
        reportDate,
        reportType,
        description,
        severity
    } = req.body;

    if (
        !reportDate ||
        !reportType ||
        !description ||
        !severity
    ) {
        return res.status(400).json({
            message:
                "Please complete all required fields."
        });
    }

    const sql = `
        INSERT INTO community_reports
        (
            STATION_ID,
            REPORT_DATE,
            REPORT_TYPE,
            DESCRIPTION,
            SEVERITY
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        stationId || null,
        reportDate,
        reportType,
        description,
        severity
    ];

    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {
                console.error(
                    "Error creating community report:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to submit community report"
                });
            }

            res.status(201).json({
                message:
                    "Community report submitted successfully.",
                reportId:
                    result.insertId
            });
        }
    );
});


// ======================================================
// ADMIN - COMMUNITY REPORT MANAGEMENT
// ======================================================

// IMPORTANT:
// These endpoints are now under /api/admin.
// Therefore requireAdmin automatically protects them.
//
// Public users can SUBMIT reports.
// Only authenticated administrators can:
// - view all reports
// - change report status
// - delete reports
// ======================================================


// Get all community reports
app.get("/api/admin/community-reports", (req, res) => {

    const sql = `
        SELECT
            r.REPORT_ID,
            r.STATION_ID,
            s.STATION_NAME,
            r.REPORT_DATE,
            r.REPORT_TYPE,
            r.DESCRIPTION,
            r.SEVERITY,
            r.STATUS,
            r.CREATED_AT
        FROM community_reports r
        LEFT JOIN station s
            ON r.STATION_ID = s.STATION_ID
        ORDER BY r.CREATED_AT DESC
    `;

    db.query(
        sql,
        (err, results) => {

            if (err) {
                console.error(
                    "Error loading community reports:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to load community reports"
                });
            }

            res.json(results);
        }
    );
});


// Update the status of a community report
app.put(
    "/api/admin/community-reports/:id/status",
    (req, res) => {

        const reportId = req.params.id;

        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Reviewed",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message:
                    "Invalid report status."
            });
        }

        const sql = `
            UPDATE community_reports
            SET STATUS = ?
            WHERE REPORT_ID = ?
        `;

        db.query(
            sql,
            [
                status,
                reportId
            ],
            (err, result) => {

                if (err) {
                    console.error(
                        "Error updating report status:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to update report status"
                    });
                }

                if (
                    result.affectedRows === 0
                ) {
                    return res.status(404).json({
                        message:
                            "Community report not found."
                    });
                }

                res.json({
                    message:
                        "Report status updated successfully."
                });
            }
        );
    }
);


// Delete a community report
app.delete(
    "/api/admin/community-reports/:id",
    (req, res) => {

        const reportId = req.params.id;

        const sql = `
            DELETE FROM community_reports
            WHERE REPORT_ID = ?
        `;

        db.query(
            sql,
            [reportId],
            (err, result) => {

                if (err) {
                    console.error(
                        "Error deleting community report:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to delete community report"
                    });
                }

                if (
                    result.affectedRows === 0
                ) {
                    return res.status(404).json({
                        message:
                            "Community report not found."
                    });
                }

                res.json({
                    message:
                        "Community report deleted successfully."
                });
            }
        );
    }
);


// ======================================================
// PUBLIC SAFETY CHECK API
// ======================================================

// Returns the latest available non-NULL microcystin
// measurement and compares it with the selected
// user group's safety standard.
app.get("/api/safety", (req, res) => {

    const stationId = req.query.stationId;

    const userGroup = req.query.userGroup;

    if (!stationId || !userGroup) {
        return res.status(400).json({
            error:
                "Station ID and user group are required"
        });
    }

    const sql = `
        SELECT
            m.STATION_ID,
            m.SAMPLE_DATE,
            m.MICROCYSTIN_UGL,
            ss.USER_GROUP,
            ss.THRESHOLD_UGL,
            ss.ADVISORY_MESSAGE,
            ss.CITING_AGENCY
        FROM cyanotoxins_measurements m
        JOIN safety_standards ss
            ON ss.USER_GROUP = ?
        WHERE m.STATION_ID = ?
          AND m.MICROCYSTIN_UGL IS NOT NULL
        ORDER BY m.SAMPLE_DATE DESC
        LIMIT 1
    `;

    db.query(
        sql,
        [
            userGroup,
            stationId
        ],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        "Failed to check water safety"
                });
            }

            // Missing measurement is NOT treated as safe.
            if (results.length === 0) {

                return res.json({
                    message:
                        "No measurement available for this station"
                });
            }

            const safetyData = results[0];

            const measurement =
                Number(
                    safetyData.MICROCYSTIN_UGL
                );

            const threshold =
                Number(
                    safetyData.THRESHOLD_UGL
                );

            safetyData.MICROCYSTIN_UGL =
                measurement;

            safetyData.THRESHOLD_UGL =
                threshold;

            const isAboveThreshold =
                measurement > threshold;

            safetyData.STATUS =
                isAboveThreshold
                    ? "ABOVE THRESHOLD"
                    : "WITHIN THRESHOLD";

            res.json(safetyData);
        }
    );
});


// ======================================================
// KEEP THE DATABASE POOL WARM
// ======================================================

// Aiven MySQL connections are opened over TLS. Creating a
// brand-new connection costs several round trips, which is
// why the very first request after a quiet period feels
// slow.
//
// Running a trivial query every 4 minutes keeps at least
// one pooled connection alive and authenticated, so real
// requests can reuse it immediately.
//
// This changes no data and no behaviour - it only prevents
// idle connections from being dropped.
const POOL_KEEP_WARM_MS = 4 * 60 * 1000;

const keepPoolWarm = setInterval(() => {

    db.query("SELECT 1", (err) => {

        if (err) {

            // A failed ping is not fatal. The pool simply
            // rebuilds the connection on the next request.
            console.error(
                "Database keep-warm ping failed:",
                err.message
            );
        }
    });

}, POOL_KEEP_WARM_MS);

// Do not let this timer keep the process alive on shutdown.
if (typeof keepPoolWarm.unref === "function") {
    keepPoolWarm.unref();
}


// ======================================================
// START SERVER
// ======================================================

// Keep app.listen at the very bottom so every route
// has already been registered before the server starts.
app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `ToxicTide server running on port ${PORT}`
    );
});