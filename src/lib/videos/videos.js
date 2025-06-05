import { getVideoInfoById, removeVideoInfo } from '@/lib/videos/db';
import { removeVideo } from '@/lib/videos/storage';

export function likeVideo(videoId) {

}

export async function deleteVideo(videoId) {
    try {
        // Remove video info from the database
        const { success: removeVideoInfoSuccess, message: removeVideoInfoMessage} = await removeVideoInfo(videoId);
        if (removeVideoInfoSuccess === false) return { success: false, message: removeVideoInfoMessage };

        // Remove video file from storage
        const { success: removeVideoSuccess, message: removeVideoMessage} = await removeVideo(videoId);
        if (removeVideoSuccess === false) return { success: false, message: removeVideoMessage };

        return { success: true, message: 'Video deleted successfully' };
    } catch (error) {
        console.error('Error deleting video:', error);
        return { success: false, message: 'Failed to delete video' };
    }
}