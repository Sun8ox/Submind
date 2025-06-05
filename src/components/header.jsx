export default function Header() {
    
    
    
    return (
        <header className="bg-white shadow sticky top-0 left-0 right-0 z-50 flex flex-row justify-between p-4">
            <div className="flex flex-row">
                <a href="/" className="font-bold text-gray-800 hover:text-gray-600 transition-colors">
                    SubMind
                </a>
            </div>
            <div className="flex flex-row gap-4">
                <a href="/login">Login</a>
                <a href="/logout">Logout</a>
                <a href="/register">Register</a>
                <a href="/changePassword">Change Password</a>
                <a href="/verify">Verify</a>
                <a href="/creator/upload">Upload</a>
            </div>
        </header>
    )
}