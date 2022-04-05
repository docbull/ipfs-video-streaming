# rmtree

> 4,36 GB of data, 28 042 files, 4 217 folders on Windows removed in 15 seconds
> vs rimraf's 60 seconds on old HDD.

Removes directory trees ultra-fast synchronously (compared async code).
No dependencies.

Install with `npm install @tgrajewski/rmtree`, or just drop `rmtree.js` somewhere.

Example usage:
```javascript
const rmtree = require('@tgrajewski/rmtree');

// Removes local directory `build` and returns number of files removed
rmtree('build');

// Remove only contents of `build`, not the directory itself
rmtree('build', false);
```


## API

■ **`rmtree(root, removeRoot=true)`**: `Number`

Removes the directory specified by the `root` argument and all files
and directories inside. Does that synchronously (fast).

If `removeRoot` is `false`, then starting directory will not be removed,
only its contents.

This function tries hard, especially on Windows, where various issues arise
because files aren't removed instantaneously or permissions might be
insufficient or files might be locked by other processes.

Returns number of files and directories removed.

*Note:* In rare cases files might be still visible in Windows Explorer after
successfull call of `rmtree(...)`. These files are usually locked by other
processes (e.g. code editor), when you close the program, these files will
vanish.


■ **`rmtree.log = null;`**

■ **`rmtree.log = function(file, error) { ... };`**

In rare cases some files might be locked and calling `rmtree(...)` will log
appropriate messages via `console.log()` calls. You can suppress these messages
by setting `rmtree.log = null;` or provide your own callback function.


## CLI

You can call `rmtree <path> [<path> ...]` inside your npm `scripts` field in `package.json`.

You can also install this package globally `npm install rmtree -g` and you will
be able to call `rmtree <path> [<path> ...]` on your command line.
