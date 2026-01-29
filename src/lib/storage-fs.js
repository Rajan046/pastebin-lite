import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'pastes.json');

async function getPastes() {
    try {
        await fs.access(DATA_FILE);
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

async function savePastes(pastes) {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify(pastes, null, 2));
    } catch (error) {
        console.error('Failed to save pastes:', error);
    }
}

export const fsStorage = {
    async createPaste(id, data) {
        const pastes = await getPastes();
        pastes[id] = {
            ...data,
            created_at: Date.now(),
            views_used: 0,
        };
        await savePastes(pastes);
        return id;
    },

    async getPaste(id) {
        const pastes = await getPastes();
        return pastes[id] || null;
    },

    async incrementViews(id) {
        const pastes = await getPastes();
        const paste = pastes[id];

        if (!paste) return null;

        paste.views_used = (paste.views_used || 0) + 1;
        pastes[id] = paste;

        await savePastes(pastes);
        return paste;
    },

    async deletePaste(id) {
        const pastes = await getPastes();
        if (pastes[id]) {
            delete pastes[id];
            await savePastes(pastes);
        }
    }
};
