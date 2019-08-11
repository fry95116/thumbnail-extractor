const fs = require('async-file');
const yauzl = require('yauzl-promise');
const getStream = require('get-stream');
const path = require('path');

module.exports = async function (src) {
  if(src instanceof Buffer) {
      let offset = 0;
      const signature = src.toString('utf-8', offset, offset + 2);
      if (signature === 'PK') {
          const zipFile = await yauzl.fromBuffer(src);
          while(true) {
            const entry = await zipFile.readEntry();
            if (entry === null) return null;
            if (/^.*[Tt]humbnail.*$/.test(entry.fileName)) {
                const format = path.parse(entry.fileName).ext.substring(1);
                const rs = await entry.openReadStream();
                const data = await getStream.buffer(rs);
                return { format, data };
            }
          }
      }
  }
};
