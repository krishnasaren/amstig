import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, X, Copy, Trash2, AlertCircle, CheckCircle } from 'lucide-react';


const OutputPanel = ({ output, error, executionTime, onClose, onClear }) => {
    const outputRef = useRef(null);

    // Scroll to bottom on output or error update
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output, error]);

    const copyOutput = async () => {
        const textToCopy = error || output || '';
        try {
            await navigator.clipboard.writeText(textToCopy);
        } catch (err) {
            console.error('Failed to copy output:', err);
        }
    };

    return (
        <motion.div
            className="h-full bg-slate-900/95 backdrop-blur-sm flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between p-2 sm:p-3 border-b border-slate-700/50 bg-slate-800/50 gap-2">
                <div className="flex items-center space-x-2 flex-grow min-w-0">
                    <Terminal size={16} className="text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate">Console Output</span>
                    {executionTime && (
                        <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded select-none whitespace-nowrap">
                            {executionTime}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                    <motion.button
                        onClick={copyOutput}
                        className="p-1.5 rounded bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Copy output"
                        aria-label="Copy output"
                    >
                        <Copy size={14} />
                    </motion.button>

                    <motion.button
                        onClick={onClear}
                        className={`p-1.5 rounded bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                            !output && !error ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        whileHover={output || error ? { scale: 1.05 } : {}}
                        whileTap={output || error ? { scale: 0.95 } : {}}
                        title="Clear output"
                        aria-label="Clear output"
                        disabled={!output && !error}
                    >
                        <Trash2 size={14} />
                    </motion.button>

                    <motion.button
                        onClick={onClose}
                        className="p-1.5 rounded bg-slate-700/50 hover:bg-red-500/50 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Close panel"
                        aria-label="Close panel"
                    >
                        <X size={14} />
                    </motion.button>
                </div>
            </div>

            {/* Output Content */}
            <div
                ref={outputRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 font-mono text-sm scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 break-words min-h-[100px]"
                style={{ wordBreak: 'break-word' }}
            >
                {error ? (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                        <div className="flex items-center space-x-2 text-red-400">
                            <AlertCircle size={16} />
                            <span className="font-semibold">Error</span>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded p-3 overflow-auto max-h-[30vh]">
                            <pre className="text-red-300 text-sm whitespace-pre-wrap break-words">{error}</pre>
                        </div>
                        {output && (
                            <div className="mt-3">
                                <div className="text-slate-400 mb-2 text-xs uppercase tracking-wide">Partial Output:</div>
                                <div className="bg-slate-800/50 rounded border border-slate-700/50 overflow-auto max-h-[20vh]">
                                    <pre className="text-slate-300 text-sm whitespace-pre-wrap p-3 break-words">{output}</pre>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : output ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className="flex items-center space-x-2 text-green-400">
                            <CheckCircle size={16} />
                            <span className="font-semibold">Output</span>
                        </div>
                        <div className="bg-slate-800/50 rounded border border-slate-700/50 max-h-[50vh] overflow-auto">
                            <pre className="text-green-300 whitespace-pre-wrap p-3 leading-relaxed">{output}</pre>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-4 select-none">
                        <Terminal size={48} className="mb-4 opacity-50" />
                        <p className="text-sm">No output yet</p>
                        <p className="text-xs mt-1">Run your code to see results here</p>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-slate-800/50 border-t border-slate-700/50 flex items-center justify-between px-2 sm:px-3 text-xs select-none flex-wrap gap-2">
                <div className="flex items-center space-x-4 text-slate-400 overflow-hidden whitespace-nowrap min-w-0 flex-wrap gap-2">
                    <span className="truncate">Lines: {(error || output || '').split('\n').length}</span>
                    <span className="truncate">Characters: {(error || output || '').length}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            error ? 'bg-red-400 animate-pulse' : output ? 'bg-green-400' : 'bg-slate-600'
                        }`}
                    />
                    <span className="text-slate-400">{error ? 'Error' : output ? 'Success' : 'Waiting'}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default OutputPanel;