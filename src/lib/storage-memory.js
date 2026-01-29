// In-memory storage for local development
// WARNING: Data is lost when the server restarts.

const pastes = new Map();

export const memoryStorage = {
  async createPaste(id, data) {
    pastes.set(id, {
      ...data,
      created_at: Date.now(),
      views_used: 0,
    });
    return id;
  },

  async getPaste(id) {
    return pastes.get(id) || null;
  },

  async incrementViews(id) {
    const paste = pastes.get(id);
    if (!paste) return null;
    paste.views_used = (paste.views_used || 0) + 1;
    pastes.set(id, paste);
    return paste;
  },
  
  async deletePaste(id) {
    pastes.delete(id);
  }
};
