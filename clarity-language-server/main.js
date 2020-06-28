const fs = require('fs');
const http = require('http');
const {spawn} = require('child_process');
const pino = require('pino');
const { multistream } = require('pino-multi-stream');
const request = require('request')


// cant use stdio, so make our own
var log = fs.createWriteStream("/tmp/clarity.log.txt", {flags:'a'});
var streams = [
  {level: 'debug', stream: log},
  {level: 'error', stream: log},
  {level: 'fatal', stream: log}
]

const logger = pino({
  name: 'clarity-lsp',
  level: 'info',
}, multistream(streams))


var binaryUrl = 'https://github.com/lgalabru/clarity-lsp/releases/download/2020-05-27/'
if (process.platform === 'linux') {
    binaryName = 'clarity-lsp-linux';
}
binaryUrl += binaryName;
binaryName = '/tmp/' + binaryName;

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', callback)
  })
}

const startServer = (err) => {
    if (err) {
        logger.error(err)
    } else {
        const fd = fs.openSync(binaryName, "r");
        fs.fchmodSync(fd, 0o544);
        logger.info('starting server');
        const childProcess = spawn(binaryName, [],
            {stdio: [process.stdin, process.stdout, process.stderr]});
        logger.info('exiting');
    }
}

download(binaryUrl, binaryName, startServer);