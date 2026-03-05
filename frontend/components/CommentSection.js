import { useState, useEffect } from "react";
import Link from "next/link";
import { getComments, addComment } from "../services/notesService";
import { isLoggedIn } from "../services/auth";
import { HiOutlineChat, HiOutlinePaperAirplane, HiOutlineUserCircle } from "react-icons/hi";
import toast from "react-hot-toast";

export default function CommentSection({ noteId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const loggedIn = isLoggedIn();

    useEffect(() => {
        fetchComments();
    }, [noteId]);

    const fetchComments = async () => {
        try {
            const data = await getComments(noteId);
            setComments(data.comments || []);
        } catch (err) {
            console.error("Failed to load comments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const data = await addComment(noteId, newComment.trim());
            setComments([data.comment, ...comments]);
            setNewComment("");
            toast.success("Comment added!");
        } catch (err) {
            toast.error("Failed to add comment");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <HiOutlineChat className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Add comment form */}
            {loggedIn ? (
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-3 bg-surface-800/60 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
                    >
                        <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
                        {submitting ? "Posting..." : "Post"}
                    </button>
                </form>
            ) : (
                <p className="text-surface-500 text-sm bg-surface-800/40 rounded-xl p-4 border border-surface-700/30">
                    Please <Link href="/login" className="text-primary-400 hover:text-primary-300 underline">log in</Link> to leave a comment.
                </p>
            )}

            {/* Comments list */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-surface-500 text-sm text-center py-8">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-4 animate-fade-in"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <HiOutlineUserCircle className="w-5 h-5 text-primary-400" />
                                <span className="text-sm font-medium text-white">
                                    {comment.users?.name || "User"}
                                </span>
                                <span className="text-xs text-surface-500">
                                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <p className="text-surface-300 text-sm leading-relaxed pl-7">
                                {comment.comment_text}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
