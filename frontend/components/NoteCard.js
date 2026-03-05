import Link from "next/link";
import { HiOutlineDownload, HiOutlineStar, HiOutlineBookOpen, HiOutlineClock } from "react-icons/hi";

export default function NoteCard({ note, index = 0 }) {
    const subjectName = note.subjects?.name || "General";
    const uploaderName = note.users?.name || "Anonymous";
    const rating = note.rating ? parseFloat(note.rating).toFixed(1) : "N/A";
    const date = new Date(note.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // Subject color mapping
    const colorMap = {
        "Computer Science": { bg: "from-blue-500/10 to-blue-600/5", border: "border-blue-500/20", badge: "bg-blue-500/15 text-blue-400", icon: "text-blue-400" },
        "Database Management System": { bg: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/20", badge: "bg-emerald-500/15 text-emerald-400", icon: "text-emerald-400" },
        "Python Programming": { bg: "from-amber-500/10 to-amber-600/5", border: "border-amber-500/20", badge: "bg-amber-500/15 text-amber-400", icon: "text-amber-400" },
        "Web Development": { bg: "from-violet-500/10 to-violet-600/5", border: "border-violet-500/20", badge: "bg-violet-500/15 text-violet-400", icon: "text-violet-400" },
        "Data Structures": { bg: "from-rose-500/10 to-rose-600/5", border: "border-rose-500/20", badge: "bg-rose-500/15 text-rose-400", icon: "text-rose-400" },
    };

    const colors = colorMap[subjectName] || { bg: "from-primary-500/10 to-primary-600/5", border: "border-primary-500/20", badge: "bg-primary-500/15 text-primary-400", icon: "text-primary-400" };

    return (
        <Link href={`/note/${note.id}`}>
            <div
                className={`group relative bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-5 hover:border-primary-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
            >
                {/* Subject Badge */}
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${colors.badge}`}>
                        {subjectName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                        <HiOutlineStar className="w-4 h-4 fill-amber-400" />
                        <span className="text-sm font-semibold">{rating}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
                    {note.title}
                </h3>

                {/* Description */}
                <p className="text-surface-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {note.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-surface-500">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <HiOutlineBookOpen className={`w-3.5 h-3.5 ${colors.icon}`} />
                            {uploaderName}
                        </span>
                        <span className="flex items-center gap-1">
                            <HiOutlineClock className="w-3.5 h-3.5" />
                            {date}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 font-medium">
                        <HiOutlineDownload className="w-3.5 h-3.5" />
                        {note.downloads || 0}
                    </span>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-500 pointer-events-none" />
            </div>
        </Link>
    );
}
