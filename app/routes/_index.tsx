import type { Route } from "./+types/_index";
import { useState } from "react";
import { Link } from "react-router";
import {
    FaCode,
    FaTools,
    FaStar,
    FaUserClock,
    FaMobileAlt,
    FaUsers,
    FaArrowRight,
    FaCheckCircle,
    FaTerminal,
    FaMicrochip,
    FaShieldAlt,
} from "react-icons/fa";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Code Rage — Software Engineering & Tech Support Services" },
        {
            name: "description",
            content:
                "Custom website development, cross-platform apps, professional computer repair, and patient family tech support by Steace Paquette.",
        },
    ];
}

export default function Index() {
    const [activeTab, setActiveTab] = useState<"software" | "hardware">("software");

    const services = [
        {
            index: "01",
            category: "WEB ENGINEERING",
            title: "Website Development",
            description:
                "Custom-engineered websites and web applications built for speed, search visibility, and conversion—plus full diagnostics and modernization for aging sites.",
            path: "/website-development",
            contactParam: "Website Development",
            icon: FaCode,
            highlight: "React • TypeScript • Edge SSR",
            deliverables: [
                "Custom responsive design & architecture",
                "Core Web Vitals & SEO optimization",
                "Legacy site repair, security & upgrades",
            ],
        },
        {
            index: "02",
            category: "MULTI-PLATFORM",
            title: "Cross-Platform Apps",
            description:
                "Ship native-grade applications across iOS, Android, Windows, macOS, Linux, and the web from a unified, maintainable codebase.",
            path: "/cross-platform-apps",
            contactParam: "Cross-Platform App Development",
            icon: FaMobileAlt,
            highlight: "React Native • Flutter • Tauri • Rust",
            deliverables: [
                "Unified mobile & desktop engineering",
                "Offline-ready Progressive Web Apps (PWA)",
                "App Store & desktop binary deployment",
            ],
        },
        {
            index: "03",
            category: "HARDWARE & SYSTEMS",
            title: "Computer Repair & Custom PCs",
            description:
                "Fast, honest hardware fixes, virus recovery, thermal servicing, and custom-built workstations or gaming rigs tuned for peak reliability.",
            path: "/computer-repair",
            contactParam: "Computer Repair",
            icon: FaTools,
            highlight: "$29 Diagnostic (Waived w/ Repair)",
            deliverables: [
                "Screen, battery & component replacement",
                "OS recovery, malware removal & SSD upgrades",
                "Custom PC builds & deep thermal cleaning",
            ],
        },
        {
            index: "04",
            category: "MANAGED CARE",
            title: "Family Tech Support",
            description:
                "Stop being the on-call IT department for your relatives. Patient, jargon-free device setup, security hardening, and 1-on-1 training for every generation.",
            path: "/family-support",
            contactParam: "Family Tech Support",
            icon: FaUsers,
            highlight: "Plans from $89/mo • Up to 6 Devices",
            deliverables: [
                "New computer, printer & WiFi home setup",
                "Proactive updates, backups & scam protection",
                "Patient 1-on-1 coaching & remote assistance",
            ],
        },
    ];

    const standards = [
        {
            icon: FaUserClock,
            code: "SLA // 01",
            title: "Quick Response",
            text: "Same-day hardware diagnostics and rapid engineering turnaround without agency bottlenecks.",
        },
        {
            icon: FaTools,
            code: "EXP // 02",
            title: "Direct Expert Service",
            text: "Work directly with Steace from initial diagnosis or architecture spec through final delivery.",
        },
        {
            icon: FaCode,
            code: "STK // 03",
            title: "Modern Production Stack",
            text: "Built with battle-tested tools—React, TypeScript, Rust, Tauri, and Cloudflare Edge infrastructure.",
        },
        {
            icon: FaStar,
            code: "QAL // 04",
            title: "Transparent & Guaranteed",
            text: "Upfront flat-rate diagnostics, clear project scopes, and satisfaction guaranteed on every job.",
        },
    ];

    return (
        <main className="grow flex flex-col w-full">
            {/* Hero Section */}
            <section
                id="hero"
                className="relative w-full pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-white dark:bg-slate-950"
            >
                {/* Architectural Grid & Subtle Glow */}
                <div className="absolute inset-0 bg-grid-pattern mask-radial-fade pointer-events-none" />
                <div className="absolute -top-40 right-1/4 w-[34rem] h-[34rem] bg-blue-500/8 dark:bg-blue-500/12 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-cyan-500/8 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center relative z-10">
                    {/* Left Column: Editorial Pitch */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>CODE RAGE // SOFTWARE &amp; HARDWARE PRACTICE</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.06]">
                            Tech Solutions{" "}
                            <span className="text-blue-600 dark:text-blue-400">Engineered to Work.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            From high-performance web &amp; cross-platform applications to precision computer repair and
                            patient family tech support—reliable craftsmanship for your digital life.
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5 pt-2">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm md:text-base shadow-sm shadow-blue-600/20 transition-all duration-150"
                            >
                                <span>Get Started Today</span>
                                <FaArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                                to="#services"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm md:text-base border border-slate-200/90 dark:border-slate-800 transition-colors"
                            >
                                <span>Explore Services</span>
                            </Link>
                        </div>

                        {/* Key Telemetry Strip */}
                        <div className="pt-6 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <div>
                                <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                                    $29
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Flat PC Diagnostic
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                                    Same-Day
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Most Hardware Fixes
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                                    6+ Platforms
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Web, Mobile &amp; Desktop
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                    100%
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Direct Expert Care
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Workbench & Identity Card */}
                    <div className="lg:col-span-5">
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-black/40 overflow-hidden">
                            {/* Workbench Window Header */}
                            <div className="px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                                        coderage.workbench
                                    </span>
                                </div>
                                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200/70 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("software")}
                                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                                            activeTab === "software"
                                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                        }`}
                                    >
                                        Software
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("hardware")}
                                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                                            activeTab === "hardware"
                                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                        }`}
                                    >
                                        Hardware &amp; Care
                                    </button>
                                </div>
                            </div>

                            {/* Workbench Body */}
                            <div className="p-6 space-y-5">
                                {activeTab === "software" ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                <FaTerminal className="w-3.5 h-3.5" />
                                                Full-Stack &amp; Native Builds
                                            </span>
                                            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                                                Lighthouse 99+
                                            </span>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 space-y-1.5">
                                            <div className="text-slate-400">// Production targets</div>
                                            <div>
                                                <span className="text-blue-400">const</span> stack ={" "}
                                                <span className="text-amber-300">
                                                    [&quot;React&quot;, &quot;TypeScript&quot;, &quot;Tauri&quot;, &quot;Rust&quot;]
                                                </span>
                                                ;
                                            </div>
                                            <div>
                                                <span className="text-blue-400">const</span> platforms ={" "}
                                                <span className="text-emerald-300">
                                                    &quot;Web • iOS • Android • Desktop&quot;
                                                </span>
                                                ;
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                to="/website-development"
                                                className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors group"
                                            >
                                                <div className="text-xs font-mono text-slate-400 mb-1">01 // WEB</div>
                                                <div className="text-sm font-display font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                                                    <span>Web Development</span>
                                                    <FaArrowRight className="w-3 h-3" />
                                                </div>
                                            </Link>
                                            <Link
                                                to="/cross-platform-apps"
                                                className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors group"
                                            >
                                                <div className="text-xs font-mono text-slate-400 mb-1">02 // APPS</div>
                                                <div className="text-sm font-display font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                                                    <span>Cross-Platform</span>
                                                    <FaArrowRight className="w-3 h-3" />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                <FaMicrochip className="w-3.5 h-3.5" />
                                                Diagnostics &amp; Managed Support
                                            </span>
                                            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                                                Fee Waived w/ Repair
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    Complete Hardware &amp; OS Diagnostic
                                                </span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    $29 Flat
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    Same-Day Repair Labor
                                                </span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    From $69
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    Family Tech Care Membership
                                                </span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    $89/mo
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                to="/computer-repair"
                                                className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors group"
                                            >
                                                <div className="text-xs font-mono text-slate-400 mb-1">
                                                    03 // REPAIR
                                                </div>
                                                <div className="text-sm font-display font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                                                    <span>PC Repair</span>
                                                    <FaArrowRight className="w-3 h-3" />
                                                </div>
                                            </Link>
                                            <Link
                                                to="/family-support"
                                                className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors group"
                                            >
                                                <div className="text-xs font-mono text-slate-400 mb-1">
                                                    04 // FAMILY
                                                </div>
                                                <div className="text-sm font-display font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                                                    <span>Family Support</span>
                                                    <FaArrowRight className="w-3 h-3" />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Operator Profile Strip */}
                                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/assets/images/tech-hero.jpg"
                                            alt="Steace Paquette - Professional Tech Services"
                                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                        />
                                        <div>
                                            <div className="text-sm font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                <span>Steace Paquette</span>
                                                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                                                    👋 That&apos;s me!
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Software Engineer &amp; Hardware Specialist
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/contact"
                                        className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                                    >
                                        Book Call →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Bento Grid Section */}
            <section id="services" className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                                // 01 — CORE PRACTICE AREAS
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                                Services I Offer
                            </h2>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
                            Comprehensive software engineering and hands-on technical support tailored to your exact
                            requirements—delivered with clarity, speed, and zero fluff.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={service.path}
                                    className="group relative bg-white dark:bg-slate-900 rounded-2xl p-7 md:p-8 border border-slate-200/90 dark:border-slate-800 transition-all duration-200 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/40 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Top Meta Row */}
                                        <div className="flex items-center justify-between gap-4 mb-6">
                                            <div className="inline-flex items-center gap-2.5">
                                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                    {service.index} / {service.category}
                                                </span>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                                                {service.highlight}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {service.title}
                                        </h3>

                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base mb-6">
                                            {service.description}
                                        </p>

                                        {/* Deliverables Checklist */}
                                        <ul className="space-y-2.5 mb-8 pt-5 border-t border-slate-100 dark:border-slate-800/80">
                                            {service.deliverables.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                                                >
                                                    <FaCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                        <Link
                                            to={service.path}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
                                        >
                                            <span>Explore {service.title}</span>
                                            <FaArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                        <Link
                                            to={`/contact?service=${encodeURIComponent(service.contactParam)}`}
                                            className="text-xs font-mono font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                                        >
                                            Request Quote →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Standards / Features Section */}
            <section
                id="features"
                className="w-full py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-2xl mb-12">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // 02 — OPERATING PRINCIPLES
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Built on Speed, Honesty &amp; Craft.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {standards.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.code}
                                    className="flex flex-col items-start p-6 md:p-7 rounded-2xl bg-slate-50/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
                                >
                                    <div className="w-full flex items-center justify-between mb-5">
                                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                                            <Icon size={20} />
                                        </div>
                                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                                            {item.code}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="w-full py-20 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto relative rounded-3xl bg-slate-900 dark:bg-slate-900 text-white p-8 sm:p-12 md:p-16 border border-slate-800 overflow-hidden isolate shadow-xl">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
                                <FaShieldAlt className="w-3.5 h-3.5" />
                                <span>No-Obligation Consultations &amp; Upfront Estimates</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white">
                                Ready to Get Started?
                            </h2>
                            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                                Let&apos;s work together to solve your tech challenges, repair your hardware, or bring
                                your next software project to life.
                            </p>
                        </div>

                        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3.5">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm md:text-base transition-colors shadow-sm"
                            >
                                <span>Contact Me Today</span>
                                <FaArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

