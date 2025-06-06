export const dynamic = "force-dynamic";

import { validateAuthToken } from "@/lib/auth/user";
import { cookies } from 'next/headers'


export default async function Header() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('Submind.AuthToken');

    let loggedIn = false;
    
    const { success, userData } = await validateAuthToken(authToken);

    if (success == true) {
        loggedIn = true;
    }
    
    return (
        <header className="bg-white shadow sticky text-black top-0 left-0 right-0 z-50 flex flex-row justify-between p-4">
            <div className="flex flex-row gap-4">
                <a href="/" className="font-bold text-gray-800 hover:text-gray-600 transition-colors">
                    Home
                </a>

                {loggedIn && (userData?.role == "CREATOR" || userData?.role == "ADMIN") && (
                    <a href="/creator">
                        Creator Dashboard
                    </a>
                )}

                <a href="/subscriptions">
                    Subscriptions
                </a>
            </div>
            <div className="flex flex-row gap-4">                

                {!loggedIn && (
                    <>
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </>
                )}

                {loggedIn && (
                    <>
                        <a href={"/profile"} >
                            {userData?.username || "Profile"}
                        </a>
                        <a href="/logout">
                            Logout
                        </a>
                    </>
                )}
            </div>
        </header>
    )
}

