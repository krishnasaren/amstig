// exinix-editor-grammar.js
// Monaco Monarch grammar for Exinix

export const exinixLanguage = {
    defaultToken: '',
    tokenPostfix: '.exi',

    typeKeywords: [
        'int','float','bool','char','byte','long','double','short',
        'ptr','str','array','mem','coll','set','map'
    ],

    controlKeywords: [
        'if','else','do','while','for','select','option','break','next',
        'return','try','catch','interrupt','fallback','from','as','assert'
    ],

    declKeywords: [
        'cls','enum','imu','mut','typedef','const','var','fn','void','static','parent',
        'default','async','await','use','base','volatile','synchronized','transient','instanceof'
    ],

    softIdents: ['its','__construct__','__guard__','__its__'],

    literals: ['True','False','null'],

    operators: [
        '==','!=','>=','<=','++','--','**','//','&&','||','->','::',
        '+','-','*','/','%','=','<','>','!','~','?','??','??=',
        '+=','-=','*=','/=','%=','&','|','^'
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[nrt'"]|u\{[0-9a-fA-F]+\})/,

    tokenizer: {
        root: [
            // multi-line comment start
            [/---/, { token: 'comment', next: '@dashComment' }],

            // single-line comment
            [/\/\/.*$/, 'comment'],

            // identifiers + keywords
            [/[A-Za-z_]\w*/, {
                cases: {
                    '@typeKeywords': 'keyword.type',
                    '@controlKeywords': 'keyword.control',
                    '@declKeywords': 'keyword',
                    '@softIdents': 'builtin',
                    '@literals': 'constant',
                    '@default': 'identifier'
                }
            }],

            // modifiers
            [/[@$]+|!!|!/, 'symbol'],

            // whitespace
            { include: '@whitespace' },

            // numbers
            [/\d+\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0x[0-9a-fA-F_]+/, 'number.hex'],
            [/0b[01_]+/, 'number.binary'],
            [/\d+/, 'number'],

            // strings
            [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' }],
            [/'/,  { token: 'string.quote', bracket: '@open', next: '@char' }],

            // triple-quoted strings
            [/("""|''')/, { token: 'string.quote', bracket: '@open', next: '@tripleString.$1' }],

            // operators
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default'  : ''
                }
            }],

            // punctuation
            [/[{}[\]()]/, '@brackets'],
            [/[;,.]/, 'delimiter']
        ],

        // -------- Multi-line triple-dash comments --------
        dashComment: [
            [/---/, { token: 'comment', next: '@pop' }], // end of comment
            [/./, 'comment'],                             // comment content
            [/[\n\r]/, 'comment']
        ],

        // -------- Strings --------
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        char: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        tripleString: [
            [/[^\\'"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/("""|''')/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        // -------- Whitespace --------
        whitespace: [
            [/[ \t\r\n]+/, '']
        ]
    }
};
