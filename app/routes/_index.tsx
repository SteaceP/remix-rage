import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FaCode, FaTools, FaStar, FaUserClock } from "react-icons/fa";

export const meta: MetaFunction = () => {
    return [
        { title: "Code Rage - Professional Tech Services" },
        {
            name: "description",
            content:
                "Expert computer repair and web development services. Fast, reliable, and professional solutions for all your tech needs.",
        },
    ];
};

const styles = {
    // Layout
    main: "grow flex flex-col items-center justify-start w-full",

    // Hero Section
    hero: "w-full px-4 py-24 md:py-32 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 relative overflow-hidden",
    heroContent: "max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10",
    heroText: "flex-1 text-left space-y-6",
    heroTitle: "text-5xl md:text-6xl lg:text-7xl font-bold text-white dark:text-white leading-tight tracking-tight",
    heroTitleSpan:
        "bg-linear-to-r from-yellow-200 via-pink-200 to-purple-200 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-lg",
    heroSubtitle: "text-xl md:text-2xl text-white/90 dark:text-gray-300 max-w-2xl leading-relaxed",
    heroCTA: "flex flex-wrap gap-4 items-center",
    heroPrimaryButton:
        "px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gray-50",
    heroSecondaryButton:
        "px-8 py-4 bg-white/10 dark:bg-gray-800 text-white dark:text-white rounded-xl font-semibold text-lg border-2 border-white/30 dark:border-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-white dark:hover:border-blue-400 hover:shadow-xl backdrop-blur-sm",
    heroImageContainer: "flex-1 relative max-w-lg group",
    heroImage:
        "w-full h-auto rounded-2xl shadow-2xl ring-4 ring-white/50 dark:ring-gray-800/50 transition-all duration-500 hover:scale-105 hover:ring-white",
    // Creative "That's me" badge
    badgeContainer:
        "absolute -top-5 left-[35%] -translate-x-1/2 z-20 animate-in slide-in-from-top-5 fade-in duration-1000 delay-500",
    badge: "relative",
    badgePulse: "absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-30",
    badgeMain:
        "relative flex items-center gap-2 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-700 dark:via-teal-700 dark:to-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl border-4 border-white dark:border-gray-900 hover:scale-110 transition-transform duration-300 cursor-default",
    badgeIcon: "text-2xl animate-wave",
    badgeText: "font-bold text-sm md:text-base whitespace-nowrap",
    badgePointer:
        "absolute -bottom-2 left-1/2 translate-x-4 w-3 h-3 bg-teal-600 dark:bg-teal-700 rotate-45 border-r-4 border-b-4 border-white dark:border-gray-900 rounded-full",
    badgePointer2:
        "absolute -bottom-3 left-1/2 translate-x-8 w-2 h-2 bg-teal-600 dark:bg-teal-700 rotate-45 border-r-2 border-b-2 border-white dark:border-gray-900 rounded-full",
    badgePointer3:
        "absolute -bottom-4 left-1/2 translate-x-11 w-1.5 h-1.5 bg-teal-600 dark:bg-teal-700 rotate-45 border-r-2 border-b-2 border-white dark:border-gray-900 rounded-full",

    // Features Section
    featuresSection: "w-full py-20 px-4 bg-gray-50 dark:bg-gray-900 relative",
    featuresGrid: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
    featureCard:
        "flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-600 dark:hover:border-blue-400 hover:scale-105 group",
    featureIcon:
        "text-blue-600 dark:text-blue-400 mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all duration-300",
    featureTitle:
        "text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300",
    featureText: "text-gray-600 dark:text-gray-400 leading-relaxed",

    // Services Section
    servicesSection: "w-full py-16 px-4",
    servicesContent: "max-w-7xl mx-auto",
    sectionTitle: "text-3xl font-bold text-center text-gray-900 dark:text-white mb-12",
    sectionSubtitle: "text-xl text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto",
    cardsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
    card: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col h-full",
    cardTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-3",
    cardDescription: "text-gray-600 dark:text-gray-300 grow",
    cardButton:
        "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6",

    // CTA Section
    ctaSection:
        "w-full py-24 px-4 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden",
    ctaContent: "max-w-4xl mx-auto text-center relative z-10",
    ctaTitle: "text-4xl md:text-5xl font-bold text-white mb-6",
    ctaText: "text-xl md:text-2xl text-white/90 dark:text-gray-300 mb-10 leading-relaxed",
    ctaButton:
        "inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:bg-gray-50",
};

