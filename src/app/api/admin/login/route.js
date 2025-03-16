import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Admin credentials (in production, these should be in environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validate credentials
        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create a session token (username|timestamp)
        const sessionToken = Buffer.from(`${username}|${Date.now()}`).toString('base64');

        // Set the session cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('admin_session', sessionToken, {
            httpOnly: true,
            // Always set secure to false for http and true for https
            secure: request.headers.get('x-forwarded-proto') === 'https',
            sameSite: 'strict',
            path: '/',
            maxAge: 2 * 60 * 60 // 2 hours
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 