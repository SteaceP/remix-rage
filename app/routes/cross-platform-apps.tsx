import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FaMobile, FaDesktop, FaCode, FaRocket } from "react-icons/fa";
import { page, serviceCards, pricing, cta, utilities } from "~/styles/sections";

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

export default function CrossPlatformApps() {
    return (
        <div className={page.layout}>
            <header className={page.header}>
                <h1 className={page.heading}>
                    Cross-Platform <span className={page.headingSpan}>App Development</span>
                </h1>
                <h2 className={page.subheading}>One Codebase, Multiple Platforms</h2>
                <p className={page.paragraph}>
                    Build powerful applications that work seamlessly across all platforms. Save time and resources while
                    maintaining native performance and user experience.
                </p>
            </header>

            <main className={page.main}>
                <section className={page.section}>
                    <h2 className={page.sectionTitle}>My Cross-Platform Solutions</h2>
                    <div className={serviceCards.gridTwoCol}>
                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaMobile size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Mobile Apps</h3>
                            <p className={serviceCards.description}>
                                Native-quality iOS and Android apps from a single codebase. Optimized for performance
                                and user experience on each platform.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaDesktop size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Desktop Applications</h3>
                            <p className={serviceCards.description}>
                                Modern desktop apps for Windows, macOS, and Linux. Full system integration with native
                                capabilities.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaCode size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Web Applications</h3>
                            <p className={serviceCards.description}>
                                Progressive Web Apps that work offline and can be installed on any device. Responsive
                                design for all screen sizes.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaRocket size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Rapid Development</h3>
                            <p className={serviceCards.description}>
                                Fast development cycles with hot reload and modern tooling. Quick iterations and faster
                                time to market.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={page.section}>
                    <h2 className={page.sectionTitle}>Technologies & Languages I Use</h2>
                    <div className={utilities.techStack}>
                        <span className={utilities.techBadge}>React Native</span>
                        <span className={utilities.techBadge}>Flutter</span>
                        <span className={utilities.techBadge}>Swift</span>
                        <span className={utilities.techBadge}>Electron</span>
                        <span className={utilities.techBadge}>Tauri</span>
                        <span className={utilities.techBadge}>PWA</span>
                        <span className={utilities.techBadge}>TypeScript</span>
                        <span className={utilities.techBadge}>Rust</span>
                        <span className={utilities.techBadge}>WASM</span>
                    </div>
                </section>

                <section className={pricing.section}>
                    <h2 className={page.sectionTitle}>Development Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-blue-600 dark:text-blue-400 mb-4">
                                <FaCode size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Design</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Platform-specific UI/UX design that feels native on each platform
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="text-blue-600 dark:text-blue-400 mb-4">
                                <FaCode size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Develop</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Efficient development with shared business logic
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="text-blue-600 dark:text-blue-400 mb-4">
                                <FaCode size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Test</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Comprehensive testing on all target platforms
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="text-blue-600 dark:text-blue-400 mb-4">
                                <FaRocket size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Deploy</h3>
                            <p className="text-gray-700 dark:text-gray-300">Streamlined deployment to all app stores</p>
                        </div>
                    </div>
                </section>

                <div className={cta.ctaSection}>
                    <Link to="/contact" className={cta.ctaButton}>
                        Start Your Project
                    </Link>
                </div>
            </main>
        </div>
    );
}
