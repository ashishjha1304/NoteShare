import api from "./api";

export const getAllNotes = async (params = {}) => {
    const res = await api.get("/notes", { params });
    return res.data;
};

export const getNotesBySubject = async (subject) => {
    const res = await api.get(`/notes/subject/${encodeURIComponent(subject)}`);
    return res.data;
};

export const getNoteDetails = async (id) => {
    const res = await api.get(`/notes/details/${id}`);
    return res.data;
};

export const uploadNote = async (formData) => {
    const res = await api.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const downloadNote = async (id) => {
    const res = await api.get(`/notes/download/${id}`);
    return res.data;
};

export const rateNote = async (note_id, rating_value) => {
    const res = await api.post("/notes/rate", { note_id, rating_value });
    return res.data;
};

export const getSubjects = async () => {
    const res = await api.get("/notes/subjects");
    return res.data;
};

export const getComments = async (noteId) => {
    const res = await api.get(`/comments/${noteId}`);
    return res.data;
};

export const addComment = async (note_id, comment_text) => {
    const res = await api.post("/comments/add", { note_id, comment_text });
    return res.data;
};

// Admin
export const getAdminStats = async () => {
    const res = await api.get("/admin/stats");
    return res.data;
};

export const getAdminUsers = async () => {
    const res = await api.get("/admin/users");
    return res.data;
};

export const getAdminNotes = async () => {
    const res = await api.get("/admin/notes");
    return res.data;
};

export const deleteNote = async (id) => {
    const res = await api.delete(`/admin/note/${id}`);
    return res.data;
};
