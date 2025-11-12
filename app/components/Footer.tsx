import { FaGithub, FaTwitter, FaFacebook, FaHeart } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
                    {/* Brand Section */}
                    <div className="space-y-4 flex flex-col items-center md:items-start">
                        <img src="/assets/logo/logo-dark.png" alt="Code Rage" className="h-10 w-auto" />
                        <p className="text-sm text-slate-600 dark:text-gray-400 max-w-xs">
                            Professional tech services delivering modern solutions for your digital needs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/website-development"
                                    className="text-sm text-slate-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Website Development
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/cross-platform-apps"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Cross-Platform Apps
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/computer-repair"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Computer Repair
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/family-support"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Family Tech Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Connect
                        </h3>
                        <div className="flex space-x-4 justify-center md:justify-start">
                            <a
                                href="https://github.com/SteaceP"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-xl bg-slate-100/80 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-blue-900/30 hover:text-sky-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 shadow-sm"
                                aria-label="GitHub"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a
                                href="https://twitter.com/PaquetteSteacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-xl bg-slate-100/80 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-blue-900/30 hover:text-sky-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 shadow-sm"
                                aria-label="Twitter"
                            >
                                <FaTwitter size={20} />
                            </a>
                            <a
                                href="https://facebook.com/steacyp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-xl bg-slate-100/80 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-blue-900/30 hover:text-sky-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 shadow-sm"
                                aria-label="Facebook"
                            >
                                <FaFacebook size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200/70 dark:border-gray-800">
                    <p className="text-sm text-center text-slate-600 dark:text-gray-400 flex items-center justify-center gap-2">
                        © {new Date().getFullYear()} Code Rage. Made with
                        <FaHeart className="text-red-500 animate-pulse" size={14} />
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
