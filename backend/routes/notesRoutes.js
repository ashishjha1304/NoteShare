const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
    getAllNotes,
    getNotesBySubject,
    getNoteDetails,
    uploadNote,
    downloadNote,
    rateNote,
    getSubjects,
} = require("../controllers/notesController");

// Multer setup (memory storage for Supabase upload)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    },
});

// GET /notes — Get all notes (with search/filter/sort)
router.get("/", getAllNotes);

// GET /notes/subjects — Get all subjects
router.get("/subjects", getSubjects);

// GET /notes/subject/:subject — Get notes by subject name
router.get("/subject/:subject", getNotesBySubject);

// GET /notes/details/:id — Get single note details
router.get("/details/:id", getNoteDetails);

// POST /notes/upload — Upload a note (auth required)
router.post("/upload", authMiddleware, upload.single("file"), uploadNote);

// GET /notes/download/:id — Track download
router.get("/download/:id", downloadNote);

// POST /notes/rate — Rate a note (auth required)
router.post("/rate", authMiddleware, rateNote);

module.exports = router;
