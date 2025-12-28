export const hero = {
    hero: "w-full px-4 py-24 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/30",
    heroContent: "max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12",
    heroText: "flex-1 text-left",
    heroTitle: "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight",
    heroTitleSpan: "text-blue-600 dark:text-blue-400",
    heroSubtitle: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8",
    heroImageContainer: "flex-1 relative max-w-sm",
    heroImage: "w-full h-auto rounded-xl shadow-2xl",
};

// Homepage hero (more prominent styling)
export const homeHero = {
    section: "w-full px-4 py-24 md:py-32 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 relative overflow-hidden",
    content: "max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10",
    textContainer: "flex-1 text-left space-y-6",
    title: "text-5xl md:text-6xl lg:text-7xl font-bold text-white dark:text-white leading-tight tracking-tight",
    titleSpan: "bg-linear-to-r from-yellow-200 via-pink-200 to-purple-200 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-lg",
    subtitle: "text-xl md:text-2xl text-white/90 dark:text-gray-300 max-w-2xl leading-relaxed",
    ctaContainer: "flex flex-wrap gap-4 items-center",
    primaryButton: "px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white motion-reduce:transition-none motion-reduce:hover:scale-100",
    secondaryButton: "px-8 py-4 bg-white/10 dark:bg-gray-800 text-white dark:text-white rounded-xl font-semibold text-lg border-2 border-white/30 dark:border-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-white dark:hover:border-blue-400 hover:shadow-xl backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    imageContainer: "flex-1 relative max-w-lg group",
    image: "w-full h-auto rounded-2xl shadow-2xl ring-4 ring-white/50 dark:ring-gray-800/50 transition-all duration-500 hover:scale-105 hover:ring-white motion-reduce:transition-none motion-reduce:hover:scale-100",
    // Badge styles
    badgeContainer: "absolute -top-5 left-[35%] -translate-x-1/2 z-20 animate-in slide-in-from-top-5 fade-in duration-1000 delay-500",
    badge: "relative",
    badgePulse: "absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-30",
    badgeMain: "relative flex items-center gap-2 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-700 dark:via-teal-700 dark:to-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl border-4 border-white dark:border-gray-900 hover:scale-110 transition-transform duration-300 cursor-default motion-reduce:transition-none motion-reduce:hover:scale-100",
    badgeIcon: "text-2xl animate-wave",
    badgeText: "font-bold text-sm md:text-base whitespace-nowrap",
    badgePointer: "absolute -bottom-2 left-1/2 translate-x-4 w-3 h-3 bg-teal-600 dark:bg-teal-700 rotate-45 border-r-4 border-b-4 border-white dark:border-gray-900 rounded-full",
    badgePointer2: "absolute -bottom-3 left-1/2 translate-x-8 w-2 h-2 bg-teal-600 dark:bg-teal-700 rotate-45 border-r-2 border-b-2 border-white dark:border-gray-900 rounded-full",
    badgePointer3: "absolute -bottom-4 left-1/2 translate-x-11 w-1.5 h-1.5 bg-teal-600 dark:bg-teal-700 rotate-45 border-r-2 border-b-2 border-white dark:border-gray-900 rounded-full",
    // Background decoration
    bgDecoration: "absolute inset-0 overflow-hidden pointer-events-none",
    bgCircle1: "absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl",
    bgCircle2: "absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl",
};

// Homepage features section
export const homeFeatures = {
    section: "w-full py-20 px-4 bg-gray-50 dark:bg-gray-900 relative",
    grid: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
    card: "flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-600 dark:hover:border-blue-400 hover:scale-105 group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
    icon: "text-blue-600 dark:text-blue-400 mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
    title: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300",
    text: "text-gray-600 dark:text-gray-400 leading-relaxed",
};

// Homepage services section
export const homeServices = {
    section: "w-full py-16 px-4",
    content: "max-w-7xl mx-auto",
    title: "text-3xl font-bold text-center text-gray-900 dark:text-white mb-12",
    subtitle: "text-xl text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
    card: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col h-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100",
    cardTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-3",
    cardDescription: "text-gray-600 dark:text-gray-300 grow",
    cardButton: "w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
};

