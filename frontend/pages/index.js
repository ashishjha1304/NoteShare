import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import NoteCard from "@/components/NoteCard";
import { getAllNotes, getSubjects } from "@/services/notesService";
import {
    HiOutlineBookOpen,
    HiOutlineDownload,
    HiOutlineStar,
    HiOutlineAcademicCap,
    HiOutlineArrowRight,
    HiOutlineSparkles,
    HiOutlineUserGroup,
    HiOutlineLightningBolt,
} from "react-icons/hi";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [notesData, subjectsData] = await Promise.all([
                getAllNotes(),
                getSubjects(),
            ]);
            setNotes(notesData.notes || []);
            setSubjects(subjectsData.subjects || []);
        } catch (err) {
            console.error("Failed to load data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }
        try {
            const data = await getAllNotes({ search: query });
            setSearchResults(data.notes || []);
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    const latestNotes = notes.slice(0, 6);
    const topDownloadedNotes = [...notes]
        .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        .slice(0, 4);

    // Subject icon/color mapping
    const subjectMeta = {
        "Computer Science": { icon: "💻", gradient: "from-blue-500 to-cyan-500" },
        "Database Management System": { icon: "🗄️", gradient: "from-emerald-500 to-teal-500" },
        "Python Programming": { icon: "🐍", gradient: "from-amber-500 to-yellow-500" },
        "Web Development": { icon: "🌐", gradient: "from-violet-500 to-purple-500" },
        "Data Structures": { icon: "🏗️", gradient: "from-rose-500 to-pink-500" },
    };

    return (
        <>
            <Head>
                <title>NoteShare — Share & Discover Study Notes</title>
                <meta name="description" content="A collaborative platform for students to share, discover, and download study notes. Browse by subject, upload PDFs, rate and review." />
            </Head>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-100/50 dark:from-primary-950/50 via-surface-50 dark:via-surface-950 to-surface-50 dark:to-surface-950" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent-500/20 dark:bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-gradient-to-t from-surface-50 dark:from-surface-950 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 animate-fade-in">
                            <HiOutlineSparkles className="w-4 h-4" />
                            Free study notes for everyone
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 animate-slide-up">
                            Share & Discover{" "}
                            <span className="text-gradient">Study Notes</span>{" "}
                            with Students
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
                            Upload, browse, and download quality study materials. Join thousands of students helping each other learn better.
                        </p>

                        {/* Search */}
                        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                            <SearchBar onSearch={handleSearch} />
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: "400ms" }}>
                            <StatBadge icon={<HiOutlineBookOpen />} value={notes.length} label="Notes shared" />
                            <StatBadge icon={<HiOutlineUserGroup />} value="100+" label="Active students" />
                            <StatBadge icon={<HiOutlineAcademicCap />} value={subjects.length} label="Subjects" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Results */}
            {searchResults !== null && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-6">
                        Search Results ({searchResults.length})
                    </h2>
                    {searchResults.length === 0 ? (
                        <div className="text-center py-12 bg-surface-100/50 dark:bg-surface-900/50 rounded-2xl border border-surface-300/50 dark:border-surface-800/50">
                            <p className="text-surface-600 dark:text-surface-400">No notes found. Try a different search term.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {searchResults.map((note, i) => (
                                <NoteCard key={note.id} note={note} index={i} />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Browse Subjects */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">Browse by Subject</h2>
                        <p className="text-surface-600 dark:text-surface-400 mt-1">Explore notes organized by topic</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject, i) => {
                        const meta = subjectMeta[subject.name] || { icon: "📚", gradient: "from-surface-600 to-surface-500" };
                        const noteCount = notes.filter((n) => n.subject_id === subject.id).length;

                        return (
                            <Link key={subject.id} href={`/notes/${encodeURIComponent(subject.name)}`}>
                                <div
                                    className="group relative overflow-hidden rounded-2xl p-6 bg-surface-100/60 dark:bg-surface-900/60 border border-surface-300/50 dark:border-surface-800/50 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 cursor-pointer animate-fade-in"
                                    style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${meta.gradient} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity`} />

                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                                            {meta.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-surface-900 dark:text-white font-semibold group-hover:text-primary-300 transition-colors">
                                                {subject.name}
                                            </h3>
                                            <p className="text-surface-600 dark:text-surface-400 dark:text-surface-500 text-sm">{noteCount} notes</p>
                                        </div>
                                        <HiOutlineArrowRight className="w-5 h-5 text-surface-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Latest Notes */}
            {!loading && latestNotes.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">Latest Notes</h2>
                            <p className="text-surface-600 dark:text-surface-400 mt-1">Recently uploaded study materials</p>
                        </div>
                        <Link
                            href="/notes"
                            className="hidden sm:flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                        >
                            View all <HiOutlineArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {latestNotes.map((note, i) => (
                            <NoteCard key={note.id} note={note} index={i} />
                        ))}
                    </div>
                </section>
            )}

            {/* Top Downloaded */}
            {!loading && topDownloadedNotes.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                            <HiOutlineLightningBolt className="text-amber-400" />
                            Most Popular
                        </h2>
                        <p className="text-surface-600 dark:text-surface-400 mt-1">Top downloaded notes by students</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {topDownloadedNotes.map((note, i) => (
                            <NoteCard key={note.id} note={note} index={i} />
                        ))}
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 dark:from-primary-950/50 to-accent-100/50 dark:to-accent-950/50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">
                        Ready to share your notes?
                    </h2>
                    <p className="text-surface-600 dark:text-surface-400 text-lg mb-8 max-w-xl mx-auto">
                        Help fellow students by uploading your study materials. Together we learn better.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/signup"
                            className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="/notes"
                            className="px-8 py-3.5 bg-surface-200/60 dark:bg-surface-800/60 hover:bg-surface-300/60 dark:hover:bg-surface-700/80 text-surface-900 dark:text-white font-medium rounded-xl border border-surface-300/50 dark:border-surface-700/50 hover:border-surface-400/50 dark:hover:border-surface-600 transition-all"
                        >
                            Browse Notes
                        </Link>
                    </div>
                </div>
            </section>

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-surface-50/80 dark:bg-surface-950/80 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                        <p className="text-surface-600 dark:text-surface-400 text-sm">Loading notes...</p>
                    </div>
                </div>
            )}
        </>
    );
}

function StatBadge({ icon, value, label }) {
    return (
        <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
            <span className="text-primary-400">{icon}</span>
            <span className="font-bold text-surface-900 dark:text-white">{value}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
}
