import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getNoteDetails, downloadNote, rateNote } from "@/services/notesService";
import { isLoggedIn } from "@/services/auth";
import RatingStars from "@/components/RatingStars";
import CommentSection from "@/components/CommentSection";
import toast from "react-hot-toast";
import {
    HiOutlineArrowLeft,
    HiOutlineDownload,
    HiOutlineBookOpen,
    HiOutlineClock,
    HiOutlineUserCircle,
    HiOutlineStar,
    HiOutlineDocumentText,
} from "react-icons/hi";

export default function NoteDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (id) fetchNote();
    }, [id]);

    const fetchNote = async () => {
        try {
            const data = await getNoteDetails(id);
            setNote(data.note);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const data = await downloadNote(id);
            // Open PDF in new tab
            window.open(data.file_url, "_blank");
            setNote((prev) => ({ ...prev, downloads: data.downloads }));
            toast.success("Download started!");
        } catch (err) {
            toast.error("Download failed");
        } finally {
            setDownloading(false);
        }
    };

    const handleRate = async (value) => {
        if (!isLoggedIn()) {
            toast.error("Please log in to rate");
            return;
        }
        try {
            const data = await rateNote(id, value);
            setNote((prev) => ({ ...prev, rating: data.average_rating }));
            toast.success("Rating submitted!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Rating failed");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white">Note not found</h2>
                <Link href="/notes" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
                    ← Back to notes
                </Link>
            </div>
        );
    }

    const date = new Date(note.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <>
            <Head>
                <title>{note.title} — NoteShare</title>
                <meta name="description" content={note.description} />
            </Head>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Back link */}
                <Link href="/notes" className="inline-flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:text-white text-sm mb-6 transition-colors">
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Back to notes
                </Link>

                {/* Note Header Card */}
                <div className="glass rounded-3xl p-6 sm:p-8 mb-8 animate-fade-in">
                    {/* Subject badge */}
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-lg bg-primary-500/15 text-primary-400 mb-4">
                        {note.subjects?.name || "General"}
                    </span>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white mb-4">
                        {note.title}
                    </h1>

                    {/* Description */}
                    <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-6">
                        {note.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-surface-600 dark:text-surface-400 mb-6 pb-6 border-b border-surface-800/50">
                        <span className="flex items-center gap-1.5">
                            <HiOutlineUserCircle className="w-4 h-4 text-primary-400" />
                            {note.users?.name || "Anonymous"}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <HiOutlineClock className="w-4 h-4" />
                            {date}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <HiOutlineDownload className="w-4 h-4" />
                            {note.downloads || 0} downloads
                        </span>
                        <span className="flex items-center gap-1.5">
                            <HiOutlineStar className="w-4 h-4 text-amber-400" />
                            {note.rating ? parseFloat(note.rating).toFixed(1) : "N/A"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Download button */}
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                        >
                            {downloading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <HiOutlineDownload className="w-5 h-5" />
                                    Download PDF
                                </>
                            )}
                        </button>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-surface-600 dark:text-surface-400">Rate this note:</span>
                            <RatingStars
                                currentRating={note.rating || 0}
                                onRate={handleRate}
                                interactive={isLoggedIn()}
                            />
                        </div>
                    </div>
                </div>

                {/* PDF Preview */}
                <div className="glass rounded-3xl p-6 sm:p-8 mb-8">
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                        <HiOutlineDocumentText className="text-primary-400" />
                        PDF Preview
                    </h2>
                    <div className="bg-surface-800/50 rounded-xl overflow-hidden" style={{ height: "500px" }}>
                        <iframe
                            src={note.file_url}
                            className="w-full h-full"
                            title={note.title}
                        />
                    </div>
                </div>

                {/* Comments */}
                <div className="glass rounded-3xl p-6 sm:p-8">
                    <CommentSection noteId={id} />
                </div>
            </div>
        </>
    );
}
