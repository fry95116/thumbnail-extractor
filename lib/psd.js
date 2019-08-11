const { Readable } = require('stream');
const consume = require('stream-consume-promise');

module.exports = async function (src) {

  if(src instanceof Buffer) {
    
    let offset = 0;
    
    // validate signature
    const signature = src.toString('utf-8', offset, offset + 4);
    offset += 4;
    if(signature !== '8BPS') return new Error('invalid file format');

    // header length: 26Byte, skip it
    offset += 22;

    // skip color data
    const colorDataLength = src.readUInt32BE(offset);
    offset += 4;
    if(colorDataLength !== 0) {
      offset += colorDataLength;
    }

    // skip iamgeResourceLength
    offset += 4; 

    // read image resource blocks
    while(offset < src.length) {
      // validate signature
      const blockId = src.toString('utf-8', offset, offset + 4)
      offset += 4;
      if(blockId !== '8BIM') return new Error('invalid file format');

      // image resource id
      const imageResourceId = src.readUInt16BE(offset);
      offset += 2;

      // read name
      let name = '';
      const nameStringLength = src.readUInt8(offset);
      offset += 1;
      if(nameStringLength > 0) {
        name = value.toString('utf-8', offset, offset + nameStringLength);
        offset += nameStringLength;
      }
      // skip padding
      offset += (nameStringLength + 1) & 0x01;

      // read data length
      const dataLength = src.readUInt32BE(offset);
      offset += 4;

      // read data
      const blockData = src.slice(offset, offset + dataLength);
      offset += dataLength;

      // skip padding
      offset += dataLength & 0x01;

      console.log(JSON.stringify({ imageResourceId, name, dataLength }));
      if (imageResourceId === 0x040C) {
        console.log('----- thumbnail -----');
        let offset = 0;
        
        // ({ done, value } = await read(4));
        const formatCode = blockData.readUInt32BE(offset);
        offset += 4;
        console.log(`format=${formatCode}(${formatCode === 1 ? 'kJpegRGB' : 'kRawRGB'})`);

        const width = blockData.readUInt32BE(offset);
        offset += 4;
        console.log(`width=${width}`);

        const height = blockData.readUInt32BE(offset);
        offset += 4;
        console.log(`height=${height}`);

        const widthBytes = blockData.readUInt32BE(offset);
        offset += 4;
        console.log(`widthBytes=${widthBytes}`);

        const totalSize = blockData.readUInt32BE(offset);
        offset += 4;
        console.log(`totalSize=${totalSize}`);

        const sizeAfterCompression = blockData.readUInt32BE(offset);
        offset += 4;
        console.log(`sizeAfterCompression=${sizeAfterCompression}`);

        const bitsPerPixel = blockData.readUInt16BE(offset);
        offset += 2;
        console.log(`bitsPerPixel=${bitsPerPixel}`);

        const numberOfPlanes = blockData.readUInt16BE(offset);
        offset += 2;
        console.log(`numberOfPlanes=${numberOfPlanes}`);

        return {
          format: 'jpg',
          data: blockData.slice(offset),
        };
      }
    }
  }

  // if(src instanceof Readable) {
  //   const read = consume(src);
    
  //   // validate signature
  //   let { done, value } = await read(4);
  //   if(value.toString() !== '8BPS') return new Error('invalid file format');
    
  //   // header length: 26Byte, skip it
  //   ({ done, value } = await read(22));

  //   // skip color data
  //   ({ done, value } = await read(4));
  //   const colorDataLength = value.readUInt32BE();
  //   if(colorDataLength !== 0) {
  //     ({ done, value } = await read(colorDataLength));
  //   }

  //   // skip iamgeResourceLength
  //   ({ done, value } = await read(4));
  //   // const imageResourcesLength = value.readUInt32BE(offset);

  //   // read image resource blocks
  //   while(true) {
  //     // validate signature
  //     ({ done, value } = await read(4));
  //     if( value.toString() !== '8BIM') return new Error('invalid file format');

  //     // image resource id
  //     ({ done, value } = await read(2));
  //     const imageResourceId = value.readUInt16BE();

  //     // read name
  //     let name = '';
  //     ({ done, value } = await read(1));
  //     const nameStringLength = value.readUInt8();
  //     if(nameStringLength > 0) {
  //       ({ done, value } = await read(nameStringLength));
  //       name = value.toString();
  //     }
  //     // skip padding
  //     if ((nameStringLength + 1) & 0x01) {
  //       await read((nameStringLength + 1) & 0x01);
  //     }

  //     // read data length
  //     ({ done, value } = await read(4));
  //     const dataLength = value.readUInt32BE();

  //     // read data
  //     ({ done, value } = await read(dataLength));
  //     const blockData = value;

  //     // skip padding
  //     if(dataLength & 0x01 > 0) {
  //       await read(dataLength & 0x01);
  //     }

  //     console.log(JSON.stringify({ imageResourceId, name, dataLength }));
  //     if (imageResourceId === 0x040C) {
  //       console.log('----- thumbnail -----');
  //       let offset = 0;
        
  //       // ({ done, value } = await read(4));
  //       const formatCode = blockData.readUInt32BE(offset);
  //       offset += 4;
  //       console.log(`format=${formatCode}(${formatCode === 1 ? 'kJpegRGB' : 'kRawRGB'})`);

  //       const width = blockData.readUInt32BE(offset);
  //       offset += 4;
  //       console.log(`width=${width}`);

  //       const height = blockData.readUInt32BE(offset);
  //       offset += 4;
  //       console.log(`height=${height}`);

  //       const widthBytes = blockData.readUInt32BE(offset);
  //       offset += 4;
  //       console.log(`widthBytes=${widthBytes}`);

  //       const totalSize = blockData.readUInt32BE(offset);
  //       offset += 4;
  //       console.log(`totalSize=${totalSize}`);

  //       const sizeAfterCompression = blockData.readUInt32BE(offset);
  //       offset += 4;
  //       console.log(`sizeAfterCompression=${sizeAfterCompression}`);

  //       const bitsPerPixel = blockData.readUInt16BE(offset);
  //       offset += 2;
  //       console.log(`bitsPerPixel=${bitsPerPixel}`);

  //       const numberOfPlanes = blockData.readUInt16BE(offset);
  //       offset += 2;
  //       console.log(`numberOfPlanes=${numberOfPlanes}`);

  //       return blockData.slice(offset);
  //     }
  //   }
  // }
};
