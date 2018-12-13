# BlockEvil

Greasemonkey/TamperMonkey userscript that denies certain functionality to `eval` scripts.

Eval is generally used to obfuscate the intent of certain types of scripts, so that analysts must spend a considerable amount of time decoding their intent.

I'm not an analyst.  You're not an analyst.  I don't need to know what a malicious script is trying to do; I just need it to _not_.  So all this script does is bar top-level DOM changes, call-homes, opens, etc from evaluated scripts.

As a bonus, it also prevents BlockAdBlock from operating, since that (currently) relies on obfuscation via eval.
