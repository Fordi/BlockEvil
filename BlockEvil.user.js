// ==UserScript==
// @name         BlockEvil
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Greasemonkey / Tampermonkey userscript that denies call-home functionality to `eval` scripts.
// @author       Bryan Elliott
// @match        http*://*/*
// @grant        none
// ==/UserScript==

(function _i_am_root() {
    'use strict';
    const noEval = () => {
        const stack = new Error().stack.split('\n').slice(3).join('\n');
        if (
            // eval'd script
            stack.indexOf('eval') !== -1
            // Inserted script with data source
            || /data:[^\/]+\/[^\/]+;/.test(stack)
            // Inserted script with blob source
            || stack.indexOf('blob:') !== -1
            // Chrome's trace for an inserted inline script
            || stack.indexOf('<anonymous>:1:1') !== -1
            // Line 1 on an HTML page is the trace in Firefox for an inserted inline script
            || stack.indexOf(`@${location}:1`) !== -1
        ) {
            var err = new Error('I control my browser, not you.  Stop trying.');
            err.stack = '';
            throw err;
        }
    };
    const noEvalFor = (obj, name) => {
        const real = obj[name];
        Object.defineProperty(obj, name, {
            configurable: false,
            writeable: false,
            enumerable: true,
            value: function () {
                noEval();
                return real.apply(this, arguments);
            }
        });
    };
    [
        'insertBefore',
        'addEventListener',
        'appendChild',
        'removeChild',
        'replaceChild',
        'querySelector',
        'querySelectorAll',
        'fetch',
        'createElement',
        'open',
        'getElementById',
        'getElementsByTagName',
        'getElementsByTagNameNS',
        'getElementsByClassName',
    ].forEach(name => {
        [ window, document, document.body, HTMLDocument.prototype, HTMLElement.prototype ].forEach(el => {
            if (el[name] instanceof Function) {
                noEvalFor(el, name);
            }
        });
    });
    const XHR = XMLHttpRequest;
    window.XMLHttpRequest = function () {
        noEval();
        return new XHR();
    };
})();
