'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [createdUrl, setCreatedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCreatedUrl(null);
    setLoading(true);

    try {
      const payload = {
        content: content,
        ttl_seconds: ttl ? parseInt(ttl) : undefined,
        max_views: maxViews ? parseInt(maxViews) : undefined
      };

      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create paste');
      }

      setCreatedUrl(data.url);
      setContent(''); // Clear functionality optional
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold mb-6">Pastebin Lite</h1>

      {createdUrl && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Your paste is ready:</span>
          <br />
          <a href={createdUrl} className="underline font-bold break-all">{createdUrl}</a>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-48 bg-white text-black dark:bg-zinc-800 dark:text-white"
            placeholder="Enter your text here..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">TTL (Seconds)</label>
            <input
              type="number"
              min="1"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              className="w-full p-2 border rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
              placeholder="Optional (e.g. 60)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Views</label>
            <input
              type="number"
              min="1"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              className="w-full p-2 border rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
              placeholder="Optional (e.g. 5)"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
        >
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>
    </div>
  );
}
