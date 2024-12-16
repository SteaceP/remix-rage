import { FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";

export function Footer() {
  const styles = {
    footer: "mt-auto flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
    socialLinks: "flex space-x-8",
    socialIcon: "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110",
    copyright: "mt-4 text-sm text-gray-500 dark:text-gray-400"
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.socialLinks}>
        <a
          href="https://github.com/SteaceP"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://twitter.com/PaquetteSteacy"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://facebook.com/steacyp"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
        >
          <FaFacebook size={24} />
        </a>
      </div>
      <p className={styles.copyright}>© 2024 Code Rage. All rights reserved.</p>
    </footer>
  );
}