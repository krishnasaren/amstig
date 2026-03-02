import React, { useState } from 'react';
import { Play, Download, Zap, FileCode, Cpu, AlertCircle } from 'lucide-react';

// ============================================================================
// MACHINE CODE GENERATOR - x86-64
// ============================================================================

class X64CodeGen {
    constructor() {
        this.code = [];
    }

    emit(...bytes) {
        this.code.push(...bytes);
    }

    static REG = { RAX: 0, RCX: 1, RDX: 2, RBX: 3, RSP: 4, RBP: 5, RSI: 6, RDI: 7, R8: 8, R9: 9 };

    // MOV reg, imm64
    movImm64(reg, value) {
        const v = BigInt(value);
        this.emit(
            0x48 | ((reg >> 3) & 1),
            0xB8 + (reg & 7),
            ...this.toLittleEndian64(v)
        );
    }

    // ADD reg, reg
    addReg(dest, src) {
        this.emit(0x48, 0x01, 0xC0 | ((src & 7) << 3) | (dest & 7));
    }

    // SUB reg, reg
    subReg(dest, src) {
        this.emit(0x48, 0x29, 0xC0 | ((src & 7) << 3) | (dest & 7));
    }

    // IMUL reg, reg
    imulReg(dest, src) {
        this.emit(0x48, 0x0F, 0xAF, 0xC0 | ((dest & 7) << 3) | (src & 7));
    }

    // IDIV reg (quotient in RAX, remainder in RDX)
    idivReg(divisor) {
        this.emit(0x48, 0x31, 0xD2); // XOR RDX, RDX
        this.emit(0x48, 0xF7, 0xF8 | (divisor & 7));
    }

    // PUSH reg
    pushReg(reg) {
        if (reg >= 8) {
            this.emit(0x41, 0x50 + (reg & 7));
        } else {
            this.emit(0x50 + reg);
        }
    }

    // POP reg
    popReg(reg) {
        if (reg >= 8) {
            this.emit(0x41, 0x58 + (reg & 7));
        } else {
            this.emit(0x58 + reg);
        }
    }

    // CALL relative
    callRel(offset) {
        this.emit(0xE8, ...this.toLittleEndian32(offset));
    }

    // RET
    ret() {
        this.emit(0xC3);
    }

    // XOR reg, reg (zero register)
    xorReg(reg) {
        this.emit(0x48, 0x31, 0xC0 | ((reg & 7) << 3) | (reg & 7));
    }

    toLittleEndian32(value) {
        return [
            value & 0xFF,
            (value >> 8) & 0xFF,
            (value >> 16) & 0xFF,
            (value >> 24) & 0xFF
        ];
    }

    toLittleEndian64(value) {
        const bytes = [];
        for (let i = 0; i < 8; i++) {
            bytes.push(Number(value & 0xFFn));
            value >>= 8n;
        }
        return bytes;
    }

    getCode() {
        return new Uint8Array(this.code);
    }

    getSize() {
        return this.code.length;
    }
}

// ============================================================================
// BYTECODE VM
// ============================================================================

const OP = {
    PUSH: 1, ADD: 2, SUB: 3, MUL: 4, DIV: 5, PRINT: 6, HALT: 7
};

class VM {
    execute(bytecode) {
        const stack = [];
        let pc = 0;
        const output = [];

        while (pc < bytecode.length) {
            const op = bytecode[pc++];

            switch (op) {
                case OP.PUSH:
                    stack.push(bytecode[pc++]);
                    break;
                case OP.ADD:
                    stack.push(stack.pop() + stack.pop());
                    break;
                case OP.SUB: {
                    const b = stack.pop();
                    stack.push(stack.pop() - b);
                    break;
                }
                case OP.MUL:
                    stack.push(stack.pop() * stack.pop());
                    break;
                case OP.DIV: {
                    const b = stack.pop();
                    stack.push(Math.floor(stack.pop() / b));
                    break;
                }
                case OP.PRINT:
                    output.push(stack[stack.length - 1]);
                    break;
                case OP.HALT:
                    return output;
            }
        }
        return output;
    }
}

