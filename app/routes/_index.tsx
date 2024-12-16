import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { FaCode, FaTools, FaStar, FaUserClock, FaArrowRight } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "Code Rage - Professional Tech Services" },
    {
      name: "description",
      content: "Expert computer repair and web development services. Fast, reliable, and professional solutions for all your tech needs.",
    },
  ];
};

const styles = {
  // Layout
  main: "flex-grow flex flex-col items-center justify-start w-full",
  
  // Hero Section
  hero: "w-full px-4 py-24 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm",
  heroContent: "max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12",
  heroText: "flex-1 text-left",
  heroTitle: "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight",
  heroTitleSpan: "text-blue-600 dark:text-blue-400",
  heroSubtitle: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8",
  heroButtons: "flex flex-wrap gap-4",
  primaryButton: "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium",
  secondaryButton: "flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg transition-colors font-medium",
  heroImageContainer: "flex-1 relative max-w-sm",
  heroImage: "w-full h-auto rounded-xl shadow-2xl",
  arrowContainer: "absolute -top-12 left-[60%] -translate-x-1/2 text-blue-600 dark:text-blue-400",
  arrowText: "absolute left-[75%] -translate-x-1/2 -top-14 lg:-top-14 md:-top-20 font-handwriting text-lg text-blue-600 dark:text-blue-400",
  
  // Features Section
  featuresSection: "w-full py-16 px-4 bg-white dark:bg-gray-900",
  featuresGrid: "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
  featureCard: "flex flex-col items-center text-center p-6",
  featureIcon: "text-blue-600 dark:text-blue-400 mb-4",
  featureTitle: "text-lg font-semibold text-gray-900 dark:text-white mb-2",
  featureText: "text-gray-600 dark:text-gray-400",
  
  // Services Section
  servicesSection: "w-full py-16 px-4",
  servicesContent: "max-w-7xl mx-auto",
  sectionTitle: "text-3xl font-bold text-center text-gray-900 dark:text-white mb-12",
  cardsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
  card: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col h-full",
  cardTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-3",
  cardDescription: "text-gray-600 dark:text-gray-300 flex-grow",
  cardButton: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6",
  
  // CTA Section
  ctaSection: "w-full py-16 px-4 bg-gray-50 dark:bg-gray-800",
  ctaContent: "max-w-4xl mx-auto text-center",
  ctaTitle: "text-3xl font-bold text-gray-900 dark:text-white mb-6",
  ctaText: "text-xl text-gray-600 dark:text-gray-300 mb-8",
};

export default function Index() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Tech Solutions <br />
              <span className={styles.heroTitleSpan}>That Work</span>
            </h1>
            <p className={styles.heroSubtitle}>
              From website development to computer repairs, I provide professional tech services 
              that help you stay ahead in the digital world.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/website-development" className={styles.primaryButton}>
                Get Started <FaArrowRight />
              </Link>
              <button className={styles.secondaryButton}>
                Learn More <FaArrowRight />
              </button>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <img 
              src="/assets/images/tech-hero.jpg" 
              alt="Professional Tech Services"
              className={styles.heroImage}
            />
            <div className={styles.arrowContainer}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="animate-draw-arrow">
                <path 
                  d="M40 10 L10 40 M10 25 L10 40 L25 40"
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className={styles.arrowText}>That&apos;s me!</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaUserClock size={32} />
            </div>
            <h3 className={styles.featureTitle}>Quick Response</h3>
            <p className={styles.featureText}>
              Fast turnaround times and reliable service
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaTools size={32} />
            </div>
            <h3 className={styles.featureTitle}>Expert Service</h3>
            <p className={styles.featureText}>
              Professional and experienced technician
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaCode size={32} />
            </div>
            <h3 className={styles.featureTitle}>Modern Solutions</h3>
            <p className={styles.featureText}>
              Latest technologies and best practices
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaStar size={32} />
            </div>
            <h3 className={styles.featureTitle}>Quality Work</h3>
            <p className={styles.featureText}>
              Satisfaction guaranteed on all services
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContent}>
          <h2 className={styles.sectionTitle}>Services I Offer</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Website Development</h2>
              <p className={styles.cardDescription}>
                Modern, responsive websites built with the latest technologies. Perfect for businesses looking to establish or improve their online presence.
              </p>
              <Link to="/website-development" className={styles.cardButton}>
                Learn More
              </Link>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Computer Repair</h2>
              <p className={styles.cardDescription}>
                Professional computer repair services including hardware fixes, software troubleshooting, and performance optimization.
              </p>
              <Link to="/computer-repair" className={styles.cardButton}>
                Learn More
              </Link>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Family Tech Support</h2>
              <p className={styles.cardDescription}>
                Tired of grandma breaking her PC? I provide patient, easy-to-understand guidance and preventive measures to keep your family&apos;s computers running smoothly.
              </p>
              <Link to="/family-support" className={styles.cardButton}>
                Learn More
              </Link>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Cross-Platform Apps</h2>
              <p className={styles.cardDescription}>
                Need your app to work everywhere? I build applications that run seamlessly across desktop, mobile, and web platforms using modern frameworks.
              </p>
              <Link to="/cross-platform" className={styles.cardButton}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaText}>
            Let&apos;s work together to solve your tech challenges and bring your ideas to life.
          </p>
          <Link to="/contact" className={styles.cardButton}>
            Contact Me Today
          </Link>
        </div>
      </section>
    </main>
  );
}
