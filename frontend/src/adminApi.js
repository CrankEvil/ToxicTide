// ======================================================
// ToxicTide - admin session + authenticated requests
// One place that knows how the admin token is stored and sent.
// ======================================================

import axios from "axios";

// Key names used in sessionStorage
const TOKEN_KEY = "toxictideAdminToken";
const FLAG_KEY = "toxictideAdmin";              // kept: the dashboard reads it
const USERNAME_KEY = "toxictideAdminUsername";  // kept: the dashboard reads it


// Save everything after a successful login
export function saveAdminSession(token, username) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(FLAG_KEY, "true");
    sessionStorage.setItem(USERNAME_KEY, username);
}

// Remove everything on logout or when the token is rejected
export function clearAdminSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(FLAG_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
}

export function getAdminToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}


// Quick check used by ProtectedRoute.
// This only avoids showing a page that will fail anyway.
// The REAL security check happens on the server (requireAdmin).
export function isAdminTokenValid() {
    const token = getAdminToken();

    if (!token) {
        return false;
    }

    try {
        // A token has 3 parts. The middle part holds the expiry time.
        const payload = JSON.parse(
            atob(
                token
                    .split(".")[1]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );

        // exp is in seconds, Date.now() is in milliseconds
        return !payload.exp || payload.exp * 1000 > Date.now();

    } catch (err) {
        return false;
    }
}


// Send the user back to the login page
function redirectToLogin() {
    clearAdminSession();
    window.location.assign("/admin/login");
}


// Same as fetch(), but adds the admin token.
// If the server says 401, the session is over, so go to login.
export async function adminFetch(url, options = {}) {

    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${getAdminToken()}`
        }
    });

    if (response.status === 401) {
        redirectToLogin();
    }

    return response;
}


// AdminWaterTypes uses axios, so do the same for axios.
// Only requests to /api/admin/ get the token.
axios.interceptors.request.use((config) => {

    if (config.url && config.url.includes("/api/admin/")) {
        config.headers.Authorization = `Bearer ${getAdminToken()}`;
    }

    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {

        const url = error.config?.url || "";

        if (
            error.response?.status === 401 &&
            url.includes("/api/admin/")
        ) {
            redirectToLogin();
        }

        return Promise.reject(error);
    }
);