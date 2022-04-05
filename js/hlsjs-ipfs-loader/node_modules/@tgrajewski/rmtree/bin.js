#!/usr/bin/env node
'use strict';


const rmtree = require('./rmtree');


var help = false

var args = process.argv.slice(2).filter(function(arg) {
    if (arg.match(/^(-+|\/)(h(elp)?|\?)$/))
        help = true;
    return arg;
});

if (help || args.length === 0)
    console.log(`Usage: rmtree <path> [<path> ...]

    Deletes all files and folders at "path" recursively.

`);
else
    for (var i = 0; i < args.length; i++)
        rmtree(args[i]);
