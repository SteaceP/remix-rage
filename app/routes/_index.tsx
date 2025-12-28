import type { Route } from "./+types/_index";
import { Link } from "react-router";
import { FaCode, FaTools, FaStar, FaUserClock } from "react-icons/fa";
import { homeHero, homeFeatures, homeServices, homeCta, homeLayout } from "~/styles/sections";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Code Rage - Professional Tech Services" },
        {
            name: "description",
            content:
                "Expert computer repair and web development services. Fast, reliable, and professional solutions for all your tech needs.",
        },
    ];
}

export default function Index() {
    return (
        <main className={homeLayout.main}>
            {/* Hero Section */}
            <section id="hero" className={homeHero.section}>
                {/* Background decoration */}
                <div className={homeHero.bgDecoration}>
                    <div className={homeHero.bgCircle1} />
                    <div className={homeHero.bgCircle2} />
                </div>

                <div className={homeHero.content}>
                    <div className={homeHero.textContainer}>
                        <h1 className={homeHero.title}>
                            Tech Solutions <br />
                            <span className={homeHero.titleSpan}>That Work</span>
                        </h1>
                        <p className={homeHero.subtitle}>
                            From website development to computer repairs, I provide professional tech services that help
                            you stay ahead in the digital world.
                        </p>
                        <div className={homeHero.ctaContainer}>
                            <Link to="/contact" className={homeHero.primaryButton}>
                                Get Started Today
                            </Link>
                            <Link to="#services" className={homeHero.secondaryButton}>
                                View Services
                            </Link>
                        </div>
                    </div>
                    <div className={homeHero.imageContainer}>
                        {/* Creative "That's me" Badge */}
                        <div className={homeHero.badgeContainer}>
                            <div className={homeHero.badge}>
                                <div className={homeHero.badgePulse} />
                                <div className={homeHero.badgeMain}>
                                    <span className={homeHero.badgeIcon}>👋</span>
                                    <span className={homeHero.badgeText}>That&apos;s me!</span>
                                </div>
                                <div className={homeHero.badgePointer} />
                                <div className={homeHero.badgePointer2} />
                                <div className={homeHero.badgePointer3} />
                            </div>
                        </div>

                        <img
                            src="/assets/images/tech-hero.jpg"
                            alt="Steace Paquette - Professional Tech Services"
                            className={homeHero.image}
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={homeFeatures.section}>
                <div className={homeFeatures.grid}>
                    <div className={homeFeatures.card}>
                        <div className={homeFeatures.icon}>
                            <FaUserClock size={32} />
                        </div>
                        <h3 className={homeFeatures.title}>Quick Response</h3>
                        <p className={homeFeatures.text}>Fast turnaround times and reliable service</p>
                    </div>

                    <div className={homeFeatures.card}>
                        <div className={homeFeatures.icon}>
                            <FaTools size={32} />
                        </div>
                        <h3 className={homeFeatures.title}>Expert Service</h3>
                        <p className={homeFeatures.text}>Professional and experienced technician</p>
                    </div>

                    <div className={homeFeatures.card}>
                        <div className={homeFeatures.icon}>
                            <FaCode size={32} />
                        </div>
                        <h3 className={homeFeatures.title}>Modern Solutions</h3>
                        <p className={homeFeatures.text}>Latest technologies and best practices</p>
                    </div>

                    <div className={homeFeatures.card}>
                        <div className={homeFeatures.icon}>
                            <FaStar size={32} />
                        </div>
                        <h3 className={homeFeatures.title}>Quality Work</h3>
                        <p className={homeFeatures.text}>Satisfaction guaranteed on all services</p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className={homeServices.section}>
                <div className={homeServices.content}>
                    <h2 className={homeServices.title}>Services I Offer</h2>
                    <p className={homeServices.subtitle}>
                        Comprehensive tech solutions tailored to your needs, delivered with expertise and passion
                    </p>
                    <div className={homeServices.grid}>
                        <div className={homeServices.card}>
                            <h2 className={homeServices.cardTitle}>Website Development</h2>
                            <p className={homeServices.cardDescription}>
                                Modern, responsive websites built with the latest technologies. Perfect for businesses
                                looking to establish or improve their online presence.
                            </p>
                            <Link to="/website-development" className={homeServices.cardButton}>
                                Learn More
                            </Link>
                        </div>

                        <div className={homeServices.card}>
                            <h2 className={homeServices.cardTitle}>Cross-Platform Apps</h2>
                            <p className={homeServices.cardDescription}>
                                Need your app to work everywhere? I build applications that run seamlessly across
                                desktop, mobile, and web platforms using modern frameworks.
                            </p>
                            <Link to="/cross-platform-apps" className={homeServices.cardButton}>
                                Learn More
                            </Link>
                        </div>

                        <div className={homeServices.card}>
                            <h2 className={homeServices.cardTitle}>Computer Repair</h2>
                            <p className={homeServices.cardDescription}>
                                Professional computer repair services including hardware fixes, software
                                troubleshooting, and performance optimization.
                            </p>
                            <Link to="/computer-repair" className={homeServices.cardButton}>
                                Learn More
                            </Link>
                        </div>

                        <div className={homeServices.card}>
                            <h2 className={homeServices.cardTitle}>Family Tech Support</h2>
                            <p className={homeServices.cardDescription}>
                                Tired of being the default tech support for your family? I provide patient,
                                easy-to-understand guidance and preventive measures to keep your family&apos;s computers
                                running smoothly.
                            </p>
                            <Link to="/family-support" className={homeServices.cardButton}>
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className={homeCta.section}>
                {/* Background decoration */}
                <div className={homeCta.bgDecoration}>
                    <div className={homeCta.bgCircle1} />
                    <div className={homeCta.bgCircle2} />
                </div>

                <div className={homeCta.content}>
                    <h2 className={homeCta.title}>Ready to Get Started?</h2>
                    <p className={homeCta.text}>
                        Let&apos;s work together to solve your tech challenges and bring your ideas to life.
                    </p>
                    <Link to="/contact" className={homeCta.button}>
                        Contact Me Today
                    </Link>
                </div>
            </section>
        </main>
    );
}
