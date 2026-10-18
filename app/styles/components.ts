export const navigation = {
    nav: "flex flex-wrap items-center gap-1.5",
    navLink:
        "px-3.5 py-2 text-sm rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    activeNavLink:
        "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs",
    logo: "text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    dropdownLink:
        "block px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors motion-reduce:transition-none rounded-xl",
    mobileNavLink:
        "px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors motion-reduce:transition-none rounded-xl",
    mobileDropdownLink:
        "block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors motion-reduce:transition-none rounded-lg",
};

export const cards = {
    card: "group relative bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-7 transition-all duration-200 motion-reduce:transition-none hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/40 flex flex-col h-full",
    cardTitle:
        "text-xl font-display font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors motion-reduce:transition-none",
    cardDescription: "text-slate-600 dark:text-slate-400 grow leading-relaxed text-sm md:text-base",
    cardButton:
        "w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors motion-reduce:transition-none text-sm mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    cardsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
};

export const form = {
    form: "w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8",
    formGroup: "mb-5 text-left",
    label: "block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider",
    input: "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-500",
    textarea:
        "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[140px] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500",
    error: "text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium",
    button: "w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors motion-reduce:transition-none flex items-center justify-center gap-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
    success: "text-emerald-600 dark:text-emerald-400 text-center mt-4 font-medium text-sm",
};

export const footer = {
    footer: "mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950",
    socialLinks: "flex space-x-3",
    socialIcon:
        "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors motion-reduce:transition-none rounded-lg p-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800",
    copyright: "mt-6 text-xs text-slate-500 dark:text-slate-400",
};

export const contactStyles = {
    wrapper: "relative overflow-hidden py-12 md:py-20 bg-slate-50 dark:bg-slate-950 grow flex items-center",
    bgGrid: "absolute inset-0 bg-grid-pattern mask-radial-fade pointer-events-none",
    container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full",
    grid: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start",
    leftCol: "lg:col-span-5 space-y-6",
    rightCol: "lg:col-span-7",
    badgeAvailable:
        "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300",
    badgeAway:
        "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 text-xs font-mono font-semibold text-amber-700 dark:text-amber-300",
    dotAvailable: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none",
    dotAway: "w-1.5 h-1.5 rounded-full bg-amber-500",
    formCard:
        "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 overflow-hidden relative",
    formInner: "p-6 sm:p-8 md:p-10 relative z-10",
    title: "text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-3",
    subtitle: "text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed",
    featureList: "space-y-3.5 pt-2",
    featureCard:
        "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3.5",
    featureIconWrap:
        "p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5",
    featureIconSize: "w-4 h-4",
    featureTitle: "text-sm font-display font-bold text-slate-900 dark:text-white",
    featureDesc: "text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed",
    securityNote: "inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2",
    securityIcon: "text-emerald-500 shrink-0",
    adminShortcutLink:
        "inline-flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md",

    // Form specific styles
    form: "space-y-5",
    formGroup: "space-y-1.5",
    label: "block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider",
    input: "block w-full px-4 py-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-300/90 dark:border-slate-700/90 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all motion-reduce:transition-none placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed",
    textarea:
        "block w-full px-4 py-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-300/90 dark:border-slate-700/90 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all motion-reduce:transition-none min-h-[110px] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed",
    button: "relative w-full flex justify-center items-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",

    // Alert styles
    errorAlert:
        "mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60",
    errorText: "text-red-700 dark:text-red-300 font-medium text-xs sm:text-sm flex items-center gap-2",
    successAlert:
        "mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60",
    successText:
        "text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2 text-xs sm:text-sm",
} as const;

export const dmStyles = {
    card: "bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/40 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col",
    header: "px-5 py-4 bg-slate-50/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3",
    headerLeft: "flex items-center gap-3 min-w-0",
    avatar: "w-10 h-10 rounded-xl bg-blue-600 text-white font-display font-bold text-sm flex items-center justify-center shrink-0 shadow-xs",
    headerTitle: "text-sm font-display font-bold text-slate-900 dark:text-white truncate",
    headerStatus: "flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400",
    headerActions: "flex items-center gap-2 shrink-0",
    resetBtn:
        "px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer",
    topicBar: "px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 space-y-2",
    topicChipActive:
        "px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors motion-reduce:transition-none cursor-pointer bg-blue-600 text-white border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    topicChipInactive:
        "px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors motion-reduce:transition-none cursor-pointer bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    messagesArea:
        "p-5 space-y-4 overflow-y-auto max-h-[420px] min-h-[280px] bg-slate-50/40 dark:bg-slate-950/40 flex flex-col",
    welcomeBox:
        "p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed",
    msgRowVisitor: "flex flex-col items-end",
    msgRowAdmin: "flex flex-col items-start",
    bubbleVisitor:
        "max-w-[85%] sm:max-w-[78%] rounded-2xl rounded-br-sm px-4 py-2.5 bg-blue-600 text-white text-sm leading-relaxed shadow-2xs break-words whitespace-pre-wrap",
    bubbleAdmin:
        "max-w-[85%] sm:max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 text-sm leading-relaxed shadow-2xs break-words whitespace-pre-wrap",
    msgMeta: "mt-1 px-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-slate-500",
    typingRow: "flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 px-1 py-1",
    composer: "p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 space-y-3",
    identityGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3",
    composerRow: "flex items-end gap-2.5",
    composerInput:
        "flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300/90 dark:border-slate-700/90 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-950 focus:border-blue-600 dark:focus:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors motion-reduce:transition-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500",
    sendBtn:
        "px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-xs transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0",
} as const;

export const inboxStyles = {
    pageWrapper: "grow flex flex-col w-full bg-slate-50 dark:bg-slate-950 py-6 md:py-10 px-3 sm:px-6 lg:px-8",
    container: "max-w-7xl mx-auto w-full grow flex flex-col",
    loginCard:
        "max-w-md w-full mx-auto my-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-lg space-y-6",
    shell: "grow flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-lg overflow-hidden min-h-[72vh]",
    topBar: "px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3",
    bodyGrid: "grow grid grid-cols-1 lg:grid-cols-12 min-h-[60vh]",
    sidebar: "lg:col-span-4 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/40 dark:bg-slate-950/30",
    chatPane: "lg:col-span-8 flex flex-col bg-white dark:bg-slate-900",
    threadItem:
        "w-full text-left p-4 border-b border-slate-200/60 dark:border-slate-800/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors motion-reduce:transition-none flex items-start justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500",
    threadItemActive:
        "bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-l-blue-600 dark:border-l-blue-400",
    pillBtn:
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
} as const;
