const { spawn } = require('child_process');
const fs = require('fs');

/**
 * Checks to see if a file path exists. If it does NOT
 * exist the directory in which that file should
 * be in are created.
 *
 * @param {String} path
 * @param {String} file
 *
 * @return {Promise}
 */
function ensureFilePathExists(path, file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (fileNotFound) => {
      if (!fileNotFound) {
        // file exists
        resolve();
      }
      fs.mkdir(path, (errorCreatingDirs) => {
        if (errorCreatingDirs && errorCreatingDirs.code !== 'EEXIST') {
          reject(errorCreatingDirs);
        }
        resolve();
      });
    });
  });
}

/**
 * Executes a bash command
 *
 * @param {String} command
 * @param {Array} args
 *
 * @returns Promise
 */
async function bash({
  command, args,
}) {
  return new Promise((resolve, reject) => {
    try {
      const resetColor = '\x1b[0m';
      const process = spawn(command, args);

      process.stdout.on('data', (data) => {
        console.log(`\x1b[36m${data}`);
      });

      process.stderr.on('data', (data) => {
        console.error(`\x1b[33m${data}`);
      });

      process.on('close', (code) => {
        resolve(code);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  bash,
  ensureFilePathExists,
};
