import { storage } from './storage';
import { nanoid } from 'nanoid';

export const pasteService = {
    async createPaste(content, ttl_seconds, max_views) {
        const id = nanoid(10);

        let expires_at = null;
        if (ttl_seconds) {
            expires_at = Date.now() + (ttl_seconds * 1000);
        }

        const pasteData = {
            content,
            ttl_seconds: ttl_seconds || null,
            max_views: max_views || null,
            expires_at,
            created_at: Date.now()
        };

        await storage.createPaste(id, pasteData);
        return id;
    },

    async getPaste(id, simulatedNow = null) {
        const paste = await storage.getPaste(id);
        if (!paste) return null;

        const now = simulatedNow !== null ? simulatedNow : Date.now();

        // Check TTL
        if (paste.expires_at !== null) {
            if (now > paste.expires_at) {
                return { error: 'Paste expired' }; // Or null
            }
        }

        // Check Max Views
        if (paste.max_views !== null) {
            if ((paste.views_used || 0) >= paste.max_views) {
                return { error: 'View limit exceeded' };
            }
        }

        // Increment Views
        // We increment here. 
        // NOTE: This changes state. 
        await storage.incrementViews(id);

        // Calculate remaining (after increment)
        const viewsUsed = (paste.views_used || 0) + 1;
        let remaining_views = null;
        if (paste.max_views !== null) {
            remaining_views = Math.max(0, paste.max_views - viewsUsed);
        }

        return {
            content: paste.content,
            remaining_views,
            expires_at: paste.expires_at
        };
    }
};
