import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-14 h-8 flex items-center bg-slate-200 dark:bg-slate-800 rounded-full p-1 cursor-pointer transition-colors duration-300"
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className="w-6 h-6 bg-white dark:bg-indigo-500 rounded-full flex items-center justify-center shadow-md"
                animate={{ x: theme === 'dark' ? 24 : 0 }}
            >
                {theme === 'light' ? (
                    <Sun size={14} className="text-amber-500" />
                ) : (
                    <Moon size={14} className="text-white" />
                )}
            </motion.div>
        </motion.button>
    );
};
