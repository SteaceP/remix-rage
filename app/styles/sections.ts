export const hero = {
    hero: "w-full px-4 py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/30",
    heroContent: "max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12",
    heroText: "flex-1 text-left",
    heroTitle: "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight",
    heroTitleSpan: "text-blue-600 dark:text-blue-400",
    heroSubtitle: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8",
    heroImageContainer: "flex-1 relative max-w-sm",
    heroImage: "w-full h-auto rounded-xl shadow-2xl",
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
    ctaSection: "w-full py-20 px-4 text-center bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900",
    ctaContent: "max-w-4xl mx-auto",
    ctaTitle: "text-4xl md:text-5xl font-bold text-white mb-8",
    ctaText: "text-xl md:text-2xl text-white/90 mb-10 leading-relaxed",
    ctaButton: "inline-block bg-white text-blue-600 font-bold py-5 px-10 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 text-lg motion-reduce:transition-none motion-reduce:hover:scale-100",
};

// Shared page-level styles
export const page = {
    layout: "flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900",
    header: "flex flex-col items-center justify-center py-24 md:py-32 px-4 text-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden",
    heading: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white relative z-10",
    headingSpan: "font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-transparent bg-clip-text",
    subheading: "text-2xl md:text-3xl mt-6 text-gray-700 dark:text-gray-200 font-semibold relative z-10",
    paragraph: "text-xl mt-6 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed relative z-10",
    main: "flex-grow flex flex-col items-center justify-center px-4 py-16 w-full max-w-7xl mx-auto gap-16",
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
    price: "text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6",
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
