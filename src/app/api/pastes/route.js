import { NextResponse } from 'next/server';
import { pasteService } from '@/lib/pasteService';

export async function POST(req) {
    try {
        const body = await req.json();
        const { content, ttl_seconds, max_views } = body;

        // Validation
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Content must be a non-empty string' }, { status: 400 });
        }

        if (ttl_seconds !== undefined) {
            if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
                return NextResponse.json({ error: 'ttl_seconds must be an integer >= 1' }, { status: 400 });
            }
        }

        if (max_views !== undefined) {
            if (!Number.isInteger(max_views) || max_views < 1) {
                return NextResponse.json({ error: 'max_views must be an integer >= 1' }, { status: 400 });
            }
        }

        const id = await pasteService.createPaste(content, ttl_seconds, max_views);

        // Use the request's origin to construct the full URL
        const origin = new URL(req.url).origin;

        // We assume the frontend route is /p/:id
        return NextResponse.json({
            id,
            url: `${origin}/p/${id}`
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating paste:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
