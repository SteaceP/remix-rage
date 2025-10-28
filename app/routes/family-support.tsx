import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FaUsers, FaLaptop, FaShieldAlt, FaGraduationCap } from "react-icons/fa";

export const meta: MetaFunction = () => {
    return [
        { title: "Family Tech Support - Code Rage" },
        {
            name: "description",
            content:
                "Professional and patient family tech support services. Get help with computer setup, maintenance, security, and training for all your family members.",
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

    servicesGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16",
    serviceCard: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl",
    iconWrapper: "mb-4 text-blue-600 dark:text-blue-400",
    serviceTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-4",
    serviceDescription: "text-gray-600 dark:text-gray-300",

    benefitsList: "list-none space-y-6 mb-16",
    benefitItem: "flex items-start gap-4",
    benefitIcon: "flex-shrink-0 mt-1 text-blue-600 dark:text-blue-400",
    benefitContent: "flex-grow",
    benefitTitle: "font-semibold text-gray-900 dark:text-white mb-1",
    benefitText: "text-gray-600 dark:text-gray-300",

    pricingSection: "w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 mb-16",
    pricingTitle: "text-2xl font-semibold text-gray-900 dark:text-white mb-6",
    pricingGrid: "grid grid-cols-1 md:grid-cols-2 gap-8",
    pricingCard: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8",
    price: "text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4",
    priceDescription: "text-gray-600 dark:text-gray-300 mb-4",

    ctaSection: "text-center mt-12",
    ctaButton:
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-lg hover:opacity-90 transition-opacity",
};

export default function FamilySupport() {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <h1 className={styles.heading}>
                    Family <span className={styles.headingSpan}>Tech Support</span>
                </h1>
                <h2 className={styles.subheading}>Patient, Understanding, Effective</h2>
                <p className={styles.paragraph}>
                    Tired of being the default tech support for your family? Let me help keep your family&apos;s devices
                    running smoothly with professional, patient support.
                </p>
            </header>

            <main className={styles.main}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Services Offered</h2>
                    <div className={styles.servicesGrid}>
                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaUsers size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Family Tech Setup</h3>
                            <p className={styles.serviceDescription}>
                                Complete setup and configuration of new devices, including computers, tablets, printers,
                                and home networks. Making technology work for everyone in the family.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaLaptop size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Ongoing Support</h3>
                            <p className={styles.serviceDescription}>
                                Regular maintenance, updates, and troubleshooting to keep everything running smoothly.
                                Quick response times for urgent issues.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaShieldAlt size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Security & Safety</h3>
                            <p className={styles.serviceDescription}>
                                Setup of parental controls, antivirus protection, and safe browsing measures. Keep your
                                family safe online while maintaining privacy.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <FaGraduationCap size={32} />
                            </div>
                            <h3 className={styles.serviceTitle}>Training & Education</h3>
                            <p className={styles.serviceDescription}>
                                Patient, easy-to-understand training sessions for family members of all ages. Learn to
                                use devices and software confidently.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Why Choose Professional Family Support?</h2>
                    <ul className={styles.benefitsList}>
                        <li className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <FaUsers size={24} />
                            </div>
                            <div className={styles.benefitContent}>
                                <h3 className={styles.benefitTitle}>Patient & Understanding</h3>
                                <p className={styles.benefitText}>
                                    No question is too basic. I provide clear, jargon-free explanations and take the
                                    time to ensure everyone understands.
                                </p>
                            </div>
                        </li>
                        <li className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <FaShieldAlt size={24} />
                            </div>
                            <div className={styles.benefitContent}>
                                <h3 className={styles.benefitTitle}>Preventive Care</h3>
                                <p className={styles.benefitText}>
                                    Stop problems before they start with regular maintenance and updates. Protect
                                    against viruses and security threats.
                                </p>
                            </div>
                        </li>
                        <li className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <FaGraduationCap size={24} />
                            </div>
                            <div className={styles.benefitContent}>
                                <h3 className={styles.benefitTitle}>Empowerment Through Education</h3>
                                <p className={styles.benefitText}>
                                    Learn to handle common issues independently. Build confidence with technology
                                    through guided learning.
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                <section className={styles.pricingSection}>
                    <h2 className={styles.pricingTitle}>Simple Pricing</h2>
                    <div className={styles.pricingGrid}>
                        <div className={styles.pricingCard}>
                            <h3 className={styles.price}>$89/month</h3>
                            <h4 className={styles.serviceTitle}>Family Basic</h4>
                            <p className={styles.priceDescription}>
                                • Up to 3 devices
                                <br />
                                • Monthly maintenance
                                <br />
                                • Remote support
                                <br />• Basic security setup
                            </p>
                        </div>

                        <div className={styles.pricingCard}>
                            <h3 className={styles.price}>$149/month</h3>
                            <h4 className={styles.serviceTitle}>Family Plus</h4>
                            <p className={styles.priceDescription}>
                                • Up to 6 devices
                                <br />
                                • Priority support
                                <br />
                                • Monthly training session
                                <br />• Advanced security package
                            </p>
                        </div>
                    </div>
                </section>

                <div className={styles.ctaSection}>
                    <Link to="/contact" className={styles.ctaButton}>
                        Get Started Today
                    </Link>
                </div>
            </main>
        </div>
    );
}
