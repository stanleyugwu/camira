import { exec } from "child_process";
import { error, log } from "console";
import { existsSync, readdir, statSync } from "fs";
import path from "path";
import { cwd } from "process";

/*
 * This script takes care of transpiling all custom expo plugins
 * from `Typescript & ES6` to `JavaScript & CommonJS` so they can be
 * safely imported in `app.config.ts`.
 *
 * Any directory inside the same directory as this script, which has
 * an `index.js` or `index.ts` file is considered a plugin and will be
 * transpiled
 */

const root = cwd();

// read all files/dirs in the root plugins directory
readdir(root, (err, files) => {
  if (err) throw Error(err);
  const pluginsDirs = [];
  // collects all dirs (considered plugins) into an array
  files.forEach((file) => {
    const fileIsDir = statSync(file).isDirectory();
    if (fileIsDir) pluginsDirs.push(file);
  });

  if (pluginsDirs.length) {
    try {
      // runs tsc in each plugin dir to build its output
      pluginsDirs.forEach((pluginDir) => {
        // path to index file in the plugin dir,
        // all valid plugins must have an index.ts or index.js file
        // in it's root dir
        const indexPath = path.join(pluginDir, "index");

        // ensures the plugin dir has an index.ts or index.js file
        // which is the file that has the plugin function
        const hasTsExt = existsSync(indexPath + ".ts"),
          hasJsExt = existsSync(indexPath + ".js");

        if (hasTsExt || hasJsExt) {
          const buildDir = path.join(pluginDir, "build");
          const indexPathWithExt = hasTsExt
            ? indexPath + ".ts"
            : indexPath + ".js";

          const buildCommand =
            `tsc --outDir ${buildDir} -m "commonjs" -t "es5"` +
            ` -d true --skipLibCheck true "${indexPathWithExt}"`;

          exec(buildCommand, (_error, stdout, stderr) => {
            if (_error && _error.code !== 0) return error(_error);
            log(stdout);
            error(stderr);
          });
        }
      });
    } catch (error) {
      error(error);
    }
  }
});
