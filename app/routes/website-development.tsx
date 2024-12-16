import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Website Development Services - Code Rage" },
    {
      name: "description",
      content: "Professional website development and repair services. Transform your online presence with modern, responsive websites built with the latest technologies.",
    },
  ];
};

const styles = {
  layout: "flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900",
  
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
  serviceTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-4",
  serviceDescription: "text-gray-600 dark:text-gray-300",
  
  featuresList: "list-disc list-inside space-y-3 text-gray-600 dark:text-gray-300 mb-8",
  
  ctaSection: "text-center mt-12",
  ctaButton: "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-lg hover:opacity-90 transition-opacity",
};

export default function WebsiteDevelopment() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.heading}>
          Professional <span className={styles.headingSpan}>Website Development</span>
        </h1>
        <h2 className={styles.subheading}>Transform Your Online Presence</h2>
        <p className={styles.paragraph}>
          From new websites to repairs and upgrades, I deliver modern solutions that drive results.
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Services</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>New Website Development</h3>
              <p className={styles.serviceDescription}>
                Get a custom-built, modern website that perfectly represents your brand. Using the latest technologies like React, TypeScript, and TailwindCSS, I create fast, responsive, and user-friendly websites that convert visitors into customers.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>Website Repair & Optimization</h3>
              <p className={styles.serviceDescription}>
                Is your existing website showing its age or experiencing issues? I can diagnose and fix problems, upgrade outdated components, and optimize performance to give your site new life.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Choose My Services?</h2>
          <ul className={styles.featuresList}>
            <li>Modern tech stack using React, TypeScript, and other cutting-edge technologies</li>
            <li>Mobile-first, responsive designs that work on all devices</li>
            <li>Search engine optimization (SEO) best practices built-in</li>
            <li>Performance optimization for fast loading speeds</li>
            <li>Secure, scalable, and maintainable code architecture</li>
            <li>Ongoing support and maintenance available</li>
          </ul>
        </section>

        <div className={styles.ctaSection}>
          <Link to="/contact" className={styles.ctaButton}>
            Schedule a Free Consultation
          </Link>
        </div>
      </main>
    </div>
  );
} 