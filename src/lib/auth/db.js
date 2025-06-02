import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getUserById(id) {
    // Get user by ID
    const rows = await sql.query("SELECT * FROM auth.users WHERE id = $1 LIMIT 1;", [id]);
    return rows[0] || null;
}

export async function getUserByEmail(email) {
    // Get user by email
    const rows = await sql.query("SELECT * FROM auth.users WHERE email = $1 LIMIT 1;", [email]);
    return rows[0] || null;
}

export async function getUserByUsername(username) {
    // Get user by username
    const rows = await sql.query("SELECT * FROM auth.users WHERE username = $1 LIMIT 1;", [username]);
    return rows[0] || null;
}

export async function dbChangePassword(id, newPassword) {
    // Just store the password
    const result = await sql.query("UPDATE auth.users SET password = $1 WHERE id = $2 RETURNING *;", [newPassword, id]);
    return result[0] || null;
}

export async function checkIfUsernameOrEmailExists(username = "", email = "") {
    // Check if username or email already exists
    const rows = await sql.query("SELECT * FROM auth.users WHERE username = $1 OR email = $2 LIMIT 1;", [username, email]);
    
    // If no rows are returned, username and email are available
    if (rows.length === 0) return false;

    // If rows are returned, username or email already exists
    return {
        usernameExists: rows[0].username === username,
        emailExists: rows[0].email === email,
    };
}

export async function dbCreateUser(username, email, password) {
    // Create a new user
    const result = await sql.query("INSERT INTO auth.users (username, email, password) VALUES ($1, $2, $3) RETURNING *;", [username, email, password]);
    return result[0] || null;
}

export async function dbCreateVerificationToken(userId, token) {
    // Create a verification token for the user
    const result = await sql.query("INSERT INTO auth.verification (userid, token) VALUES ($1, $2) RETURNING *;", [userId, token]);
    return result[0] || null;
}

export async function dbVerifyUser(token, userId) {
    const rows = await sql.query("SELECT * FROM auth.verification WHERE userid = $1 LIMIT 1;", [userId]);

    // If no rows are returned, user is already verified
    if (rows.length === 0) return false;

    // Check if the token matches
    const verification = rows[0];

    console.log(verification);
    console.log(token);

    if (String(verification.token).trim() !== String(token).trim()) return false; // Very weird but it works
    
    // Delete token from database and mark user as verified
    await sql.query("DELETE FROM auth.verification WHERE userid = $1;", [userId]);
    await sql.query("UPDATE auth.users SET verified = true WHERE id = $1;", [userId]);

    return true;
}