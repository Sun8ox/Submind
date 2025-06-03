import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getVideoInfoById(video_id) {
    const rows = await sql.query("SELECT * FROM videos.info WHERE id = $1 LIMIT 1", [video_id]);
    if (rows.length === 0) return null;

    return rows[0] || null;
}

export async function createVideoInfo(video_info) {
    const { name, description, author, subscription_type, video_url } = video_info;

    const rows = await sql.query("INSERT INTO videos.info (name, description, author, subscription) VALUES ($1, $2, $3, $4) RETURNING *", [name, description, author, subscription_type]);
    if (rows.length === 0) return null;

    return rows[0] || null;
}

export async function setVideoUrl(video_id, url) {
    const rows = await sql.query("UPDATE videos.info SET video_url = $1 WHERE id = $2 RETURNING *", [url, video_id]);
    if (rows.length === 0) return null;

    return rows[0] || null;
}

export async function getVideosBySubscription(subscriptionType, pageNumber = 1, pageSize = 10, publicity = "Public") {
    const offset = (pageNumber - 1) * pageSize;

    const rows = await sql.query("SELECT * FROM videos.info WHERE subscription = $1 AND publicity = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4", [subscriptionType, publicity, pageSize, offset]);
    
    return rows || [];
}