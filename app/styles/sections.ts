export const hero = {
    hero: "w-full px-4 py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden",
    heroContent: "max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12",
    heroText: "flex-1 text-left",
    heroTitle: "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight",
    heroTitleSpan: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
    heroSubtitle: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8 leading-relaxed",
    heroImageContainer: "flex-1 relative max-w-sm",
    heroImage: "w-full h-auto rounded-2xl shadow-2xl",
};

// Homepage hero (more prominent styling)
export const homeHero = {
    section: "w-full px-4 py-28 md:py-36 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden",
    content: "max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10",
    textContainer: "flex-1 text-center lg:text-left space-y-8",
    title: "text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight",
    titleSpan: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent inline-block bg-[length:200%_auto]",
    subtitle: "text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium",
    ctaContainer: "flex flex-wrap gap-4 items-center justify-center lg:justify-start",
    primaryButton: "group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 motion-reduce:transition-none motion-reduce:hover:scale-100 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/30 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-300",
    secondaryButton: "px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-lg border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 hover:bg-white dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 motion-reduce:transition-none motion-reduce:hover:-translate-y-0",
    imageContainer: "flex-1 relative max-w-lg group perspective-1000",
    image: "w-full h-auto rounded-3xl shadow-2xl shadow-indigo-900/20 dark:shadow-black/60 ring-1 ring-white/50 dark:ring-gray-800/50 transition-all duration-200 hover:scale-[1.03] hover:rotate-1 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:rotate-0",
    // Badge styles
    badgeContainer: "absolute -top-6 left-[35%] -translate-x-1/2 z-20",
    badge: "relative animate-float",
    badgePulse: "absolute inset-0 rounded-full bg-indigo-500/30 animate-ping",
    badgeMain: "relative flex items-center gap-2.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-800 dark:text-white pl-4 pr-6 py-3.5 rounded-full shadow-2xl shadow-indigo-500/20 border-2 border-white/80 dark:border-gray-700 hover:scale-110 transition-transform duration-200 cursor-default motion-reduce:transition-none motion-reduce:hover:scale-100 ring-1 ring-indigo-500/20",
    badgeIcon: "text-2xl animate-wave",
    badgeText: "font-black text-base whitespace-nowrap bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
    badgePointer: "absolute -bottom-2 left-1/2 translate-x-4 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-r-2 border-b-2 border-white/80 dark:border-gray-700 shadow-lg",
    badgePointer2: "absolute -bottom-3 left-1/2 translate-x-8 w-2 h-2 bg-white/80 dark:bg-gray-800/80 rotate-45 border-r border-b border-white/60 dark:border-gray-700/60 shadow-md",
    badgePointer3: "absolute -bottom-4 left-1/2 translate-x-11 w-1.5 h-1.5 bg-white/60 dark:bg-gray-800/60 rotate-45 border-r border-b border-white/40 dark:border-gray-700/40 shadow-sm",
    // Background decoration
    bgDecoration: "absolute inset-0 overflow-hidden pointer-events-none",
    bgCircle1: "absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-full blur-[60px]",
    bgCircle2: "absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400/20 via-pink-400/20 to-indigo-400/20 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-indigo-500/10 rounded-full blur-[60px]",
};

// Homepage features section
export const homeFeatures = {
    section: "w-full py-24 px-4 bg-white/40 dark:bg-gray-900/40 relative backdrop-blur-xl overflow-hidden",
    grid: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    card: "group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-200 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:-translate-y-0 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-indigo-500/0 before:via-purple-500/0 before:to-pink-500/0 hover:before:from-indigo-500/5 hover:before:via-purple-500/5 hover:before:to-pink-500/5 before:transition-all before:duration-200",
    icon: "relative z-10 text-indigo-600 dark:text-indigo-400 mb-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-200 shadow-lg group-hover:shadow-xl group-hover:shadow-indigo-500/30 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0",
    title: "relative z-10 text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200",
    text: "relative z-10 text-gray-600 dark:text-gray-400 leading-relaxed",
};

// Homepage services section
export const homeServices = {
    section: "w-full py-28 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900",
    content: "max-w-7xl mx-auto",
    title: "text-4xl md:text-5xl font-black text-center text-gray-900 dark:text-white mb-6",
    subtitle: "text-xl text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed font-medium",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
    card: "group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.03] hover:-translate-y-2 border border-white/50 dark:border-gray-700/50 flex flex-col h-full focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:-translate-y-0 overflow-hidden before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-indigo-500/0 before:via-purple-500/0 before:to-pink-500/0 hover:before:from-indigo-500/10 hover:before:via-purple-500/10 hover:before:to-pink-500/10 before:transition-all before:duration-200",
    cardTitle: "relative z-10 text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200",
    cardDescription: "relative z-10 text-gray-600 dark:text-gray-300 grow leading-relaxed mb-6",
    cardButton: "relative z-10 w-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-700/50 hover:from-indigo-600 hover:via-purple-600  hover:to-pink-600 dark:hover:from-indigo-600 dark:hover:via-purple-600 dark:hover:to-pink-600 text-gray-900 dark:text-white hover:text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]",
};