// Homepage CTA section
export const homeCta = {
    section: "w-full py-24 px-4 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden",
    content: "max-w-4xl mx-auto text-center relative z-10",
    title: "text-4xl md:text-5xl font-bold text-white mb-6",
    text: "text-xl md:text-2xl text-white/90 dark:text-gray-300 mb-10 leading-relaxed",
    button: "inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white motion-reduce:transition-none motion-reduce:hover:scale-100",
    bgDecoration: "absolute inset-0 overflow-hidden pointer-events-none",
    bgCircle1: "absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl",
    bgCircle2: "absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl",
};

// Homepage main layout
export const homeLayout = {
    main: "grow flex flex-col items-center justify-start w-full",
};

export const features = {
    featuresSection: "w-full py-16 px-4 bg-white dark:bg-gray-900",
    featuresGrid: "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
    featureCard: "flex flex-col items-center text-center p-6 rounded-lg transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
    featureIcon: "text-blue-600 dark:text-blue-400 mb-4 transition-transform duration-300 hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100",
    featureTitle: "text-lg font-semibold text-gray-900 dark:text-white mb-2",
    featureText: "text-gray-600 dark:text-gray-400",
};

export const services = {
    servicesSection: "w-full py-16 px-4 bg-gray-50 dark:bg-gray-900/50",
    servicesContent: "max-w-7xl mx-auto",
    servicesGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16",
    serviceCard: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl",
    iconWrapper: "mb-4 text-blue-600 dark:text-blue-400",
    serviceTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-4",
    serviceDescription: "text-gray-600 dark:text-gray-300",
};

export const cta = {
    ctaSection: "w-full py-20 px-4 text-center bg-linear-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900",
    ctaContent: "max-w-4xl mx-auto",
    ctaTitle: "text-4xl md:text-5xl font-bold text-white mb-8",
    ctaText: "text-xl md:text-2xl text-white/90 mb-10 leading-relaxed",
    ctaButton: "inline-block bg-white text-blue-600 font-bold py-5 px-10 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 text-lg motion-reduce:transition-none motion-reduce:hover:scale-100",
};

// Shared page-level styles
export const page = {
    layout: "flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900",
    header: "flex flex-col items-center justify-center py-24 md:py-32 px-4 text-center bg-linear-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden",
    heading: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white relative z-10",
    headingSpan: "font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 text-transparent bg-clip-text",
    subheading: "text-2xl md:text-3xl mt-6 text-gray-700 dark:text-gray-200 font-semibold relative z-10",
    paragraph: "text-xl mt-6 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed relative z-10",
    main: "grow flex flex-col items-center justify-center px-4 py-16 w-full max-w-7xl mx-auto gap-16",
    section: "w-full",
    sectionTitle: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8",
};

// Extended service card styles
export const serviceCards = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16",
    gridTwoCol: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16",
    card: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 group motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0",
    iconWrapper: "mb-6 text-blue-600 dark:text-blue-400 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
    title: "text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200",
    description: "text-gray-600 dark:text-gray-300 leading-relaxed",
};

// Pricing card styles
export const pricing = {
    section: "w-full bg-white dark:bg-gray-800/50 rounded-3xl p-12 mb-16 border border-gray-200 dark:border-gray-700 shadow-xl",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
    card: "bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl p-10 border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100",
    price: "text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6",
    title: "text-2xl font-bold text-gray-900 dark:text-white mb-4",
    description: "text-gray-600 dark:text-gray-300 leading-relaxed",
};

// Utility styles
export const utilities = {
    featuresList: "list-disc list-inside space-y-3 text-gray-600 dark:text-gray-300 mb-8",
    techStack: "flex flex-wrap justify-center gap-4 mb-16",
    techBadge: "px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300",
    imageSection: "relative w-full max-w-2xl mx-auto mb-16",
    image: "w-full h-auto rounded-xl",
};
