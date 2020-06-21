const fs = require('fs')
const {spawn} = require('child_process');
const pino = require('pino')
const { multistream } = require('pino-multi-stream')

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

if (process.platform === 'linux') {
    binaryName = '/tmp/clarity-lsp-linux'
}
logger.info('starting server')
const childProcess = spawn(binaryName, [],
    {stdio: [process.stdin, process.stdout, process.stderr]});
logger.info('exiting')