// ============================================================================
// COMPILER
// ============================================================================

class Compiler {
    tokenize(source) {
        const tokens = [];
        const regex = /\s*([-+*/()=]|\d+|[a-zA-Z_]\w*|\S)\s*/g;
        let match;
        while ((match = regex.exec(source))) {
            if (match[1]) tokens.push(match[1]);
        }
        return tokens;
    }

    parse(tokens) {
        const ast = [];
        let i = 0;

        while (i < tokens.length) {
            if (tokens[i] === 'print') {
                i++;
                const expr = this.parseExpression(tokens, i);
                ast.push({ type: 'print', expr: expr.node });
                i = expr.pos;
            } else {
                i++;
            }
        }
        return ast;
    }

    parseExpression(tokens, pos) {
        return this.parseAddSub(tokens, pos);
    }

    parseAddSub(tokens, pos) {
        let result = this.parseMulDiv(tokens, pos);

        while (result.pos < tokens.length && (tokens[result.pos] === '+' || tokens[result.pos] === '-')) {
            const op = tokens[result.pos++];
            const right = this.parseMulDiv(tokens, result.pos);
            result = {
                node: { type: 'binop', op, left: result.node, right: right.node },
                pos: right.pos
            };
        }
        return result;
    }

    parseMulDiv(tokens, pos) {
        let result = this.parsePrimary(tokens, pos);

        while (result.pos < tokens.length && (tokens[result.pos] === '*' || tokens[result.pos] === '/')) {
            const op = tokens[result.pos++];
            const right = this.parsePrimary(tokens, result.pos);
            result = {
                node: { type: 'binop', op, left: result.node, right: right.node },
                pos: right.pos
            };
        }
        return result;
    }

    parsePrimary(tokens, pos) {
        if (tokens[pos] === '(') {
            const expr = this.parseExpression(tokens, pos + 1);
            return { node: expr.node, pos: expr.pos + 1 };
        }
        return { node: { type: 'num', value: parseInt(tokens[pos]) }, pos: pos + 1 };
    }

    compileToBytecode(ast) {
        const bytecode = [];
        for (const stmt of ast) {
            if (stmt.type === 'print') {
                this.generateExpr(stmt.expr, bytecode);
                bytecode.push(OP.PRINT);
            }
        }
        bytecode.push(OP.HALT);
        return bytecode;
    }

    generateExpr(node, bytecode) {
        if (node.type === 'num') {
            bytecode.push(OP.PUSH, node.value);
        } else if (node.type === 'binop') {
            this.generateExpr(node.left, bytecode);
            this.generateExpr(node.right, bytecode);
            const ops = { '+': OP.ADD, '-': OP.SUB, '*': OP.MUL, '/': OP.DIV };
            bytecode.push(ops[node.op]);
        }
    }

    compileToX64(ast) {
        const gen = new X64CodeGen();
        const REG = X64CodeGen.REG;

        // Simple function that calculates and returns result in RAX
        for (const stmt of ast) {
            if (stmt.type === 'print') {
                this.generateX64Expr(stmt.expr, gen, REG.RAX);
            }
        }

        gen.ret();
        return gen.getCode();
    }

    generateX64Expr(node, gen, targetReg) {
        if (node.type === 'num') {
            gen.movImm64(targetReg, node.value);
        } else if (node.type === 'binop') {
            const REG = X64CodeGen.REG;
            this.generateX64Expr(node.left, gen, REG.RAX);
            this.generateX64Expr(node.right, gen, REG.RCX);

            switch (node.op) {
                case '+': gen.addReg(REG.RAX, REG.RCX); break;
                case '-': gen.subReg(REG.RAX, REG.RCX); break;
                case '*': gen.imulReg(REG.RAX, REG.RCX); break;
                case '/': gen.idivReg(REG.RCX); break;
            }
        }
    }
}

