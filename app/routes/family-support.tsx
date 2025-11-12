import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FaUsers, FaLaptop, FaShieldAlt, FaGraduationCap } from "react-icons/fa";
import { page, serviceCards, pricing, cta } from "~/styles/sections";

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

export default function FamilySupport() {
    return (
        <div className={page.layout}>
            <header className={page.header}>
                <h1 className={page.heading}>
                    Family <span className={page.headingSpan}>Tech Support</span>
                </h1>
                <h2 className={page.subheading}>Patient, Understanding, Effective</h2>
                <p className={page.paragraph}>
                    Tired of being the default tech support for your family? Let me help keep your family&apos;s devices
                    running smoothly with professional, patient support.
                </p>
            </header>

            <main className={page.main}>
                <section className={page.section}>
                    <h2 className={page.sectionTitle}>Services Offered</h2>
                    <div className={serviceCards.gridTwoCol}>
                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaUsers size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Family Tech Setup</h3>
                            <p className={serviceCards.description}>
                                Complete setup and configuration of new devices, including computers, tablets, printers,
                                and home networks. Making technology work for everyone in the family.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaLaptop size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Ongoing Support</h3>
                            <p className={serviceCards.description}>
                                Regular maintenance, updates, and troubleshooting to keep everything running smoothly.
                                Quick response times for urgent issues.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaShieldAlt size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Security & Safety</h3>
                            <p className={serviceCards.description}>
                                Setup of parental controls, antivirus protection, and safe browsing measures. Keep your
                                family safe online while maintaining privacy.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaGraduationCap size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Training & Education</h3>
                            <p className={serviceCards.description}>
                                Patient, easy-to-understand training sessions for family members of all ages. Learn to
                                use devices and software confidently.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={page.section}>
                    <h2 className={page.sectionTitle}>Why Choose Professional Family Support?</h2>
                    <ul className="list-none space-y-6 mb-16">
                        <li className="flex items-start gap-4">
                            <div className="shrink-0 mt-1 text-blue-600 dark:text-blue-400">
                                <FaUsers size={24} />
                            </div>
                            <div className="grow">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    Patient & Understanding
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    No question is too basic. I provide clear, jargon-free explanations and take the
                                    time to ensure everyone understands.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="shrink-0 mt-1 text-blue-600 dark:text-blue-400">
                                <FaShieldAlt size={24} />
                            </div>
                            <div className="grow">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Preventive Care</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Stop problems before they start with regular maintenance and updates. Protect
                                    against viruses and security threats.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="shrink-0 mt-1 text-blue-600 dark:text-blue-400">
                                <FaGraduationCap size={24} />
                            </div>
                            <div className="grow">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    Empowerment Through Education
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Learn to handle common issues independently. Build confidence with technology
                                    through guided learning.
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                <section className={pricing.section}>
                    <h2 className={page.sectionTitle}>Simple Pricing</h2>
                    <div className={pricing.grid}>
                        <div className={pricing.card}>
                            <h3 className={pricing.price}>$89/month</h3>
                            <h4 className={pricing.title}>Family Basic</h4>
                            <p className={pricing.description}>
                                • Up to 3 devices
                                <br />
                                • Monthly maintenance
                                <br />
                                • Remote support
                                <br />• Basic security setup
                            </p>
                        </div>

                        <div className={pricing.card}>
                            <h3 className={pricing.price}>$149/month</h3>
                            <h4 className={pricing.title}>Family Plus</h4>
                            <p className={pricing.description}>
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

                <div className={cta.ctaSection}>
                    <Link to="/contact" className={cta.ctaButton}>
                        Get Started Today
                    </Link>
                </div>
            </main>
        </div>
    );
}
