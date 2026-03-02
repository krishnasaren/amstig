import React, { useMemo, useCallback,useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import { PrismLight as PrismSyntaxHighlighter } from 'react-syntax-highlighter';
import {Light as HLJSSyntaxHighlighter} from 'react-syntax-highlighter';
import { vscDarkPlus,atomDark,oneDark,duotoneDark,a11yDark,solarizedDarkAtom,lucario,materialDark,dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { atomOneDark, monokai, github, docco, solarizedLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import html from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import kotlin from "react-syntax-highlighter/src/languages/hljs/kotlin";
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import swift from "react-syntax-highlighter/src/languages/hljs/swift";
import nasm from 'react-syntax-highlighter/dist/esm/languages/prism/nasm'
import {x86asm,mipsasm,armasm} from "react-syntax-highlighter/src/languages/hljs";



import exinix from '../../exinix-grammer/prism/exinix'; //copied java syntax prism
//import exinix from '../../exinix-grammer/hljs/exinix' // exinix hljs
//import hljs from 'highlight.js/lib/core'; //core hljs



const prismLanguages = new Set(['jsx', 'tsx', 'nasm', 'html','css','exinix']);


const ContentRenderer = ({ content }) => {
    // Generate unique placeholder for inline code preservation
    const generatePlaceholder = useCallback((type, index) => `__${type.toUpperCase()}_PLACEHOLDER_${index}__`, []);
    const [copied, setCopied] = useState(false);
    HLJSSyntaxHighlighter.registerLanguage("python",python);
    PrismSyntaxHighlighter.registerLanguage("jsx",jsx);
    HLJSSyntaxHighlighter.registerLanguage("java",java);
    PrismSyntaxHighlighter.registerLanguage("exinix",exinix);
    HLJSSyntaxHighlighter.registerLanguage("javascript",javascript);
    HLJSSyntaxHighlighter.registerLanguage("csharp",csharp);
    HLJSSyntaxHighlighter.registerLanguage("sql",sql);
    HLJSSyntaxHighlighter.registerLanguage("bash",bash);
    PrismSyntaxHighlighter.registerLanguage("html",html);
    PrismSyntaxHighlighter.registerLanguage("css",css);
    HLJSSyntaxHighlighter.registerLanguage("json",json);
    HLJSSyntaxHighlighter.registerLanguage("typescript",typescript);
    PrismSyntaxHighlighter.registerLanguage("tsx",tsx);
    HLJSSyntaxHighlighter.registerLanguage("php",php);
    HLJSSyntaxHighlighter.registerLanguage("c",c);
    HLJSSyntaxHighlighter.registerLanguage("cpp",cpp);
    HLJSSyntaxHighlighter.registerLanguage("swift",swift);
    HLJSSyntaxHighlighter.registerLanguage("kotlin",kotlin);
    HLJSSyntaxHighlighter.registerLanguage("ruby",ruby);
    HLJSSyntaxHighlighter.registerLanguage("rust",rust);
    PrismSyntaxHighlighter.registerLanguage("nasm",nasm);
    HLJSSyntaxHighlighter.registerLanguage("x86asm",x86asm);
    HLJSSyntaxHighlighter.registerLanguage("mipsasm",mipsasm);
    HLJSSyntaxHighlighter.registerLanguage("armasm", armasm);










    // Enhanced animation variants
    const animationVariants = useMemo(() => ({
        header1: {
            initial: { opacity: 0, y: -20, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { delay: 0.1, type: "spring", stiffness: 120 }
        },
        header2: {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.2, type: "spring", stiffness: 130 }
        },
        header3: {
            initial: { opacity: 0, x: -15 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.3, type: "spring", stiffness: 140 }
        },
        paragraph: {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2, duration: 0.4 }
        },
        listItem: (index) => ({
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.05 * index, type: "spring", stiffness: 160 }
        }),
        codeBlock: {
            initial: { opacity: 0, y: 20, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { delay: 0.3, duration: 0.5, ease: "easeOut" }
        }
    }), []);

    // FIXED: Proper inline formatting with code preservation
    const processInlineFormatting = useCallback((text, inlineCodes) => {
        if (!text) return '';

        let processedText = text;

        // First restore inline code blocks (these should NOT be processed further)
        processedText = processedText.replace(/__INLINE_PLACEHOLDER_(\d+)__/g, (match, index) => {
            const codeIndex = parseInt(index);
            const code = inlineCodes?.[codeIndex] || '';
            // Escape HTML in code content to prevent XSS
            const escapedCode = code.replace(/[<>&"']/g, (char) => {
                const escapeMap = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' };
                return escapeMap[char];
            });
            return `<code class="bg-slate-700/60 text-blue-300 px-2 py-0.5 rounded-md text-sm font-mono border border-slate-600/50 whitespace-nowrap">${escapedCode}</code>`;
        });

        // Then process other markdown formatting
        processedText = processedText
            .replace(/\*\*((?:[^*]|\*(?!\*))+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\*((?:[^*]|\*\*)+)\*/g, '<em class="italic text-slate-200">$1</em>')
            .replace(/~~(.*?)~~/g, '<del class="line-through text-slate-400">$1</del>')
            .replace(/==(.*?)==/g, '<mark class="bg-yellow-400/20 text-yellow-300 px-1 rounded">$1</mark>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200 break-words hyphens-auto" target="_blank" rel="noopener noreferrer">$1</a>');

        return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
    }, []);

    // FIXED: Enhanced code block renderer
    const renderCodeBlock = useCallback((code, language, key) => {
        if (!code.trim()) return null;
        const isPrism = prismLanguages.has(language);
        const themeMap = {
            prism: materialDark,
            hljs: atomOneDark
        };

        const SyntaxComponent = isPrism ? PrismSyntaxHighlighter : HLJSSyntaxHighlighter;
        const style = isPrism ? themeMap.prism : themeMap.hljs;


        const displayLanguage = language || 'text';
        const languageColors = {
            javascript: 'text-yellow-400',
            python: 'text-green-400',
            html: 'text-orange-400',
            css: 'text-blue-400',
            json: 'text-purple-400',
            sql: 'text-cyan-400',
            bash: 'text-gray-400',
            typescript: 'text-emerald-500',
            jsx: 'text-lime-500',
            tsx: 'text-amber-600',
            exinix : "text-pink-500",
            java : "text-rose-500",
            php : "text-stone-500",
            kotlin : "text-indigo-500",
            rust : "text-slate-500",
            c: "text-fuchsia-500",
            cpp :"text-violet-500",
            assembly : "text-zinc-600",
            swift : "text-neutral-500",
            ruby: "text-sky-500",
        };

        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(code.trim());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                console.log('Code copied successfully');
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        };

        return (
            <motion.div
                key={key}
                className="my-6 group"
                {...animationVariants.codeBlock}
            >
                <div className="bg-slate-800/95 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-700/60">
                        <span className={`text-sm font-medium flex items-center gap-2 ${languageColors[displayLanguage] || 'text-slate-400'}`}>
                            <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                            {displayLanguage.charAt(0).toUpperCase() + displayLanguage.slice(1)}
                        </span>
                        <motion.button
                            className="text-xs text-slate-400 hover:text-white transition-all duration-200 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/70 border border-slate-600/50 hover:border-slate-500/50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopy}
                            aria-label="Copy code to clipboard"
                        >
                            Copy
                        </motion.button>
                    </div>
                    <div className="relative overflow-x-auto">
                        <SyntaxComponent
                            language={displayLanguage}
                            style = {style}
                            customStyle={{
                                margin: 0,
                                padding: '1.25rem',
                                background: 'transparent',
                                fontSize: '0.875rem',
                                lineHeight: '1.6',
                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace'
                            }}
                            showLineNumbers={code.split('\n').length > 0}
                            lineNumberStyle={{
                                color: '#64748b',
                                paddingRight: '1rem',
                                minWidth: '2.5rem'
                            }}
                            wrapLines={true}
                            wrapLongLines={true}
                        >
                            {code.trim()}
                        </SyntaxComponent>

                    </div>
                </div>
            </motion.div>
        );
    }, [animationVariants]);

    // FIXED: Markdown renderer with proper dependencies
    const renderMarkdown = useCallback((text, key, inlineCodes) => {
        if (!text.trim()) return null;

        const lines = text.split('\n');
        const elements = [];
        let currentElement = [];
        let listItems = [];
        let inList = false;
        let listType = 'unordered';

        const flushCurrentElement = () => {
            if (currentElement.length > 0) {
                const content = currentElement.join(' ').trim();
                if (content) {
                    elements.push(
                        <motion.p
                            key={`p-${elements.length}`}
                            className="text-slate-300 mb-4 leading-relaxed break-words overflow-wrap-anywhere"
                            {...animationVariants.paragraph}
                        >
                            {processInlineFormatting(content, inlineCodes)}
                        </motion.p>
                    );
                }
                currentElement = [];
            }
        };

        const flushList = () => {
            if (inList && listItems.length > 0) {
                const ListComponent = listType === 'ordered' ? 'ol' : 'ul';
                const listClass = listType === 'ordered'
                    ? "mb-6 space-y-2 list-decimal list-inside"
                    : "mb-6 space-y-2";

                elements.push(
                    <motion.div
                        key={`list-${elements.length}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                    >
                        <ListComponent className={listClass}>
                            {listItems}
                        </ListComponent>
                    </motion.div>
                );
                listItems = [];
                inList = false;
            }
        };

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            // Headers with PROPER SIZES (not too big)
            if (trimmedLine.startsWith('# ')) {
                flushCurrentElement();
                flushList();
                elements.push(
                    <motion.h1
                        key={`h1-${elements.length}`}
                        className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight"
                        {...animationVariants.header1}
                    >
                        {processInlineFormatting(trimmedLine.substring(2), inlineCodes)}
                    </motion.h1>
                );
            }
            else if (trimmedLine.startsWith('## ')) {
                flushCurrentElement();
                flushList();
                elements.push(
                    <motion.h2
                        key={`h2-${elements.length}`}
                        className="text-2xl font-semibold text-white mb-4 mt-8 border-b border-slate-700/30 pb-2"
                        {...animationVariants.header2}
                    >
                        {processInlineFormatting(trimmedLine.substring(3), inlineCodes)}
                    </motion.h2>
                );
            }
            else if (trimmedLine.startsWith('### ')) {
                flushCurrentElement();
                flushList();
                elements.push(
                    <motion.h3
                        key={`h3-${elements.length}`}
                        className="text-xl font-semibold text-slate-200 mb-3 mt-6"
                        {...animationVariants.header3}
                    >
                        {processInlineFormatting(trimmedLine.substring(4), inlineCodes)}
                    </motion.h3>
                );
            }
            else if (trimmedLine.startsWith('#### ')) {
                flushCurrentElement();
                flushList();
                elements.push(
                    <motion.h4
                        key={`h4-${elements.length}`}
                        className="text-lg font-medium text-slate-300 mb-2 mt-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        {processInlineFormatting(trimmedLine.substring(5), inlineCodes)}
                    </motion.h4>
                );
            }
            else if (trimmedLine.startsWith('##### ')) {
                flushCurrentElement();
                flushList();
                elements.push(
                    <motion.h5
                        key={`h5-${elements.length}`}
                        className="text-base font-medium text-slate-400 mb-2 mt-3"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.27 }}
                    >
                        {processInlineFormatting(trimmedLine.substring(6), inlineCodes)}
                    </motion.h5>
                );
            }
            else if (trimmedLine.startsWith('###### ')) {
                flushCurrentElement();
                flushList();
                elements.push(
                    <motion.h6
                        key={`h6-${elements.length}`}
                        className="text-sm font-medium text-slate-500 mb-1 mt-2"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {processInlineFormatting(trimmedLine.substring(7), inlineCodes)}
                    </motion.h6>
                );
            }
            // Unordered lists
            else if (trimmedLine.match(/^[-*+]\s/)) {
                flushCurrentElement();
                if (!inList || listType !== 'unordered') {
                    flushList();
                    inList = true;
                    listType = 'unordered';
                }

                const listContent = trimmedLine.replace(/^[-*+]\s/, '');
                listItems.push(
                    <motion.li
                        key={`li-${listItems.length}`}
                        className="text-slate-300 flex items-center group hover:text-slate-200 transition-colors"
                        {...animationVariants.listItem(listItems.length)}
                    >
                        <span className="text-blue-400 mr-3 group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0">
                            •
                        </span>
                        <span className="flex-1">{processInlineFormatting(listContent, inlineCodes)}</span>
                    </motion.li>
                );
            }
            // Ordered lists
            else if (trimmedLine.match(/^\d+\.\s/)) {
                flushCurrentElement();
                if (!inList || listType !== 'ordered') {
                    flushList();
                    inList = true;
                    listType = 'ordered';
                }

                const listContent = trimmedLine.replace(/^\d+\.\s/, '');
                const itemNumber = listItems.length + 1;
                listItems.push(
                    <motion.li
                        key={`li-${listItems.length}`}
                        className="text-slate-300 flex items-center group hover:text-slate-200 transition-colors"
                        {...animationVariants.listItem(listItems.length)}
                    >
                        <span className="text-blue-400 mr-3  group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0 font-medium min-w-[1.5rem]">
                            {itemNumber}.
                        </span>
                        <span className="flex-1">{processInlineFormatting(listContent, inlineCodes)}</span>
                    </motion.li>
                );
            }
            // Blockquotes
            else if (trimmedLine.startsWith('> ')) {
                flushCurrentElement();
                flushList();
                const quoteContent = trimmedLine.substring(2);
                elements.push(
                    <motion.blockquote
                        key={`quote-${elements.length}`}
                        className="border-l-4 border-blue-400/50 pl-6 py-3 my-6 bg-slate-800/30 rounded-r-lg italic text-slate-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {processInlineFormatting(quoteContent, inlineCodes)}
                    </motion.blockquote>
                );
            }
            // Tables (improved detection)
            else if (trimmedLine.includes('|') && trimmedLine.split('|').filter(cell => cell.trim()).length > 1) {
                flushCurrentElement();
                flushList();
                // Parse table row
                const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell);
                elements.push(
                    <motion.div
                        key={`table-row-${elements.length}`}
                        className="my-2 text-slate-300 font-mono text-sm bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 overflow-x-auto"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex gap-4 min-w-max">
                            {cells.map((cell, index) => (
                                <div key={index} className="flex-1 min-w-[100px]">
                                    {processInlineFormatting(cell, inlineCodes)}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            }
            // Horizontal rules
            else if (trimmedLine.match(/^[-*_]{3,}$/)) {
                flushCurrentElement();
                flushList();
                elements.push(
                    <motion.hr
                        key={`hr-${elements.length}`}
                        className="my-8 border-slate-600/50"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    />
                );
            }
            // Empty line handling
            else if (trimmedLine === '') {
                flushList();
                flushCurrentElement();
            }
            // Regular text
            else {
                currentElement.push(trimmedLine);
            }
        });

        // Handle remaining content
        flushList();
        flushCurrentElement();

        return <div key={key} className="prose prose-invert max-w-none">{elements}</div>;
    }, [animationVariants, processInlineFormatting]);

    // FIXED: Main content renderer with proper dependencies
    const renderContent = useCallback((text) => {
        if (!text) return null;

        // Step 1: Extract and preserve inline code blocks FIRST
        const inlineCodes = [];
        let processedText = text.replace(/`([^`\n]+)`/g, (match, code) => {
            const index = inlineCodes.length;
            inlineCodes.push(code);
            return generatePlaceholder('inline', index);
        });

        // Step 2: Split by code blocks (maintaining original efficient method)
        const parts = processedText.split(/```(\w+)?\n([\s\S]*?)```/);

        return parts.map((part, index) => {
            // Regular text content (every 3rd element starting from 0)
            if (index % 3 === 0) {
                return renderMarkdown(part, `content-${index}`, inlineCodes);
            }
            // Language identifier (every 3rd element starting from 1) - skip
            else if ((index - 1) % 3 === 0) {
                return null;
            }
            // Code content (every 3rd element starting from 2)
            else {
                const language = parts[index - 1] || 'javascript';
                return renderCodeBlock(part, language, `code-${index}`);
            }
        });
    }, [generatePlaceholder, renderMarkdown, renderCodeBlock]);

    // Memoize the entire render to prevent unnecessary re-renders
    const renderedContent = useMemo(() => {
        return renderContent(content);
    }, [content, renderContent]);

    return (
        <motion.div
            className="prose prose-invert max-w-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {renderedContent}
            {/* 👇 Toast goes here */}
            {copied && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="fixed z-[9999] bottom-5 right-5 bg-sky-700 text-white text-sm px-2 py-1 rounded-md shadow-md border border-sky-800/60"
                >
                    Copied to clipboard
                </motion.div>
            )}
        </motion.div>
    );
};

export default React.memo(ContentRenderer);