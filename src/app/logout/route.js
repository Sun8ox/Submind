import { logout } from "@/lib/auth";

export function GET(request) {
    return logout(request);
}