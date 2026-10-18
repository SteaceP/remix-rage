import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
    FaBars,
    FaTimes,
    FaCode,
    FaMobileAlt,
    FaTools,
    FaUsers,
    FaSun,
    FaMoon,
    FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "~/hooks/useTheme";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        {
            path: "/website-development",
            label: "Web Development",
            shortDesc: "Custom React & TypeScript sites",
            icon: FaCode,
        },
        {
            path: "/cross-platform-apps",
            label: "Cross-Platform Apps",
            shortDesc: "iOS, Android & Desktop builds",
            icon: FaMobileAlt,
        },
        {
            path: "/computer-repair",
            label: "Computer Repair",
            shortDesc: "$29 diagnostics & hardware fixes",
            icon: FaTools,
        },
        {
            path: "/family-support",
            label: "Family Tech Support",
            shortDesc: "Patient care, security & training",
            icon: FaUsers,
        },
    ];

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-200 ${
                scrolled
                    ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/90 shadow-xs"
                    : "bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-18 gap-4">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                        >
                            <img
                                src="/assets/logo/logo-dark.png"
                                alt="Code Rage"
                                className="h-9 md:h-11 w-auto dark:invert transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                        </Link>
                        <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available
                        </span>
                    </div>

                    {/* Desktop Primary Navigation */}
                    <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80">
                        <Link
                            to="/"
                            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive("/")
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            Overview
                        </Link>
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        active
                                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Right Controls */}
                    <div className="hidden lg:flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                            aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            <div className="relative w-4 h-4 flex items-center justify-center">
                                <FaSun
                                    className={`w-4 h-4 text-amber-500 transition-all duration-200 ${
                                        theme === "light"
                                            ? "rotate-0 scale-100 opacity-100"
                                            : "rotate-90 scale-0 opacity-0"
                                    }`}
                                />
                                <FaMoon
                                    className={`absolute w-4 h-4 text-blue-400 transition-all duration-200 ${
                                        theme === "dark"
                                            ? "rotate-0 scale-100 opacity-100"
                                            : "-rotate-90 scale-0 opacity-0"
                                    }`}
                                />
                            </div>
                        </button>

                        <Link
                            to="/contact"
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                isActive("/contact")
                                    ? "bg-blue-700 text-white shadow-xs"
                                    : "bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs"
                            }`}
                        >
                            <span>Get in Touch</span>
                            <FaArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Mobile / Tablet Controls */}
                    <div className="flex lg:hidden items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
                            aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            <div className="relative w-4 h-4 flex items-center justify-center">
                                <FaSun
                                    className={`w-4 h-4 text-amber-500 transition-all duration-200 ${
                                        theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                                    }`}
                                />
                                <FaMoon
                                    className={`absolute w-4 h-4 text-blue-400 transition-all duration-200 ${
                                        theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                                    }`}
                                />
                            </div>
                        </button>

                        <button
                            type="button"
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800/80 py-4 space-y-3">
                        <div className="px-2 text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Navigation & Services
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                                            active
                                                ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                                : "bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                                        }`}
                                    >
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold">{item.label}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                {item.shortDesc}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="pt-2">
                            <Link
                                to="/contact"
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-xs"
                            >
                                <span>Start a Project or Book Repair</span>
                                <FaArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

