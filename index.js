const fs = require('fs');
const parsePsd = require('./lib/psd');

const src = fs.createReadStream('./6cdbde.psd');
parsePsd(src);