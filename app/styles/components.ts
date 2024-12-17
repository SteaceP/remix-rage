export const navigation = {
    nav: "flex flex-wrap justify-center gap-2 md:gap-4",
    navLink:
        "px-3 py-1.5 text-sm md:text-base rounded-md font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
    activeNavLink: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    logo: "text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors",
    dropdownLink: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
    mobileNavLink: "px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md mb-1",
    mobileDropdownLink: "block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md mb-1",
};

export const cards = {
    card: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col h-full",
    cardTitle: "text-xl font-semibold text-gray-900 dark:text-white mb-3",
    cardDescription: "text-gray-600 dark:text-gray-300 flex-grow",
    cardButton:
        "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6",
    cardsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto",
};

export const form = {
    form: "w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8",
    formGroup: "mb-6 text-left",
    label: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
    input: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
    textarea:
        "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[150px] resize-y",
    error: "text-sm text-red-500 dark:text-red-400 mt-1",
    button: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    success: "text-green-600 dark:text-green-400 text-center mt-4",
};

export const footer = {
    footer: "mt-auto flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
    socialLinks: "flex space-x-8",
    socialIcon:
        "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110",
    copyright: "mt-4 text-sm text-gray-500 dark:text-gray-400",
};
