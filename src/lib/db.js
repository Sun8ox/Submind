import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getUserById(id) {
    const rows = await sql.query("SELECT * FROM auth.users WHERE id = $1 LIMIT 1;", [id]);
    return rows[0] || null;
}

export async function getUserByEmail(email) {
    const rows = await sql.query("SELECT * FROM auth.users WHERE email = $1 LIMIT 1;", [email]);
    return rows[0] || null;
}

export async function getUserByUsername(username) {
    const rows = await sql.query("SELECT * FROM auth.users WHERE username = $1 LIMIT 1;", [username]);
    return rows[0] || null;
}

export async function dbChangePassword(id, newPassword) {
    const result = await sql.query("UPDATE auth.users SET password = $1 WHERE id = $2 RETURNING *;", [newPassword, id]);
    return result[0] || null;
}

export async function dbVerifyToken(token, userId) {
    const rows = await sql.query("SELECT * FROM auth.verification WHERE email = $1 LIMIT 1;", [email]);
    return rows[0] || null;
}