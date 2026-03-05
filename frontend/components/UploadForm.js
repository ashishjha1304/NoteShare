import { useState } from "react";
import { uploadNote } from "../services/notesService";
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineX } from "react-icons/hi";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function UploadForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                toast.error("Only PDF files are allowed");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !subject || !file) {
            toast.error("Please fill all required fields and select a file");
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            toast.error("File size exceeds 200MB limit");
            return;
        }

        if (file.size < 2 * 1024) {
            toast.error("File size must be at least 2KB");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("subject", subject);
            formData.append("file", file);

            await uploadNote(formData);
            toast.success("Note uploaded successfully!");
            router.push("/notes");
        } catch (err) {
            toast.error(err.response?.data?.error || "Upload failed");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Title <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Algorithms"
                    className="w-full px-4 py-3 bg-white dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700/50 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the notes..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700/50 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                />
            </div>

            {/* Subject */}
            <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Subject <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-4 py-3 bg-white dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700/50 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                />
            </div>

            {/* File Upload */}
            <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    PDF File <span className="text-red-400">*</span>
                </label>
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragActive
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                        : file
                            ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/5"
                            : "border-surface-300 dark:border-surface-700/50 hover:border-surface-400 dark:hover:border-surface-600 bg-surface-50 dark:bg-surface-800/30"
                        }`}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                        <div className="flex items-center justify-center gap-3">
                            <HiOutlineDocumentText className="w-8 h-8 text-emerald-400" />
                            <div className="text-left">
                                <p className="text-surface-900 dark:text-white font-medium">{file.name}</p>
                                <p className="text-surface-600 dark:text-surface-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="ml-3 p-1 text-surface-600 dark:text-surface-400 hover:text-red-400 transition-colors"
                            >
                                <HiOutlineX className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <HiOutlineCloudUpload className="w-10 h-10 text-surface-600 dark:text-surface-400 dark:text-surface-500 mx-auto mb-3" />
                            <p className="text-surface-600 dark:text-surface-400 text-sm">
                                <span className="text-primary-400 font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-surface-600 dark:text-surface-400 dark:text-surface-500 text-xs mt-1">PDF files only (min 2KB, max 200MB)</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center justify-center gap-2"
            >
                {uploading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <HiOutlineCloudUpload className="w-5 h-5" />
                        Upload Notes
                    </>
                )}
            </button>
        </form>
    );
}
