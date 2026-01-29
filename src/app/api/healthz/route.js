import { NextResponse } from 'next/server';

export async function GET() {
    // Simple health check
    // In a real app, we might check DB connection here
    return NextResponse.json({ ok: true });
}
