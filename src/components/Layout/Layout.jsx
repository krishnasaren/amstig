import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const lastWidthRef = useRef(window.innerWidth);

    // Optimized resize handler with debouncing
    const handleResize = useCallback(() => {
        const width = window.innerWidth;
        if (width !== lastWidthRef.current) {
            lastWidthRef.current = width;

            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);

            // Auto-close on mobile when resizing
            if (width < 768 && sidebarOpen) {
                setSidebarOpen(false);
            }
            // Auto-open on desktop
            if (width >= 1024) {
                setSidebarOpen(true);
            }
        }
    }, [sidebarOpen]);

    useEffect(() => {
        // Set initial state based on current window size
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);

        // Set initial sidebar state based on screen size
        if (width >= 1024) {
            setSidebarOpen(true); // Auto-open on desktop
        } else {
            setSidebarOpen(false); // Auto-close on mobile/tablet
        }

        let timeoutId;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 150);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, []); // ✅ Removed handleResize dependency to avoid infinite loop

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    const sidebarVariants = {
        mobile: {
            open: {
                x: 0,
                transition: {
                    type: "tween",
                    /*stiffness: 400,
                    damping: 40*/
                    duration: 0.00000001,
                }
            },
            closed: {
                x: "-100%",
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 45
                }
            }
        },
        desktop: {
            open: {
                x: 0,
                width: 320,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 40
                }
            },
            closed: {
                x: 0,
                width: 0,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 40
                }
            }
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* Desktop Sidebar - Always present in layout */}
            {!isMobile && (
                <motion.div
                    className="relative z-30 bg-slate-800/95 backdrop-blur-lg border-r border-slate-700/50 overflow-hidden"
                    variants={sidebarVariants.desktop}
                    animate={sidebarOpen ? 'open' : 'closed'}
                    initial={sidebarOpen ? 'open' : 'closed'}
                >
                    <Sidebar
                        isOpen={sidebarOpen}
                        isMobile={isMobile}
                        onClose={closeSidebar}
                    />
                </motion.div>
            )}

            {/* Mobile Sidebar - Fixed overlay */}
            <AnimatePresence>
                {sidebarOpen && isMobile && (
                    <motion.div
                        className="fixed top-0 left-0 z-50 h-full w-[70vw] bg-slate-800/95 backdrop-blur-lg border-r border-slate-700/50 overflow-hidden"
                        variants={sidebarVariants.mobile}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <Sidebar
                            isOpen={sidebarOpen}
                            isMobile={isMobile}
                            onClose={closeSidebar}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        onClick={closeSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-w-0">
                {/* Header */}
                <Header
                    onToggleSidebar={toggleSidebar}
                    sidebarOpen={sidebarOpen}
                    isMobile={isMobile}
                />

                {/* Main Content */}
                <motion.main
                    className="flex-1 overflow-hidden relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    {/* Glass morphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm" />

                    {/* Content */}
                    <div className="relative z-10 h-full">
                        {children}
                    </div>
                </motion.main>
            </div>
        </div>
    );
};

export default Layout;