import { useState, useEffect } from "react";
import Head from "next/head";
import { getAllNotes, getSubjects } from "@/services/notesService";
import NoteCard from "@/components/NoteCard";
import SearchBar from "@/components/SearchBar";
import { HiOutlineBookOpen, HiOutlineFilter, HiOutlineSortDescending } from "react-icons/hi";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [activeSubject, setActiveSubject] = useState("");
    const [activeSort, setActiveSort] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjects();
        fetchNotes();
    }, []);

    const fetchSubjects = async () => {
        try {
            const data = await getSubjects();
            setSubjects(data.subjects || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNotes = async (params = {}) => {
        setLoading(true);
        try {
            const data = await getAllNotes(params);
            setNotes(data.notes || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        fetchNotes({ search: query, subject: activeSubject, sort: activeSort });
    };

    const handleSubjectFilter = (subjectName) => {
        setActiveSubject(subjectName === activeSubject ? "" : subjectName);
        fetchNotes({ subject: subjectName === activeSubject ? "" : subjectName, sort: activeSort });
    };

    const handleSort = (sortType) => {
        setActiveSort(sortType === activeSort ? "" : sortType);
        fetchNotes({ subject: activeSubject, sort: sortType === activeSort ? "" : sortType });
    };

    return (
        <>
            <Head>
                <title>Browse Notes — NoteShare</title>
                <meta name="description" content="Browse and discover study notes by subject, popularity, or search keywords." />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-white flex items-center justify-center gap-3">
                        <HiOutlineBookOpen className="text-primary-400" />
                        Browse Notes
                    </h1>
                    <p className="text-surface-400 mt-2">Discover and download study materials</p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 mr-2">
                        <HiOutlineFilter className="text-surface-400 w-4 h-4" />
                        <span className="text-surface-400 text-sm font-medium">Filter:</span>
                    </div>
                    <button
                        onClick={() => handleSubjectFilter("")}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${!activeSubject
                                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                : "text-surface-400 bg-surface-800/40 border border-surface-700/30 hover:border-surface-600"
                            }`}
                    >
                        All
                    </button>
                    {subjects.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => handleSubjectFilter(s.name)}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${activeSubject === s.name
                                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                    : "text-surface-400 bg-surface-800/40 border border-surface-700/30 hover:border-surface-600"
                                }`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center gap-2 mr-2">
                        <HiOutlineSortDescending className="text-surface-400 w-4 h-4" />
                        <span className="text-surface-400 text-sm font-medium">Sort:</span>
                    </div>
                    <button
                        onClick={() => handleSort("downloads")}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${activeSort === "downloads"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "text-surface-400 bg-surface-800/40 border border-surface-700/30 hover:border-surface-600"
                            }`}
                    >
                        Most Downloads
                    </button>
                    <button
                        onClick={() => handleSort("rating")}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${activeSort === "rating"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "text-surface-400 bg-surface-800/40 border border-surface-700/30 hover:border-surface-600"
                            }`}
                    >
                        Highest Rated
                    </button>
                </div>

                {/* Notes Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                            <p className="text-surface-400 text-sm">Loading notes...</p>
                        </div>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-20 bg-surface-900/30 rounded-2xl border border-surface-800/50">
                        <HiOutlineBookOpen className="w-12 h-12 text-surface-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-surface-400">No notes found</h3>
                        <p className="text-surface-500 text-sm mt-1">Try adjusting your filters or search terms</p>
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
