import { Link } from "react-router";
import { FaGithub, FaTwitter, FaFacebook, FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200/70 dark:border-slate-800/70">
                    {/* Brand & Mission */}
                    <div className="lg:col-span-5 space-y-4">
                        <Link to="/" className="inline-block">
                            <img
                                src="/assets/logo/logo-dark.png"
                                alt="Code Rage"
                                className="h-9 w-auto dark:invert"
                            />
                        </Link>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                            Precision software engineering, cross-platform application builds, and reliable hardware &amp;
                            family tech support by Steace Paquette.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Accepting new client projects &amp; same-day diagnostics</span>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div className="lg:col-span-3">
                        <h3 className="text-xs font-mono font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Services
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    to="/website-development"
                                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Website Development
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/cross-platform-apps"
                                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Cross-Platform Apps
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/computer-repair"
                                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Computer Repair &amp; Custom PCs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/family-support"
                                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Family Tech Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Direct Action & Socials */}
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="text-xs font-mono font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                            Start a Conversation
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Need a custom web app, a cross-platform build, or fast hardware diagnostics? Reach out for a
                            straightforward quote.
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-3">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 text-white dark:text-slate-950 dark:hover:text-white text-xs font-semibold transition-colors"
                            >
                                Contact Steace
                                <FaArrowUpRightFromSquare className="w-3 h-3" />
                            </Link>
                            <div className="flex items-center gap-2">
                                <a
                                    href="https://github.com/SteaceP"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800 transition-colors"
                                    aria-label="GitHub"
                                >
                                    <FaGithub size={17} />
                                </a>
                                <a
                                    href="https://twitter.com/PaquetteSteacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800 transition-colors"
                                    aria-label="Twitter"
                                >
                                    <FaTwitter size={17} />
                                </a>
                                <a
                                    href="https://facebook.com/steacyp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800 transition-colors"
                                    aria-label="Facebook"
                                >
                                    <FaFacebook size={17} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <p>© {currentYear} Code Rage (Steace Paquette). All rights reserved.</p>
                    <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                        Built with React Router v7 • TypeScript • Cloudflare Edge
                    </p>
                </div>
            </div>
        </footer>
    );
}

