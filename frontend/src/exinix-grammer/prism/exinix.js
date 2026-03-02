'use strict';
//this is CompatibleWith PrismLight/prism not HLJS

module.exports = exinix;
exinix.displayName = 'exinix';
exinix.aliases = [];

function exinix(Prism) {
    (function (Prism) {
        // ---------------- Core keyword sets ----------------
        const typeKeywords = /\b(?:int|float|bool|char|byte|long|double|short|ptr|str|array|mem|coll|set|map)\b/;
        const controlKeywords = /\b(?:if|else|do|while|for|select|option|break|next|return|try|catch|interrupt|fallback|from|as|assert)\b/;
        const declKeywords = /\b(?:cls|parent|enum|imu|mut|typedef|const|var|fn|void|static|default|async|await|use|base|volatile|synchronized|transient|instanceof)\b/;
        const softIdents = /\b(?:its|__construct__|__guard__|__its__)\b/;

        const allKeywords = RegExp(
            typeKeywords.source.replace(/^\//, '').replace(/\/$/, '') + '|' +
            controlKeywords.source.replace(/^\//, '').replace(/\/$/, '') + '|' +
            declKeywords.source.replace(/^\//, '').replace(/\/$/, '') + '|' +
            /\b(?:True|False|null)\b/.source
        );

        // ---------------- Numbers ----------------
        const number =
            /\b0b[01][01_]*\b|\b0x[\da-fA-F_]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/;

        // ---------------- Strings & chars ----------------
        const string = { pattern: /"(?:\\.|[^"\\\r\n])*"/, greedy: true };
        const char   = { pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/, greedy: true };

        // ---------------- Operators ----------------
        // Includes: arithmetic, comparison, bitwise, assignment, logic, null-coalescing assign ??=, power **, floor-div //, arrow ->
        const operator =
            /(?:\?\?=)|==|!==|>=|<=|\+\+|--|\*\*|\/\/|&&|\|\||->|::|[+\-*/%=&|^!<>]=?|[?:~]/;

        // ---------------- Identifiers (names) ----------------
        // Start with letter or underscore; case-sensitive; no spaces; digits allowed after start
        const identifier = /[A-Za-z_]\w*/;

        // ---------------- Class-like declarations ----------------
        // Matches: cls [static ] [!!|!]? [$|@]? Name
        const classDecl = {
            pattern: new RegExp(
                String.raw`(?:\b(?:cls|imu|mut|enum)\b)\s+(?:static\s+)?(?:!!|!)?[@$]?` +
                String.raw`(?:` + identifier.source + `)`, 'i'
            ),
            alias: 'class-name'
        };

        // ---------------- Generics: <str,int> ----------------
        const generics = {
            pattern: /<\s*[A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*\s*>/,
            inside: {
                keyword: typeKeywords,
                punctuation: /[<>(),.:]/
            }
        };

        // --- multiline comment ---
        const tripleDashComment = {
            pattern: /---[\s\S]*?---/,
            greedy: true,
            alias: 'comment'
        };
        //single-line comment
        const slashesLineComment = {
            pattern: /\/\/.*/,
            greedy: true,
            alias: 'comment'
        };

        // ---------------- Functions ----------------
        // Matches 'fn name(...)' and also plain call sites 'name(...)'
        const funcName = {
            pattern: new RegExp(String.raw`\b(?:fn\s+)?` + identifier.source + String.raw`(?=\s*\()`, 'i'),
            alias: 'function'
        };

        // ---------------- Modifiers on members ----------------
        // Highlight leading $, @, !!, ! before names (access/finality symbols)
        const modifiers = {
            pattern: /(^|[^\w])(?:[@$]+|!!|!)(?=\s*[A-Za-z_]\w*)/,
            lookbehind: true,
            alias: 'important'
        };

        // ---------------- Namespace/package/use ----------------
        const namespace = {
            pattern: /\b(?:package|use|base)\s+[a-z]\w*(?:\.[a-z]\w*)*\.?/,
            inside: { punctuation: /\./ }
        };

        // Build the language by extending clike
        Prism.languages.exinix = Prism.languages.extend('clike', {
            // Order matters: put the special dash block comment first
            comment: [
                tripleDashComment,
                slashesLineComment
            ],
            string,
            char,
            number,
            keyword: allKeywords,
            boolean: { pattern: /\b(?:True|False)\b/, alias: 'boolean' },
            operator,
            // Token to make __construct__/its/__guard__ stand out
            builtin: softIdents,
            'class-name': classDecl,
            function: funcName,
            generics,
            // highlight modifiers like $, @, !!, !
            symbol: modifiers,
            // punctuation
            punctuation: /[{}[\];(),.:]/
        });

        // -------- Insert extras before 'string' (e.g., triple-quoted) --------
        /*Prism.languages.insertBefore('exinix', 'string', {
            'triple-quoted-string': {
                // Optional: allow Python-style triple quotes as an extra convenience
                pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*?"""/,
                greedy: true,
                alias: 'string'
            }
        });*/

        Prism.languages.insertBefore('exinix', 'string', {
            'triple-quoted-string': {
                // Support """...""" and '''...''' multi-line strings
                pattern: /("""|''')[\s\S]*?\1/,
                greedy: true,
                alias: 'string',
                inside: {
                    // only escapes (\n, \t, etc.) should be highlighted
                    'escape': {
                        pattern: /\\[nrt'"]|\\u\{[0-9a-fA-F]+\}/,
                        alias: 'entity'
                    }
                    // no keywords, numbers, operators etc.
                }
            }
        });

        // -------- Insert extras before 'class-name' (namespaces, decorators) --------
        Prism.languages.insertBefore('exinix', 'class-name', {
            namespace,
            // Optional light "decorator" style: @Ident (but avoid catching @ used as access symbol by requiring not-after a word char)
            annotation: {
                pattern: /(^|[^\w.])@\w+(?:\s*\.\s*\w+)*/,
                lookbehind: true,
                alias: 'attr-name'
            }
        });

    })(Prism);
}
