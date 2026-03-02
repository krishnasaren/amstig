import React, { useMemo, useCallback,useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import { PrismLight as PrismSyntaxHighlighter } from 'react-syntax-highlighter';
import {Light as HLJSSyntaxHighlighter} from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
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

import exinix from '../../exinix-grammer/prism/exinix';

const prismLanguages = new Set(['jsx', 'tsx', 'nasm', 'html','css','exinix']);

const ContentRenderer = ({ content }) => {
    const generatePlaceholder = useCallback((type, index) => `__${type.toUpperCase()}_PLACEHOLDER_${index}__`, []);
    const [copied, setCopied] = useState(false);

    // Register all languages
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
        },
        table: {
            initial: { opacity: 0, scale: 0.98 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.3 }
        },
        tableRow: (index) => ({
            initial: {opacity: 0, x: -10},
            animate: {opacity: 1, x: 0},
            transition: {delay: 0.03 * index, duration: 0.3}
        }),
        taskItem: (index) => ({
            initial: {opacity: 0, x: -15, scale: 0.95},
            animate: {opacity: 1, x: 0, scale: 1},
            transition: {delay: 0.05 * index, type: "spring", stiffness: 150}
        })
    }), []);


    const processInlineFormatting = useCallback((text, inlineCodes) => {
        if (!text) return '';

        let processedText = text;

        // 1️⃣ Step: Replace inline code with placeholders
        const inlineCodesArray = inlineCodes || [];
        processedText = processedText.replace(/`([^`\n]+)`/g, (match, code) => {
            const index = inlineCodesArray.length;
            inlineCodesArray.push(code); // store code for later
            return `__INLINE_PLACEHOLDER_${index}__`;
        });

        // 2️⃣ Step: Apply Markdown formatting on remaining text
        processedText = processedText
            // Bold
            .replace(/\*\*((?:[^*]|\*(?!\*))+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            // Italic
            .replace(/\*((?:[^*]|\*\*)+)\*/g, '<em class="italic text-slate-200">$1</em>')
            // Strikethrough
            .replace(/~~(.*?)~~/g, '<del class="line-through text-slate-400">$1</del>')
            // Highlight (double equals)
            .replace(/==([\s\S]+?)==/g, '<mark class="bg-yellow-400/20 text-yellow-300 px-1 rounded">$1</mark>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200 break-words hyphens-auto" target="_blank" rel="noopener noreferrer">$1</a>');

        // 3️⃣ Step: Restore inline code placeholders
        processedText = processedText.replace(/__INLINE_PLACEHOLDER_(\d+)__/g, (match, index) => {
            const code = inlineCodesArray[parseInt(index, 10)] || '';
            const escapedCode = code.replace(/[<>&"']/g, (char) => {
                const escapeMap = {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;'};
                return escapeMap[char];
            });
            return `<code class="bg-slate-700/60 text-cyan-300 px-2 py-0.5 rounded-md text-sm font-mono border border-slate-600/50 whitespace-nowrap">${escapedCode}</code>`;
        });

        return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
    }, []);



    // Enhanced task list renderer
    const renderTaskList = useCallback((items, startIndex) => {
        return items.map((item, index) => {
            const isCompleted = item.startsWith('[x]') || item.startsWith('[X]');
            const isPending = item.startsWith('[ ]');

            if (!isCompleted && !isPending) return null;

            const taskContent = item.replace(/^\[[ xX]\]\s*/, '');

            return (
                <motion.div
                    key={`task-${startIndex + index}`}
                    className="flex items-center space-x-3 mb-2 group"
                    {...animationVariants.taskItem(index)}
                >
                    <div
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            isCompleted
                                ? 'bg-green-500/20 border-green-400 text-green-400'
                                : 'border-slate-500 hover:border-slate-400'
                        }`}>
                        {isCompleted && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        )}
                    </div>
                    <span className={`flex-1 transition-colors duration-200 ${
                        isCompleted ? 'text-slate-400 line-through' : 'text-slate-300'
                    }`}>
                        {processInlineFormatting(taskContent)}
                    </span>
                </motion.div>
            );
        }).filter(Boolean);
    }, [animationVariants, processInlineFormatting]);

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


    const INDENT_UNIT = 1; // treat every 2 spaces as one nesting level
    const renderMarkdown = useCallback((text, key, inlineCodes) => {
        if (!text.trim()) return null;

        const lines = text.split('\n');
        const elements = [];
        let currentElement = [];
        let listItems = [];
        let inList = false;
        let listType = 'unordered';
        let tableData = null;

        let taskItems = [];
        let inTaskList = false;

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

        //added later
        // Clean nested list renderer with proper bullet/number spacing & bool highlighting
        const renderNestedList = (items, parentOrdered = false, depth = 0, inlineCodes = []) => {
            const tree = [];
            const stack = [{ children: tree, indent: -1 }];

            items.forEach(item => {
                while (stack.length > 0 && item.indent <= stack[stack.length - 1].indent) {
                    stack.pop();
                }
                const node = { content: item.content, children: [], ordered: item.ordered };
                stack[stack.length - 1].children.push(node);
                stack.push({ children: node.children, indent: item.indent });
            });

            const renderTree = (nodes, ordered, currentDepth) => {
                const ListTag = ordered ? "ol" : "ul";
                return (
                    <ListTag className="m-0 p-0 space-y-2">
                        {nodes.map((node, idx) => (
                            <motion.li
                                key={`${currentDepth}-${idx}`}
                                className="flex items-start gap-3 mb-1"
                                style={{ paddingLeft: `${currentDepth * 1.25}rem` }}
                                {...animationVariants.listItem(idx)}
                            >
                        <span className="text-blue-400 font-medium shrink-0 w-6 text-right">
                            {node.ordered ? `${idx + 1}.` : "•"}
                        </span>
                                <div className="text-slate-300 leading-relaxed flex-1">
                                    {processInlineFormatting(node.content, inlineCodes)}
                                    {node.children.length > 0 &&
                                        renderTree(node.children, node.ordered, currentDepth + 1)}
                                </div>
                            </motion.li>
                        ))}
                    </ListTag>
                );
            };

            return renderTree(tree, parentOrdered, depth);
        };

        const flushList = () => {
            if (!inList || listItems.length === 0) return;

            elements.push(
                <motion.div
                    key={`list-${elements.length}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="mb-6"
                >
                    {renderNestedList(listItems, listItems[0]?.ordered ?? false, 0, inlineCodes)}
                </motion.div>
            );

            listItems = [];
            inList = false;
        };

        /*const flushList = () => {
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
        };*/


        const flushTable = () => {
            if (tableData) {
                const { headers, rows, alignments } = tableData;

                elements.push(
                    <motion.table
                        key={`table-${elements.length}`}
                        className="my-6 w-full text-sm border-collapse border border-slate-700/50 rounded-lg overflow-hidden"
                        {...animationVariants.table}
                    >
                        {headers && headers.length > 0 && (
                            <thead className="bg-slate-900/60">
                            <tr>
                                {headers.map((header, i) => {
                                    let alignClass = "text-center";
                                    if (alignments[i] === 'left') alignClass = "text-left";
                                    else if (alignments[i] === 'right') alignClass = "text-right";

                                    return (
                                        <th key={i} className={`px-4 py-2  border border-slate-700/50 text-slate-200 font-semibold ${alignClass}`}>
                                            {processInlineFormatting(header, inlineCodes)}
                                        </th>
                                    );
                                })}
                            </tr>
                            </thead>
                        )}
                        <tbody>
                        {rows.map((row, r) => (
                            <tr key={r}>
                                {row.map((cell, i) => {
                                    let alignClass = "text-center";
                                    if (alignments[i] === 'left') alignClass = "text-left";
                                    else if (alignments[i] === 'right') alignClass = "text-right";

                                    return (
                                        <td key={i} className={`px-4 py-2 border border-slate-700/50 text-slate-300 ${alignClass}`}>
                                            {processInlineFormatting(cell, inlineCodes)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </motion.table>
                );
                tableData = null;
            }
        };

        const flushTaskList = () => {
            if (inTaskList && taskItems.length > 0) {
                elements.push(
                    <motion.div
                        key={`tasklist-${elements.length}`}
                        className="mb-6 space-y-2"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4, duration: 0.3}}
                    >
                        {renderTaskList(taskItems, elements.length)}
                    </motion.div>
                );
                taskItems = [];
                inTaskList = false;
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Headers
            if (trimmedLine.startsWith('# ')) {
                flushTable();
                flushCurrentElement();
                flushList();
                flushTaskList();
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
                flushTable();
                flushCurrentElement();
                flushList();
                flushTaskList()
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
                flushTable();
                flushCurrentElement();
                flushList();
                flushTaskList()
                elements.push(
                    <motion.h3
                        key={`h3-${elements.length}`}
                        className="text-xl font-semibold text-slate-200 mb-3 mt-6"
                        {...animationVariants.header3}
                    >
                        {processInlineFormatting(trimmedLine.substring(4), inlineCodes)}
                    </motion.h3>
                );
            }else if (trimmedLine.startsWith('#### ')) {
                flushCurrentElement();
                flushList();
                flushTable();
                flushTaskList();
                elements.push(
                    <motion.h4
                        key={`h4-${elements.length}`}
                        className="text-lg font-medium text-slate-300 mb-2 mt-4"
                        initial={{opacity: 0, x: -10}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.25}}
                    >
                        {processInlineFormatting(trimmedLine.substring(5), inlineCodes)}
                    </motion.h4>
                );
            } else if (trimmedLine.startsWith('##### ')) {
                flushCurrentElement();
                flushList();
                flushTable();
                flushTaskList();
                elements.push(
                    <motion.h5
                        key={`h5-${elements.length}`}
                        className="text-base font-medium text-slate-400 mb-2 mt-3"
                        initial={{opacity: 0, x: -8}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.27}}
                    >
                        {processInlineFormatting(trimmedLine.substring(6), inlineCodes)}
                    </motion.h5>
                );
            } else if (trimmedLine.startsWith('###### ')) {
                flushCurrentElement();
                flushList();
                flushTable();
                flushTaskList();
                elements.push(
                    <motion.h6
                        key={`h6-${elements.length}`}
                        className="text-sm font-medium text-slate-500 mb-1 mt-2"
                        initial={{opacity: 0, x: -5}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.3}}
                    >
                        {processInlineFormatting(trimmedLine.substring(7), inlineCodes)}
                    </motion.h6>
                );
            }
            // Tables - FIXED IMPLEMENTATION
            else if (trimmedLine.includes('|') && !trimmedLine.match(/^```|^`/)) {
                flushCurrentElement();
                flushList();

                const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '');

                // Check if this is a separator row (determines alignment)
                if (cells.every(cell => /^:?-+:?$/.test(cell))) {
                    // This is a separator row, determine alignment
                    const alignments = cells.map(cell => {
                        if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
                        if (cell.endsWith(':')) return 'right';
                        return 'left';
                    });

                    if (tableData) {
                        tableData.alignments = alignments;
                    }
                }
                // Check if this is the first row (header)
                else if (!tableData) {
                    tableData = {
                        headers: cells,
                        rows: [],
                        alignments: Array(cells.length).fill('center') // Default alignment
                    };
                }
                // This is a regular data row
                else {
                    tableData.rows.push(cells);
                }
            }
            // Task list items
            else if (trimmedLine.match(/^- \[[ xX]\]/)) {
                flushCurrentElement();
                flushList();
                flushTable();
                if (!inTaskList) {
                    inTaskList = true;
                }
                taskItems.push(trimmedLine.substring(2)); // Remove "- " prefix

            }

            // --- Unordered lists (supports nesting) ---
            else if (/^(\s*)[-*+]\s+/.test(line)) {
                flushCurrentElement();
                flushTaskList();
                inList = true;

                const m = line.match(/^(\s*)[-*+]\s+(.+)$/);
                const leadingSpaces = m[1].length;
                const indent = Math.floor(leadingSpaces / INDENT_UNIT);
                const listContent = m[2];

                listItems.push({
                    indent,
                    ordered: false,
                    content: listContent
                });
            }
            // --- Ordered lists (supports nesting) ---
            else if (/^(\s*)\d+\.\s+/.test(line)) {
                flushCurrentElement();
                flushTaskList();
                inList = true;

                const m = line.match(/^(\s*)\d+\.\s+(.+)$/);
                const leadingSpaces = m[1].length;
                const indent = Math.floor(leadingSpaces / INDENT_UNIT);
                const listContent = m[2];

                listItems.push({
                    indent,
                    ordered: true,
                    content: listContent
                });
            }
            /*
            // Unordered lists
            else if (trimmedLine.match(/^[-*+]\s/)) {
                flushTable();
                flushCurrentElement();
                flushTaskList();
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
                flushTable();
                flushCurrentElement();
                flushTaskList();
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
            }*/
            // Blockquotes
            else if (trimmedLine.startsWith('> ')) {
                flushTable();
                flushCurrentElement();
                flushList();
                flushTaskList();
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
            // Horizontal rules
            else if (trimmedLine.match(/^[-*_]{3,}$/)) {
                flushTable();
                flushCurrentElement();
                flushList();
                flushTaskList();
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
                flushTable();
                flushList();
                flushCurrentElement();
                flushTaskList();
            }
            // Regular text
            else {
                currentElement.push(trimmedLine);
            }
        }

        // Handle remaining content
        flushTable();
        flushList();
        flushCurrentElement();
        flushTaskList();

        return <div key={key} className="prose prose-invert max-w-none">{elements}</div>;
    }, [animationVariants, processInlineFormatting]);

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
                const language = parts[index - 1] || 'exinix';
                return renderCodeBlock(part, language, `code-${index}`);
            }
        });
    }, [generatePlaceholder, renderMarkdown, renderCodeBlock]);

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