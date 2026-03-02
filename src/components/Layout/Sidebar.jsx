import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, Play, CheckCircle, MoreHorizontal } from 'lucide-react';
import topics from '../../data/topics';

const Sidebar = ({ isOpen, isMobile, onClose }) => {
    const [expandedTopics, setExpandedTopics] = useState(['javascript-basics']);
    const { topicId, subtopicId } = useParams();
    const location = useLocation();

    // Auto-expand current topic
    useEffect(() => {
        if (topicId && !expandedTopics.includes(topicId)) {
            setExpandedTopics(prev => [...prev, topicId]);
        }
    }, [topicId, expandedTopics]);

    const toggleTopic = useCallback((id) => {
        setExpandedTopics(prev =>
            prev.includes(id)
                ? prev.filter(topic => topic !== id)
                : [...prev, id]
        );
    }, []);

    const isTopicActive = useCallback((topic) => topicId === topic.id, [topicId]);
    const isSubtopicActive = useCallback((topic, subtopic) =>
        topicId === topic.id && subtopicId === subtopic.id, [topicId, subtopicId]);

    // Calculate progress
    const progress = useMemo(() => {
        const totalSubtopics = topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
        const completedSubtopics = Math.floor(totalSubtopics * 0.23); // Mock 23% completion
        return {
            percentage: 23,
            completed: completedSubtopics,
            total: totalSubtopics
        };
    }, []);

    const handleLinkClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <motion.aside
            className="h-full bg-slate-800/95 backdrop-blur-lg border-r border-slate-700/50 overflow-hidden relative flex flex-col"
            /*initial={{ x: isMobile ? '-100%' : 0 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}*/
        >
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />

            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-700/50 shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h2 className="text-lg font-semibold text-white mb-1">
                                        📚 Learning Path
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        Master programming step by step
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Collapsed view */}
                        {!isOpen && (
                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <BookOpen size={24} className="text-blue-400" />
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    <AnimatePresence>
                        {topics.map((topic, topicIndex) => (
                            <motion.div
                                key={topic.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: topicIndex * 0.05 }}
                                className="mb-1"
                            >
                                {/* Topic Header */}
                                <motion.button
                                    onClick={() => toggleTopic(topic.id)}
                                    className={`w-full px-3 sm:px-6 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors relative group ${
                                        isTopicActive(topic) ? 'bg-blue-500/20 border-r-2 border-blue-400' : ''
                                    }`}
                                    whileHover={{ x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <span className="text-lg sm:text-xl shrink-0">{topic.icon}</span>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    className="text-left min-w-0 flex-1"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 'auto' }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <h3 className="text-sm font-medium text-white truncate">
                                                        {topic.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {topic.description}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {isOpen && (
                                        <motion.div
                                            animate={{ rotate: expandedTopics.includes(topic.id) ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="shrink-0"
                                        >
                                            <ChevronRight size={16} className="text-slate-400" />
                                        </motion.div>
                                    )}

                                    {/* Collapsed indicator */}
                                    {!isOpen && expandedTopics.includes(topic.id) && (
                                        <div className="absolute right-1 top-1 w-2 h-2 bg-blue-400 rounded-full" />
                                    )}
                                </motion.button>

                                {/* Subtopics */}
                                <AnimatePresence>
                                    {expandedTopics.includes(topic.id) && isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-slate-900/30 overflow-hidden"
                                        >
                                            {topic.subtopics.map((subtopic, subtopicIndex) => (
                                                <motion.div
                                                    key={subtopic.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: subtopicIndex * 0.03 }}
                                                >
                                                    <Link
                                                        to={`/topic/${topic.id}/${subtopic.id}`}
                                                        onClick={handleLinkClick}
                                                        className={`block px-8 sm:px-12 py-2 sm:py-3 text-sm hover:bg-slate-700/30 transition-colors border-l-2 group ${
                                                            isSubtopicActive(topic, subtopic)
                                                                ? 'border-blue-400 bg-blue-500/10 text-blue-300'
                                                                : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2 min-w-0">
                                                                {isSubtopicActive(topic, subtopic) ? (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: "spring", stiffness: 500 }}
                                                                    >
                                                                        <Play size={12} className="text-blue-400 shrink-0" />
                                                                    </motion.div>
                                                                ) : (
                                                                    <BookOpen size={12} className="text-slate-500 shrink-0" />
                                                                )}
                                                                <span className="truncate">{subtopic.title}</span>
                                                            </div>

                                                            {/* Progress indicator */}
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.5 }}
                                                                className="shrink-0"
                                                            >
                                                                <CheckCircle
                                                                    size={12}
                                                                    className="text-green-400 opacity-50 group-hover:opacity-75 transition-opacity"
                                                                />
                                                            </motion.div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Collapsed subtopics indicator */}
                                {!isOpen && expandedTopics.includes(topic.id) && (
                                    <div className="px-6 py-1">
                                        <div className="flex justify-center">
                                            <MoreHorizontal size={16} className="text-slate-500" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </nav>

                {/* Footer with Progress */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="p-4 sm:p-6 border-t border-slate-700/50 shrink-0"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Overall Progress</span>
                                    <span className="text-blue-400 font-medium">{progress.percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress.percentage}%` }}
                                        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>{progress.completed} of {progress.total} completed</span>
                                    <span>🚀</span>
                                </div>
                                <motion.p
                                    className="text-xs text-slate-400 text-center"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    Keep learning to unlock new topics!
                                </motion.p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapsed footer */}
                {!isOpen && (
                    <motion.div
                        className="p-4 border-t border-slate-700/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex justify-center">
                            <div className="w-8 bg-slate-700 rounded-full h-2">
                                <motion.div
                                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress.percentage}%` }}
                                    transition={{ delay: 1, duration: 1 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.aside>
    );
};

export default Sidebar;