// ============================================================================
// WINDOWS PE EXECUTABLE GENERATOR
// ============================================================================

class WindowsPEGenerator {
    generate(machineCode) {
        const codeSize = machineCode.length;
        const fileAlignment = 512;
        const sectionAlignment = 4096;

        // Calculate aligned sizes
        const codeAlignedSize = this.alignUp(codeSize, fileAlignment);
        const codeVirtualSize = this.alignUp(codeSize, sectionAlignment);

        const pe = [];

        // DOS Header (64 bytes)
        pe.push(
            0x4D, 0x5A, // MZ signature
            0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00,
            0xB8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x80, 0x00, 0x00, 0x00 // PE header offset at 0x80
        );

        // DOS Stub (32 bytes - minimal)
        pe.push(...new Array(32).fill(0));

        // PE Signature (4 bytes) at offset 0x80
        pe.push(0x50, 0x45, 0x00, 0x00); // "PE\0\0"

        // COFF Header (20 bytes)
        pe.push(
            0x64, 0x86, // Machine: AMD64
            0x01, 0x00, // Number of sections: 1
            0x00, 0x00, 0x00, 0x00, // Timestamp
            0x00, 0x00, 0x00, 0x00, // Symbol table pointer
            0x00, 0x00, 0x00, 0x00, // Number of symbols
            0xF0, 0x00, // Size of optional header: 240
            0x22, 0x00  // Characteristics: executable, large address aware
        );

        // Optional Header (240 bytes for PE32+)
        const imageBase = 0x140000000;
        const entryPoint = 0x1000; // RVA of code section

        pe.push(
            0x0B, 0x02, // Magic: PE32+ (64-bit)
            0x0E, 0x00, // Linker version
            ...this.u32le(codeAlignedSize), // Size of code
            0x00, 0x00, 0x00, 0x00, // Size of initialized data
            0x00, 0x00, 0x00, 0x00, // Size of uninitialized data
            ...this.u32le(entryPoint), // Entry point RVA
            ...this.u32le(0x1000), // Base of code
            ...this.u64le(imageBase), // Image base
            ...this.u32le(sectionAlignment), // Section alignment
            ...this.u32le(fileAlignment), // File alignment
            0x06, 0x00, 0x00, 0x00, // OS version
            0x00, 0x00, 0x00, 0x00, // Image version
            0x06, 0x00, 0x00, 0x00, // Subsystem version
            0x00, 0x00, 0x00, 0x00, // Win32 version
            ...this.u32le(0x2000), // Size of image
            ...this.u32le(0x200), // Size of headers
            0x00, 0x00, 0x00, 0x00, // Checksum
            0x03, 0x00, // Subsystem: Console
            0x60, 0x81, // DLL characteristics
            ...this.u64le(0x100000), // Size of stack reserve
            ...this.u64le(0x1000), // Size of stack commit
            ...this.u64le(0x100000), // Size of heap reserve
            ...this.u64le(0x1000), // Size of heap commit
            0x00, 0x00, 0x00, 0x00, // Loader flags
            0x10, 0x00, 0x00, 0x00 // Number of RVA and sizes
        );

        // Data directories (16 * 8 = 128 bytes)
        for (let i = 0; i < 16; i++) {
            pe.push(0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
        }

        // Section Header for .text (40 bytes)
        pe.push(
            0x2E, 0x74, 0x65, 0x78, 0x74, 0x00, 0x00, 0x00, // Name: ".text"
            ...this.u32le(codeVirtualSize), // Virtual size
            ...this.u32le(0x1000), // Virtual address
            ...this.u32le(codeAlignedSize), // Size of raw data
            ...this.u32le(0x200), // Pointer to raw data
            0x00, 0x00, 0x00, 0x00, // Pointer to relocations
            0x00, 0x00, 0x00, 0x00, // Pointer to line numbers
            0x00, 0x00, // Number of relocations
            0x00, 0x00, // Number of line numbers
            0x60, 0x00, 0x00, 0x20  // Characteristics: code, executable, readable
        );

        // Pad to file alignment (0x200)
        while (pe.length < 512) {
            pe.push(0x00);
        }

        // Add machine code
        pe.push(...machineCode);

        // Pad to file alignment
        while (pe.length < 512 + codeAlignedSize) {
            pe.push(0x00);
        }

        return new Uint8Array(pe);
    }

    alignUp(value, alignment) {
        return Math.ceil(value / alignment) * alignment;
    }

    u32le(value) {
        return [
            value & 0xFF,
            (value >> 8) & 0xFF,
            (value >> 16) & 0xFF,
            (value >> 24) & 0xFF
        ];
    }

    u64le(value) {
        const low = value & 0xFFFFFFFF;
        const high = Math.floor(value / 0x100000000);
        return [...this.u32le(low), ...this.u32le(high)];
    }
}

// ============================================================================
// LINUX ELF GENERATOR
// ============================================================================

class LinuxELFGenerator {
    generate(machineCode) {
        const codeSize = machineCode.length;
        const baseAddr = 0x400000;
        const headerSize = 120;

        const elf = [];

        // ELF Header (64 bytes)
        elf.push(
            0x7F, 0x45, 0x4C, 0x46, // Magic
            0x02, 0x01, 0x01, 0x00, // 64-bit, little-endian, current version, SYSV
            ...new Array(8).fill(0), // Padding
            0x02, 0x00, // Executable
            0x3E, 0x00, // x86-64
            0x01, 0x00, 0x00, 0x00, // Version
            ...this.u64le(baseAddr + headerSize), // Entry point
            0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Program header offset
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Section header offset
            0x00, 0x00, 0x00, 0x00, // Flags
            0x40, 0x00, // ELF header size
            0x38, 0x00, // Program header entry size
            0x01, 0x00, // Number of program headers
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // Section header info
        );

        // Program Header (56 bytes)
        elf.push(
            0x01, 0x00, 0x00, 0x00, // PT_LOAD
            0x05, 0x00, 0x00, 0x00, // Read + Execute
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Offset
            ...this.u64le(baseAddr), // Virtual address
            ...this.u64le(baseAddr), // Physical address
            ...this.u64le(headerSize + codeSize), // File size
            ...this.u64le(headerSize + codeSize), // Memory size
            ...this.u64le(0x200000) // Alignment
        );

        // Machine code
        elf.push(...machineCode);

        return new Uint8Array(elf);
    }

