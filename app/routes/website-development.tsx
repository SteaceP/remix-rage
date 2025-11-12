import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { page, serviceCards, cta, utilities } from "~/styles/sections";

export const meta: MetaFunction = () => {
    return [
        { title: "Website Development Services - Code Rage" },
        {
            name: "description",
            content:
                "Professional website development and repair services. Transform your online presence with modern, responsive websites built with the latest technologies.",
        },
    ];
};

export default function WebsiteDevelopment() {
    return (
        <div className={page.layout}>
            <header className={page.header}>
                <h1 className={page.heading}>
                    Professional <span className={page.headingSpan}>Website Development</span>
                </h1>
                <h2 className={page.subheading}>Transform Your Online Presence</h2>
                <p className={page.paragraph}>
                    From new websites to repairs and upgrades, I deliver modern solutions that drive results.
                </p>
            </header>

            <main className={page.main}>
                <section className={page.section}>
                    <h2 className={page.sectionTitle}>My Services</h2>
                    <div className={serviceCards.gridTwoCol}>
                        <div className={serviceCards.card}>
                            <h3 className={serviceCards.title}>New Website Development</h3>
                            <p className={serviceCards.description}>
                                Get a custom-built, modern website that perfectly represents your brand. Using the
                                latest technologies like React, TypeScript, and TailwindCSS, I create fast, responsive,
                                and user-friendly websites that convert visitors into customers.
                            </p>
                        </div>

                        <div className={serviceCards.card}>
                            <h3 className={serviceCards.title}>Website Repair & Optimization</h3>
                            <p className={serviceCards.description}>
                                Is your existing website showing its age or experiencing issues? I can diagnose and fix
                                problems, upgrade outdated components, and optimize performance to give your site new
                                life.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={page.section}>
                    <h2 className={page.sectionTitle}>Why Choose My Services?</h2>
                    <ul className={utilities.featuresList}>
                        <li>Modern tech stack using React, TypeScript, and other cutting-edge technologies</li>
                        <li>Mobile-first, responsive designs that work on all devices</li>
                        <li>Search engine optimization (SEO) best practices built-in</li>
                        <li>Performance optimization for fast loading speeds</li>
                        <li>Secure, scalable, and maintainable code architecture</li>
                        <li>Ongoing support and maintenance available</li>
                    </ul>
                </section>

                <div className={cta.ctaSection}>
                    <Link to="/contact" className={cta.ctaButton}>
                        Schedule a Free Consultation
                    </Link>
                </div>
            </main>
        </div>
    );
}
