import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getSubscriptionByUserId(userId) {
    const rows = await sql`SELECT * FROM subscriptions.subscriptions WHERE userid = ${userId} LIMIT 1;`;
    if (rows.length === 0) return null; 
    
    return rows[0];
}