    u64le(value) {
        const bytes = [];
        for (let i = 0; i < 8; i++) {
            bytes.push(value & 0xFF);
            value = Math.floor(value / 256);
        }
        return bytes;
    }
}

// ============================================================================
// UI COMPONENT
// ============================================================================

export default function SimpleCalcCompiler() {
    const [code, setCode] = useState('print 10 + 5 * 2\nprint (10 + 5) * 2');
    const [output, setOutput] = useState('');
    const [bytecode, setBytecode] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [activeTab, setActiveTab] = useState('output');

    const compiler = new Compiler();
    const vm = new VM();

    const runCode = () => {
        try {
            const tokens = compiler.tokenize(code);
            const ast = compiler.parse(tokens);

            const bc = compiler.compileToBytecode(ast);
            setBytecode(bc.map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' '));

            const result = vm.execute(bc);

            const x64Code = compiler.compileToX64(ast);
            const x64Hex = Array.from(x64Code).map(b => b.toString(16).padStart(2, '0')).join(' ');
            setMachineCode(`x86-64 Machine Code (${x64Code.length} bytes):\n${x64Hex}`);

            setOutput(`Executed successfully!\n\nResults:\n${result.join('\n')}`);
        } catch (e) {
            setOutput(`Error: ${e.message}`);
        }
    };

