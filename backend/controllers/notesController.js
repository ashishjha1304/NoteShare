const { supabase, supabaseAdmin } = require("../config/supabaseClient");

// Get all notes (with optional search/filter)
const getAllNotes = async (req, res) => {
    try {
        const { search, subject, sort } = req.query;

        let query = supabaseAdmin
            .from("notes")
            .select(`
        *,
        subjects(name),
        users!notes_uploaded_by_fkey(name, email)
      `)
            .order("created_at", { ascending: false });

        // Filter by subject name
        if (subject) {
            const { data: subjectData } = await supabaseAdmin
                .from("subjects")
                .select("id")
                .eq("name", subject)
                .single();

            if (subjectData) {
                query = query.eq("subject_id", subjectData.id);
            }
        }

        // Search by title or description
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Sort options
        if (sort === "downloads") {
            query = query.order("downloads", { ascending: false });
        } else if (sort === "rating") {
            query = query.order("rating", { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ notes: data });
    } catch (err) {
        console.error("Get notes error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get notes by subject
const getNotesBySubject = async (req, res) => {
    try {
        const { subject } = req.params;

        // Find subject by name
        const { data: subjectData, error: subjectError } = await supabaseAdmin
            .from("subjects")
            .select("*")
            .ilike("name", `%${subject}%`)
            .single();

        if (subjectError || !subjectData) {
            return res.status(404).json({ error: "Subject not found" });
        }

        const { data: notes, error } = await supabaseAdmin
            .from("notes")
            .select(`
        *,
        subjects(name),
        users!notes_uploaded_by_fkey(name, email)
      `)
            .eq("subject_id", subjectData.id)
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ subject: subjectData, notes });
    } catch (err) {
        console.error("Get notes by subject error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get note details by ID
const getNoteDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from("notes")
            .select(`
        *,
        subjects(name),
        users!notes_uploaded_by_fkey(name, email)
      `)
            .eq("id", id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: "Note not found" });
        }

        return res.status(200).json({ note: data });
    } catch (err) {
        console.error("Get note details error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Upload a note
const uploadNote = async (req, res) => {
    try {
        const { title, description, subject } = req.body;
        const file = req.file;
        const userId = req.user.id;

        if (!title || !subject || !file) {
            return res.status(400).json({ error: "Title, subject and file are required" });
        }

        if (file.size < 2 * 1024) {
            return res.status(400).json({ error: "File size must be at least 2KB" });
        }

        // Find or create subject
        let subject_id;
        const { data: existingSubject } = await supabaseAdmin
            .from("subjects")
            .select("id")
            .ilike("name", subject)
            .single();

        if (existingSubject) {
            subject_id = existingSubject.id;
        } else {
            const { data: newSubject, error: subjectError } = await supabaseAdmin
                .from("subjects")
                .insert({ name: subject })
                .select()
                .single();

            if (subjectError) {
                return res.status(500).json({ error: "Failed to create subject" });
            }
            subject_id = newSubject.id;
        }

        // Upload file to Supabase Storage
        const fileName = `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from("notes-pdfs")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (uploadError) {
            return res.status(500).json({ error: "File upload failed: " + uploadError.message });
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from("notes-pdfs")
            .getPublicUrl(fileName);

        // Insert note record
        const { data, error } = await supabaseAdmin.from("notes").insert({
            title,
            description: description || "",
            subject_id,
            file_url: urlData.publicUrl,
            uploaded_by: userId,
        }).select().single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ message: "Note uploaded successfully", note: data });
    } catch (err) {
        console.error("Upload note error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Download note (increment counter)
const downloadNote = async (req, res) => {
    try {
        const { id } = req.params;

        // Get current note
        const { data: note, error: fetchError } = await supabaseAdmin
            .from("notes")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !note) {
            return res.status(404).json({ error: "Note not found" });
        }

        // Increment download count
        await supabaseAdmin
            .from("notes")
            .update({ downloads: (note.downloads || 0) + 1 })
            .eq("id", id);

        return res.status(200).json({
            message: "Download tracked",
            file_url: note.file_url,
            downloads: (note.downloads || 0) + 1,
        });
    } catch (err) {
        console.error("Download error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Rate a note
const rateNote = async (req, res) => {
    try {
        const { note_id, rating_value } = req.body;
        const userId = req.user.id;

        if (!note_id || !rating_value || rating_value < 1 || rating_value > 5) {
            return res.status(400).json({ error: "Valid note_id and rating (1-5) are required" });
        }

        // Upsert rating
        const { error: ratingError } = await supabaseAdmin.from("ratings").upsert(
            {
                note_id,
                user_id: userId,
                rating_value,
            },
            { onConflict: "note_id,user_id" }
        );

        if (ratingError) {
            return res.status(500).json({ error: ratingError.message });
        }

        // Recalculate average rating
        const { data: ratings } = await supabaseAdmin
            .from("ratings")
            .select("rating_value")
            .eq("note_id", note_id);

        const avgRating =
            ratings.reduce((sum, r) => sum + r.rating_value, 0) / ratings.length;

        // Update note rating
        await supabaseAdmin
            .from("notes")
            .update({ rating: parseFloat(avgRating.toFixed(2)) })
            .eq("id", note_id);

        return res.status(200).json({
            message: "Rating submitted",
            average_rating: parseFloat(avgRating.toFixed(2)),
        });
    } catch (err) {
        console.error("Rate note error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get all subjects
const getSubjects = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("subjects")
            .select("*")
            .order("name");

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ subjects: data });
    } catch (err) {
        console.error("Get subjects error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllNotes,
    getNotesBySubject,
    getNoteDetails,
    uploadNote,
    downloadNote,
    rateNote,
    getSubjects,
};
