export default async function CreatorPage(){
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10">
            <h1 className="text-3xl font-bold text-indigo-800 mb-6">Creator Dashboard</h1>
            <p className="text-lg text-gray-700 mb-4">Welcome to your creator dashboard!</p>
            <div className="w-full max-w-4xl bg-white rounded-xl shadow p-6">
                <a href="/creator/videos"
                   className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                    Manage Your Videos
                </a>
                <a href="/creator/upload"
                   className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                    Upload New Video
                </a>
                <a href="/creator/settings"
                   className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                    Account Settings
                </a>
            </div>
        </div>
    );
}