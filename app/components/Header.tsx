import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { header } from "~/styles/layout";
import { navigation } from "~/styles/components";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
    const solutionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
                setIsSolutionsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsSolutionsOpen(false);
    };

    const toggleSolutions = () => {
        setIsSolutionsOpen(!isSolutionsOpen);
    };

    const handleSolutionLinkClick = () => {
        setIsSolutionsOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
            <div className={`${header.headerContainer}`}>
                <div className={header.container}>
                    <Link to="/" className={navigation.logo}>
                        <img src="/assets/logo/logo-dark.png" alt="Code Rage" className="h-14 w-auto" />
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        <Link to="/" className={navigation.navLink}>
                            Home
                        </Link>
                        <div className="relative group" ref={solutionsRef}>
                            <button
                                onClick={toggleSolutions}
                                className={`${navigation.navLink} flex items-center gap-1`}
                            >
                                Solutions
                                <svg
                                    className={`w-4 h-4 transition-transform ${isSolutionsOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isSolutionsOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                                    <Link to="/website-development" className={navigation.dropdownLink} onClick={handleSolutionLinkClick}>
                                        Website Development
                                    </Link>
                                    <Link to="/cross-platform-apps" className={navigation.dropdownLink} onClick={handleSolutionLinkClick}>
                                        Cross-Platform Apps
                                    </Link>
                                    <Link to="/computer-repair" className={navigation.dropdownLink} onClick={handleSolutionLinkClick}>
                                        Computer Repair
                                    </Link>
                                    <Link to="/family-support" className={navigation.dropdownLink} onClick={handleSolutionLinkClick}>
                                        Family Tech Support
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                        <nav className="flex flex-col p-4">
                            <Link to="/" className={navigation.mobileNavLink} onClick={toggleMenu}>
                                Home
                            </Link>
                            <Link to="/website-development" className={navigation.mobileNavLink} onClick={toggleMenu}>
                                Website Development
                            </Link>
                            <Link to="/cross-platform-apps" className={navigation.mobileNavLink} onClick={toggleMenu}>
                                Cross-Platform Apps
                            </Link>
                            <Link to="/computer-repair" className={navigation.mobileNavLink} onClick={toggleMenu}>
                                Computer Repair
                            </Link>
                            <Link to="/family-support" className={navigation.mobileNavLink} onClick={toggleMenu}>
                                Family Tech Support
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
