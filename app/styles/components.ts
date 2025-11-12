export const navigation = {
    nav: "flex flex-wrap justify-center gap-2 md:gap-4",
    navLink:
        "px-3 py-1.5 text-sm md:text-base rounded-md font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
    activeNavLink: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    logo: "text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    dropdownLink: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
    mobileNavLink: "px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
    mobileDropdownLink: "block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
};

export const cards = {
    card: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 flex flex-col h-full motion-reduce:transition-none motion-reduce:hover:scale-100",
    cardTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-3",
    cardDescription: "text-gray-600 dark:text-gray-300 grow",
    cardButton:
        "w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-6",
    cardsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
};

export const form = {
    form: "w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8",
    formGroup: "mb-6 text-left",
    label: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
    input: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
    textarea:
        "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus-visible:outline-none min-h-[150px] resize-y disabled:opacity-50 disabled:cursor-not-allowed",
    error: "text-sm text-red-500 dark:text-red-400 mt-1",
    button: "w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
    success: "text-green-600 dark:text-green-400 text-center mt-4",
};

export const footer = {
    footer: "mt-auto flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
    socialLinks: "flex space-x-8",
    socialIcon:
        "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded motion-reduce:transition-none motion-reduce:hover:scale-100",
    copyright: "mt-4 text-sm text-gray-500 dark:text-gray-400",
};

export const contactStyles = {
    // Symmetric compact vertical spacing (equal top & bottom) per request
    wrapper: "bg-linear-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden py-10",
    container: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full",
    formCard: "bg-white dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700",
    // Inner card symmetric padding
    formInner: "px-6 py-6 sm:px-10 sm:py-8",
    title: "text-4xl md:text-5xl font-bold text-center bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4",
    subtitle: "text-center text-gray-600 dark:text-gray-400 text-base mb-7 max-w-2xl mx-auto",
  
    // Form specific styles
    form: "space-y-4",
    formGroup: "space-y-1.5",
    label: "block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide",
    input: "mt-1 block w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus-visible:outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    textarea: "mt-1 block w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus-visible:outline-none transition-all duration-200 min-h-[100px] resize-y placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    button: "relative w-full flex justify-center items-center gap-3 py-3.5 px-6 rounded-xl text-base font-semibold text-white bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-purple-600/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 after:absolute after:inset-0 after:bg-white/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:rounded-xl after:pointer-events-none",
    
    // Alert styles
    errorAlert: "mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 animate-in fade-in slide-in-from-top-4 duration-300",
    errorText: "text-red-700 dark:text-red-400 font-medium text-center text-sm",
    successAlert: "mb-5 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 animate-in fade-in slide-in-from-top-4 duration-300",
    successText: "text-green-700 dark:text-green-400 font-medium text-center flex items-center justify-center gap-2 text-sm",
} as const;
