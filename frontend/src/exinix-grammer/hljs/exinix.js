// src/exinix-grammer/hljs/exinix.js
// Full HLJS grammar for "exinix", ported from your Prism grammar.
// ESM: export default function exinix(hljs) { ... }

export default function exinix(hljs) {
    const IDENT = /[A-Za-z_]\w*/;

    const KEYWORDS = {
        keyword:
        // types + control + declaration/others (merged from your Prism groups)
            'int float bool char byte long double short ptr str array mem coll set map ' +
            'if else do while for select option break next return try catch interrupt fallback from as assert ' +
            'cls enum imu mut typedef const var fn void parent static default async await use base volatile synchronized transient instanceof',
        literal: 'True False null',
        built_in: 'its __construct__ __guard__ __its__'
    };

    // --- Comment modes ---
    const TRIPLE_DASH_COMMENT = hljs.COMMENT(/---/, /---/, {
        relevance: 10
    });

    const SLASHES_LINE_COMMENT = hljs.C_LINE_COMMENT_MODE; // // ... EOL

    // --- Strings ---
    // --- Multiline Strings (Python-like) ---
    const MULTILINE_STRING = {
        className: 'string',
        variants: [
            {
                begin: /"""/,
                end: /"""/,
                // no nested double strings, just escapes
                contains: [hljs.BACKSLASH_ESCAPE],
                keywords: false,
                relevance: 10
            },
            {
                begin: /'''/,
                end: /'''/,
                contains: [hljs.BACKSLASH_ESCAPE],
                keywords: false,
                relevance: 10
            }
        ]
    };



    const DOUBLE_QUOTED_STRING = {
        className: 'string',
        begin: /"(?:\\.|[^"\\\r\n])*"/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
    };

    const SINGLE_QUOTED_CHAR = {
        className: 'string',
        // allow escaped sequences; limit length not strictly necessary here for HLJS
        begin: /'(?:\\.|[^'\\\r\n]){1,6}'/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
    };

    // --- Numbers ---
    const NUMBER = {
        className: 'number',
        variants: [
            { begin: /\b0b[01][01_]*\b/ },               // binary
            { begin: /\b0x[\da-fA-F_]+\b/ },            // hex
            { begin: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ } // decimal / float / sci
        ],
        relevance: 0
    };

    // --- Operators ---
    const OPERATOR = {
        className: 'operator',
        begin: /(?:\?\?=|==|!==|>=|<=|\+\+|--|\*\*|\/\/|&&|\|\||->|::|[+\-*/%=&|^!<>]=?|[?:~])/,
        relevance: 0
    };

    // --- Modifiers (prefix symbols) ---
    const MODIFIER = {
        className: 'symbol',
        // match @,$, !!, ! when used as prefix before names
        begin: /(?:[@$]+|!!|!)(?=\s*[A-Za-z_]\w*)/,
        relevance: 0
    };

    // --- Decorators / annotations ---
    const DECORATOR = {
        className: 'meta',
        begin: /@[A-Za-z_]\w*(?:\s*(?:\.\s*[A-Za-z_]\w*)*)?/, // @ident or @ns.ident
        relevance: 0
    };

    // --- Function names (declaration + call sites) ---
    // We inherit TITLE_MODE to get HLJS behaviour for titles/identifiers
    const FUNCTION_TITLE = hljs.inherit(hljs.TITLE_MODE, {
        begin: new RegExp(`\\b(?:fn\\s+)?${IDENT.source}(?=\\s*\\()`),
        relevance: 0
    });

    const FUNCTION = {
        className: 'function',
        begin: FUNCTION_TITLE.begin,
        relevance: 0
    };

    // --- Class-like declarations: cls/imu/mut/enum ... Name ---
    const CLASS_DECL = {
        className: 'class',
        begin: new RegExp(
            String.raw`(?:\b(?:cls|imu|mut|enum)\b)\s+(?:static\s+)?(?:!!|!)?[@$]?${IDENT.source}`
        ),
        relevance: 1,
        contains: [
            // ensure the name part is highlighted as a title
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT })
        ]
    };

    // --- Generics like <T, U> ---
    const GENERICS = {
        className: 'generics',
        begin: /</,
        end: />/,
        contains: [
            {
                className: 'type',
                begin: IDENT,
                relevance: 0
            },
            {
                className: 'punctuation',
                begin: /[<>(),.:]/
            }
        ],
        relevance: 0
    };

    // --- Namespace / package / use forms ---
    const NAMESPACE = {
        className: 'namespace',
        begin: /\b(?:package|use|base)\b\s+[a-z]\w*(?:\.[a-z]\w*)*\.?/,
        relevance: 0,
        contains: [
            {
                className: 'punctuation',
                begin: /\./
            },
            hljs.inherit(hljs.TITLE_MODE, { begin: /[a-z]\w*/ })
        ]
    };

    // --- Punctuation ---
    const PUNCTUATION = {
        className: 'punctuation',
        begin: /[{}[\];(),.:]/
    };

    // --- Soft idents / builtins (__construct__, its, etc.) as built_in ---
    const BUILT_INS = {
        className: 'built_in',
        begin: /\b(?:its|__construct__|__guard__|__its__)\b/,
        relevance: 0
    };

    // Main returned grammar
    return {
        name: 'Exinix',
        aliases: ['exx', 'exinix'],
        keywords: KEYWORDS,
        contains: [
            // Comments first so they take precedence
            TRIPLE_DASH_COMMENT,
            SLASHES_LINE_COMMENT,

            // Strings (triple first for greedy match)
            MULTILINE_STRING,
            DOUBLE_QUOTED_STRING,
            SINGLE_QUOTED_CHAR,



            // Numbers
            NUMBER,

            // Functions & class-like constructs
            FUNCTION,
            CLASS_DECL,

            // Generics right after types/names to avoid clobbering
            GENERICS,

            // Builtins and special identifiers
            BUILT_INS,

            // Decorator / annotation and modifiers
            DECORATOR,
            MODIFIER,

            // Operators & punctuation
            OPERATOR,
            PUNCTUATION,

            // Namespace
            NAMESPACE,

            // Make HLJS try to highlight plain identifiers in contexts not matched above, but
            // keep it low relevance so keywords still win
            {
                begin: IDENT,
                relevance: 0
            }
        ]
    };
}
