const { VM } = require('vm2');

// Execute JavaScript code safely
const executeCode = async (req, res) => {
    try {
        const { code, language = 'javascript' } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                error: 'Invalid code provided',
                output: ''
            });
        }

        // Currently supporting JavaScript only
        if (language !== 'javascript') {
            return res.status(400).json({
                error: `Language ${language} is not supported yet`,
                output: 'Currently only JavaScript is supported'
            });
        }

        // Create a new VM instance for safe execution
        let output = [];
        const vm = new VM({
            timeout: 5000, // 5 second timeout
            sandbox: {
                console: {
                    log: (...args) => {
                        output.push(args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(' '));

                    },
                    error: (...args) => {
                        output.push('ERROR: ' + args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(' '));
                    },
                    warn: (...args) => {
                        output.push('WARNING: ' + args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(' '));
                    }
                }
            }
        });



        try {
            // Execute the code in the VM
            const result = vm.run(`${code}
        
        //If there's a return statement or expression result, capture it
        if (typeof result !== 'undefined') {
          console.log(result);
        }
      `);

            // If there's a direct result and no console output, show the result
            if (output.length === 0 && result !== undefined) {
                output.push(String(result));
            }

            res.json({
                success: true,
                output: output.join('\n') || 'Code executed successfully (no output)',
                executionTime: '< 1s'
            });

        } catch (executionError) {
            // Handle runtime errors
            let errorMessage = executionError.message;

            // Clean up VM-specific error messages
            errorMessage = errorMessage.replace(/VM\d+:\d+/g, 'Line');

            res.json({
                success: false,
                error: errorMessage,
                output: output.join('\n'),
                executionTime: '< 1s'
            });
        }

    } catch (error) {
        console.error('Code execution error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during code execution',
            output: '',
            details: error.message
        });
    }
};

// Get supported languages
const getSupportedLanguages = (req, res) => {
    res.json({
        languages: [
            {
                name: 'JavaScript',
                id: 'javascript',
                version: 'ES6+',
                supported: true
            },
            {
                name: 'Python',
                id: 'python',
                version: '3.x',
                supported: false,
                comingSoon: true
            },
            {
                name: 'Java',
                id: 'java',
                version: '11+',
                supported: false,
                comingSoon: true
            }
        ]
    });
};

module.exports = {
    executeCode,
    getSupportedLanguages
};