export default function Index() {
    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section id="hero" className={styles.hero}>
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Tech Solutions <br />
                            <span className={styles.heroTitleSpan}>That Work</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            From website development to computer repairs, I provide professional tech services that help
                            you stay ahead in the digital world.
                        </p>
                        <div className={styles.heroCTA}>
                            <Link to="/contact" className={styles.heroPrimaryButton}>
                                Get Started Today
                            </Link>
                            <Link to="#services" className={styles.heroSecondaryButton}>
                                View Services
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroImageContainer}>
                        {/* Creative "That's me" Badge */}
                        <div className={styles.badgeContainer}>
                            <div className={styles.badge}>
                                <div className={styles.badgePulse} />
                                <div className={styles.badgeMain}>
                                    <span className={styles.badgeIcon}>👋</span>
                                    <span className={styles.badgeText}>That&apos;s me!</span>
                                </div>
                                <div className={styles.badgePointer} />
                                <div className={styles.badgePointer2} />
                                <div className={styles.badgePointer3} />
                            </div>
                        </div>

                        <img
                            src="/assets/images/tech-hero.jpg"
                            alt="Steace Paquette - Professional Tech Services"
                            className={styles.heroImage}
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.featuresSection}>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <FaUserClock size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Quick Response</h3>
                        <p className={styles.featureText}>Fast turnaround times and reliable service</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <FaTools size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Expert Service</h3>
                        <p className={styles.featureText}>Professional and experienced technician</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <FaCode size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Modern Solutions</h3>
                        <p className={styles.featureText}>Latest technologies and best practices</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <FaStar size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Quality Work</h3>
                        <p className={styles.featureText}>Satisfaction guaranteed on all services</p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className={styles.servicesSection}>
                <div className={styles.servicesContent}>
                    <h2 className={styles.sectionTitle}>Services I Offer</h2>
                    <p className={styles.sectionSubtitle}>
                        Comprehensive tech solutions tailored to your needs, delivered with expertise and passion
                    </p>
                    <div className={styles.cardsContainer}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Website Development</h2>
                            <p className={styles.cardDescription}>
                                Modern, responsive websites built with the latest technologies. Perfect for businesses
                                looking to establish or improve their online presence.
                            </p>
                            <Link to="/website-development" className={styles.cardButton}>
                                Learn More
                            </Link>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Cross-Platform Apps</h2>
                            <p className={styles.cardDescription}>
                                Need your app to work everywhere? I build applications that run seamlessly across
                                desktop, mobile, and web platforms using modern frameworks.
                            </p>
                            <Link to="/cross-platform-apps" className={styles.cardButton}>
                                Learn More
                            </Link>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Computer Repair</h2>
                            <p className={styles.cardDescription}>
                                Professional computer repair services including hardware fixes, software
                                troubleshooting, and performance optimization.
                            </p>
                            <Link to="/computer-repair" className={styles.cardButton}>
                                Learn More
                            </Link>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Family Tech Support</h2>
                            <p className={styles.cardDescription}>
                                Tired of being the default tech support for your family? I provide patient,
                                easy-to-understand guidance and preventive measures to keep your family&apos;s computers
                                running smoothly.
                            </p>
                            <Link to="/family-support" className={styles.cardButton}>
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className={styles.ctaSection}>
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
                    <p className={styles.ctaText}>
                        Let&apos;s work together to solve your tech challenges and bring your ideas to life.
                    </p>
                    <Link to="/contact" className={styles.ctaButton}>
                        Contact Me Today
                    </Link>
                </div>
            </section>
        </main>
    );
}
