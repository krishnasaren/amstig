import React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                className="flex flex-col items-center space-y-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative"
                >
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full" />
                    <Code2
                        className="absolute inset-0 m-auto text-blue-400"
                        size={24}
                    />
                </motion.div>
                <motion.p
                    className="text-white font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Loading amazing content...
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;