import { Link, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";
import {
    FaBars,
    FaTimes,
    FaChevronDown,
    FaCode,
    FaMobile,
    FaTools,
    FaUsers,
    FaRocket,
    FaSun,
    FaMoon,
} from "react-icons/fa";
import { useTheme } from "~/hooks/useTheme";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isContactHovered, setIsContactHovered] = useState(false);
    const [rocketPosition, setRocketPosition] = useState({ x: 0, y: 0 });
    const [rocketRotation, setRocketRotation] = useState(-135);
    const [rocketTrail, setRocketTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const solutionsRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>(0);
    const prevPositionRef = useRef({ x: 0, y: 0 });
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
                setIsSolutionsOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Animate rocket in a circular/wave pattern when contact is hovered
    useEffect(() => {
        if (isContactHovered && typeof window !== "undefined") {
            let time = 0;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radiusX = window.innerWidth * 0.3;
            const radiusY = window.innerHeight * 0.25;

            const animate = () => {
                time += 0.015;

                // Figure-8 pattern (lemniscate)
                const scale = 1 / (1 + Math.sin(time) ** 2);
                const x = centerX + radiusX * scale * Math.cos(time);
                const y = centerY + radiusY * scale * Math.sin(time) * Math.cos(time);

                // Calculate rotation based on movement direction
                const velocityX = x - prevPositionRef.current.x;

                // Update rotation: -45° when moving right, -135° when moving left
                // Add 90° rotation after 50% of the cycle (when time crosses PI)
                const cycleProgress = (time % (Math.PI * 2)) / (Math.PI * 2);
                const additionalRotation = cycleProgress > 0.5 ? 90 : 0;

                if (Math.abs(velocityX) > 0.5) {
                    const baseRotation = velocityX > 0 ? -45 : -135;
                    setRocketRotation(baseRotation + additionalRotation);
                }

                prevPositionRef.current = { x, y };
                setRocketPosition({ x, y });

                // Add trail point
                const newTrail = { x, y, id: Date.now() + Math.random() };
                setRocketTrail((prev) => [...prev.slice(-12), newTrail]);

                animationFrameRef.current = requestAnimationFrame(animate);
            };

            animate();

            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        } else {
            setRocketTrail([]);
        }
    }, [isContactHovered]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsSolutionsOpen(false);
    };

    const toggleSolutions = () => {
        setIsSolutionsOpen(!isSolutionsOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
        setIsSolutionsOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const solutions = [
        { path: "/website-development", label: "Website Development", icon: FaCode },
        { path: "/cross-platform-apps", label: "Cross-Platform Apps", icon: FaMobile },
        { path: "/computer-repair", label: "Computer Repair", icon: FaTools },
        { path: "/family-support", label: "Family Tech Support", icon: FaUsers },
    ];

    return (
        <>
            {/* Rocket animation with fire trail */}
            {isContactHovered && (
                <>
                    {/* Fire trail */}
                    {rocketTrail.map((point, index) => {
                        const opacity = (index + 1) / rocketTrail.length;
                        const size = 6 + index * 1.5;
                        return (
                            <div
                                key={point.id}
                                className="fixed pointer-events-none z-99 rounded-full"
                                style={{
                                    left: `${point.x}px`,
                                    top: `${point.y}px`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    background: `radial-gradient(circle, ${
                                        index % 2 === 0 ? "rgba(251, 146, 60, " : "rgba(250, 204, 21, "
                                    }${opacity * 0.8}) 0%, transparent 70%)`,
                                    transform: "translate(-50%, -50%)",
                                    transition: "opacity 0.3s ease-out",
                                }}
                            />
                        );
                    })}

                    {/* Rocket flying in pattern */}
                    <div
                        className="fixed pointer-events-none z-100 transition-transform duration-200"
                        style={{
                            left: `${rocketPosition.x}px`,
                            top: `${rocketPosition.y}px`,
                            transform: `translate(-50%, -50%) rotate(${rocketRotation}deg)`,
                        }}
                    >
                        <FaRocket className="w-7 h-7 text-blue-600 drop-shadow-2xl" />
                    </div>
                </>
            )}

            <header className="sticky top-0 z-50 w-full transition-all duration-500">
                <div
                    className={`w-full transition-all duration-500 relative ${
                        scrolled
                            ? "bg-white/80 dark:bg-gray-900/80 shadow-lg shadow-blue-900/5 backdrop-blur-2xl border-b border-white/50 dark:border-gray-800 support-backdrop-blur:bg-white/90"
                            : "bg-white/20 dark:bg-gray-900/50 backdrop-blur-md border-b border-white/10 dark:border-white/5"
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 md:h-20">
                            {/* Logo with glow effect */}
                            <Link
                                to="/"
                                className="flex items-center space-x-3 group relative"
                                onClick={handleLinkClick}
                            >
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <img
                                    src="/assets/logo/logo-dark.png"
                                    alt="Code Rage"
                                    className="h-16 md:h-20 w-auto transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-2xl relative z-10"
                                />
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center gap-2">
                                <div className="relative" ref={solutionsRef}>
                                    <button
                                        onClick={toggleSolutions}
                                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 relative overflow-hidden group bg-blue-600 dark:bg-linear-to-r dark:from-blue-600 dark:to-purple-600 text-white shadow-lg shadow-blue-500/30`}

                                    >
                                        <span className="relative z-10">Services</span>
                                        <FaChevronDown
                                            className={`w-3 h-3 transition-transform duration-300 relative z-10 ${
                                                isSolutionsOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                    </button>

                                    {/* Dropdown Menu - Enhanced */}
                                    {isSolutionsOpen && (
                                        <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="p-2 space-y-1">
                                                {solutions.map((solution, index) => {
                                                    const Icon = solution.icon;
                                                    return (
                                                        <Link
                                                            key={solution.path}
                                                            to={solution.path}
                                                            onClick={handleLinkClick}
                                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                                                                isActive(solution.path)
                                                                    ? "bg-blue-600 dark:bg-linear-to-r dark:from-blue-600 dark:to-purple-600 text-white shadow-md"
                                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-[1.02] hover:shadow-sm"
                                                            }`}
                                                            style={{
                                                                animationDelay: `${index * 50}ms`,
                                                            }}
                                                        >
                                                            <Icon
                                                                className={`w-4 h-4 shrink-0 ${isActive(solution.path) ? "text-white" : "text-blue-600 dark:text-blue-400"}`}
                                                            />
                                                            <span className="text-sm font-medium relative z-10">
                                                                {solution.label}
                                                            </span>
                                                            <div className="absolute inset-0 bg-linear-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    to="/contact"
                                    onMouseEnter={() => setIsContactHovered(true)}
                                    onMouseLeave={() => setIsContactHovered(false)}
                                    className="ml-3 px-8 py-3 bg-blue-600 dark:bg-linear-to-r dark:from-blue-600 dark:via-purple-600 dark:to-blue-600 bg-size-[200%_100%] text-white rounded-xl font-bold text-sm lg:text-base transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-110 hover:bg-position-[100%_0] relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Contact
                                        <FaRocket className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Link>

                                {/* Theme Toggle Button - Far Right */}
                                <button
                                    onClick={toggleTheme}
                                    className="ml-3 relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 group overflow-hidden"
                                    aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
                                >
                                    {/* Background gradient that animates */}
                                    <div className="absolute inset-0 bg-linear-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Icon container with rotation animation */}
                                    <div className="relative z-10 w-5 h-5 flex items-center justify-center">
                                        <FaSun
                                            className={`absolute text-yellow-600 dark:text-yellow-400 transition-all duration-500 ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-180 scale-0 opacity-0"}`}
                                        />
                                        <FaMoon
                                            className={`absolute text-blue-600 dark:text-blue-400 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"}`}
                                        />
                                    </div>

                                    {/* Pulse effect on click */}
                                    <div className="absolute inset-0 rounded-xl bg-blue-500/20 scale-0 group-active:scale-100 transition-transform duration-300" />
                                </button>
                            </nav>

                            {/* Mobile Menu Button & Theme Toggle */}
                            <div className="md:hidden flex items-center gap-2">
                                {/* Mobile Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 group"
                                    aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
                                >
                                    <div className="relative w-5 h-5 flex items-center justify-center">
                                        <FaSun
                                            className={`absolute text-yellow-600 transition-all duration-300 ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}
                                        />
                                        <FaMoon
                                            className={`absolute text-blue-600 dark:text-blue-400 transition-all duration-300 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
                                        />
                                    </div>
                                </button>

                                <button
                                    className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                    onClick={toggleMenu}
                                    aria-label="Toggle menu"
                                    aria-expanded={isMenuOpen}
                                >
                                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {isMenuOpen && (
                            <div className="md:hidden border-t-2 border-gray-200 dark:border-gray-700 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <nav className="flex flex-col space-y-1">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Services
                                    </div>

                                    {solutions.map((solution) => {
                                        const Icon = solution.icon;
                                        return (
                                            <Link
                                                key={solution.path}
                                                to={solution.path}
                                                onClick={handleLinkClick}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                    isActive(solution.path)
                                                        ? "bg-blue-600 dark:bg-blue-600 text-white shadow-md"
                                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                            >
                                                <Icon className="w-5 h-5 shrink-0" />
                                                {solution.label}
                                            </Link>
                                        );
                                    })}

                                    <Link
                                        to="/contact"
                                        onClick={handleLinkClick}
                                        className="mt-4 px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-center transition-all duration-200 hover:shadow-lg hover:from-blue-700 hover:to-purple-700"
                                    >
                                        Contact Me
                                    </Link>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
