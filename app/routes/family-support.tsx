import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { FaUsers, FaLaptop, FaShieldAlt, FaGraduationCap, FaCheckCircle, FaArrowRight } from "react-icons/fa";

export const meta: MetaFunction = () => {
    return [
        { title: "Family Tech Support — Code Rage" },
        {
            name: "description",
            content:
                "Professional and patient family tech support services. Get help with computer setup, maintenance, security, and training for all your family members.",
        },
    ];
};

export default function FamilySupport() {
    const services = [
        {
            icon: FaUsers,
            tag: "ONBOARDING",
            title: "Family Tech Setup",
            description:
                "Complete setup and configuration of new devices, including computers, tablets, printers, smart TVs, and home WiFi networks—making technology effortless for everyone in the household.",
        },
        {
            icon: FaLaptop,
            tag: "PROACTIVE CARE",
            title: "Ongoing Support",
            description:
                "Regular system maintenance, software updates, cloud backup verification, and troubleshooting to keep every device running smoothly with quick response times.",
        },
        {
            icon: FaShieldAlt,
            tag: "PROTECTION",
            title: "Security & Safety",
            description:
                "Setup of parental controls, ad/phishing blockers, password managers, antivirus protection, and safe browsing measures that protect your family online.",
        },
        {
            icon: FaGraduationCap,
            tag: "1-ON-1 COACHING",
            title: "Training & Education",
            description:
                "Patient, easy-to-understand training sessions for family members of all ages. Learn to spot scams, organize photos, and use everyday apps with confidence.",
        },
    ];

    const pillars = [
        {
            icon: FaUsers,
            title: "Patient & Understanding",
            description:
                "No question is too basic. I provide clear, jargon-free explanations and take the time to ensure everyone feels comfortable and respected.",
        },
        {
            icon: FaShieldAlt,
            title: "Preventive Care",
            description:
                "Stop problems before they start with automated maintenance, verified cloud backups, and proactive protection against scams and malware.",
        },
        {
            icon: FaGraduationCap,
            title: "Empowerment Through Education",
            description:
                "Learn to handle everyday tasks independently. Build lasting confidence with technology through calm, guided 1-on-1 coaching.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Editorial Header */}
            <header className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern mask-radial-fade pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mb-4">
                        <span>04 // MANAGED FAMILY CARE</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl">
                        Family <span className="text-blue-600 dark:text-blue-400">Tech Support</span>
                    </h1>
                    <h2 className="text-xl md:text-2xl mt-4 font-display font-medium text-slate-700 dark:text-slate-300">
                        Patient, Understanding, Effective
                    </h2>
                    <p className="text-base md:text-lg mt-4 text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        Tired of being the default tech support for your family? Let me keep your household&apos;s
                        devices running smoothly and securely with patient, professional care.
                    </p>
                </div>
            </header>

            <main className="grow flex flex-col px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full max-w-7xl mx-auto gap-20">
                {/* Services Grid */}
                <section className="w-full">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // HOUSEHOLD COVERAGE
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Services Offered
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white dark:bg-slate-900 rounded-2xl p-7 md:p-8 border border-slate-200/90 dark:border-slate-800"
                                >
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
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Why Choose Professional Family Support */}
                <section className="w-full">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // PEACE OF MIND
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Why Choose Professional Family Support?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pillars.map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={pillar.title}
                                    className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800"
                                >
                                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 w-fit mb-4">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Simple Pricing */}
                <section className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200/90 dark:border-slate-800">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // MEMBERSHIP PLANS
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Simple Pricing
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Family Basic */}
                        <div className="rounded-2xl p-7 md:p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="text-xs font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                                    ESSENTIAL CARE
                                </div>
                                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                                    Family Basic
                                </h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                                        $89
                                    </span>
                                    <span className="text-sm font-mono text-slate-500 dark:text-slate-400">/month</span>
                                </div>

                                <ul className="space-y-3 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Up to 3 devices covered</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Monthly health &amp; update maintenance</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>On-demand remote support</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Basic security &amp; scam-shield setup</span>
                                    </li>
                                </ul>
                            </div>

                            <Link
                                to="/contact?service=Family%20Basic%20Plan%20(%2489%2Fmo)"
                                className="mt-8 w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
                            >
                                Choose Family Basic
                            </Link>
                        </div>

                        {/* Family Plus */}
                        <div className="rounded-2xl p-7 md:p-8 bg-slate-50 dark:bg-slate-950 border-2 border-blue-600 dark:border-blue-500 flex flex-col justify-between relative">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-xs font-mono font-semibold uppercase text-blue-600 dark:text-blue-400">
                                        COMPLETE HOUSEHOLD
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-600 text-white">
                                        RECOMMENDED
                                    </span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                                    Family Plus
                                </h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                                        $149
                                    </span>
                                    <span className="text-sm font-mono text-slate-500 dark:text-slate-400">/month</span>
                                </div>

                                <ul className="space-y-3 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Up to 6 devices covered</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Priority same-day support response</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Dedicated monthly 1-on-1 training session</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Advanced security, backup &amp; parental controls</span>
                                    </li>
                                </ul>
                            </div>

                            <Link
                                to="/contact?service=Family%20Plus%20Plan%20(%24149%2Fmo)"
                                className="mt-8 w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
                            >
                                Choose Family Plus
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="w-full px-6 py-12 md:p-14 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-lg">
                    <div className="space-y-2 max-w-xl">
                        <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                            PATIENT, JARGON-FREE HELP
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold">
                            Ready to simplify tech for your family?
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base">
                            Reach out for a one-time home setup or a monthly peace-of-mind care plan.
                        </p>
                    </div>
                    <Link
                        to="/contact?service=Family%20Tech%20Support"
                        className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors text-sm md:text-base shrink-0"
                    >
                        <span>Get Started Today</span>
                        <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
