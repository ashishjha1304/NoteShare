import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { isAdmin } from "@/services/auth";
import { getAdminStats, getAdminNotes, getAdminUsers, deleteNote } from "@/services/notesService";
import toast from "react-hot-toast";
import {
    HiOutlineBookOpen,
    HiOutlineUserGroup,
    HiOutlineDownload,
    HiOutlineChatAlt2,
    HiOutlineTrash,
    HiOutlineAcademicCap,
    HiOutlineShieldCheck,
    HiOutlineStar,
} from "react-icons/hi";

export default function Admin() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [notes, setNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin()) {
            router.push("/");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsData, notesData, usersData] = await Promise.all([
                getAdminStats(),
                getAdminNotes(),
                getAdminUsers(),
            ]);
            setStats(statsData.stats);
            setNotes(notesData.notes || []);
            setUsers(usersData.users || []);
        } catch (err) {
            console.error("Admin data fetch failed:", err);
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            await deleteNote(noteId);
            setNotes(notes.filter((n) => n.id !== noteId));
            toast.success("Note deleted");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Admin Panel — NoteShare</title>
                <meta name="description" content="NoteShare admin dashboard" />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                            <HiOutlineShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white">Admin Panel</h1>
                    </div>
                    <p className="text-surface-400">Manage notes, users, and view platform statistics</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-surface-900/60 rounded-xl p-1 border border-surface-800/50 w-fit">
                    {["overview", "notes", "users"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab
                                    ? "bg-primary-500/20 text-primary-400 shadow-sm"
                                    : "text-surface-400 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && stats && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatsCard
                                icon={<HiOutlineBookOpen className="w-6 h-6" />}
                                label="Total Notes"
                                value={stats.totalNotes}
                                color="from-blue-500 to-cyan-500"
                            />
                            <StatsCard
                                icon={<HiOutlineUserGroup className="w-6 h-6" />}
                                label="Total Users"
                                value={stats.totalUsers}
                                color="from-emerald-500 to-teal-500"
                            />
                            <StatsCard
                                icon={<HiOutlineDownload className="w-6 h-6" />}
                                label="Total Downloads"
                                value={stats.totalDownloads}
                                color="from-amber-500 to-orange-500"
                            />
                            <StatsCard
                                icon={<HiOutlineChatAlt2 className="w-6 h-6" />}
                                label="Total Comments"
                                value={stats.totalComments}
                                color="from-violet-500 to-purple-500"
                            />
                        </div>

                        {/* Quick info */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Platform Overview</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between py-2 border-b border-surface-800/50">
                                    <span className="text-surface-400">Subjects Available</span>
                                    <span className="text-white font-medium">{stats.totalSubjects}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-surface-800/50">
                                    <span className="text-surface-400">Avg Downloads/Note</span>
                                    <span className="text-white font-medium">
                                        {stats.totalNotes > 0 ? Math.round(stats.totalDownloads / stats.totalNotes) : 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === "notes" && (
                    <div className="animate-fade-in">
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-surface-800/50">
                                            <th className="text-left py-4 px-6 text-surface-400 font-medium">Title</th>
                                            <th className="text-left py-4 px-4 text-surface-400 font-medium">Subject</th>
                                            <th className="text-left py-4 px-4 text-surface-400 font-medium">Uploader</th>
                                            <th className="text-center py-4 px-4 text-surface-400 font-medium">Downloads</th>
                                            <th className="text-center py-4 px-4 text-surface-400 font-medium">Rating</th>
                                            <th className="text-center py-4 px-4 text-surface-400 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notes.map((note) => (
                                            <tr key={note.id} className="border-b border-surface-800/30 hover:bg-surface-800/20 transition-colors">
                                                <td className="py-3 px-6 text-white font-medium max-w-[200px] truncate">
                                                    {note.title}
                                                </td>
                                                <td className="py-3 px-4 text-surface-400">{note.subjects?.name}</td>
                                                <td className="py-3 px-4 text-surface-400">{note.users?.name}</td>
                                                <td className="py-3 px-4 text-center text-surface-300">{note.downloads}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="flex items-center justify-center gap-1">
                                                        <HiOutlineStar className="w-3.5 h-3.5 text-amber-400" />
                                                        <span className="text-surface-300">{note.rating ? parseFloat(note.rating).toFixed(1) : '-'}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => handleDeleteNote(note.id)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Delete note"
                                                    >
                                                        <HiOutlineTrash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="animate-fade-in">
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-surface-800/50">
                                            <th className="text-left py-4 px-6 text-surface-400 font-medium">Name</th>
                                            <th className="text-left py-4 px-4 text-surface-400 font-medium">Email</th>
                                            <th className="text-left py-4 px-4 text-surface-400 font-medium">Role</th>
                                            <th className="text-left py-4 px-4 text-surface-400 font-medium">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-surface-800/30 hover:bg-surface-800/20 transition-colors">
                                                <td className="py-3 px-6 text-white font-medium">{user.name}</td>
                                                <td className="py-3 px-4 text-surface-400">{user.email}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${user.role === "admin"
                                                            ? "bg-amber-500/15 text-amber-400"
                                                            : "bg-primary-500/15 text-primary-400"
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-surface-400">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function StatsCard({ icon, label, value, color }) {
    return (
        <div className="glass rounded-2xl p-6 group hover:border-primary-500/20 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {icon}
            </div>
            <p className="text-surface-400 text-sm mb-1">{label}</p>
            <p className="text-3xl font-display font-bold text-white">{value}</p>
        </div>
    );
}
