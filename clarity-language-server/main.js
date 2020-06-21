
const {spawn} = require('child_process');

if (process.platform === "linux") {
    binaryName = "clarity-lsp-linux"
}

const childProcess = spawn(binaryName, [],
    {stdio: [process.stdin, process.stdout, process.stderr]});
