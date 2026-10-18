export const navigation = {
    nav: "flex flex-wrap items-center gap-1.5",
    navLink:
        "px-3.5 py-2 text-sm rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    activeNavLink:
        "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs",
    logo: "text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    dropdownLink:
        "block px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors rounded-xl",
    mobileNavLink:
        "px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors rounded-xl",
    mobileDropdownLink:
        "block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors rounded-lg",
};

export const cards = {
    card: "group relative bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-7 transition-all duration-200 hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/40 flex flex-col h-full",
    cardTitle:
        "text-xl font-display font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
    cardDescription: "text-slate-600 dark:text-slate-400 grow leading-relaxed text-sm md:text-base",
    cardButton:
        "w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    cardsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
};

export const form = {
    form: "w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8",
    formGroup: "mb-5 text-left",
    label: "block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider",
    input: "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-colors focus-visible:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500",
    textarea:
        "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-colors focus-visible:outline-none min-h-[140px] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500",
    error: "text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium",
    button: "w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
    success: "text-emerald-600 dark:text-emerald-400 text-center mt-4 font-medium text-sm",
};

export const footer = {
    footer: "mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
    socialLinks: "flex space-x-3",
    socialIcon:
        "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg p-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800",
    copyright: "mt-6 text-xs text-slate-500 dark:text-slate-400",
};

export const contactStyles = {
    wrapper: "relative overflow-hidden py-16 md:py-24 bg-slate-50 dark:bg-slate-950 grow flex items-center",
    container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full",
    formCard:
        "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 overflow-hidden relative",
    formInner: "p-6 sm:p-8 md:p-10 relative z-10",
    title: "text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-3",
    subtitle: "text-slate-600 dark:text-slate-400 text-base md:text-lg mb-8 leading-relaxed",

    // Form specific styles
    form: "space-y-5",
    formGroup: "space-y-1.5",
    label: "block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider",
    input: "block w-full px-4 py-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-300/90 dark:border-slate-700/90 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-3 focus:ring-blue-500/15 focus-visible:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed",
    textarea:
        "block w-full px-4 py-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-300/90 dark:border-slate-700/90 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-3 focus:ring-blue-500/15 focus-visible:outline-none transition-all min-h-[130px] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed",
    button: "relative w-full flex justify-center items-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",

    // Alert styles
    errorAlert:
        "mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60",
    errorText: "text-red-700 dark:text-red-300 font-medium text-sm flex items-center gap-2",
    successAlert:
        "mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60",
    successText:
        "text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2 text-sm",
} as const;

