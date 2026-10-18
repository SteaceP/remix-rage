import type { MetaFunction } from "react-router";
import {
    FaLaptopMedical,
    FaDesktop,
    FaTools,
    FaNetworkWired,
    FaWrench,
    FaSprayCan,
    FaCheckCircle,
    FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router";

export const meta: MetaFunction = () => {
    return [
        { title: "Computer Repair Services — Code Rage" },
        {
            name: "description",
            content:
                "Professional computer repair services. Fast, reliable fixes for all your PC and laptop issues, including hardware repairs, virus removal, and system optimization.",
        },
    ];
};

export default function ComputerRepair() {
    const repairServices = [
        {
            icon: FaLaptopMedical,
            code: "HW // 01",
            title: "Hardware Repairs",
            description:
                "Screen replacement, keyboard repairs, battery replacement, power jack fixes, and component-level troubleshooting for laptops and desktops.",
        },
        {
            icon: FaDesktop,
            code: "SW // 02",
            title: "Software Solutions",
            description:
                "Virus & malware removal, clean operating system installation, driver recovery, blue-screen diagnostics, and data recovery services.",
        },
        {
            icon: FaTools,
            code: "OPT // 03",
            title: "Performance Optimization",
            description:
                "System cleanup, RAM memory upgrades, NVMe SSD installation & cloning, and startup tuning for dramatically faster computing.",
        },
        {
            icon: FaNetworkWired,
            code: "NET // 04",
            title: "Network Setup",
            description:
                "Home and small business network configuration, mesh WiFi dead-zone elimination, wired Ethernet routing, and firewall security setup.",
        },
        {
            icon: FaWrench,
            code: "BLD // 05",
            title: "Custom PC Building",
            description:
                "Custom-built computers tailored to your workflow—whether for high-refresh gaming, 4K content creation, or silent workstation reliability.",
        },
        {
            icon: FaSprayCan,
            code: "THM // 06",
            title: "Deep Cleaning Service",
            description:
                "Professional internal cleaning of heatsinks and fans, fresh high-conductivity thermal paste application, and airflow optimization.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Editorial Page Header */}
            <header className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern mask-radial-fade pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>03 // HARDWARE &amp; SYSTEMS • SAME-DAY DIAGNOSTICS</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl">
                        Professional <span className="text-blue-600 dark:text-blue-400">Computer Repair</span>
                    </h1>
                    <h2 className="text-xl md:text-2xl mt-4 font-display font-medium text-slate-700 dark:text-slate-300">
                        Fast &amp; Reliable Tech Solutions
                    </h2>
                    <p className="text-base md:text-lg mt-4 text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        Expert computer repair services for all your PC and laptop needs. Quick turnaround times, honest
                        diagnostics, and transparent flat-rate pricing.
                    </p>
                </div>
            </header>

            <main className="grow flex flex-col px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full max-w-7xl mx-auto gap-20">
                {/* Services Grid */}
                <section className="w-full">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // REPAIR &amp; UPGRADE CAPABILITIES
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            My Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repairServices.map((service) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={service.code}
                                    className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-4 mb-5">
                                            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                                                <Icon size={22} />
                                            </div>
                                            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                                                {service.code}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2.5">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Pricing & Diagnostic Spotlight */}
                <section className="w-full">
                    <div className="mb-10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            // TRANSPARENT RATES
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Pricing
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Diagnostic Card */}
                        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-7 md:p-8 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-4">
                                    STEP 1 // EVALUATION
                                </div>
                                <h3 className="text-4xl font-mono font-bold tabular-nums text-slate-900 dark:text-white mb-2">
                                    $29
                                </h3>
                                <h4 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    Diagnostic Service
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    Complete system diagnosis and upfront repair estimate. Fee is 100% waived if you
                                    proceed with repairs.
                                </p>
                                <ul className="space-y-2.5 pt-5 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Full hardware &amp; drive health check</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Thermal &amp; power stability test</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Waived when you approve the repair</span>
                                    </li>
                                </ul>
                            </div>
                            <Link
                                to="/contact?service=Computer%20Diagnostic%20(%2429)"
                                className="mt-8 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm transition-colors"
                            >
                                Book Diagnostic
                            </Link>
                        </div>

                        {/* Repair Service Card */}
                        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-7 md:p-8 border-2 border-blue-600 dark:border-blue-500 flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="inline-flex px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/80 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mb-4">
                                    MOST REPAIRS SAME-DAY
                                </div>
                                <h3 className="text-4xl font-mono font-bold tabular-nums text-slate-900 dark:text-white mb-2">
                                    From $69
                                </h3>
                                <h4 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    Repair Service
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    Most repairs completed same day. Replacement parts are billed at cost with zero
                                    hidden markups.
                                </p>
                                <ul className="space-y-2.5 pt-5 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Includes the $29 diagnostic fee</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>OS tune-up &amp; internal dust check</span>
                                    </li>
                                    <li className="flex items-center gap-2.5">
                                        <FaCheckCircle className="text-emerald-500 shrink-0" />
                                        <span>Post-repair stress test verification</span>
                                    </li>
                                </ul>
                            </div>
                            <Link
                                to="/contact?service=Computer%20Repair"
                                className="mt-8 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
                            >
                                Schedule a Repair
                            </Link>
                        </div>

                        {/* Hardware Gremlin Spotlight Card */}
                        <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-7 border border-slate-800 flex flex-col justify-between overflow-hidden">
                            <div className="space-y-3">
                                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                                    // GREMLIN EXORCISM
                                </span>
                                <h3 className="text-xl font-display font-bold">
                                    Don&apos;t let hardware gremlins win.
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Strange fan noises, random reboots, or a cracked screen? Bring your rig in for a
                                    clean, professional teardown.
                                </p>
                            </div>
                            <div className="my-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                <img
                                    src="/assets/images/monster_repair.png"
                                    alt="Computer Repair Service"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="text-xs font-mono text-slate-400">
                                Desktops • Laptops • Custom Workstations
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="w-full px-6 py-12 md:p-14 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-lg">
                    <div className="space-y-2 max-w-xl">
                        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                            FAST LOCAL &amp; REMOTE SERVICE
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold">
                            Need your computer fixed or upgraded?
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base">
                            Describe what your computer is doing and I&apos;ll get back to you right away with next
                            steps.
                        </p>
                    </div>
                    <Link
                        to="/contact?service=Computer%20Repair"
                        className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors text-sm md:text-base shrink-0"
                    >
                        <span>Schedule a Repair</span>
                        <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}

