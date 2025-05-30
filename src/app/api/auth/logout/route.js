import { NextResponse } from 'next/server';

export function GET(request) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('Submind.AuthToken', '', {
        maxAge: -1, 
    });
    return response;
}