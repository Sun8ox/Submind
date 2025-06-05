import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY,
  },
});

// For downloading/viewing videos
export async function getSignedVideoUrl(videoId, expiresIn = 5*60*60) {

  const command = new GetObjectCommand({
    Bucket: process.env.OBJECT_STORAGE_BUCKET_NAME,
    Key: "video-" + videoId,
  });

  return await getSignedUrl(S3, command, { expiresIn });
}

// For uploading videos
export async function getPresignedVideoUrl(videoId, contentType, expiresIn = 5*60*60) {

  const command = new PutObjectCommand({
    Bucket: process.env.OBJECT_STORAGE_BUCKET_NAME,
    Key: "video-" + videoId,
    ContentType: contentType,
  });

  return await getSignedUrl(S3, command, { expiresIn: expiresIn });
}

export async function removeVideo(videoId) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.OBJECT_STORAGE_BUCKET_NAME,
      Key: "video-" + videoId,
    });

    await S3.send(command);
    return { success: true, message: 'Video deleted successfully' };
  } catch (error) {
    console.error('Error deleting video:', error);
    return { success: false, message: 'Failed to delete video' };
  }
}