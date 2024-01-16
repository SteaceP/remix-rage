import type { MetaFunction } from "@remix-run/cloudflare";
import { FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "Code Rage" },
    {
      name: "description",
      content:
        "Welcome to Code Rage! The website is going for a overhaul! Please be patient.",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center flex-grow">
          Welcome to <span className="font-bold">Code Rage</span>
        </h1>
        <h3>This website is under RE-construction</h3>
        <p>Please be patient...</p>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-grow justify-center">
        <img
          src="/assets/images/website-rebuild.jpg"
          alt="Code Rage Website Rebuild"
          className="w-3/4 md:w-1/2"
        />
      </main>

      {/* Footer Section */}
      <footer className="flex flex-col items-center justify-center p-4">
        <div className="flex space-x-6">
          <a
            href="https://github.com/SteaceP"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://twitter.com/PaquetteSteacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://facebook.com/steacyp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={24} />
          </a>
        </div>

        <p className="mt-4">© 2024 Code Rage. All rights reserved.</p>
      </footer>
    </div>
  );
}
