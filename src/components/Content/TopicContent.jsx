import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Users, Code, Award, ChevronDown, ChevronUp } from 'lucide-react';
import ContentRenderer from './ContentRenderer';
import CodeEditor from '../CodeEditor/CodeEditor';
import topics from '../../data/topics';

const TopicContent = () => {
    const { topicId, subtopicId } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [codeEditorExpanded, setCodeEditorExpanded] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    // Responsive handling
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Find current topic and subtopic with memoization
    const { currentTopic, currentSubtopic, currentIndex, prevSubtopic, nextSubtopic } = useMemo(() => {
        const topic = topics.find(topic => topic.id === topicId);
        const subtopic = topic?.subtopics.find(subtopic => subtopic.id === subtopicId);
        const index = topic?.subtopics.findIndex(sub => sub.id === subtopicId) ?? -1;

        return {
            currentTopic: topic,
            currentSubtopic: subtopic,
            currentIndex: index,
            prevSubtopic: index > 0 ? topic?.subtopics[index - 1] : null,
            nextSubtopic: index < (topic?.subtopics.length ?? 0) - 1 ? topic?.subtopics[index + 1] : null
        };
    }, [topicId, subtopicId]);

    if (!currentTopic || !currentSubtopic) {
        return (
            <div className="flex items-center justify-center h-full p-4 sm:p-6">
                <motion.div
                    className="text-center max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <BookOpen size={32} className="text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-4">Content Not Found</h2>
                    <p className="text-slate-400 mb-6">The requested topic or subtopic could not be found.</p>
                    <motion.button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium mx-auto block"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Return to Home
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const handleNavigation = (targetSubtopic) => {
        if (targetSubtopic) {
            navigate(`/topic/${topicId}/${targetSubtopic.id}`);
        }
    };

    const progressPercentage = ((currentIndex + 1) / currentTopic.subtopics.length) * 100;

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <motion.div
                className="p-3 sm:p-4 lg:p-6 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm shrink-0"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 mb-2 flex-wrap">
                            <span className="shrink-0">{currentTopic.icon}</span>
                            <span className="truncate">{currentTopic.title}</span>
                            <ChevronRight size={14} className="shrink-0" />
                            <span className="text-blue-400 truncate font-medium">{currentSubtopic.title}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2">
                            {currentSubtopic.title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                            <div className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>~{isMobile ? '10' : '15'} min read</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <BookOpen size={14} />
                                <span>Beginner</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Users size={14} />
                                <span>1.2k+ learners</span>
                            </div>
                            {currentSubtopic.codeExample && (
                                <div className="flex items-center space-x-1 text-green-400">
                                    <Code size={14} />
                                    <span>Interactive</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress indicator */}
                    <motion.div
                        className="text-right shrink-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.button
                            onClick={() => setShowProgress(!showProgress)}
                            className="text-xs sm:text-sm text-slate-400 mb-1 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <span>Progress: {currentIndex + 1} / {currentTopic.subtopics.length}</span>
                            {isMobile && (showProgress ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                        </motion.button>

                        <AnimatePresence>
                            {(!isMobile || showProgress) && (
                                <motion.div
                                    initial={isMobile ? { opacity: 0, height: 0 } : { opacity: 1 }}
                                    animate={isMobile ? { opacity: 1, height: 'auto' } : { opacity: 1 }}
                                    exit={isMobile ? { opacity: 0, height: 0 } : { opacity: 0 }}
                                    className="w-24 sm:w-32 bg-slate-700 rounded-full h-2"
                                >
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Layout: Stack vertically on mobile/tablet, side-by-side on desktop */}
                <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                    {/* Main Content */}
                    <motion.div
                        className={`
                            overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800
                            ${currentSubtopic.codeExample && (isMobile || isTablet)
                            ? codeEditorExpanded
                                ? 'hidden' //old h-1/3
                                : 'flex-1' //old h-2/3
                            : 'flex-1'
                            
                        }
                            ${!currentSubtopic.codeExample ? 'flex-1' : ''}
                            ${currentSubtopic.codeExample && !isMobile && !isTablet ? 'flex-1 lg:w-3/5' : ''}
                        `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                            <ContentRenderer content={currentSubtopic.content} />

                            {/* Navigation Buttons */}
                            <motion.div
                                className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50 gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="flex-1 flex justify-start">
                                    {prevSubtopic ? (
                                        <motion.button
                                            onClick={() => handleNavigation(prevSubtopic)}
                                            className="flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors border border-slate-600/50 max-w-full"
                                            whileHover={{ scale: 1.02, x: -3 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <ChevronLeft size={18} />
                                            <div className="text-left min-w-0">
                                                <div className="text-xs text-slate-400">Previous</div>
                                                <div className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                                                    {prevSubtopic.title}
                                                </div>
                                            </div>
                                        </motion.button>
                                    ) : (
                                        <div />
                                    )}
                                </div>

                                <div className="flex-1 flex justify-end">
                                    {nextSubtopic ? (
                                        <motion.button
                                            onClick={() => handleNavigation(nextSubtopic)}
                                            className="flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/25 max-w-full"
                                            whileHover={{ scale: 1.02, x: 3 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="text-right min-w-0">
                                                <div className="text-xs text-blue-100">Next</div>
                                                <div className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                                                    {nextSubtopic.title}
                                                </div>
                                            </div>
                                            <ChevronRight size={18} />
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            className="flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors shadow-lg hover:shadow-green-500/25"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="text-right">
                                                <div className="text-xs text-green-100">Completed!</div>
                                                <div className="font-medium text-sm">🎉 Well Done!</div>
                                            </div>
                                            <Award size={18} />
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Code Editor Panel */}
                    {currentSubtopic.codeExample && (
                        <motion.div
                            className={`
                                border-slate-700/50 flex flex-col min-h-0
                                ${isMobile || isTablet
                                ? `w-full border-t ${codeEditorExpanded ? 'flex-1 h-full' : 'h-1/6'}` //h-2/3
                                : 'w-full lg:w-2/5 border-t lg:border-t-0 lg:border-l'
                            }
                            `}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            {/* Code Editor Header - Mobile */}
                            {(isMobile || isTablet) && (
                                <div className="p-3 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Code size={16} className="text-blue-400" />
                                        <h3 className="text-sm font-semibold text-white">Try It Yourself</h3>
                                    </div>
                                    <motion.button
                                        onClick={() => setCodeEditorExpanded(!codeEditorExpanded)}
                                        className="p-1.5 rounded bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {codeEditorExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </motion.button>
                                </div>
                            )}

                            <div className="flex-1 flex flex-col min-h-0">
                                {/* Desktop header */}
                                {!isMobile && !isTablet && (
                                    <div className="p-4 border-b border-slate-700/50">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Code size={18} className="text-blue-400" />
                                            <h3 className="text-lg font-semibold text-white">🧪 Try It Yourself</h3>
                                        </div>
                                        <p className="text-sm text-slate-400">Experiment with the code below</p>
                                    </div>
                                )}

                                {/* Code Editor */}
                                <div className="flex-1 min-h-0 overflow-hidden">
                                    <CodeEditor
                                        initialCode={currentSubtopic.codeExample}
                                        language="javascript"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopicContent;