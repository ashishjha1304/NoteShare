import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isLoggedIn, isAdmin, logout, getUser } from "../services/auth";
import { HiOutlineMenu, HiOutlineX, HiOutlineUpload, HiOutlineLogin, HiOutlineLogout, HiOutlineCog, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "next-themes";

export default function Navbar() {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setLoggedIn(isLoggedIn());
        setAdmin(isAdmin());
        setUser(getUser());

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        setAdmin(false);
        setUser(null);
        router.push("/");
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-surface-50/90 dark:bg-surface-950/90 backdrop-blur-xl shadow-lg shadow-primary-500/5 border-b border-surface-200 dark:border-surface-800/50"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                            N
                        </div>
                        <span className="font-display text-xl font-bold bg-gradient-to-r from-surface-800 to-surface-500 dark:from-white dark:to-surface-300 bg-clip-text text-transparent">
                            NoteShare
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/" active={router.pathname === "/"}>Home</NavLink>
                        <NavLink href="/notes" active={router.pathname === "/notes"}>Browse Notes</NavLink>
                        {loggedIn && (
                            <NavLink href="/upload" active={router.pathname === "/upload"}>
                                <HiOutlineUpload className="inline mr-1 -mt-0.5" />Upload
                            </NavLink>
                        )}
                        {admin && (
                            <NavLink href="/admin" active={router.pathname === "/admin"}>
                                <HiOutlineCog className="inline mr-1 -mt-0.5" />Admin
                            </NavLink>
                        )}
                    </div>

                    {/* Auth buttons & Theme */}
                    <div className="hidden md:flex items-center gap-3">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2.5 rounded-xl bg-surface-200/50 dark:bg-surface-800/60 hover:bg-surface-300 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400 border border-surface-300 dark:border-surface-700/50 transition-all mr-1"
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === "dark" || (!theme && window?.matchMedia('(prefers-color-scheme: dark)').matches) ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
                            </button>
                        )}
                        {loggedIn ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-surface-600 dark:text-surface-400">
                                    Hi, <span className="text-primary-400 font-medium">{user?.name || "User"}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 bg-surface-800/60 hover:bg-surface-700/80 rounded-xl border border-surface-700/50 transition-all hover:border-surface-300 dark:hover:border-surface-600"
                                >
                                    <HiOutlineLogout className="text-base" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:text-white transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu and Theme toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2.5 rounded-xl text-surface-600 dark:text-surface-400 bg-surface-200/50 dark:bg-surface-800/40 border border-surface-300 dark:border-surface-700/50 transition-colors active:scale-95"
                                aria-label="Toggle Theme"
                            >
                                {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
                            </button>
                        )}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:text-white p-2.5 rounded-xl bg-surface-200/50 dark:bg-surface-800/40 border border-surface-300 dark:border-surface-700/50 transition-colors active:scale-95"
                            aria-label="Toggle Menu"
                        >
                            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-surface-50/95 dark:bg-surface-950/95 backdrop-blur-xl border-t border-surface-200 dark:border-surface-800/50 animate-slide-down">
                    <div className="px-4 py-4 space-y-2">
                        <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
                        <MobileNavLink href="/notes" onClick={() => setMenuOpen(false)}>Browse Notes</MobileNavLink>
                        {loggedIn && <MobileNavLink href="/upload" onClick={() => setMenuOpen(false)}>Upload Notes</MobileNavLink>}
                        {admin && <MobileNavLink href="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</MobileNavLink>}
                        <div className="pt-2 border-t border-surface-200 dark:border-surface-800">
                            {loggedIn ? (
                                <button
                                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:text-white hover:bg-surface-800/60 rounded-xl transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:text-white bg-surface-800/40 rounded-xl transition-colors">
                                        Log in
                                    </Link>
                                    <Link href="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl font-semibold">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                ? "text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-500/10"
                : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200/50 dark:hover:bg-surface-800/50"
                }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block px-4 py-2.5 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:text-white hover:bg-surface-800/60 rounded-xl transition-colors"
        >
            {children}
        </Link>
    );
}
