import React from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ContentRenderer = ({ content }) => {
    const renderContent = (text) => {
        // Split content by code blocks
        const parts = text.split(/```(\w+)?\n([\s\S]*?)```/);

        return parts.map((part, index) => {
            if (index % 3 === 0) {
                return renderMarkdown(part, index);
            } else if ((index - 1) % 3 === 0) {
                return null; // skip language identifiers
            } else {
                const language = parts[index - 1] || 'javascript';
                return renderCodeBlock(part, language, index);
            }
        });
    };

    const renderMarkdown = (text, key) => {
        if (!text.trim()) return null;

        const lines = text.split('\n');
        const elements = [];
        let currentElement = [];
        let listItems = [];
        let inList = false;

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('# ')) {
                if (currentElement.length) {
                    elements.push(
                        <p key={`p-${elements.length}`} className="mb-4 leading-relaxed text-slate-300">
                            {currentElement.join(' ')}
                        </p>
                    );
                    currentElement = [];
                }
                elements.push(
                    <motion.h1
                        key={`h1-${elements.length}`}
                        className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {trimmedLine.substring(2)}
                    </motion.h1>
                );
            } else if (trimmedLine.startsWith('## ')) {
                if (currentElement.length) {
                    elements.push(
                        <p key={`p-${elements.length}`} className="mb-4 leading-relaxed text-slate-300">
                            {currentElement.join(' ')}
                        </p>
                    );
                    currentElement = [];
                }
                elements.push(
                    <motion.h2
                        key={`h2-${elements.length}`}
                        className="text-2xl sm:text-3xl font-semibold text-white mb-4 mt-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {trimmedLine.substring(3)}
                    </motion.h2>
                );
            } else if (trimmedLine.startsWith('### ')) {
                if (currentElement.length) {
                    elements.push(
                        <p key={`p-${elements.length}`} className="mb-4 leading-relaxed text-slate-300">
                            {currentElement.join(' ')}
                        </p>
                    );
                    currentElement = [];
                }
                elements.push(
                    <motion.h3
                        key={`h3-${elements.length}`}
                        className="text-xl sm:text-2xl font-semibold text-slate-200 mb-3 mt-6"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {trimmedLine.substring(4)}
                    </motion.h3>
                );
            } else if (trimmedLine.startsWith('- **') || trimmedLine.startsWith('- ')) {
                if (currentElement.length) {
                    elements.push(
                        <p key={`p-${elements.length}`} className="mb-4 leading-relaxed text-slate-300">
                            {processInlineFormatting(currentElement.join(' '))}
                        </p>
                    );
                    currentElement = [];
                }

                const listContent = trimmedLine.substring(2);
                listItems.push(
                    <motion.li
                        key={`li-${listItems.length}`}
                        className="text-slate-300 mb-2 flex items-start max-w-full break-words"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * listItems.length }}
                    >
                        <span className="text-blue-400 mr-2 mt-1 flex-shrink-0">•</span>
                        <span>{processInlineFormatting(listContent)}</span>
                    </motion.li>
                );
                inList = true;
            } else if (trimmedLine === '') {
                if (inList && listItems.length) {
                    elements.push(
                        <motion.ul
                            key={`ul-${elements.length}`}
                            className="mb-6 list-disc list-inside"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {listItems}
                        </motion.ul>
                    );
                    listItems = [];
                    inList = false;
                }
                if (currentElement.length) {
                    elements.push(
                        <motion.p
                            key={`p-${elements.length}`}
                            className="mb-4 leading-relaxed text-slate-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {processInlineFormatting(currentElement.join(' '))}
                        </motion.p>
                    );
                    currentElement = [];
                }
            } else {
                currentElement.push(trimmedLine);
            }
        });

        // Flush remaining list or paragraphs
        if (inList && listItems.length) {
            elements.push(
                <motion.ul
                    key={`ul-${elements.length}`}
                    className="mb-6 list-disc list-inside"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {listItems}
                </motion.ul>
            );
        }
        if (currentElement.length) {
            elements.push(
                <motion.p
                    key={`p-${elements.length}`}
                    className="mb-4 leading-relaxed text-slate-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {processInlineFormatting(currentElement.join(' '))}
                </motion.p>
            );
        }

        return <div key={key} className="prose prose-invert max-w-full">{elements}</div>;
    };

    const processInlineFormatting = (text) => {
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        text = text.replace(/`([^`]+)`/g, '<code class="bg-slate-700/50 text-blue-300 px-1 py-[2px] rounded text-xs sm:text-sm font-mono border border-slate-600/50 whitespace-nowrap">$1</code>');
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline break-words" target="_blank" rel="noopener noreferrer">$1</a>');
        return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    const renderCodeBlock = (code, language, key) => {
        if (!code.trim()) return null;

        return (
            <motion.div
                key={key}
                className="my-6 max-w-full overflow-x-auto rounded-lg border border-slate-700/50 bg-slate-800/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-700/50">
          <span className="text-sm text-slate-400 font-medium select-none">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
                    <motion.button
                        className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-600/50 select-none"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigator.clipboard.writeText(code)}
                        aria-label="Copy code to clipboard"
                    >
                        Copy
                    </motion.button>
                </div>
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap', // wrap long lines
                        wordBreak: 'break-word',
                    }}
                    showLineNumbers={false}
                    wrapLines={true}
                    wrapLongLines={true}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </motion.div>
        );
    };

    return (
        <motion.div
            className="prose prose-invert max-w-full px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ wordBreak: 'break-word' }}
        >
            {renderContent(content)}
        </motion.div>
    );
};

export default ContentRenderer;
