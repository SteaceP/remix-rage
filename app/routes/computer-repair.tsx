import type { MetaFunction } from "@remix-run/cloudflare";
import { FaLaptopMedical, FaDesktop, FaTools, FaNetworkWired, FaWrench, FaSprayCan } from "react-icons/fa";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Computer Repair Services - Code Rage" },
    {
      name: "description",
      content: "Professional computer repair services. Fast, reliable fixes for all your PC and laptop issues, including hardware repairs, virus removal, and system optimization.",
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
  
  servicesGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16",
  serviceCard: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl",
  iconWrapper: "mb-4 text-blue-600 dark:text-blue-400",
  serviceTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-4",
  serviceDescription: "text-gray-600 dark:text-gray-300",
  
  imageSection: "relative w-full max-w-2xl mx-auto mb-16",
  image: "w-full h-auto rounded-xl",
  
  pricingGrid: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16",
  pricingCard: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8",
  price: "text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4",
  priceDescription: "text-gray-600 dark:text-gray-300 mb-4",
  
  ctaSection: "text-center mt-12",
  ctaButton: "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-lg hover:opacity-90 transition-opacity",
};

export default function ComputerRepair() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.heading}>
          Professional <span className={styles.headingSpan}>Computer Repair</span>
        </h1>
        <h2 className={styles.subheading}>Fast & Reliable Tech Solutions</h2>
        <p className={styles.paragraph}>
          Expert computer repair services for all your PC and laptop needs. Quick turnaround times and competitive pricing.
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Services</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.iconWrapper}>
                <FaLaptopMedical size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Hardware Repairs</h3>
              <p className={styles.serviceDescription}>
                Screen replacement, keyboard repairs, battery replacement, and other hardware fixes for laptops and desktops.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.iconWrapper}>
                <FaDesktop size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Software Solutions</h3>
              <p className={styles.serviceDescription}>
                Virus removal, operating system installation, software troubleshooting, and data recovery services.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.iconWrapper}>
                <FaTools size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Performance Optimization</h3>
              <p className={styles.serviceDescription}>
                System cleanup, memory upgrades, SSD installation, and performance tuning for faster computing.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.iconWrapper}>
                <FaNetworkWired size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Network Setup</h3>
              <p className={styles.serviceDescription}>
                Home and small business network configuration, WiFi optimization, and security setup.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.iconWrapper}>
                <FaWrench size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Custom PC Building</h3>
              <p className={styles.serviceDescription}>
                Custom-built computers tailored to your needs, whether for gaming, content creation, or business use. Expert component selection and assembly.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.iconWrapper}>
                <FaSprayCan size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Deep Cleaning Service</h3>
              <p className={styles.serviceDescription}>
                Professional cleaning of computer components, including dust removal, thermal paste replacement, and fan maintenance for optimal performance.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.imageSection}>
          <img 
            src="/assets/images/monster_repair.png" 
            alt="Computer Repair Service"
            className={styles.image}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pricing</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3 className={styles.price}>$29</h3>
              <h4 className={styles.serviceTitle}>Diagnostic Service</h4>
              <p className={styles.priceDescription}>
                Complete system diagnosis and repair estimate. Fee waived if you proceed with repairs.
              </p>
            </div>

            <div className={styles.pricingCard}>
              <h3 className={styles.price}>From $69</h3>
              <h4 className={styles.serviceTitle}>Repair Service</h4>
              <p className={styles.priceDescription}>
                Most repairs completed same day. Parts cost additional if needed and shipping delay may be required.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.ctaSection}>
          <Link to="/contact" className={styles.ctaButton}>
            Schedule a Repair
          </Link>
        </div>
      </main>
    </div>
  );
} 