    const downloadExecutable = (platform) => {
        try {
            const ast = compiler.parse(compiler.tokenize(code));
            const x64Code = compiler.compileToX64(ast);

            let binary, filename;

            if (platform === 'windows') {
                const peGen = new WindowsPEGenerator();
                binary = peGen.generate(x64Code);
                filename = 'program.exe';
            } else {
                const elfGen = new LinuxELFGenerator();
                binary = elfGen.generate(x64Code);
                filename = 'program';
            }

            const blob = new Blob([binary], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            setOutput(`${platform === 'windows' ? 'Windows PE' : 'Linux ELF'} executable generated!\nSize: ${binary.length} bytes`);
        } catch (e) {
            setOutput(`Error: ${e.message}`);
        }
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 w-full max-w-8xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Cpu className="w-8 h-8 text-blue-400" />
                    SimpleCalc - Native Compiler
                </h1>
                <p className="text-slate-300">Bytecode VM + Native x86-64 Code Generation</p>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold text-yellow-200 mb-1">Note about generated executables:</p>
                    <p className="text-yellow-100">The Windows .exe will run but exit immediately (no output). To see results, use the VM execution. Real executables need runtime libraries (CRT) and system call wrappers for console I/O.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 font-semibold text-slate-200">Source Codeee</label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-56 bg-slate-800/50 backdrop-blur border border-slate-600 rounded-lg p-4 font-mono text-sm text-white focus:border-blue-500 focus:outline-none overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                        placeholder="print 10 + 5"
                    />

                    <div className="mt-4 space-y-3">
                        <button
                            onClick={runCode}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            <Play className="w-4 h-4" />
                            Compile & Run (VM)
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={() => downloadExecutable('windows')}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Windows .exe
                            </button>
                            <button
                                onClick={() => downloadExecutable('linux')}
                                className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Linux ELF
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`px-4 py-2 rounded transition ${activeTab === 'output' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            Output
                        </button>
                        <button
                            onClick={() => setActiveTab('bytecode')}
                            className={`px-4 py-2 rounded transition ${activeTab === 'bytecode' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            Bytecode
                        </button>
                        <button
                            onClick={() => setActiveTab('machine')}
                            className={`px-4 py-2 rounded transition ${activeTab === 'machine' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            Machine Code
                        </button>
                    </div>

                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 h-64 overflow-auto">
                        {activeTab === 'output' && (
                            <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">
                {output || 'Run code to see output...'}
              </pre>
                        )}
                        {activeTab === 'bytecode' && (
                            <pre className="font-mono text-xs text-cyan-300">
                {bytecode || 'Compile to see bytecode...'}
              </pre>
                        )}
                        {activeTab === 'machine' && (
                            <pre className="font-mono text-xs text-purple-300 whitespace-pre-wrap">
                {machineCode || 'Compile to see machine code...'}
              </pre>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                    <h3 className="font-bold text-blue-300 mb-2">1. Parse & Compile</h3>
                    <p className="text-sm text-slate-300">Tokenize → AST → Bytecode/Machine Code</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                    <h3 className="font-bold text-blue-300 mb-2">2. Machine Code</h3>
                    <p className="text-sm text-slate-300">Emit raw x86-64 bytes from CPU manual</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                    <h3 className="font-bold text-blue-300 mb-2">3. PE/ELF Wrapper</h3>
                    <p className="text-sm text-slate-300">Wrap code in executable format</p>
                </div>
            </div>

            <div className="mt-4 bg-slate-800 rounded-lg p-4 text-xs space-y-2">
                <h3 className="font-bold text-slate-200">Machine Code Example:</h3>
                <p className="text-slate-400 font-mono">
                    MOV RAX, 42 → <span className="text-green-400">48 B8 2A 00 00 00 00 00 00 00</span><br/>
                    ADD RAX, RCX → <span className="text-green-400">48 01 C8</span><br/>
                    RET → <span className="text-green-400">C3</span>
                </p>
            </div>
        </div>
    );
}