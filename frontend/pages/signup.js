import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signup, saveSession } from "@/services/auth";
import toast from "react-hot-toast";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const data = await signup(name, email, password);
            if (data.session) {
                saveSession(data.session, data.user);
                toast.success("Account created! Welcome to NoteShare!");
                router.push("/");
                setTimeout(() => window.location.reload(), 100);
            } else {
                toast.success("Account created! Please check your email to verify.");
                router.push("/login");
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Sign Up — NoteShare</title>
                <meta name="description" content="Create a NoteShare account to upload and share study notes." />
            </Head>

            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
                <div className="fixed top-1/4 right-1/4 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl" />
                <div className="fixed bottom-1/4 left-1/4 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />

                <div className="relative w-full max-w-md animate-scale-in">
                    <div className="glass rounded-3xl p-8 shadow-2xl shadow-primary-500/5">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-accent-500/30">
                                N
                            </div>
                            <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white">Create your account</h1>
                            <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">Join NoteShare and start learning</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-600 dark:text-surface-400 dark:text-surface-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-surface-800/60 border border-surface-700/50 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-600 dark:text-surface-400 dark:text-surface-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-surface-800/60 border border-surface-700/50 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Password</label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-600 dark:text-surface-400 dark:text-surface-500 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        required
                                        className="w-full pl-12 pr-12 py-3 bg-surface-800/60 border border-surface-700/50 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-600 dark:text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:text-surface-300 transition-colors"
                                    >
                                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-500 hover:to-primary-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-surface-600 dark:text-surface-400 dark:text-surface-500 text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
