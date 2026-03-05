import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { login, saveSession } from "@/services/auth";
import toast from "react-hot-toast";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login(email, password);
            saveSession(data.session, data.user);
            toast.success("Welcome back!");
            router.push("/");
            // Force reload to update navbar
            setTimeout(() => window.location.reload(), 100);
        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login — NoteShare</title>
                <meta name="description" content="Log in to NoteShare to upload and download study notes." />
            </Head>

            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
                {/* Background effects */}
                <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
                <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl" />

                <div className="relative w-full max-w-md animate-scale-in">
                    {/* Card */}
                    <div className="glass rounded-3xl p-8 shadow-2xl shadow-primary-500/5">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/30">
                                N
                            </div>
                            <h1 className="text-2xl font-display font-bold text-white">Welcome back</h1>
                            <p className="text-surface-400 text-sm mt-1">Log in to your NoteShare account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-2">Email</label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-surface-800/60 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-300 mb-2">Password</label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-12 py-3 bg-surface-800/60 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                                    >
                                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-6 text-center">
                            <p className="text-surface-500 text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
