# BlockEvil

Greasemonkey/TamperMonkey userscript that denies call-home functionality to `eval` scripts.

Eval is generally used to obfuscate the intent of certain types of scripts, so that analysts must spend a considerable amount of time decoding their intent.

I'm not an analyst.  You're not an analyst.  I don't need to know what a malicious script is trying to do; I just need it to _not_.  So all this script does is bar top-level DOM changes, call-homes, opens, etc from evaluated scripts.  Basic premise is, if you're trying to hide it bad enough you're happy to lose performance through eval, my browser probably shouldn't be obeying those commands, and _absolutely_ should not be trying to call out or mess with my user experience.

As a bonus, it also prevents BlockAdBlock and other adBlock detectors (which I personally consider to be pretty evil anyway) from operating, since they generally rely on obfuscation via eval.  Most other avenues of script injection are blocked from calling home and messing with the DOM as well, so it should be a while before anyone figures out a way around this.

That said, if you're here from reddit, try to get around this, and create an issue illustrating the problem!  Would love the feedback!

A known issue is that BlockEvil interferes with some of the nicer features of Reddit Enhancement Suite.  They're unavoidable, so you might want to add reddit as an exception for the script.
