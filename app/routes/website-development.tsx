import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import {
    FaCode,
    FaWrench,
    FaBolt,
    FaSearch,
    FaMobileAlt,
    FaLock,
    FaCheckCircle,
    FaArrowRight,
    FaServer,
} from "react-icons/fa";

export const meta: MetaFunction = () => {
    return [
        { title: "Website Development Services — Code Rage" },
        {
            name: "description",
            content:
                "Professional website development and repair services. Transform your online presence with modern, responsive websites built with the latest technologies.",
        },
    ];
};

export default function WebsiteDevelopment() {
    const capabilities = [
        {
            icon: FaCode,
            title: "Modern Tech Stack",
            text: "Engineered with React, TypeScript, Tailwind CSS, and modern edge runtimes for rock-solid reliability.",
        },
        {
            icon: FaMobileAlt,
            title: "Mobile-First & Responsive",
            text: "Fluid layouts that look and feel native across phones, tablets, laptops, and ultra-wide monitors.",
        },
        {
            icon: FaSearch,
            title: "SEO & Semantic Markup",
            text: "Search engine optimization best practices, structured metadata, and fast SSR built in from day one.",
        },
        {
            icon: FaBolt,
            title: "Sub-Second Performance",
            text: "Optimized asset delivery, edge caching, and minimal bundle overhead for instant page loads.",
        },
        {
            icon: FaLock,
            title: "Secure & Maintainable",
            text: "Strict CSP headers, origin verification, rate limiting, and clean modular code architecture.",
        },
        {
            icon: FaServer,
            title: "Ongoing Support & Care",
            text: "Continuous updates, uptime monitoring, and feature iterations whenever your business grows.",
        },
    ];

    const processSteps = [
        {
            step: "01",
            title: "Discovery & Scope",
            desc: "We clarify your goals, target audience, required features, and timeline with a transparent fixed or milestone estimate.",
        },
        {
            step: "02",
            title: "Architecture & UI Design",
            desc: "Clean wireframes and responsive component systems designed around conversion, accessibility, and brand clarity.",
        },
        {
            step: "03",
            title: "Clean Engineering",
            desc: "Full-stack implementation using React, TypeScript, and automated testing so everything works reliably.",
        },
        {
            step: "04",
            title: "Launch & Optimization",
            desc: "Zero-downtime deployment, custom domain & SSL configuration, and post-launch performance verification.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Editorial Page Header */}
            <header className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern mask-radial-fade pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mb-4">
                        <span>01 // WEB ENGINEERING</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl">
                        Professional <span className="text-blue-600 dark:text-blue-400">Website Development</span>
                    </h1>
                    <h2 className="text-xl md:text-2xl mt-4 font-display font-medium text-slate-700 dark:text-slate-300">
                        Transform Your Online Presence
                    </h2>
                    <p className="text-base md:text-lg mt-4 text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        From greenfield custom websites to rescuing and optimizing existing platforms, I deliver modern
                        web solutions engineered to convert visitors into customers.
                    </p>
                </div>
            </header>

            <main className="grow flex flex-col px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full max-w-7xl mx-auto gap-20">
                {/* Core Offerings */}
                <section className="w-full">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // DELIVERABLES
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            My Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 md:p-8 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="inline-flex p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-5">
                                    <FaCode size={24} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    New Website Development
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base mb-6">
                                    Get a custom-built, modern website that perfectly represents your brand. Using the
                                    latest technologies like React, TypeScript, and TailwindCSS, I create fast,
                                    responsive, and user-friendly websites that convert visitors into customers.
                                </p>
                            </div>
                            <ul className="space-y-2.5 pt-5 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex items-center gap-2.5">
                                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                                    <span>Custom UI/UX tailored to your brand identity</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                                    <span>Real-time chat, booking flows &amp; API integrations</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                                    <span>Edge-deployed for instant global loading</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 md:p-8 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="inline-flex p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-5">
                                    <FaWrench size={24} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    Website Repair &amp; Optimization
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base mb-6">
                                    Is your existing website showing its age or experiencing issues? I can diagnose and
                                    fix problems, upgrade outdated components, and optimize performance to give your
                                    site new life.
                                </p>
                            </div>
                            <ul className="space-y-2.5 pt-5 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex items-center gap-2.5">
                                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                                    <span>Broken layout, UI &amp; mobile responsiveness fixes</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                                    <span>Dependency upgrades &amp; security patching</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                                    <span>Lighthouse speed &amp; Core Web Vitals tuning</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Why Choose My Services */}
                <section className="w-full">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // ENGINEERING STANDARDS
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Why Choose My Services?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((cap) => {
                            const Icon = cap.icon;
                            return (
                                <div
                                    key={cap.title}
                                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800"
                                >
                                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 w-fit mb-4">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                                        {cap.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {cap.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Process Blueprint */}
                <section className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200/90 dark:border-slate-800">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // WORKFLOW
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            How We Build Together
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {processSteps.map((item) => (
                            <div
                                key={item.step}
                                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800"
                            >
                                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-3">
                                    STEP // {item.step}
                                </div>
                                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="w-full px-6 py-12 md:p-14 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-lg">
                    <div className="space-y-2 max-w-xl">
                        <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                            FREE INITIAL CONSULTATION
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold">
                            Ready to launch or modernize your website?
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base">
                            Tell me about your goals and timeline, and I&apos;ll put together a clear plan.
                        </p>
                    </div>
                    <Link
                        to="/contact?service=Website%20Development"
                        className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors text-sm md:text-base shrink-0"
                    >
                        <span>Schedule a Free Consultation</span>
                        <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