// Homepage CTA section (Glassmorphic Card)
export const homeCta = {
    section: "w-full py-24 px-4 flex justify-center", // Container for the card
    content: "w-full max-w-5xl mx-auto text-center relative z-10 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[3rem] p-16 md:p-24 shadow-2xl shadow-indigo-900/10 border border-white/60 dark:border-gray-700/50 overflow-hidden isolate",
    title: "text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6",
    text: "text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto font-medium",
    button: "group relative inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:-translate-y-0 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/30 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-300",
    bgDecoration: "absolute inset-0 overflow-hidden pointer-events-none -z-10",
    bgCircle1: "absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-500/30 dark:via-purple-500/30 dark:to-pink-500/30 rounded-full blur-[60px]",
    bgCircle2: "absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-pink-500/20 via-purple-500/20 to-indigo-500/20 dark:from-pink-500/30 dark:via-purple-500/30 dark:to-indigo-500/30 rounded-full blur-[60px]",
};

// Homepage main layout
export const homeLayout = {
    main: "grow flex flex-col items-center justify-start w-full",
};

export const features = {
    featuresSection: "w-full py-20 px-4 bg-white dark:bg-gray-900",
    featuresGrid: "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
    featureCard: "flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-200 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2",
    featureIcon: "text-indigo-600 dark:text-indigo-400 mb-4 transition-transform duration-200 hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100",
    featureTitle: "text-lg font-bold text-gray-900 dark:text-white mb-2",
    featureText: "text-gray-600 dark:text-gray-400 leading-relaxed",
};

export const services = {
    servicesSection: "w-full py-20 px-4 bg-gray-50 dark:bg-gray-900/50",
    servicesContent: "max-w-7xl mx-auto",
    servicesGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16",
    serviceCard: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.02] border border-white/50 dark:border-gray-700/50",
    iconWrapper: "mb-4 text-indigo-600 dark:text-indigo-400",
    serviceTitle: "text-xl font-bold text-gray-900 dark:text-white mb-4",
    serviceDescription: "text-gray-600 dark:text-gray-300 leading-relaxed",
};

export const cta = {
    ctaSection: "w-full max-w-5xl mx-auto mb-16 px-4 py-24 text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-indigo-900/10 border border-white/60 dark:border-gray-700/50 relative overflow-hidden isolate",
    ctaContent: "max-w-4xl mx-auto relative z-10",
    ctaTitle: "text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8",
    ctaText: "text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-medium",
    ctaButton: "group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-5 px-12 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 active:bg-indigo-700 transition-all duration-200 hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 text-lg motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:-translate-y-0 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/30 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-300",
};

// Shared page-level styles
export const page = {
    layout: "flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900",
    header: "flex flex-col items-center justify-center py-28 md:py-36 px-4 text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden",
    heading: "text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white relative z-10",
    headingSpan: "font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text",
    subheading: "text-2xl md:text-3xl mt-6 text-gray-700 dark:text-gray-200 font-bold relative z-10",
    paragraph: "text-xl mt-6 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed relative z-10",
    main: "grow flex flex-col items-center justify-center px-4 py-20 w-full max-w-7xl mx-auto gap-20",
    section: "w-full",
    sectionTitle: "text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-10",
};

// Extended service card styles
export const serviceCards = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16",
    gridTwoCol: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16",
    card: "group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 dark:border-gray-700/50 transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.03] hover:-translate-y-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:-translate-y-0 overflow-hidden before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-indigo-500/0 before:via-purple-500/0 before:to-pink-500/0 hover:before:from-indigo-500/10 hover:before:via-purple-500/10 hover:before:to-pink-500/10 before:transition-all before:duration-200",
    iconWrapper: "relative z-10 mb-6 text-indigo-600 dark:text-indigo-400 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl inline-block group-hover:scale-110 group-hover:rotate-3 transition-all duration-200 shadow-lg group-hover:shadow-xl group-hover:shadow-indigo-500/30 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0",
    title: "relative z-10 text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200",
    description: "relative z-10 text-gray-600 dark:text-gray-300 leading-relaxed",
};

// Pricing card styles
export const pricing = {
    section: "w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 mb-16 border border-white/50 dark:border-gray-700/50 shadow-2xl",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
    card: "group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-10 border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100",
    price: "text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6",
    title: "text-2xl font-bold text-gray-900 dark:text-white mb-4",
    description: "text-gray-600 dark:text-gray-300 leading-relaxed",
};

// Utility styles
export const utilities = {
    featuresList: "list-disc list-inside space-y-3 text-gray-600 dark:text-gray-300 mb-8",
    techStack: "flex flex-wrap justify-center gap-4 mb-16",
    techBadge: "px-5 py-2.5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full text-gray-700 dark:text-gray-300 font-semibold border border-indigo-200/50 dark:border-indigo-700/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200",
    imageSection: "relative w-full max-w-2xl mx-auto mb-16",
    image: "w-full h-auto rounded-2xl shadow-xl",
};
