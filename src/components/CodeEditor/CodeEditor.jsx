import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Copy, Download, Settings, Maximize2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import OutputPanel from './OutputPanel';
import { executeCode } from '../../utils/api';

const CodeEditor = ({ initialCode = '', language = 'javascript' }) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isOutputVisible, setIsOutputVisible] = useState(false);
    const [error, setError] = useState(null);
    const [executionTime, setExecutionTime] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        monaco.editor.defineTheme('amstig-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '569CD6' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'regexp', foreground: 'D16969' },
            ],
            colors: {
                'editor.background': '#0F172A',
                'editor.foreground': '#E2E8F0',
                'editorLineNumber.foreground': '#64748B',
                'editor.selectionBackground': '#2563EB40',
                'editor.lineHighlightBackground': '#1E293B',
                'editorCursor.foreground': '#3B82F6',
                'editorWhitespace.foreground': '#374151',
            },
        });
        monaco.editor.setTheme('amstig-dark');
    };

    const runCode = async () => {
        setIsRunning(true);
        setError(null);
        setOutput('Running code...');
        setIsOutputVisible(true);

        try {
            const startTime = Date.now();
            const result = await executeCode(code, language);
            const endTime = Date.now();

            setExecutionTime(`${endTime - startTime}ms`);

            if (result.success) {
                setOutput(result.output || 'Code executed successfully (no output)');
            } else {
                const maxErrorLength = 2000;
                const truncatedError = result.error?.length > maxErrorLength
                    ? `${result.error.substring(0, maxErrorLength)}... [truncated]`
                    : result.error || 'An error occurred';

                setError(truncatedError);
                setOutput(result.output || '');
            }
        } catch (err) {
            const maxErrorLength = 2000;
            const errorMessage = err.message || 'Failed to execute code';
            const truncatedError = errorMessage.length > maxErrorLength
                ? `${errorMessage.substring(0, maxErrorLength)}... [truncated]`
                : errorMessage;

            setError(truncatedError);
            setOutput('');
        } finally {
            setIsRunning(false);
        }
    };

    const stopExecution = () => {
        setIsRunning(false);
        setOutput('Execution stopped by user');
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${language === 'javascript' ? 'js' : language}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toggleOutputVisibility = () => {
        setIsOutputVisible(!isOutputVisible);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    return (
        <motion.div
            className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700/50 shadow-2xl relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-slate-800/90 border-b border-slate-700/50 backdrop-blur-sm gap-2">
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-slate-400 font-medium whitespace-nowrap">
                        {language.charAt(0).toUpperCase() + language.slice(1)} Editor
                    </span>
                </div>

                <div className="flex items-center justify-end gap-2 w-full md:w-auto flex-wrap">
                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={runCode}
                            disabled={isRunning}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                                isRunning
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-500'
                            } text-white transition-colors`}
                            whileHover={!isRunning ? { scale: 1.02 } : {}}
                            whileTap={!isRunning ? { scale: 0.98 } : {}}
                        >
                            {isRunning ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Square size={16} />
                                    </motion.div>
                                    <span>Running...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    <span>Run Code</span>
                                </>
                            )}
                        </motion.button>

                        {isRunning && (
                            <motion.button
                                onClick={stopExecution}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium whitespace-nowrap"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Square size={16} />
                                <span>Stop</span>
                            </motion.button>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <motion.button
                            onClick={copyCode}
                            className="p-2 rounded-md bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Copy code"
                        >
                            <Copy size={16} />
                        </motion.button>
                        <motion.button
                            onClick={downloadCode}
                            className="p-2 rounded-md bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Download code"
                        >
                            <Download size={16} />
                        </motion.button>
                        <motion.button
                            onClick={toggleSettings}
                            className="p-2 rounded-md bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Settings"
                        >
                            <Settings size={16} />
                        </motion.button>
                        <motion.button
                            onClick={toggleOutputVisibility}
                            className="p-2 rounded-md bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors lg:hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Toggle Output"
                        >
                            <Maximize2 size={16} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <motion.div
                    className="absolute right-4 top-16 z-50 bg-slate-800/90 border border-slate-700/50 rounded-lg p-4 shadow-xl backdrop-blur-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <div className="text-white font-medium mb-2">Editor Settings</div>
                    <div className="text-sm text-slate-300 space-y-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="lineNumbers" defaultChecked />
                            <label htmlFor="lineNumbers">Line Numbers</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="wordWrap" defaultChecked />
                            <label htmlFor="wordWrap">Word Wrap</label>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Editor and Output Container */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" ref={editorRef}>
                {/* Editor flex-1 relative ${isOutputVisible && (isMobile || isTablet) ? 'h-1/2' : 'h-full'} */}
                <div className={`flex-1 min-h-0 relative`}>
                    <Editor
                        height="100%"
                        language={language}
                        value={code}
                        onChange={setCode}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            insertSpaces: true,
                            wordWrap: 'on',
                            contextmenu: true,
                            quickSuggestions: true,
                            suggestOnTriggerCharacters: true,
                            acceptSuggestionOnEnter: 'on',
                            bracketPairColorization: { enabled: true },
                            guides: { bracketPairs: true, indentation: true },
                            padding: { top: 16, bottom: 16 },
                        }}
                        className="rounded-b-lg lg:rounded-bl-none"
                    />

                    {isRunning && (
                        <motion.div
                            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center rounded-b-lg lg:rounded-bl-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="bg-slate-800 px-6 py-4 rounded-lg border border-slate-700 shadow-xl flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
                                />
                                <span className="text-white font-medium">Executing code...</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Output Panel */}
                {isOutputVisible && (
                    <motion.div
                        className={`absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col p-4`} //w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-700/50 bg-slate-900/80 flex flex-col ${ isMobile ? 'h-[100vh]' : 'h-full'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <OutputPanel
                            output={output}
                            error={error}
                            executionTime={executionTime}
                            onClose={() => setIsOutputVisible(false)}
                        />
                    </motion.div>
                )}
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-slate-800/90 border-t border-slate-700/50 flex items-center justify-between px-4 text-xs text-slate-400 gap-2 flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                    <span>Language: {language.charAt(0).toUpperCase() + language.slice(1)}</span>
                    <span>Lines: {code.split('\n').length}</span>
                    <span>Characters: {code.length}</span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    {executionTime && <span>Execution: {executionTime}</span>}
                    <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-400' : 'bg-green-400'}`} />
                    <span>{error ? 'Error' : 'Ready'}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default CodeEditor;