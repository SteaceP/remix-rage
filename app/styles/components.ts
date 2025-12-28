export const navigation = {
    nav: "flex flex-wrap justify-center gap-2 md:gap-4",
    navLink:
        "relative px-4 py-2 text-sm md:text-base rounded-full font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-10",
    activeNavLink: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30",
    logo: "text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
    dropdownLink: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
    mobileNavLink: "px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 rounded-xl mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
    mobileDropdownLink: "block px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 rounded-lg mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
};

export const cards = {
    card: "group relative bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 flex flex-col h-full motion-reduce:transition-none motion-reduce:hover:-translate-y-0 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-indigo-500/0 before:via-purple-500/0 before:to-pink-500/0 hover:before:from-indigo-500/10 hover:before:via-purple-500/10 hover:before:to-pink-500/10 before:transition-all before:duration-200 overflow-hidden after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-white/20 dark:after:ring-white/10",
    cardTitle: "relative z-10 text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    cardDescription: "relative z-10 text-gray-600 dark:text-gray-300 grow leading-relaxed",
    cardButton:
        "relative z-10 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:from-indigo-700 active:via-purple-700 active:to-pink-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]",
    cardsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
};

export const form = {
    form: "w-full max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-900/10 p-8 border border-white/20 dark:border-gray-700/50",
    formGroup: "mb-6 text-left",
    label: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide",
    input: "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400",
    textarea:
        "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 focus-visible:outline-none min-h-[150px] resize-y disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400",
    error: "text-sm text-red-500 dark:text-red-400 mt-2 font-medium",
    button: "w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:from-indigo-700 active:via-purple-700 active:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]",
    success: "text-green-600 dark:text-green-400 text-center mt-4 font-semibold",
};

export const footer = {
    footer: "mt-auto flex flex-col items-center justify-center p-8 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-t border-white/50 dark:border-gray-800/50",
    socialLinks: "flex space-x-8",
    socialIcon:
        "text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all duration-200 hover:scale-125 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg p-2 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:-translate-y-0",
    copyright: "mt-6 text-sm text-gray-500 dark:text-gray-400",
};

export const contactStyles = {
    // Symmetric compact vertical spacing (equal top & bottom) per request
    wrapper: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden py-12",
    container: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full",
    formCard: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-gray-700/50 relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-indigo-500/5 before:via-purple-500/5 before:to-pink-500/5 before:pointer-events-none",
    // Inner card symmetric padding
    formInner: "px-6 py-8 sm:px-10 sm:py-10 relative z-10",
    title: "text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4",
    subtitle: "text-center text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto",
  
    // Form specific styles
    form: "space-y-5",
    formGroup: "space-y-2",
    label: "block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider",
    input: "mt-1 block w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus-visible:outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    textarea: "mt-1 block w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus-visible:outline-none transition-all duration-200 min-h-[120px] resize-y placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    button: "relative w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-purple-600/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-300",
    
    // Alert styles
    errorAlert: "mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 shadow-lg shadow-red-500/10",
    errorText: "text-red-700 dark:text-red-400 font-semibold text-center text-sm",
    successAlert: "mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 shadow-lg shadow-green-500/10",
    successText: "text-green-700 dark:text-green-400 font-semibold text-center flex items-center justify-center gap-2 text-sm",
} as const;
