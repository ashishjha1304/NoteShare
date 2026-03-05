import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function SearchBar({ onSearch, placeholder = "Search notes by title or keyword..." }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        // Live search with debounce-like behavior
        if (val === "") {
            onSearch("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative group">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-600 dark:text-surface-400 dark:text-surface-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-28 py-3.5 bg-surface-100/60 dark:bg-surface-800/60 border border-surface-300/50 dark:border-surface-700/50 rounded-2xl text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
