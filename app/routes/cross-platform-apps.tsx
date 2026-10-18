import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FaMobileAlt, FaDesktop, FaCode, FaRocket, FaArrowRight, FaCheckCircle } from "react-icons/fa";

export const meta: MetaFunction = () => {
    return [
        { title: "Cross-Platform App Development — Code Rage" },
        {
            name: "description",
            content:
                "Professional cross-platform app development services. Build once, deploy everywhere with modern frameworks and native performance.",
        },
    ];
};

export default function CrossPlatformApps() {
    const solutions = [
        {
            icon: FaMobileAlt,
            tag: "iOS & ANDROID",
            title: "Mobile Apps",
            description:
                "Native-quality iOS and Android apps from a single codebase. Optimized for 60/120fps animations, offline storage, and native device APIs.",
            points: [
                "App Store & Google Play deployment",
                "Push notifications & biometric auth",
                "Shared TypeScript/Dart business logic",
            ],
        },
        {
            icon: FaDesktop,
            tag: "WINDOWS • MACOS • LINUX",
            title: "Desktop Applications",
            description:
                "Lightweight, secure desktop apps with full OS integration, file-system access, system tray support, and minimal memory footprint.",
            points: [
                "Tauri (Rust) & Electron architectures",
                "Native installers & auto-updaters",
                "Hardware & local database integration",
            ],
        },
        {
            icon: FaCode,
            tag: "INSTALLABLE WEB",
            title: "Web Applications (PWA)",
            description:
                "Progressive Web Apps that work offline, sync in the background, and can be installed directly onto any desktop or mobile home screen.",
            points: ["Service Worker offline caching", "Zero app-store friction", "Responsive across all viewports"],
        },
        {
            icon: FaRocket,
            tag: "FAST ITERATION",
            title: "Rapid Development",
            description:
                "Fast development cycles with hot reload, strict static typing, and automated CI/CD builds for faster time to market.",
            points: [
                "Single unified codebase to maintain",
                "Consistent UI design system",
                "Predictable release pipelines",
            ],
        },
    ];

    const technologies = [
        { name: "React Native", category: "Mobile" },
        { name: "Flutter", category: "Multi-Platform" },
        { name: "Swift", category: "iOS / macOS" },
        { name: "Tauri", category: "Lightweight Desktop" },
        { name: "Electron", category: "Desktop" },
        { name: "PWA", category: "Installable Web" },
        { name: "TypeScript", category: "Core Language" },
        { name: "Rust", category: "Systems & Native" },
        { name: "WASM", category: "High-Performance Web" },
    ];

    const process = [
        {
            step: "01",
            title: "Design",
            description: "Platform-specific UI/UX design that respects native conventions on each target OS.",
        },
        {
            step: "02",
            title: "Develop",
            description: "Efficient engineering with shared state, business logic, and native bridges.",
        },
        {
            step: "03",
            title: "Test",
            description: "Comprehensive automated and real-device testing across all target platforms.",
        },
        {
            step: "04",
            title: "Deploy",
            description: "Streamlined code-signing and release to App Store, Google Play, and desktop installers.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Editorial Header */}
            <header className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern mask-radial-fade pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mb-4">
                        <span>02 // MULTI-PLATFORM ENGINEERING</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl">
                        Cross-Platform <span className="text-blue-600 dark:text-blue-400">App Development</span>
                    </h1>
                    <h2 className="text-xl md:text-2xl mt-4 font-display font-medium text-slate-700 dark:text-slate-300">
                        One Codebase, Multiple Platforms
                    </h2>
                    <p className="text-base md:text-lg mt-4 text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        Build powerful applications that run seamlessly across mobile, desktop, and web. Save
                        engineering time and budget while maintaining native performance and user experience.
                    </p>
                </div>
            </header>

            <main className="grow flex flex-col px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full max-w-7xl mx-auto gap-20">
                {/* Solutions Grid */}
                <section className="w-full">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // TARGET PLATFORMS
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            My Cross-Platform Solutions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {solutions.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white dark:bg-slate-900 rounded-2xl p-7 md:p-8 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-4 mb-5">
                                            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                                                <Icon size={22} />
                                            </div>
                                            <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base mb-6">
                                            {item.description}
                                        </p>
                                    </div>
                                    <ul className="space-y-2 pt-5 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                        {item.points.map((pt) => (
                                            <li key={pt} className="flex items-center gap-2.5">
                                                <FaCheckCircle className="text-emerald-500 shrink-0 w-4 h-4" />
                                                <span>{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Tech Stack Matrix */}
                <section className="w-full">
                    <div className="mb-8">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // TOOLING &amp; RUNTIMES
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Technologies &amp; Languages I Use
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                        {technologies.map((tech) => (
                            <div
                                key={tech.name}
                                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between"
                            >
                                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase">
                                    {tech.category}
                                </span>
                                <span className="text-base font-display font-bold text-slate-900 dark:text-white mt-1">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Development Process */}
                <section className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200/90 dark:border-slate-800">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // LIFECYCLE
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Development Process
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {process.map((item) => (
                            <div
                                key={item.step}
                                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800"
                            >
                                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-3">
                                    PHASE // {item.step}
                                </div>
                                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="w-full px-6 py-12 md:p-14 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-lg">
                    <div className="space-y-2 max-w-xl">
                        <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                            MULTI-PLATFORM ARCHITECTURE
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold">
                            Ready to ship your app everywhere?
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base">
                            Let&apos;s discuss your target platforms, feature set, and release roadmap.
                        </p>
                    </div>
                    <Link
                        to="/contact?service=Cross-Platform%20App%20Development"
                        className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors text-sm md:text-base shrink-0"
                    >
                        <span>Start Your Project</span>
                        <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
