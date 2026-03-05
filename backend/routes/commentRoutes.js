const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { supabaseAdmin } = require("../config/supabaseClient");

// POST /comments/add — Add a comment
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { note_id, comment_text } = req.body;
        const userId = req.user.id;

        if (!note_id || !comment_text) {
            return res.status(400).json({ error: "note_id and comment_text are required" });
        }

        const { data, error } = await supabaseAdmin
            .from("comments")
            .insert({
                note_id,
                user_id: userId,
                comment_text,
            })
            .select(`
        *,
        users(name, email)
      `)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ message: "Comment added", comment: data });
    } catch (err) {
        console.error("Add comment error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /comments/:noteId — Get comments for a note
router.get("/:noteId", async (req, res) => {
    try {
        const { noteId } = req.params;

        const { data, error } = await supabaseAdmin
            .from("comments")
            .select(`
        *,
        users(name, email)
      `)
            .eq("note_id", noteId)
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ comments: data });
    } catch (err) {
        console.error("Get comments error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
