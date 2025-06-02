import { logout } from "@/lib/auth/auth";

export function GET(request) {
    return logout(request);
}