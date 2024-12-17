import { FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";
import { footer } from "~/styles/components";

export default function Footer() {
    return (
        <footer className={footer.footer}>
            <div className={footer.socialLinks}>
                <a
                    href="https://github.com/SteaceP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footer.socialIcon}
                >
                    <FaGithub size={24} />
                </a>
                <a
                    href="https://twitter.com/PaquetteSteacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footer.socialIcon}
                >
                    <FaTwitter size={24} />
                </a>
                <a
                    href="https://facebook.com/steacyp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footer.socialIcon}
                >
                    <FaFacebook size={24} />
                </a>
            </div>
            <p className={footer.copyright}>© 2024 Code Rage. All rights reserved.</p>
        </footer>
    );
}
