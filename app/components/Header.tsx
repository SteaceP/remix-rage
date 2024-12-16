import { Link } from "@remix-run/react";

import { ScrollingBanner } from "./ScrollingBanner";

const styles = {
  header: "sticky top-0 flex flex-col md:flex-row items-center justify-between py-2 md:py-3 px-4 md:px-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm",
  logoContainer: "flex items-center mb-2 md:mb-0",
  logo: "h-12 w-auto",
  nav: "flex flex-wrap justify-center gap-2 md:gap-4",
  navLink: "px-3 py-1.5 text-sm md:text-base rounded-md font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
  activeNavLink: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  banner: "relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800",
  bannerContent: "whitespace-nowrap absolute py-1.5 text-sm font-medium text-white inline-flex",
};


export function Header() {
  return (
    <>
      <ScrollingBanner 
        text={`If you miss the Code Rage Blog, I do too! It's gonna be here soon™`}
        speed={60}
      />
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <picture>
            <source
              srcSet="/assets/logo/logo-dark.png"
              media="(prefers-color-scheme: dark)"
            />
            <img
              src="/assets/logo/logo-light.png"
              alt="Code Rage Logo"
              className={styles.logo}
            />
          </picture>
        </div>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/website-development" className={styles.navLink}>
            Website Development
          </Link>
        </nav>
      </header>
    </>
  );
}