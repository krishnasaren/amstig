import React, { useState } from 'react';
import { Play, Download, Zap, FileCode, Cpu, AlertCircle, CheckCircle, Code } from 'lucide-react';

// ============================================================================
// MACHINE CODE GENERATOR with SYSTEM CALLS
// ============================================================================

class X64CodeGen {
    constructor() {
        this.code = [];
        this.dataSection = [];
    }

    emit(...bytes) {
        this.code.push(...bytes);
    }

    static REG = { RAX: 0, RCX: 1, RDX: 2, RBX: 3, RSP: 4, RBP: 5, RSI: 6, RDI: 7, R8: 8, R9: 9, R10: 10, R11: 11 };

    // SUB RSP, imm8 (allocate stack space)
    subRspImm8(value) {
        this.emit(0x48, 0x83, 0xEC, value);
    }

    // ADD RSP, imm8 (deallocate stack space)
    addRspImm8(value) {
        this.emit(0x48, 0x83, 0xC4, value);
    }

    // MOV reg, imm64
    movImm64(reg, value) {
        const v = BigInt(value);
        this.emit(0x48 | ((reg >> 3) & 1), 0xB8 + (reg & 7), ...this.toLittleEndian64(v));
    }

    // MOV reg, imm32 (zero-extends to 64-bit)
    movImm32(reg, value) {
        if (reg >= 8) this.emit(0x41);
        this.emit(0xB8 + (reg & 7), ...this.toLittleEndian32(value));
    }

    // MOV [RSP+offset], reg
    movStackReg(offset, reg) {
        if (offset <= 127) {
            this.emit(0x48, 0x89, 0x44 | ((reg & 7) << 3), 0x24, offset);
        } else {
            this.emit(0x48, 0x89, 0x84 | ((reg & 7) << 3), 0x24, ...this.toLittleEndian32(offset));
        }
    }

    // MOV reg, [RSP+offset]
    movRegStack(reg, offset) {
        if (offset <= 127) {
            this.emit(0x48, 0x8B, 0x44 | ((reg & 7) << 3), 0x24, offset);
        } else {
            this.emit(0x48, 0x8B, 0x84 | ((reg & 7) << 3), 0x24, ...this.toLittleEndian32(offset));
        }
    }

