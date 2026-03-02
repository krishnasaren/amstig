import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, Users, Star, BookOpen, Play, Trophy } from 'lucide-react';
import topics from '../data/topics';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto p-8">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
                    variants={itemVariants}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-block mb-6"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25">
                                <Code size={40} className="text-white" />
                            </div>
                            <motion.div
                                className="absolute -top-2 -right-2"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity }
                                }}
                            >
                                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <Star size={14} className="text-yellow-900" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6"
                        variants={itemVariants}
                    >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to
            </span>
                        <br />
                        <span className="text-white">Amstig</span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        Your journey to mastering programming starts here. Learn, code, and create with our interactive platform designed for modern developers.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        variants={itemVariants}
                    >
                        <motion.button
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center space-x-2"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play size={20} />
                            <span>Start Learning</span>
                            <ArrowRight size={20} />
                        </motion.button>

                        <motion.button
                            className="px-8 py-4 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-semibold rounded-xl transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Watch Demo
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                    variants={itemVariants}
                >
                    {[
                        { icon: Users, label: 'Active Learners', value: '10K+', color: 'text-blue-400' },
                        { icon: BookOpen, label: 'Lessons', value: '200+', color: 'text-green-400' },
                        { icon: Code, label: 'Code Examples', value: '500+', color: 'text-purple-400' },
                        { icon: Trophy, label: 'Success Rate', value: '95%', color: 'text-yellow-400' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-colors"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                        >
                            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-slate-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Section */}
                <motion.div
                    className="mb-16"
                    variants={itemVariants}
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Why Choose <span className="text-blue-400">Amstig</span>?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Code,
                                title: 'Interactive Code Editor',
                                description: 'Write, test, and debug code directly in your browser with our powerful Monaco-based editor.',
                                color: 'from-blue-500 to-blue-600'
                            },
                            {
                                icon: Zap,
                                title: 'Instant Feedback',
                                description: 'Get real-time results and error messages to learn from your mistakes immediately.',
                                color: 'from-yellow-500 to-orange-500'
                            },
                            {
                                icon: BookOpen,
                                title: 'Structured Learning',
                                description: 'Follow our carefully crafted curriculum that builds your skills progressively.',
                                color: 'from-green-500 to-green-600'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/50 transition-all"
                                whileHover={{ y: -10, scale: 1.02 }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 + 0.8 }}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <feature.icon size={32} className="text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Learning Paths */}
                <motion.div
                    className="mb-16"
                    variants={itemVariants}
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Start Your Learning Journey
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic, index) => (
                            <motion.div
                                key={topic.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 + 1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group"
                            >
                                <Link to={`/topic/${topic.id}/${topic.subtopics[0].id}`}>
                                    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all h-full">
                                        <div className="flex items-center mb-4">
                                            <div className="text-4xl mr-4">{topic.icon}</div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                    {topic.title}
                                                </h3>
                                                <p className="text-sm text-slate-400">
                                                    {topic.subtopics.length} lessons
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-slate-300 mb-6 leading-relaxed">
                                            {topic.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                                                <BookOpen size={16} />
                                                <span>Beginner Friendly</span>
                                            </div>

                                            <motion.div
                                                className="flex items-center text-blue-400 group-hover:text-blue-300"
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 5 }}
                                            >
                                                <span className="text-sm font-medium mr-2">Start</span>
                                                <ArrowRight size={16} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="text-center py-16"
                    variants={itemVariants}
                >
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-12">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Ready to Start Coding?
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of learners who are already building their programming skills with Amstig.
                        </p>
                        <motion.button
                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all text-lg"
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Begin Your Journey
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Home;