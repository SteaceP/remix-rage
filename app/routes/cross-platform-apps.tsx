import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { FaMobile, FaDesktop, FaCode, FaRocket } from "react-icons/fa";

export const meta: MetaFunction = () => {
    return [
        { title: "Cross-Platform App Development - Code Rage" },
        {
            name: "description",
            content:
                "Professional cross-platform app development services. Build once, deploy everywhere with modern frameworks and native performance.",
        },
    ];
};

const styles = {
    layout: "flex flex-col min-h-screen",

    header: "flex flex-col items-center justify-center py-20 px-4 text-center",
    heading: "text-4xl md:text-5xl font-medium tracking-tight text-gray-900 dark:text-white",
    headingSpan: "font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text",
    subheading: "text-xl md:text-2xl mt-4 text-gray-700 dark:text-gray-200",
    paragraph: "text-lg mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto",

    main: "flex-grow flex flex-col items-center justify-center px-4 py-12 w-full max-w-6xl mx-auto gap-8",
    section: "w-full",
    sectionTitle: "text-2xl font-semibold text-gray-900 dark:text-white mb-6",

    servicesGrid: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16",
    serviceCard: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl",
    iconWrapper: "mb-4 text-blue-600 dark:text-blue-400",
    serviceTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-4",
    serviceDescription: "text-gray-600 dark:text-gray-300",

    techStack: "flex flex-wrap justify-center gap-4 mb-16",
    techBadge: "px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300",

    processSection: "w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 mb-16",
    processGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
    processCard: "flex flex-col items-center text-center",
    processIcon: "text-blue-600 dark:text-blue-400 mb-4",
    processTitle: "font-semibold text-gray-900 dark:text-white mb-2",
    processText: "text-gray-600 dark:text-gray-300",

    ctaSection: "text-center mt-12",
    ctaButton:
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-lg hover:opacity-90 transition-opacity",
};

export default function CrossPlatformApps() {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <h1 className={styles.heading}>
                    Cross-Platform <span className={styles.headingSpan}>App Development</span>
                </h1>
                <h2 className={styles.subheading}>One Codebase, Multiple Platforms</h2>
                <p className={styles.paragraph}>
                    Build powerful applications that work seamlessly across all platforms. Save time and resources while
                    maintaining native performance and user experience.
                </p>
            </header>

            <main className={styles.main}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>My Cross-Platform Solutions</h2>
                    <div className={styles.servicesGrid}>
                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaMobile size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Mobile Apps</h3>
                            <p className={styles.serviceDescription}>
                                Native-quality iOS and Android apps from a single codebase. Optimized for performance
                                and user experience on each platform.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaDesktop size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Desktop Applications</h3>
                            <p className={styles.serviceDescription}>
                                Modern desktop apps for Windows, macOS, and Linux. Full system integration with native
                                capabilities.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaCode size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Web Applications</h3>
                            <p className={styles.serviceDescription}>
                                Progressive Web Apps that work offline and can be installed on any device. Responsive
                                design for all screen sizes.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaRocket size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Rapid Development</h3>
                            <p className={styles.serviceDescription}>
                                Fast development cycles with hot reload and modern tooling. Quick iterations and faster
                                time to market.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Technologies & Languages I Use</h2>
                    <div className={styles.techStack}>
                        <span className={styles.techBadge}>React Native</span>
                        <span className={styles.techBadge}>Flutter</span>
                        <span className={styles.techBadge}>Swift</span>
                        <span className={styles.techBadge}>Electron</span>
                        <span className={styles.techBadge}>Tauri</span>
                        <span className={styles.techBadge}>PWA</span>
                        <span className={styles.techBadge}>TypeScript</span>
                        <span className={styles.techBadge}>Rust</span>
                        <span className={styles.techBadge}>WASM</span>
                    </div>
                </section>

                <section className={styles.processSection}>
                    <h2 className={styles.sectionTitle}>Development Process</h2>
                    <div className={styles.processGrid}>
                        <div className={styles.processCard}>
                            <div className={styles.processIcon}>
                                <FaCode size={24} />
                            </div>
                            <h3 className={styles.processTitle}>Design</h3>
                            <p className={styles.processText}>
                                Platform-specific UI/UX design that feels native on each platform
                            </p>
                        </div>
                        <div className={styles.processCard}>
                            <div className={styles.processIcon}>
                                <FaCode size={24} />
                            </div>
                            <h3 className={styles.processTitle}>Develop</h3>
                            <p className={styles.processText}>Efficient development with shared business logic</p>
                        </div>
                        <div className={styles.processCard}>
                            <div className={styles.processIcon}>
                                <FaCode size={24} />
                            </div>
                            <h3 className={styles.processTitle}>Test</h3>
                            <p className={styles.processText}>Comprehensive testing on all target platforms</p>
                        </div>
                        <div className={styles.processCard}>
                            <div className={styles.processIcon}>
                                <FaRocket size={24} />
                            </div>
                            <h3 className={styles.processTitle}>Deploy</h3>
                            <p className={styles.processText}>Streamlined deployment to all app stores</p>
                        </div>
                    </div>
                </section>

                <div className={styles.ctaSection}>
                    <Link to="/contact" className={styles.ctaButton}>
                        Start Your Project
                    </Link>
                </div>
            </main>
        </div>
    );
}
