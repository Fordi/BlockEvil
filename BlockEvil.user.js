// ==UserScript==
// @name         BlockEvil
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Greasemonkey / Tampermonkey userscript that denies call-home functionality to `eval` scripts.
// @author       Bryan Elliott
// @match        http*://*/*
// @grant        none
// @downloadURL  https://github.com/Fordi/BlockEvil/raw/master/BlockEvil.user.js
// ==/UserScript==

(function _i_am_root() {
    const captureStackTrace = (() => {
        try {
            undefined.break();
        } catch (e) {
            return e.constructor.captureStackTrace;
        }
    })();
    const getStack = () => {
        const x = {};
        captureStackTrace(x);
        return x.stack.split('\n').slice(1).join('\n');
    };
    const isEval = () => {
        const stack = getStack();
        return (
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
        );
    };
    const noEval = () => {
        if (isEval()) {
            var err = new Error('I control my browser, not you.  Stop trying.');
            err.stack = '';
            throw err;
        }
    };
    const wrapCallback = (callback, acceptString) => {
        if (acceptString && typeof callback === 'string') {
            callback = new Function(callback);
        } else if (isEval()) {
            const ofn = callback;
            callback = function eval() {
                ofn();
            };
        }
        return callback;
    };
    const sto = window.setTimeout;
    window.setTimeout = (fn, time) => sto(wrapCallback(fn, true), time);
    const si = window.setInterval;
    window.setInterval = (fn, time) => si(wrapCallback(fn, true), time);
    const raf = window.requestAnimationFrame;
    window.requestAnimationFrame = (fn) => raf(wrapCallback(fn));

    const noEvalFor = (obj, name) => {
        const real = obj[name];
        const get = () => {
            return function () {
                noEval();
                return real.apply(this, arguments);
            };
        };
        const set = (v) => {};
        Object.defineProperty(obj, name, {
            configurable: false,
            enumerable: true,
            get, set
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
    for (let name in XMLHttpRequest.prototype) {
        if (XMLHttpRequest.prototype[name] instanceof Function) {
            noEvalFor(XMLHttpRequest.prototype, name);
        }
    }
})();
