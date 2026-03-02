import { jsPDF } from "jspdf";

// Beautiful Markdown to PDF Converter
export const downloadAllTopicsPDF = async (topics, setIsGenerating) => {
    if (!topics || !topics.length) return;

    // Python keywords
    const KEYWORDS = [
        "def","class","import","from","return","if","else","elif","for","while",
        "try","except","with","async","await","lambda","yield","break","continue","pass",

        "int","float","bool","char","byte","long","double","short","ptr","str","array","mem","coll","set","map",
        "if","else","do","while","for","select","option","break","next","return","try","catch","interrupt","fallback","from","as","assert",
        "cls","parent","enum","imu","mut","typedef","const","var","fn","void","static","default","async","await","use","base","volatile","synchronized","transient","instanceof",
        "its","__construct__","__guard__","__its__",

    ];

    const SYMBOLS = /[{}[\]()<>+=\-*/%&|^!~.,;:?]/g;

    try {
        setIsGenerating(true);

        const pdf = new jsPDF("p", "pt", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 50;
        const contentWidth = pageWidth - (margin * 2);

        let yPosition = margin;

        // Helper: Check if we need a new page
        const checkNewPage = (height) => {
            if (yPosition + height > pageHeight - margin - 30) {
                pdf.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        };

        // Helper: Strip markdown formatting and clean special characters
        const stripMarkdown = (text) => {
            if (!text) return '';
            return text
                .replace(/[❌]/g,'[NO]')
                .replace(/[✅]/g,'[YES]')
                .replace(/[⚠️]/g,'[NOT APPLICABLE]')
                .replace(/❌/g,'[NO]')
                .replace(/✅/g,'[YES]')
                .replace(/⚠️/g,'[NOT APPLICABLE]')
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/\*(.+?)\*/g, '$1')
                .replace(/`(.+?)`/g, '$1')
                .replace(/==(.+?)==/g, '$1')
                .replace(/~~(.+?)~~/g, '$1')
                .replace(/\[(.+?)\]\(.+?\)/g, '$1')
                // Remove copy-paste icons and emojis
                .replace(/[📋📝📄📌🔍✓✗➜→←↑↓✨🎯💡⚠️⬇️1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🧠🧬⬇❗️📊📈📉⭐️🔥💻🚀📱⚡️]/g, '')
                .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
                .replace(/[\u2600-\u26FF]/g, '')
                .replace(/[\u2700-\u27BF]/g, '')

                .trim();
        };

        // Helper: Check if text has formatting
        const hasFormatting = (text) => {
            return /\*\*|\*|`|==|~~|\[.+?\]\(/.test(text);
        };

        const drawWrappedText = (text, x, y, maxWidth, lineHeight) => {
            const lines = pdf.splitTextToSize(text, maxWidth);
            lines.forEach(line => {
                if (y + lineHeight > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, x, y);
                y += lineHeight;
            });
            return y;
        };


        // Helper: Render formatted text
        const renderFormattedText = (text, fontSize, yPos, xPos = margin, maxWidth = contentWidth) => {
            if (!text) return yPos;

            // Clean text first
            const cleanedText = text
                .replace(/[📋📝📄📌🔍✓✗➜→←↑↓✨🎯💡⚠️❌✅❗️📊📈📉⭐️🔥💻🚀📱⚡️]/g, '')
                .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
                .replace(/[\u2600-\u26FF]/g, '')
                .replace(/[\u2700-\u27BF]/g, '')
                .trim();

            if (!hasFormatting(cleanedText)) {
                pdf.setFontSize(fontSize);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(50, 50, 50);
                const lines = pdf.splitTextToSize(cleanedText, maxWidth);
                lines.forEach((line, idx) => {
                    checkNewPage(fontSize * 1.4);
                    pdf.text(line, xPos, yPos + (idx * fontSize * 1.4));
                });
                return yPos + (lines.length * fontSize * 1.4);
            }

            let currentX = xPos;
            let currentY = yPos;
            const lineHeight = fontSize * 1.4;
            const segments = [];
            let remaining = cleanedText;

            while (remaining.length > 0) {
                let match = remaining.match(/^\*\*(.+?)\*\*/);
                if (match) {
                    segments.push({ text: match[1], bold: true });
                    remaining = remaining.substring(match[0].length);
                    continue;
                }

                match = remaining.match(/^\*(.+?)\*/);
                if (match) {
                    segments.push({ text: match[1], italic: true });
                    remaining = remaining.substring(match[0].length);
                    continue;
                }

                match = remaining.match(/^`(.+?)`/);
                if (match) {
                    segments.push({ text: match[1], code: true });
                    remaining = remaining.substring(match[0].length);
                    continue;
                }

                match = remaining.match(/^==(.+?)==/);
                if (match) {
                    segments.push({ text: match[1], highlight: true });
                    remaining = remaining.substring(match[0].length);
                    continue;
                }

                match = remaining.match(/^~~(.+?)~~/);
                if (match) {
                    segments.push({ text: match[1], strikethrough: true });
                    remaining = remaining.substring(match[0].length);
                    continue;
                }

                match = remaining.match(/^\[(.+?)\]\((.+?)\)/);
                if (match) {
                    segments.push({ text: match[1], link: true });
                    remaining = remaining.substring(match[0].length);
                    continue;
                }

                match = remaining.match(/^([^\*`=~\[]+)/);
                if (match) {
                    segments.push({ text: match[1], normal: true });
                    remaining = remaining.substring(match[0].length);
                    continue;
                }

                segments.push({ text: remaining[0], normal: true });
                remaining = remaining.substring(1);
            }

            segments.forEach(segment => {
                pdf.setFontSize(fontSize);

                if (segment.bold) {
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(20, 20, 20);
                } else if (segment.italic) {
                    pdf.setFont("helvetica", "italic");
                    pdf.setTextColor(60, 60, 60);
                } else if (segment.code) {
                    //pdf.setFont("courier", "normal");
                    //pdf.setTextColor(220, 38, 38);
                    pdf.setFont("courier", "normal");
                    pdf.setTextColor(30, 30, 30); // Dark gray for better readability
                    pdf.setFillColor(245, 245, 245); // Light gray background
                    const textWidth = pdf.getTextWidth(segment.text);
                    pdf.rect(currentX - 2, currentY - fontSize + 2, textWidth + 4, fontSize + 4, 'F'); // fill rect behind code

                } else if (segment.link) {
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(37, 99, 235);
                } else if (segment.strikethrough) {
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(150, 150, 150);
                } else {
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(50, 50, 50);
                }

                const textWidth = pdf.getTextWidth(segment.text);

                if (currentX + textWidth > xPos + maxWidth) {
                    currentX = xPos;
                    currentY += lineHeight;
                    checkNewPage(lineHeight);
                }

                if (segment.highlight) {
                    pdf.setFillColor(254, 240, 138);
                    pdf.rect(currentX - 2, currentY - fontSize + 3, textWidth + 4, fontSize + 3, 'F');
                    pdf.setTextColor(20, 20, 20);
                }

                pdf.text(segment.text, currentX, currentY);

                if (segment.strikethrough) {
                    pdf.setDrawColor(150, 150, 150);
                    pdf.setLineWidth(0.5);
                    pdf.line(currentX, currentY - fontSize/3, currentX + textWidth, currentY - fontSize/3);
                }

                if (segment.link) {
                    pdf.setDrawColor(37, 99, 235);
                    pdf.setLineWidth(0.5);
                    pdf.line(currentX, currentY + 2, currentX + textWidth, currentY + 2);
                }

                currentX += textWidth;
            });

            return currentY + lineHeight;
        };

        // Helper: Horizontal line
        const addHorizontalLine = (color = [229, 231, 235], thickness = 1) => {
            checkNewPage(10);
            pdf.setDrawColor(color[0], color[1], color[2]);
            pdf.setLineWidth(thickness);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 12;
        };

        // Helper: Render beautiful table with proper text wrapping
        const renderTable = (rows) => {
            if (rows.length === 0) return;

            const numCols = rows[0].length;
            const cellPadding = 10;
            const colWidth = (contentWidth - (cellPadding * 2 * numCols)) / numCols;

            // Calculate row heights based on content
            const rowHeights = rows.map((row) => {
                let maxHeight = 30;
                row.forEach(cell => {
                    const cleanCell = stripMarkdown(cell);
                    const lines = pdf.splitTextToSize(cleanCell, colWidth - cellPadding);
                    const cellHeight = Math.max(30, (lines.length * 12) + 16);
                    maxHeight = Math.max(maxHeight, cellHeight);
                });
                return maxHeight;
            });

            const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0);
            checkNewPage(totalHeight);

            rows.forEach((row, rowIndex) => {
                let xPos = margin;
                const rowHeight = rowHeights[rowIndex];

                // Header row styling
                if (rowIndex === 0) {
                    pdf.setFillColor(30, 41, 59);
                    pdf.rect(margin, yPosition, contentWidth, rowHeight, 'F');
                }
                // Alternate row colors
                else if (rowIndex % 2 === 0) {
                    pdf.setFillColor(248, 250, 252);
                    pdf.rect(margin, yPosition, contentWidth, rowHeight, 'F');
                }

                row.forEach((cell) => {
                    // Draw cell border
                    pdf.setDrawColor(226, 232, 240);
                    pdf.setLineWidth(0.5);
                    pdf.rect(xPos, yPosition, colWidth + cellPadding * 2, rowHeight);

                    // Cell text
                    pdf.setFontSize(9);
                    pdf.setFont("helvetica", rowIndex === 0 ? "bold" : "normal");
                    pdf.setTextColor(rowIndex === 0 ? 255 : 50, rowIndex === 0 ? 255 : 50, rowIndex === 0 ? 255 : 50);

                    const cleanCell = stripMarkdown(cell);
                    const cellLines = pdf.splitTextToSize(cleanCell, colWidth - cellPadding);

                    cellLines.forEach((line, lineIdx) => {
                        pdf.text(line, xPos + cellPadding, yPosition + 15 + (lineIdx * 12));
                    });

                    xPos += colWidth + cellPadding * 2;
                });

                yPosition += rowHeight;
            });

            yPosition += 15;
        };


        const CODE_LINE_HEIGHT = 14;
        const CODE_PADDING_TOP = 42;
        const CODE_PADDING_BOTTOM = 20;
        const CODE_HEADER_HEIGHT = 32;



        const CODE_FONT_NORMAL = 9;
        const CODE_FONT_SMALL  = 8;
        const CODE_FONT_MIN    = 7;

        const CODE_MAX_LINES_NORMAL = 40;
        const CODE_MAX_LINES_SMALL  = 70;

        const CODE_MIN_VISIBLE_LINES = 14;


        const CODE_LEFT_PADDING = 15;
        const CODE_RIGHT_PADDING = 15;


        const drawCodeBlockHeader = (lang) => {
            // Container
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(margin, yPosition, contentWidth, CODE_HEADER_HEIGHT, 6, 6, 'F');

            // Header bar
            pdf.setFillColor(52, 152, 219);
            pdf.roundedRect(margin, yPosition, contentWidth, CODE_HEADER_HEIGHT, 6, 6, 'F');

            // Language
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(255, 255, 255);
            pdf.text((lang || "CODE").toUpperCase(), margin + 15, yPosition + 20);

            // Editor dots
            pdf.setFillColor(255, 255, 255);
            pdf.circle(margin + contentWidth - 40, yPosition + 16, 3, 'F');
            pdf.circle(margin + contentWidth - 28, yPosition + 16, 3, 'F');
            pdf.circle(margin + contentWidth - 16, yPosition + 16, 3, 'F');

            yPosition += CODE_HEADER_HEIGHT + 10;
        };

        const drawCodeContainerBorder = (topY,height) => {
            pdf.setDrawColor(52, 152, 219);
            pdf.setLineWidth(2);
            pdf.roundedRect(
                margin,
                topY,
                contentWidth,
                height + CODE_PADDING_BOTTOM,
                6,
                6,
                'S'
            );
        };

        // Parse and render markdown
        const parseMarkdown = (content) => {
            if (!content) return;

            const lines = content.split('\n');
            let inCodeBlock = false;
            let codeBlockLines = [];
            let codeBlockLang = '';
            let inTable = false;
            let tableRows = [];
            let inBlockquote = false;
            let blockquoteLines = [];

            let inMultilineComment = false;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmedLine = line.trim();



                // Code block
                const renderCodeBlockPaginated = (codeLines, lang) => {
                    // ---------- ADAPTIVE CODE LAYOUT ----------
                    let codeFontSize = CODE_FONT_NORMAL;
                    let lineHeight   = CODE_LINE_HEIGHT;
                    const codeStartX = margin + CODE_LEFT_PADDING;
                    const codeMaxX = margin + contentWidth - CODE_RIGHT_PADDING;

                    if (codeLines.length > CODE_MAX_LINES_SMALL) {
                        codeFontSize = CODE_FONT_MIN;
                        lineHeight   = 11;
                    }
                    else if (codeLines.length > CODE_MAX_LINES_NORMAL) {
                        codeFontSize = CODE_FONT_SMALL;
                        lineHeight   = 12;
                    }

                    // ---------- PRE-FLIGHT PAGE CHECK FOR CODE BLOCK ----------
                    const minRequiredHeight =
                        CODE_HEADER_HEIGHT +
                        (CODE_MIN_VISIBLE_LINES * lineHeight) +
                        CODE_PADDING_BOTTOM;

                    if (yPosition + minRequiredHeight > pageHeight - margin) {
                        pdf.addPage();
                        yPosition = margin;
                    }


                    pdf.setFont("courier", "normal");
                    pdf.setFontSize(codeFontSize);

                    let blockStartY = yPosition;
                    drawCodeBlockHeader(lang);

                    let usedHeight = CODE_HEADER_HEIGHT;



                    codeLines.forEach((rawLine) => {

                        let line = rawLine;
                        let isCommentLine = false;

                        // --- MULTILINE COMMENT DETECTION ---
                        if (line.includes('---')) {
                            const count = (line.match(/---/g) || []).length;

                            // toggle for each ---
                            if (count % 2 !== 0) {
                                inMultilineComment = !inMultilineComment;
                            }
                            isCommentLine = true;
                        }

                        // If already inside multiline comment
                        if (inMultilineComment) {
                            isCommentLine = true;
                        }

                        // Single-line comment
                        if (line.trim().startsWith('//')) {
                            isCommentLine = true;
                        }
                        const cleanLine = rawLine
                            .replace(/[📋📝📄📌🔍✓✗➜→←↑↓✨🎯💡⚠️❌✅]/g, '')
                            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '');

                        // Page break BEFORE drawing line
                        if (yPosition + lineHeight > pageHeight - margin) {
                            drawCodeContainerBorder(blockStartY,usedHeight);
                            pdf.addPage();
                            yPosition = margin;

                            blockStartY = yPosition;
                            usedHeight = CODE_HEADER_HEIGHT;
                            drawCodeBlockHeader(lang);
                        }

                        // Tokenize
                        const tokens = line.match(
                            /(\s+|\".*?\"|\'.*?\'|\w+|[^\w\s])/g
                        ) || [];


                        let xPos = margin + 15;

                        tokens.forEach(token => {

                            // ---- COMMENT (single or multi) ----
                            if (isCommentLine) {
                                pdf.setTextColor(160, 160, 160); // comment gray
                                pdf.setFont("courier", "italic");
                            }

                            // ---- STRING ----
                            else if (/^["'].*["']$/.test(token)) {
                                pdf.setTextColor(150, 50, 200);
                                pdf.setFont("courier", "normal");
                            }

                            // ---- KEYWORD ----
                            else if (KEYWORDS.includes(token)) {
                                pdf.setTextColor(245, 100, 10);
                                pdf.setFont("courier", "normal");
                            }

                            // ---- NUMBER ----
                            else if (/^\d+$/.test(token)) {
                                pdf.setTextColor(200, 50, 50);
                            }

                            // ---- CLASS / TYPE ----
                            else if (/^[A-Z][a-zA-Z0-9_]*$/.test(token)) {
                                pdf.setTextColor(0, 128, 128);
                            }

                            // ---- DEFAULT ----
                            else {
                                pdf.setTextColor(30, 30, 30);
                                pdf.setFont("courier", "normal");
                            }

                            pdf.text(token, xPos, yPosition);
                            xPos += pdf.getTextWidth(token);
                        });


                        yPosition += lineHeight;
                        usedHeight += lineHeight;
                    });

                    drawCodeContainerBorder(blockStartY,usedHeight);

                    // 🔥 MOVE cursor BELOW the entire code block
                    //yPosition = yPosition + CODE_PADDING_BOTTOM + 10;

                    yPosition = blockStartY + usedHeight + CODE_PADDING_BOTTOM + 12;
                };

                if (trimmedLine.startsWith('```')) {
                    if (!inCodeBlock) {
                        inCodeBlock = true;
                        codeBlockLang = trimmedLine.substring(3).trim();
                        codeBlockLines = [];
                    } else {
                        renderCodeBlockPaginated(codeBlockLines, codeBlockLang);
                        inCodeBlock = false;
                        codeBlockLines = [];
                        codeBlockLang = '';
                    }
                    continue;
                }



                if (inCodeBlock) {
                    codeBlockLines.push(line);
                    continue;
                }

                // Table
                if (trimmedLine.includes('|') && trimmedLine.split('|').length > 2) {
                    const cells = trimmedLine.split('|').map(c => c.trim()).filter(c => c);

                    if (cells.every(cell => /^[\-\:\s]+$/.test(cell))) {
                        continue;
                    }

                    tableRows.push(cells);
                    inTable = true;
                    continue;
                } else if (inTable) {
                    renderTable(tableRows);
                    tableRows = [];
                    inTable = false;
                }

                // Blockquote
                if (trimmedLine.startsWith('>')) {
                    blockquoteLines.push(trimmedLine.substring(1).trim());
                    inBlockquote = true;
                    continue;
                } else if (inBlockquote && trimmedLine === '') {
                    const quoteText = blockquoteLines.join(' ');
                    const cleanQuote = stripMarkdown(quoteText);
                    const quoteLines = pdf.splitTextToSize(cleanQuote, contentWidth - 60);
                    const blockHeight = (quoteLines.length * 15) + 28;

                    checkNewPage(blockHeight);

                    // Quote background
                    pdf.setFillColor(239, 246, 255);
                    pdf.roundedRect(margin, yPosition, contentWidth, blockHeight, 4, 4, 'F');

                    // Left border accent
                    pdf.setFillColor(59, 130, 246);
                    pdf.rect(margin, yPosition, 4, blockHeight, 'F');

                    yPosition += 16;
                    pdf.setFontSize(10);
                    pdf.setFont("helvetica", "italic");
                    pdf.setTextColor(71, 85, 105);

                    quoteLines.forEach(quoteLine => {
                        pdf.text(quoteLine, margin + 25, yPosition);
                        yPosition += 15;
                    });

                    yPosition += 20;
                    blockquoteLines = [];
                    inBlockquote = false;
                    continue;
                } else if (inBlockquote) {
                    blockquoteLines.push(trimmedLine);
                    continue;
                }

                if (!trimmedLine) {
                    yPosition += 8;
                    continue;
                }

                // Headers with better styling
                if (trimmedLine.startsWith('# ')) {
                    checkNewPage(35);
                    yPosition += 5;

                    // Header background
                    pdf.setFillColor(239, 246, 255);
                    pdf.rect(margin - 10, yPosition - 5, contentWidth + 20, 30, 'F');

                    pdf.setFontSize(18);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(30, 64, 175);
                    pdf.text(stripMarkdown(trimmedLine.substring(2)), margin, yPosition + 15);

                    yPosition += 30;
                    addHorizontalLine([59, 130, 246], 2);
                }
                else if (trimmedLine.startsWith('## ')) {
                    checkNewPage(30);
                    yPosition += 8;

                    pdf.setFontSize(15);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(51, 65, 85);
                    pdf.text(stripMarkdown(trimmedLine.substring(3)), margin, yPosition);

                    yPosition += 5;
                    pdf.setDrawColor(148, 163, 184);
                    pdf.setLineWidth(1.5);
                    pdf.line(margin, yPosition, margin + 60, yPosition);
                    yPosition += 12;
                }
                else if (trimmedLine.startsWith('### ')) {
                    checkNewPage(25);
                    yPosition += 6;

                    pdf.setFontSize(13);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(71, 85, 105);
                    pdf.text(stripMarkdown(trimmedLine.substring(4)), margin, yPosition);
                    yPosition += 15;
                }
                else if (trimmedLine.startsWith('#### ')) {
                    checkNewPage(20);
                    yPosition += 5;

                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(100, 116, 139);
                    pdf.text(stripMarkdown(trimmedLine.substring(5)), margin, yPosition);
                    yPosition += 12;
                }
                else if (trimmedLine.startsWith('##### ')) {
                    checkNewPage(18);
                    yPosition += 4;

                    pdf.setFontSize(10);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(120, 130, 150);
                    pdf.text(stripMarkdown(trimmedLine.substring(6)), margin, yPosition);
                    yPosition += 10;
                }
                // Horizontal rule
                else if (trimmedLine.match(/^[\-\*\_]{3,}$/)) {
                    addHorizontalLine([203, 213, 225], 1);
                }
                // Unordered list
                else if (trimmedLine.match(/^[\*\-\+]\s/)) {
                    const text = trimmedLine.substring(2);
                    checkNewPage(20);

                    // Draw bullet point
                    pdf.setFillColor(59, 130, 246);
                    pdf.circle(margin + 4, yPosition - 3, 2.5, 'F');

                    yPosition = renderFormattedText(text, 10, yPosition, margin + 20, contentWidth - 20);
                    yPosition += 4;
                }
                // Ordered list
                else if (trimmedLine.match(/^\d+\.\s/)) {
                    const match = trimmedLine.match(/^(\d+)\.\s/);
                    const number = match[1] + '.';
                    const text = trimmedLine.substring(match[0].length);
                    checkNewPage(20);

                    pdf.setFontSize(10);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(59, 130, 246);
                    pdf.text(number, margin, yPosition);

                    yPosition = renderFormattedText(text, 10, yPosition, margin + 25, contentWidth - 25);
                    yPosition += 4;
                }
                // Task list
                else if (trimmedLine.match(/^\-\s\[(x| )\]\s/)) {
                    const isChecked = trimmedLine.includes('[x]');
                    const text = trimmedLine.substring(6);

                    checkNewPage(18);

                    // Checkbox
                    if (isChecked) {
                        pdf.setFillColor(34, 197, 94);
                        pdf.roundedRect(margin, yPosition - 10, 12, 12, 2, 2, 'F');
                        pdf.setDrawColor(22, 163, 74);
                        pdf.setLineWidth(2);
                        pdf.line(margin + 3, yPosition - 4, margin + 5, yPosition - 2);
                        pdf.line(margin + 5, yPosition - 2, margin + 9, yPosition - 8);
                    } else {
                        pdf.setDrawColor(148, 163, 184);
                        pdf.setLineWidth(1.5);
                        pdf.roundedRect(margin, yPosition - 10, 12, 12, 2, 2, 'S');
                    }

                    yPosition = renderFormattedText(text, 10, yPosition, margin + 20, contentWidth - 20);
                    yPosition += 4;
                }
                // Regular paragraph
                else {
                    checkNewPage(15);
                    yPosition = renderFormattedText(trimmedLine, 10, yPosition);
                    yPosition += 8;
                }
            }

            if (tableRows.length > 0) {
                renderTable(tableRows);
            }

            if (blockquoteLines.length > 0) {
                const quoteText = blockquoteLines.join(' ');
                const cleanQuote = stripMarkdown(quoteText);
                const quoteLines = pdf.splitTextToSize(cleanQuote, contentWidth - 60);
                const blockHeight = (quoteLines.length * 15) + 28;

                checkNewPage(blockHeight);

                pdf.setFillColor(239, 246, 255);
                pdf.roundedRect(margin, yPosition, contentWidth, blockHeight, 4, 4, 'F');

                pdf.setFillColor(59, 130, 246);
                pdf.rect(margin, yPosition, 4, blockHeight, 'F');

                yPosition += 16;
                pdf.setFontSize(10);
                pdf.setFont("helvetica", "italic");
                pdf.setTextColor(71, 85, 105);

                quoteLines.forEach(quoteLine => {
                    pdf.text(quoteLine, margin + 25, yPosition);
                    yPosition += 15;
                });

                yPosition += 20;
            }
        };

        // Process all topics
        topics.forEach((topic, topicIndex) => {
            // Don't add page break for first topic
            if (topicIndex > 0) {
                pdf.addPage();
                yPosition = margin;
            }

            // Beautiful Topic Title
            pdf.setFillColor(30, 58, 138);
            pdf.rect(0, yPosition, pageWidth, 50, 'F');

            pdf.setFontSize(24);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(255, 255, 255);
            pdf.text(stripMarkdown(topic.title), margin, yPosition + 32);

            yPosition += 60;

            // Subtopics
            if (topic.subtopics && topic.subtopics.length > 0) {
                topic.subtopics.forEach((sub) => {
                    // Check if we need space for subtopic title + some content
                    if (yPosition > pageHeight - 150) {
                        pdf.addPage();
                        yPosition = margin;
                    }

                    // Subtopic title with accent
                    pdf.setFillColor(241, 245, 249);
                    pdf.roundedRect(margin - 10, yPosition, contentWidth + 20, 28, 4, 4, 'F');

                    pdf.setFillColor(59, 130, 246);
                    pdf.rect(margin - 10, yPosition, 5, 28, 'F');

                    pdf.setFontSize(14);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(30, 41, 59);
                    pdf.text(stripMarkdown(sub.title), margin + 10, yPosition + 18);

                    yPosition += 40;

                    if (sub.content) {
                        parseMarkdown(sub.content);
                    }

                    yPosition += 8;
                });
            }
        });

        // Save PDF
        const dateStr = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
        pdf.save(`Topics_Report_${dateStr}.pdf`);

        console.log("✅ Beautiful PDF generated successfully!");

    } catch (err) {
        console.error("❌ Failed to generate PDF:", err);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        setIsGenerating(false);
    }
};