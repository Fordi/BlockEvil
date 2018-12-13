// ==UserScript==
// @name         BlockEvil
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Greasemonkey / Tampermonkey userscript that denies certain functionality to `eval` scripts.
// @author       Bryan Elliott
// @match        http*://*/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    const noEval = () => {
        if (new Error().stack.indexOf('eval') !== -1) {
            var err = new Error('I control my browser, not you.  Stop trying.');
            err.stack = '';
            throw err;
        }
    };
    const noEvalFor = (obj, name) => {
        const real = obj[name];
        obj[name] = function () {
            noEval();
            return real.apply(this, arguments);
        };
        return () => (obj[name] = real);
    };
    [
        'insertBefore',
        'addEventListener',
        'appendChild',
        'removeChild',
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
        [ window, HTMLDocument.prototype, HTMLElement.prototype ].forEach(el => {
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
    noEvalFor(Object, 'defineProperty');
    noEvalFor(Object, 'defineProperties');

})();
