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
        { label: "Search", icon: HiOutlineSearch, href: "/", active: false, scroll: true }, // Logic for search can be improved
        { label: admin ? "Admin" : "Profile", icon: HiOutlineUser, href: admin ? "/admin" : (loggedIn ? "/" : "/login"), active: router.pathname === "/admin" || router.pathname === "/login" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-xl border-t border-surface-200 dark:border-surface-800/50 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    if (item.primary) {
                        return (
                            <Link key={idx} href={item.href} className="relative -top-5">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 border-4 border-surface-50 dark:border-surface-950 transition-transform active:scale-90 ${item.active ? "scale-110" : ""}`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            onClick={() => {
                                if (item.scroll) {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${item.active ? "text-primary-500 dark:text-primary-400" : "text-surface-500 dark:text-surface-400"}`}
                        >
                            <Icon className={`w-6 h-6 ${item.active ? "animate-pulse-subtle" : ""}`} />
                            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
