const fs = require('fs');
const http = require('http');
const {spawn} = require('child_process');
const pino = require('pino');
const { multistream } = require('pino-multi-stream');
const request = require('request')

var binaryUrl = 'https://github.com/lgalabru/clarity-lsp/releases/download/2020-05-27/'
if (process.platform === 'linux') {
    binaryName = 'clarity-lsp-linux';
    binaryPath = '/tmp/';
} else if (process.platform === 'darwin') {
    binaryName = 'clarity-lsp-mac';
    binaryPath = '/tmp/';
} else if (process.platform === 'win32') {
    binaryName = 'clarity-lsp-windows.exe';
    binaryPath = '%TEMP%\\';
}
binaryUrl += binaryName;

// cant use stdio, so make our own
var log = fs.createWriteStream(binaryPath + '/clarity.log.txt', {flags:'a'});
var streams = [
  {level: 'debug', stream: log},
  {level: 'error', stream: log},
  {level: 'fatal', stream: log}
]

const logger = pino({
  name: 'clarity-lsp',
  level: 'info',
  enabled: (process.env.LOG === 'true')
}, multistream(streams))



const startServer = (err) => {
    if (err) {
        logger.error(err)
    } else {
        logger.info('starting server');
        const childProcess = spawn(binaryPath + binaryName, [],
            {stdio: [process.stdin, process.stdout, process.stderr]});
        logger.info('exiting');
    }
}

const download = (url, path) => {
  request.head(url, (err, res, body) => {
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', (err) => {
          const fd = fs.openSync(path, "r");
          fs.fchmodSync(fd, 0o544);
          startServer();
      })
  })
}

if (fs.existsSync(binaryPath + binaryName)) {
    startServer();
} else {
    download(binaryUrl, binaryPath + binaryName);
}