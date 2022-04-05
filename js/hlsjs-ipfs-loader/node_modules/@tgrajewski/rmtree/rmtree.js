'use strict';


const fs = require('fs');
const path = require('path');


const log = console.log.bind(console);


function _readdir(dir) {
    var warn = false;
    while (true)
        try {
            return fs.readdirSync(dir, {'withFileTypes': true});
        } catch (e) {
            if (e.code === 'ENOENT')
                return [];
            if (e.code === 'EPERM')
                fs.chmodSync(dir, 0o777);

            if (!warn && rmtree.log) {
                if (rmtree.log === log)
                    rmtree.log(`Waiting for '${dir}' to be scanned`);
                else
                    rmtree.log(dir, e);
                warn = true;
            }
        }
}

function _rmdir(dir) {
    var warn = false;
    while (true)
        try {
            fs.rmdirSync(dir);
            return 1;
        } catch (e) {
            if (e.code === 'ENOENT')
                return 0;
            if (e.code === 'EPERM')
                fs.chmodSync(dir, 0o777);

            if (!warn && rmtree.log) {
                if (rmtree.log === log)
                    rmtree.log(`Waiting for '${dir}' to be removed`);
                else
                    rmtree.log(dir, e);
                warn = true;
            }
        }
}


function rmtree(root, removeRoot=true) {
    var files = _readdir(root);
    var lastWarn = -1;
    var count = 0;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var name = path.join(root, file.name);
        if (file.isDirectory())
            count += rmtree(name, true);
        else
            try {
                fs.unlinkSync(name);
                count += 1;
            } catch (e) {
                if (e.code === 'ENOENT')
                    continue;
                if (e.code === 'EPERM')
                    fs.chmodSync(name, 0o777);

                if (i !== lastWarn && rmtree.log) {
                    if (rmtree.log === log)
                        rmtree.log(`Waiting for '${name}' to be removed`);
                    else
                        rmtree.log(name, e);
                    lastWarn = i;
                }
                i -= 1;
            }
    }

    if (removeRoot)
        count += _rmdir(root);

    return count;
}


rmtree.log = log;


module.exports = rmtree;
