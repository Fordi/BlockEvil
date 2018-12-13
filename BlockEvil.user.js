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
            return real.apply(obj, arguments);
        };
        return () => (obj[name] = real);
    };
    const noEvalForProp = (obj, prop) => {
        let value = obj[prop];
        Object.defineProperty(obj, prop, {
            get: () => {
                noEval();
                return value;
            },
            set: (v) => {
                noEval();
                value = v;
            }
        });
    };
    [ 'insertBefore', 'addEventListener', 'appendChild', 'removeChild', 'querySelector', 'querySelectorAll', 'innerHTML', 'fetch', 'createElement' ].forEach(name => {
        [ window, document, document.body ].concat([].call(document.body.children)).forEach(el => {
            if (el[name] instanceof Function) {
                noEvalFor(el, name);
            } else {
                noEvalForProp(el, name);
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
