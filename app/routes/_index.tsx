import type { MetaFunction } from "@remix-run/cloudflare";

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
    <>
      <header className="flex justify-center items-center flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Welcome to Code Rage</h1>
        <h3 className="text-lg">This website is under RE-construction</h3>
        <p className="text-base">Please be patient.</p>
      </header>
      <main className="flex justify-center items-center mt-8">
        <div className="flex justify-center items-center overflow-auto">
          <img
            src="/assets/images/website-rebuild.jpg"
            alt="Code Rage Website Rebuild"
            className="max-w-full h-auto"
          />
        </div>
      </main>
      <footer className="text-center mt-8 absolute bottom-0">
        <div className="flex justify-center items-center">
          <p className="mx-auto">© 2024 Code Rage. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
