const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use("/comments", commentRoutes);
app.use("/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "NoteShare API is running",
        version: "1.0.0",
        endpoints: {
            auth: "/auth/signup, /auth/login",
            notes: "/notes, /notes/subjects, /notes/subject/:subject, /notes/details/:id, /notes/upload, /notes/download/:id, /notes/rate",
            comments: "/comments/add, /comments/:noteId",
            admin: "/admin/stats, /admin/users, /admin/notes, /admin/note/:id",
        },
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
    console.log(`🚀 NoteShare API server running on port ${PORT}`);
});
