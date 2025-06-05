import { validateAuthToken } from "@/lib/auth/user";
import { cookies } from 'next/headers'


export default async function Header() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('Submind.AuthToken');

    let loggedIn = false;
    let production = process.env.NODE_ENV === 'production';
    
    const { success, userId, userData, message } = await validateAuthToken(authToken);

    if (success == true) {
        loggedIn = true;
    }
    
    return (
        <header className="bg-white shadow sticky top-0 left-0 right-0 z-50 flex flex-row justify-between p-4">
            <div className="flex flex-row">
                <a href="/" className="font-bold text-gray-800 hover:text-gray-600 transition-colors">
                    SubMind
                </a>
            </div>
            <div className="flex flex-row gap-4">                
                {!production && (
                    <>
                        <a href="/changePassword">Change Password</a>
                        <a href="/verify">Verify</a>
                    </>
                )}

                {!loggedIn && (
                    <>
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </>
                )}

                {loggedIn && (userData?.role == "CREATOR" || userData?.role == "ADMIN") && (
                    <a href="/creator">
                        Creator Dashboard
                    </a>
                )}

                {loggedIn && (
                    <>
                        <a href={"/user/" + userId} >
                            {userData?.username || "Profile"}
                        </a>
                        <a href="/logout">Logout</a>
                    </>
                )}
            </div>
        </header>
    )
}

