import VideoPlayer from "@/components/VideoPlayer";

export default async function PlayerPage({params}) {
  const { videoId } = await params;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <VideoPlayer videoId={videoId} />
    </div>
  );
}