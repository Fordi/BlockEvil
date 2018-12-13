# BlockEvil

Greasemonkey/TamperMonkey userscript that denies certain functionality to `eval` scripts.

Eval is generally used to obfuscate the intent of certain types of scripts, so that analysts must spend a considerable amount of time decoding their intent.

I'm not an analyst.  You're not an analyst.  I don't need to know what a malicious script is trying to do; I just need it to _not_.  So all this script does is bar top-level DOM changes, call-homes, opens, etc from evaluated scripts.  Basic premise is, if you're trying to hide it bad enough you're happy to lose performance through eval, my browser probably shouldn't be obeying those commands, and _absolutely_ should not be trying to call out or mess with my user experience.

As a bonus, it also prevents BlockAdBlock (which I personally consider evil anyway) from operating, since that (currently) relies on obfuscation via eval.  Most other avenues of script injection suffer from disablement now as well, so should be a while before that guy figures out a way around this.
