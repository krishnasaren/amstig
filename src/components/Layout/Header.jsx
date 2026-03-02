import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Code2, Sparkles, Search, Bell, User, X } from 'lucide-react';

const Header = ({ onToggleSidebar, sidebarOpen, isMobile }) => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    const toggleSearch = () => {
        setSearchOpen(prev => !prev);
        if (searchOpen) {
            setSearchQuery('');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            // Implement search functionality here
        }
    };

    return (
        <motion.header
            className="h-14 sm:h-16 bg-slate-800/90 backdrop-blur-lg border-b border-slate-700/50 flex items-center px-3 sm:px-6 z-20 relative shrink-0"
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-sm" />

            <div className="relative z-10 flex items-center justify-between w-full">
                {/* Left side */}
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                    {/* Menu toggle */}
                    <motion.button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors shrink-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={isMobile ? 18 : 20} className="text-slate-200" />
                    </motion.button>

                    {/* Logo - Responsive */}
                    <motion.div
                        className="flex items-center space-x-2 min-w-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <div className="relative shrink-0">
                            <Code2 size={isMobile ? 24 : 28} className="text-blue-400" />
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles size={isMobile ? 10 : 12} className="text-yellow-400" />
                            </motion.div>
                        </div>
                        <div className="min-w-0 hidden xs:block">
                            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Amstig
                            </h1>
                            <p className="text-xs text-slate-400 -mt-1 hidden sm:block">Learn. Code. Create.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Center - Search */}
                <AnimatePresence>
                    {!isMobile && !searchOpen && (
                        <motion.div
                            className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={handleSearchSubmit} className="relative w-full">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all placeholder-slate-400 text-sm"
                                />
                            </form>
                        </motion.div>
                    )}

                    {/* Mobile search overlay */}
                    {searchOpen && (
                        <motion.div
                            className="absolute inset-0 bg-slate-800/95 backdrop-blur-lg flex items-center px-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center space-x-3">
                                <Search size={20} className="text-slate-400 shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
                                />
                                <motion.button
                                    type="button"
                                    onClick={toggleSearch}
                                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X size={20} className="text-slate-400" />
                                </motion.button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right side */}
                {!searchOpen && (
                    <motion.div
                        className="flex items-center space-x-1 sm:space-x-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {/* Mobile search button */}
                        <motion.button
                            onClick={toggleSearch}
                            className="md:hidden p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Search"
                        >
                            <Search size={18} className="text-slate-300" />
                        </motion.button>

                        {/* Notifications */}
                        <motion.button
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors relative"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Notifications"
                        >
                            <Bell size={isMobile ? 16 : 18} className="text-slate-300" />
                            <motion.span
                                className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.button>

                        {/* Profile */}
                        <motion.div
                            className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shrink-0">
                                <User size={isMobile ? 12 : 16} className="text-white" />
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-slate-200 truncate max-w-20">
                                Learner
                            </span>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
};

export default Header;