const fs = require('async-file');
const parsePsd = require('./lib/psd');
const parseCdr = require('./lib/cdr');

(async function () {
    const src = await fs.readFile('./mock/example.psd');

    // const { format, data } = await parseCdr(src);
    const { format, data } = await parsePsd(src);

    await fs.writeFile(`out.${format}`, data);
})();
