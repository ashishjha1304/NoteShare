import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getNotesBySubject } from "@/services/notesService";
import NoteCard from "@/components/NoteCard";
import { HiOutlineArrowLeft, HiOutlineBookOpen } from "react-icons/hi";
import Link from "next/link";

export default function SubjectNotes() {
    const router = useRouter();
    const { subject } = router.query;
    const [notes, setNotes] = useState([]);
    const [subjectData, setSubjectData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (subject) {
            fetchNotes();
        }
    }, [subject]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const data = await getNotesBySubject(subject);
            setNotes(data.notes || []);
            setSubjectData(data.subject);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>{subject ? `${subject} Notes` : "Subject Notes"} — NoteShare</title>
                <meta name="description" content={`Browse study notes for ${subject}`} />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Back link */}
                <Link href="/notes" className="inline-flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:text-white text-sm mb-6 transition-colors">
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Back to all notes
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-3">
                        <HiOutlineBookOpen className="text-primary-400" />
                        {subject || "Subject"}
                    </h1>
                    <p className="text-surface-600 dark:text-surface-400 mt-2">{notes.length} notes available</p>
                </div>

                {/* Notes Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-20 bg-surface-900/30 rounded-2xl border border-surface-800/50">
                        <HiOutlineBookOpen className="w-12 h-12 text-surface-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-400">No notes found for this subject</h3>
                        <p className="text-surface-600 dark:text-surface-400 dark:text-surface-500 text-sm mt-1">Be the first to upload!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {notes.map((note, i) => (
                            <NoteCard key={note.id} note={note} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
