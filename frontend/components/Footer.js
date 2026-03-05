import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi";

export default function Footer() {
    return (
        <footer className="relative mt-auto border-t border-surface-300/50 dark:border-surface-800/50 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-sm">
            {/* Gradient top line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28 md:pb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                                N
                            </div>
                            <span className="font-display text-lg font-bold text-surface-900 dark:text-white">NoteShare</span>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed max-w-sm">
                            A collaborative platform for students to share, discover, and download study notes. Learn together, grow together.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/notes">Browse Notes</FooterLink>
                            <FooterLink href="/upload">Upload Notes</FooterLink>
                            <FooterLink href="/signup">Create Account</FooterLink>
                        </ul>
                    </div>

                    {/* Subjects */}
                    <div>
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-4">Popular Subjects</h4>
                        <ul className="space-y-2.5">
                            <FooterLink href="/notes/Computer Science">Computer Science</FooterLink>
                            <FooterLink href="/notes/Python Programming">Python Programming</FooterLink>
                            <FooterLink href="/notes/Web Development">Web Development</FooterLink>
                            <FooterLink href="/notes/Data Structures">Data Structures</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-surface-300/50 dark:border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-surface-600 dark:text-surface-400 dark:text-surface-500 text-sm">
                        © {new Date().getFullYear()} NoteShare. All rights reserved.
                    </p>
                    <p className="text-surface-600 dark:text-surface-400 dark:text-surface-500 text-sm flex items-center gap-1">
                        Built with <HiOutlineHeart className="text-red-400 w-4 h-4" /> for students
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link href={href} className="text-surface-600 dark:text-surface-400 hover:text-primary-400 text-sm transition-colors">
                {children}
            </Link>
        </li>
    );
}
