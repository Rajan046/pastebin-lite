import { NextResponse } from 'next/server';
import { pasteService } from '@/lib/pasteService';

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        // Determine "Now"
        // Check headers for test mode
        const testMode = process.env.TEST_MODE === '1';
        const testTimeHeader = req.headers.get('x-test-now-ms');

        let now = null;
        if (testMode && testTimeHeader) {
            const parsedTime = parseInt(testTimeHeader, 10);
            if (!isNaN(parsedTime)) {
                now = parsedTime;
            }
        }

        // Use service Logic
        const result = await pasteService.getPaste(id, now);

        if (!result) {
            return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
        }

        if (result.error) {
            // "Unavailable pastes consistently return HTTP 404"
            return NextResponse.json({ error: result.error }, { status: 404 });
        }

        return NextResponse.json({
            content: result.content,
            remaining_views: result.remaining_views,
            expires_at: result.expires_at ? new Date(result.expires_at).toISOString() : null
        });

    } catch (error) {
        console.error('Error fetching paste:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
