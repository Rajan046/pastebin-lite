import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { pasteService } from '@/lib/pasteService';

export default async function ViewPaste({ params }) {
    const { id } = await params;
    const headerList = await headers();

    const testMode = process.env.TEST_MODE === '1';
    const testTimeHeader = headerList.get('x-test-now-ms');

    let now = null;
    if (testMode && testTimeHeader) {
        const parsedTime = parseInt(testTimeHeader, 10);
        if (!isNaN(parsedTime)) {
            now = parsedTime;
        }
    }

    // Fetch paste using internal service logic
    // This will check TTL and increment View Count
    const paste = await pasteService.getPaste(id, now);

    if (!paste) {
        notFound();
    }

    if (paste.error) {
        return (
            <div className="min-h-screen p-8 max-w-2xl mx-auto font-[family-name:var(--font-geist-sans)]">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-red-600">Unavailable</h1>
                    <a href="/" className="text-blue-600 hover:underline text-sm">Create New</a>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                    <p className="font-medium">{paste.error}</p>
                    <p className="text-sm mt-2">This paste is no longer accessible.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 max-w-2xl mx-auto font-[family-name:var(--font-geist-sans)]">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Paste</h1>
                <a href="/" className="text-blue-600 hover:underline text-sm">Create New</a>
            </div>

            <div className="bg-gray-50 border rounded-lg p-6 dark:bg-zinc-900 dark:border-zinc-700">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                    {paste.content}
                </pre>
            </div>

            <div className="mt-6 text-sm text-gray-500">
                {paste.expires_at && (
                    <p>Expires: {new Date(paste.expires_at).toLocaleString()}</p>
                )}
                {paste.remaining_views !== null && (
                    <p>Remaining Views: {paste.remaining_views}</p>
                )}
            </div>
        </div>
    );
}
