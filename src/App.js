import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import './styles/globals.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Topic = lazy(() => import('./pages/Topic'));

function App() {
    return (
        <Router>
            <motion.div
                className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Optimized animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -20, 0],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, -30, 0],
                            y: [0, 20, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                <Layout>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/topic/:topicId" element={<Topic />} />
                            <Route path="/topic/:topicId/:subtopicId" element={<Topic />} />
                        </Routes>
                    </Suspense>
                </Layout>
            </motion.div>
        </Router>
    );
}

export default App;