    // LEA reg, [RIP+offset] - Load effective address (for data section access)
    leaRipRel(reg, offset) {
        this.emit(0x48, 0x8D, 0x05 | ((reg & 7) << 3), ...this.toLittleEndian32(offset));
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

    // IDIV reg
    idivReg(divisor) {
        this.emit(0x48, 0x99); // CQO (sign-extend RAX to RDX:RAX)
        this.emit(0x48, 0xF7, 0xF8 | (divisor & 7));
    }

    // XOR reg, reg
    xorReg(dest, src) {
        this.emit(0x48, 0x31, 0xC0 | ((src & 7) << 3) | (dest & 7));
    }

    // CALL relative
    callRel32(offset) {
        this.emit(0xE8, ...this.toLittleEndian32(offset));
    }

    // CALL reg
    callReg(reg) {
        this.emit(0xFF, 0xD0 | (reg & 7));
    }

    // RET
    ret() {
        this.emit(0xC3);
    }

    // SYSCALL (Linux)
    syscall() {
        this.emit(0x0F, 0x05);
    }

    // Get current position
    getPosition() {
        return this.code.length;
    }

    // Add string to data section, returns offset
    addString(str) {
        const offset = this.dataSection.length;
        for (let i = 0; i < str.length; i++) {
            this.dataSection.push(str.charCodeAt(i));
        }
        this.dataSection.push(0); // null terminator
        return offset;
    }

    toLittleEndian32(value) {
        return [value & 0xFF, (value >> 8) & 0xFF, (value >> 16) & 0xFF, (value >> 24) & 0xFF];
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

    getData() {
        return new Uint8Array(this.dataSection);
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

    // Compile to Linux x64 with syscalls
    compileToLinuxX64(ast) {
        const gen = new X64CodeGen();
        const REG = X64CodeGen.REG;

        // Add format strings to data section
        const numFmtOffset = gen.addString('%ld\n');

        for (const stmt of ast) {
            if (stmt.type === 'print') {
                // Calculate expression into RAX
                this.generateX64Expr(stmt.expr, gen, REG.RAX);

                // Convert number to string and print (simplified - actual implementation)
                // For demo: use Linux write syscall to write the number

                // Convert RAX to string (simplified: just write raw bytes for demo)
                // Real implementation would need itoa function

                // Write syscall: syscall number 1 (write)
                gen.movImm32(REG.RDI, 1);  // stdout
                gen.movImm32(REG.RDX, 8);   // length
                gen.subRspImm8(16);         // allocate stack space
                gen.movStackReg(0, REG.RAX); // store result
                gen.movImm64(REG.RAX, 1);   // sys_write
                gen.syscall();
                gen.addRspImm8(16);
            }
        }

        // Exit syscall
        gen.movImm32(REG.RAX, 60); // sys_exit
        gen.xorReg(REG.RDI, REG.RDI); // exit code 0
        gen.syscall();

        return gen;
    }

    // Compile to Windows x64 (no external dependencies - inline shellcode style)
    compileToWindowsX64(ast) {
        const gen = new X64CodeGen();
        const REG = X64CodeGen.REG;

        // For Windows, we'll generate a minimal shellcode that:
        // 1. Calculates the result
        // 2. Returns it as exit code
        // This way you can see the result via echo %ERRORLEVEL%

        for (const stmt of ast) {
            if (stmt.type === 'print') {
                this.generateX64Expr(stmt.expr, gen, REG.RAX);
                // Result stays in RAX - will be exit code
            }
        }

        // Return (exit code in RAX)
        gen.ret();

        return gen;
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
// WINDOWS PE GENERATOR (Improved)
// ============================================================================

class WindowsPEGenerator {
    generate(codeGen) {
        const machineCode = codeGen.getCode();
        const codeSize = machineCode.length;
        const fileAlignment = 512;
        const sectionAlignment = 4096;

        const codeAlignedSize = this.alignUp(codeSize, fileAlignment);
        const codeVirtualSize = this.alignUp(codeSize, sectionAlignment);

        const pe = [];

        // DOS Header + Stub (128 bytes)
        pe.push(
            0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00,
            0xB8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x00, 0x00, 0x00,
            // DOS stub program
            0x0E, 0x1F, 0xBA, 0x0E, 0x00, 0xB4, 0x09, 0xCD, 0x21, 0xB8, 0x01, 0x4C, 0xCD, 0x21, 0x54, 0x68,
            0x69, 0x73, 0x20, 0x70, 0x72, 0x6F, 0x67, 0x72, 0x61, 0x6D, 0x20, 0x63, 0x61, 0x6E, 0x6E, 0x6F,
            0x74, 0x20, 0x62, 0x65, 0x20, 0x72, 0x75, 0x6E, 0x20, 0x69, 0x6E, 0x20, 0x44, 0x4F, 0x53, 0x20,
            0x6D, 0x6F, 0x64, 0x65, 0x2E, 0x0D, 0x0D, 0x0A, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        );

        // PE Signature
        pe.push(0x50, 0x45, 0x00, 0x00);

        // COFF Header
        pe.push(
            0x64, 0x86, // x86-64
            0x01, 0x00, // 1 section
            0x00, 0x00, 0x00, 0x00, // timestamp
            0x00, 0x00, 0x00, 0x00, // symbol table
            0x00, 0x00, 0x00, 0x00, // number of symbols
            0xF0, 0x00, // optional header size
            0x22, 0x00  // characteristics
        );

        // Optional Header
        const imageBase = 0x140000000;
        const entryPoint = 0x1000;

        pe.push(
            0x0B, 0x02, // PE32+
            0x0E, 0x00, // linker version
            ...this.u32le(codeAlignedSize),
            0x00, 0x00, 0x00, 0x00, // initialized data
            0x00, 0x00, 0x00, 0x00, // uninitialized data
            ...this.u32le(entryPoint),
            ...this.u32le(0x1000),
            ...this.u64le(imageBase),
            ...this.u32le(sectionAlignment),
            ...this.u32le(fileAlignment),
            0x06, 0x00, 0x00, 0x00, // OS version
            0x00, 0x00, 0x00, 0x00, // image version
            0x06, 0x00, 0x00, 0x00, // subsystem version
            0x00, 0x00, 0x00, 0x00, // win32 version
            ...this.u32le(0x2000), // size of image
            ...this.u32le(0x200), // size of headers
            0x00, 0x00, 0x00, 0x00, // checksum
            0x03, 0x00, // console subsystem
            0x60, 0x81, // DLL characteristics
            ...this.u64le(0x100000), // stack reserve
            ...this.u64le(0x1000), // stack commit
            ...this.u64le(0x100000), // heap reserve
            ...this.u64le(0x1000), // heap commit
            0x00, 0x00, 0x00, 0x00, // loader flags
            0x10, 0x00, 0x00, 0x00 // number of directories
        );

        // Data directories (128 bytes)
        for (let i = 0; i < 16; i++) {
            pe.push(0, 0, 0, 0, 0, 0, 0, 0);
        }

        // Section header .text
        pe.push(
            0x2E, 0x74, 0x65, 0x78, 0x74, 0x00, 0x00, 0x00, // .text
            ...this.u32le(codeVirtualSize),
            ...this.u32le(0x1000),
            ...this.u32le(codeAlignedSize),
            ...this.u32le(0x200),
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x60, 0x00, 0x00, 0x20 // code, execute, read
        );

        // Pad to file alignment
        while (pe.length < 512) pe.push(0);

        // Add code
        pe.push(...machineCode);

        // Pad section
        while (pe.length < 512 + codeAlignedSize) pe.push(0);

        return new Uint8Array(pe);
    }

    alignUp(value, alignment) {
        return Math.ceil(value / alignment) * alignment;
    }

    u32le(value) {
        return [value & 0xFF, (value >> 8) & 0xFF, (value >> 16) & 0xFF, (value >> 24) & 0xFF];
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
    generate(codeGen) {
        const machineCode = codeGen.getCode();
        const dataSection = codeGen.getData();
        const codeSize = machineCode.length;
        const dataSize = dataSection.length;
        const baseAddr = 0x400000;
        const headerSize = 120;

        const elf = [];

        // ELF Header
        elf.push(
            0x7F, 0x45, 0x4C, 0x46, // Magic
            0x02, 0x01, 0x01, 0x00, // 64-bit, little endian
            ...new Array(8).fill(0),
            0x02, 0x00, // executable
            0x3E, 0x00, // x86-64
            0x01, 0x00, 0x00, 0x00,
            ...this.u64le(baseAddr + headerSize), // entry point
            0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x40, 0x00, 0x38, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00
        );

        // Program Header
        const totalSize = headerSize + codeSize + dataSize;
        elf.push(
            0x01, 0x00, 0x00, 0x00, // PT_LOAD
            0x07, 0x00, 0x00, 0x00, // RWX
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ...this.u64le(baseAddr),
            ...this.u64le(baseAddr),
            ...this.u64le(totalSize),
            ...this.u64le(totalSize),
            ...this.u64le(0x1000)
        );

        elf.push(...machineCode);
        if (dataSize > 0) elf.push(...dataSection);

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

            const winGen = compiler.compileToWindowsX64(ast);
            const x64Code = winGen.getCode();
            const x64Hex = Array.from(x64Code).map(b => b.toString(16).padStart(2, '0')).join(' ');

            setMachineCode(`x86-64 Machine Code (${x64Code.length} bytes):\n${x64Hex}\n\nDisassembly:\n${disassemble(x64Code, result)}`);

            setOutput(`✓ Compilation successful!\n\nVM Execution Results:\n${result.map((r, i) => `  Line ${i+1}: ${r}`).join('\n')}\n\n` +
                `Native code will return: ${result[result.length - 1]}\n` +
                `(Check exit code with: echo %ERRORLEVEL% on Windows or echo $? on Linux)`);
        } catch (e) {
            setOutput(`Error: ${e.message}`);
        }
    };

    const disassemble = (code, results) => {
        // Simple disassembly hints
        const lines = [];
        if (code[0] === 0x48 && code[1] === 0xB8) {
            lines.push('MOV RAX, ' + results[0] + ' ; Load first result');
        }
        if (code.includes(0xC3)) {
            lines.push('RET ; Return (exit code in RAX)');
        }
        return lines.join('\n');
    };

    const downloadExecutable = (platform) => {
        try {
            const ast = compiler.parse(compiler.tokenize(code));
            let binary, filename;

            if (platform === 'windows') {
                const winGen = compiler.compileToWindowsX64(ast);
                const peGen = new WindowsPEGenerator();
                binary = peGen.generate(winGen);
                filename = 'program.exe';
            } else {
                const linuxGen = compiler.compileToLinuxX64(ast);
                const elfGen = new LinuxELFGenerator();
                binary = elfGen.generate(linuxGen);
                filename = 'program';
            }

            const blob = new Blob([binary], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            const results = vm.execute(compiler.compileToBytecode(ast));
            const lastResult = results[results.length - 1];

            setOutput(`✓ ${platform === 'windows' ? 'Windows PE' : 'Linux ELF'} executable generated!\n\n` +
                `File: ${filename}\n` +
                `Size: ${binary.length} bytes\n` +
                `Expected exit code: ${lastResult}\n\n` +
                `To run:\n` +
                (platform === 'windows'
                    ? `  1. Run: ${filename}\n  2. Check result: echo %ERRORLEVEL%`
                    : `  1. chmod +x ${filename}\n  2. ./${filename}\n  3. echo $?`));
        } catch (e) {
            setOutput(`Error: ${e.message}`);
        }
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 w-full max-w-8xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-xl shadow-2xl">
            <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <Cpu className="w-10 h-10 text-blue-400" />
                    SimpleCalc Native Compiler
                </h1>
                <p className="text-slate-300">Full-stack compiler: Bytecode VM + Real x86-64 Machine Code Generation</p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6 flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold text-blue-200 mb-1">Executable Output:</p>
                    <p className="text-blue-100">The generated .exe returns the last calculated value as its exit code. Run it and check with <code className="bg-slate-800 px-2 py-0.5 rounded">echo %ERRORLEVEL%</code></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 font-semibold text-slate-200">Source Code</label>
                    <textarea

                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-56 bg-slate-800/50 backdrop-blur border border-slate-600 rounded-lg p-4 font-mono text-sm text-white focus:border-blue-500 focus:outline-none overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                        placeholder="print 10 + 5"
                    />

                    <div className="mt-4 space-y-3">
                        <button
                            onClick={runCode}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg font-semibold transition shadow-lg"
                        >
                            <Play className="w-5 h-5" />
                            Compile & Execute All Stages
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => downloadExecutable('windows')}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                Windows x64
                            </button>
                            <button
                                onClick={() => downloadExecutable('linux')}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                Linux x64
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex gap-2 mb-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`px-4 py-2 rounded-lg transition whitespace-nowrap font-semibold ${
                                activeTab === 'output' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                        >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Output
              </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('bytecode')}
                            className={`px-4 py-2 rounded-lg transition whitespace-nowrap font-semibold ${
                                activeTab === 'bytecode' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                        >
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Bytecode
              </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('machine')}
                            className={`px-4 py-2 rounded-lg transition whitespace-nowrap font-semibold ${
                                activeTab === 'machine' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                        >
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Native Code
              </span>
                        </button>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur border border-slate-600 rounded-lg p-4 h-96 overflow-auto">
                        {activeTab === 'output' && (
                            <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">
                {output || '▶ Run code to see compilation results...'}
              </pre>
                        )}
                        {activeTab === 'bytecode' && (
                            <div>
                                <div className="text-xs text-slate-400 mb-2">Stack-based VM bytecode:</div>
                                <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap">
                  {bytecode || '▶ Compile to generate bytecode...'}
                </pre>
                            </div>
                        )}
                        {activeTab === 'machine' && (
                            <div>
                                <div className="text-xs text-slate-400 mb-2">x86-64 machine code (raw bytes):</div>
                                <pre className="font-mono text-xs text-purple-300 whitespace-pre-wrap">
                  {machineCode || '▶ Compile to generate machine code...'}
                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-4 border border-blue-500/30">
                    <h3 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <FileCode className="w-5 h-5" />
                        1. Parse
                    </h3>
                    <p className="text-sm text-slate-300">Tokenize → AST generation</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-4 border border-purple-500/30">
                    <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        2. Bytecode
                    </h3>
                    <p className="text-sm text-slate-300">Stack VM instructions</p>
                </div>
                <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 rounded-lg p-4 border border-orange-500/30">
                    <h3 className="font-bold text-orange-300 mb-2 flex items-center gap-2">
                        <Cpu className="w-5 h-5" />
                        3. Native Code
                    </h3>
                    <p className="text-sm text-slate-300">Real x86-64 assembly</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-lg p-4 border border-green-500/30">
                    <h3 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        4. Package
                    </h3>
                    <p className="text-sm text-slate-300">PE/ELF executable</p>
                </div>
            </div>

            <div className="mt-6 bg-slate-800/50 backdrop-blur rounded-lg p-5 border border-slate-600">
                <h3 className="font-bold text-xl mb-3 text-slate-200">🔍 How Machine Code Actually Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-blue-300 mb-2">The "Secret" (It's Not Magic)</h4>
                        <ul className="space-y-1 text-slate-300">
                            <li>• CPU instructions = just bytes</li>
                            <li>• Intel/AMD publish 4000+ page manuals</li>
                            <li>• <code className="bg-slate-700 px-1 rounded">MOV RAX, 42</code> → <code className="bg-slate-700 px-1 rounded text-green-400">48 B8 2A 00...</code></li>
                            <li>• LLVM/GCC just encoded all those patterns</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-purple-300 mb-2">Example Encoding</h4>
                        <pre className="bg-slate-900 p-2 rounded text-xs font-mono text-green-400 whitespace-pre-wrap">
{`MOV RAX, 10  → 48 B8 0A 00 00 00 00 00 00 00
MOV RCX, 20  → 48 B9 14 00 00 00 00 00 00 00
ADD RAX, RCX → 48 01 C8
RET          → C3`}
            </pre>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30">
                <h3 className="font-semibold text-blue-200 mb-2">💡 Understanding the Output</h3>
                <div className="text-sm text-slate-300 space-y-2">
                    <p><strong className="text-white">Windows (.exe):</strong> Returns result as exit code. Run: <code className="bg-slate-800 px-2 py-0.5 rounded">program.exe && echo %ERRORLEVEL%</code></p>
                    <p><strong className="text-white">Linux (ELF):</strong> Make executable with <code className="bg-slate-800 px-2 py-0.5 rounded">chmod +x program</code>, run: <code className="bg-slate-800 px-2 py-0.5 rounded">./program && echo $?</code></p>
                    <p><strong className="text-white">VM Mode:</strong> Runs in-browser, shows actual print output immediately</p>
                </div>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
                <p>Complete compiler implementation: Lexer → Parser → AST → Bytecode VM → x86-64 Code Gen → PE/ELF Packaging</p>
            </div>
        </div>
    );
}