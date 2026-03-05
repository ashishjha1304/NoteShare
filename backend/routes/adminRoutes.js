const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../middleware/authMiddleware");
const { supabaseAdmin } = require("../config/supabaseClient");

// GET /admin/stats — Dashboard statistics
router.get("/stats", adminMiddleware, async (req, res) => {
    try {
        const { data: notes } = await supabaseAdmin.from("notes").select("id, downloads");
        const { data: users } = await supabaseAdmin.from("users").select("id");
        const { data: subjects } = await supabaseAdmin.from("subjects").select("id");
        const { data: comments } = await supabaseAdmin.from("comments").select("id");

        const totalDownloads = notes
            ? notes.reduce((sum, n) => sum + (n.downloads || 0), 0)
            : 0;

        return res.status(200).json({
            stats: {
                totalNotes: notes ? notes.length : 0,
                totalUsers: users ? users.length : 0,
                totalSubjects: subjects ? subjects.length : 0,
                totalComments: comments ? comments.length : 0,
                totalDownloads,
            },
        });
    } catch (err) {
        console.error("Admin stats error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /admin/users — Get all users
router.get("/users", adminMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ users: data });
    } catch (err) {
        console.error("Admin users error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /admin/notes — Get all notes for management
router.get("/notes", adminMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("notes")
            .select(`
        *,
        subjects(name),
        users!notes_uploaded_by_fkey(name, email)
      `)
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ notes: data });
    } catch (err) {
        console.error("Admin notes error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /admin/note/:id — Delete a note
router.delete("/note/:id", adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Get the note first to delete the file
        const { data: note } = await supabaseAdmin
            .from("notes")
            .select("file_url")
            .eq("id", id)
            .single();

        // Delete from database
        const { error } = await supabaseAdmin.from("notes").delete().eq("id", id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Try to delete from storage if it's a Supabase URL
        if (note && note.file_url && note.file_url.includes("notes-pdfs")) {
            try {
                const fileName = note.file_url.split("/").pop();
                await supabaseAdmin.storage.from("notes-pdfs").remove([fileName]);
            } catch (storageErr) {
                console.log("Storage cleanup error (non-critical):", storageErr);
            }
        }

        return res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        console.error("Admin delete note error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
