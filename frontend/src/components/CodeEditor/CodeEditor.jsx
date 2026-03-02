import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Copy, Download, Settings, Maximize2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import OutputPanel from './OutputPanel';
import { executeCode } from '../../utils/api';
import { exinixLanguage} from '../../exinix-grammer/editor/exinix-editor-grammer';

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


    // near top of component
    const monacoRef = useRef(null);
    const disposablesRef = useRef([]); // store disposables to dispose later

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile]);

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monaco.current = monaco;

        //custom
        // Register language
        if (!monaco.languages.getLanguages().some(l => l.id === 'exinix')) {
            monaco.languages.register({ id: 'exinix' });
        }
        monaco.languages.setMonarchTokensProvider('exinix', exinixLanguage);

        // ---------- Language configuration (comments, brackets, autoClosingPairs, folding)
        monaco.languages.setLanguageConfiguration('exinix', {
            comments: { lineComment: '//', blockComment: ['---', '---'] }, // keep triple-dash handled in tokenizer if you want
            brackets: [['{','}'], ['[',']'], ['(',')']],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" }
            ],
            surroundingPairs: [
                { open: '"', close: '"' },
                { open: "'", close: "'" },
                { open: '(', close: ')' },
                { open: '[', close: ']' },
                { open: '{', close: '}' }
            ],
            folding: {
                offSide: false,
                markers: {
                    start: new RegExp('^\\s*//\\s*#?region\\b'),
                    end: new RegExp('^\\s*//\\s*#?endregion\\b')
                }
            },
            // makes double-click/selecting reasonable
            wordPattern: /(-?\d*\.\d\w*)|([A-Za-z_]\w*)/
        });

        // dispose previous completion (HMR safety)
        if (disposablesRef.current.length) {
            disposablesRef.current.forEach(d => d && d.dispose && d.dispose());
            disposablesRef.current = [];
        }

        const completionProvider = monaco.languages.registerCompletionItemProvider('exinix', {
            provideCompletionItems: () => {
                const suggestions = [
                    { label: 'cls', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'cls ' },
                    {
                        label: 'fn',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'fn ${1:functionName}(${2:params}) {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    { label: 'var', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'var ' },
                    { label: 'const', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'const ' },
                    {
                        label: '__construct__',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '__construct__() {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    { label: 'imu', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'imu ' },
                    { label: 'mu', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'mu ' },
                    { label: 'str', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'str' },
                    { label: 'float', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'float' },
                    { label: 'int', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'int' },
                    { label: 'bool', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'bool' },
                    { label: 'byte', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'byte' },
                    { label: 'map', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'map({"${1:items}":"${2:items}"})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'coll', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'coll(${1:params},${2:items})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'set', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'set(${1:params},${2:items})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'ptr', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'ptr(${1:params})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    {
                        label: 'guard',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '__guard__(${1:imuClass},${2:imuClass}) {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    { label: 'base', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'base' },
                    { label: 'mem', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'mem(${1:params},${2:items})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'static', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'static' },
                    { label: 'typedef', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'typedef' },
                    { label: 'enum', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'enum' },
                    {
                        label: 'if',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'if (${1:condition}) {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'else',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'else {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'else if',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'else if (${1:condition}) {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'do',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'do {\n\t$0\n} while (${1:condition});',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'for',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'for (${1:init}; ${2:condition}; ${3:increment}) {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    { label: 'attempt', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'attempt {\n\t$0\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'failed', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'failed(${1:errors}) {\n\t$0\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'passed', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'passed(,${1:arga}) {\n\t$0\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'fallback', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'fallback{\n\t$0\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
                    { label: 'break', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'break' },
                    { label: 'next', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'next' },
                    {
                        label: 'while',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'while (${1:condition}) {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    { label: 'default', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'default' },
                    { label: 'async', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'async' },
                    { label: 'await', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'await' },
                    { label: 'short', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'short' },
                    { label: 'char', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'char' },
                    { label: 'double', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'double' },
                    { label: 'long', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'long' },
                    { label: 'as', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'as' },
                    {
                        label: 'use',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'use {${1:module}} from "${2:source}"\n$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'export',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '__export__(${1:item})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: '__export__',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '__export__(${1:item})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'out',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'out(${1:})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }
                ];

                return { suggestions };
            }
        });

        // ---------- Simple hover provider (optional)
        const hoverProvider = monaco.languages.registerHoverProvider('exinix', {
            provideHover: (model, position) => {
                const word = model.getWordAtPosition(position);
                if (!word) return;
                if (word.word === 'cls') {
                    return { contents: [{ value: '**cls** — declare a class (public by default)' }] };
                }
                return null;
            }
        });

        // store disposables so we can dispose on unmount or HMR
        disposablesRef.current.push(completionProvider, hoverProvider);

        //added later for scrollbar behaviour
        editor.updateOptions({
            readOnly : isMobile || window.innerWidth < 1024,
            accessibilitySupport:"off",
            domReadOnly : isMobile || window.innerWidth < 1024,
            smoothScrolling: true,
            parameterHints: { enabled: false },
            scrollbar : {
                vertical: "auto",         // "visible" | "hidden" | "auto"
                horizontal: "auto",
                verticalScrollbarSize: 6,    // Thin vertical scrollbar
                horizontalScrollbarSize: 6,  // Thin horizontal scrollbar
                useShadows: false,           // Remove shadow edges
                verticalHasArrows: false,
                horizontalHasArrows: false,
                arrowSize: 0,
                alwaysConsumeMouseWheel: false,
                handleMouseWheel: true


            },
            suggest: {
                snippetsPreventQuickSuggestions: false,
                showWords: true,

            },
            quickSuggestions: true,
            fixedOverflowWidgets: true

        });

        monaco.editor.defineTheme('amstig-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '569CD6' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'regexp', foreground: 'D16969' },
                { token: 'builtin', foreground: 'DCDCAA' },
                { token: 'identifier', foreground: '4EC9B0' }, // instead of 'type.identifier'
                { token: 'operator', foreground: 'D4D4D4' },
                {token : 'constant', foreground: '8444DD' },
            ],
            colors: {
                'editor.background': '#0F172A',
                'editor.foreground': '#E2E8F0',
                'editorLineNumber.foreground': '#64748B',
                'editor.selectionBackground': '#2563EB40',
                'editor.lineHighlightBackground': '#1E293B',
                'editorCursor.foreground': '#3B82F6',
                'editorWhitespace.foreground': '#374151',

                // Scrollbar colors
                'scrollbarSlider.background': '#4a5568aa',   // default
                'scrollbarSlider.hoverBackground': '#718096cc', // on hover
                'scrollbarSlider.activeBackground': '#a0aec0cc', // when dragging
            },
        });
        monaco.editor.setTheme('amstig-dark');
    };

    // ensure the Monaco model's language updates when `language` prop changes
    useEffect(() => {
        if (!monacoRef.current || !editorRef.current) return;
        try {
            const monaco = monacoRef.current;
            const model = editorRef.current.getModel();
            // If using a custom id 'exinix', map your `language` prop to that id
            const targetLang = (language === 'exinix') ? 'exinix' : language;
            monaco.editor.setModelLanguage(model, targetLang);
        } catch (e) {
            console.error('Failed to set model language:', e);
        }
    }, [language]);

    // cleanup on unmount — dispose stored providers
    useEffect(() => {
        return () => {
            if (disposablesRef.current && disposablesRef.current.length) {
                disposablesRef.current.forEach(d => d && d.dispose && d.dispose());
                disposablesRef.current = [];
            }
            // optional: dispose editor instance (if you created it)
            // if (editorRef.current) editorRef.current.dispose();
        };
    }, []);

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
        const blob = new Blob([code], { type: 'text/plain' }); // default MIME type
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // mapping language -> extension
        const extMap = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            java: 'java',
            c: 'c',
            cpp: 'cpp',
            csharp: 'cs',
            ruby: 'rb',
            php: 'php',
            go: 'go',
            rust: 'rs',
            html: 'html',
            css: 'css',
            json: 'json',
            xml: 'xml',
            exinix: 'exi' // 👈 your custom language
        };

        const extension = extMap[language] || language; // fallback to raw language name
        a.href = url;
        a.download = `code.${extension}`;
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