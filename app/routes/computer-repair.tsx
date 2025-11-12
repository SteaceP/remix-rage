import type { MetaFunction } from "react-router";
import { FaLaptopMedical, FaDesktop, FaTools, FaNetworkWired, FaWrench, FaSprayCan } from "react-icons/fa";
import { Link } from "react-router";
import { page, serviceCards, pricing, cta, utilities } from "~/styles/sections";

export const meta: MetaFunction = () => {
    return [
        { title: "Computer Repair Services - Code Rage" },
        {
            name: "description",
            content:
                "Professional computer repair services. Fast, reliable fixes for all your PC and laptop issues, including hardware repairs, virus removal, and system optimization.",
        },
    ];
};

export default function ComputerRepair() {
    return (
        <div className={page.layout}>
            <header className={page.header}>
                <h1 className={page.heading}>
                    Professional <span className={page.headingSpan}>Computer Repair</span>
                </h1>
                <h2 className={page.subheading}>Fast & Reliable Tech Solutions</h2>
                <p className={page.paragraph}>
                    Expert computer repair services for all your PC and laptop needs. Quick turnaround times and
                    competitive pricing.
                </p>
            </header>

            <main className={page.main}>
                <section className={page.section}>
                    <h2 className={page.sectionTitle}>My Services</h2>
                    <div className={serviceCards.grid}>
                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaLaptopMedical size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Hardware Repairs</h3>
                            <p className={serviceCards.description}>
                                Screen replacement, keyboard repairs, battery replacement, and other hardware fixes for
                                laptops and desktops.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaDesktop size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Software Solutions</h3>
                            <p className={serviceCards.description}>
                                Virus removal, operating system installation, software troubleshooting, and data
                                recovery services.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaTools size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Performance Optimization</h3>
                            <p className={serviceCards.description}>
                                System cleanup, memory upgrades, SSD installation, and performance tuning for faster
                                computing.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaNetworkWired size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Network Setup</h3>
                            <p className={serviceCards.description}>
                                Home and small business network configuration, WiFi optimization, and security setup.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaWrench size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Custom PC Building</h3>
                            <p className={serviceCards.description}>
                                Custom-built computers tailored to your needs, whether for gaming, content creation, or
                                business use. Expert component selection and assembly.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <div className={serviceCards.iconWrapper}>
                                <FaSprayCan size={32} />
                            </div>
                            <h3 className={serviceCards.title}>Deep Cleaning Service</h3>
                            <p className={serviceCards.description}>
                                Professional cleaning of computer components, including dust removal, thermal paste
                                replacement, and fan maintenance for optimal performance.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={utilities.imageSection}>
                    <img
                        src="/assets/images/monster_repair.png"
                        alt="Computer Repair Service"
                        className={utilities.image}
                    />
                </section>

                <section className={page.section}>
                    <h2 className={page.sectionTitle}>Pricing</h2>
                    <div className={pricing.grid}>
                        <div className={pricing.card}>
                            <h3 className={pricing.price}>$29</h3>
                            <h4 className={pricing.title}>Diagnostic Service</h4>
                            <p className={pricing.description}>
                                Complete system diagnosis and repair estimate. Fee waived if you proceed with repairs.
                            </p>
                        </div>

                        <div className={pricing.card}>
                            <h3 className={pricing.price}>From $69</h3>
                            <h4 className={pricing.title}>Repair Service</h4>
                            <p className={pricing.description}>
                                Most repairs completed same day. Parts cost additional if needed and shipping delay may
                                be required.
                            </p>
                        </div>
                    </div>
                </section>

                <div className={cta.ctaSection}>
                    <Link to="/contact" className={cta.ctaButton}>
                        Schedule a Repair
                    </Link>
                </div>
            </main>
        </div>
    );
}
