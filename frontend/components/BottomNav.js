import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlineHome, HiOutlineSearch, HiOutlinePlus, HiOutlineUser, HiOutlineFolderOpen } from "react-icons/hi";
import { isLoggedIn, isAdmin } from "../services/auth";
import { useEffect, useState } from "react";

export default function BottomNav() {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setLoggedIn(isLoggedIn());
        setAdmin(isAdmin());
    }, []);

    const navItems = [
        { label: "Home", icon: HiOutlineHome, href: "/", active: router.pathname === "/" },
        { label: "Browse", icon: HiOutlineFolderOpen, href: "/notes", active: router.pathname === "/notes" || router.pathname.startsWith("/notes/") },
        { label: "Upload", icon: HiOutlinePlus, href: "/upload", active: router.pathname === "/upload", primary: true },
        { label: "Search", icon: HiOutlineSearch, href: "#", active: false, search: true },
        { label: admin ? "Admin" : (loggedIn ? "Profile" : "Login"), icon: HiOutlineUser, href: admin ? "/admin" : (loggedIn ? "/upload" : "/login"), active: router.pathname === "/admin" || router.pathname === "/login" },
    ];

    const handleClick = (e, item) => {
        if (item.search) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) searchInput.focus();
            }, 300);
        }
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-xl border-t border-surface-200 dark:border-surface-800/50 pb-safe shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    if (item.primary) {
                        return (
                            <Link key={idx} href={item.href} className="relative -top-5">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 border-4 border-surface-50 dark:border-surface-950 transition-transform active:scale-90 touch-bounce ${item.active ? "scale-110" : ""}`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            onClick={(e) => handleClick(e, item)}
                            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all active:scale-95 ${item.active ? "text-primary-500 dark:text-primary-400 font-bold" : "text-surface-500 dark:text-surface-400 font-medium"}`}
                        >
                            <Icon className={`w-6 h-6 ${item.active ? "animate-pulse-subtle" : ""}`} />
                            <span className="text-[9px] uppercase tracking-tighter">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
