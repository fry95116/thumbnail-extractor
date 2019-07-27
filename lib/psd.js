const { Readable } = require('stream');
const consume = require('stream-consume-promise');

module.exports = async function (src) {

  if(src instanceof Readable) {
    const read = consume(src);
    
    // validate signature
    let { done, value } = await read(4);
    if(value.toString() !== '8BPS') return new Error('invalid file format');
    
    // header length: 26Byte, skip it
    ({ done, value } = await read(22));

    // skip color data
    ({ done, value } = await read(4));
    const colorDataLength = value.readUInt32BE();
    if(colorDataLength !== 0) {
      ({ done, value } = await read(colorDataLength));
    }

    // skip iamgeResourceLength
    ({ done, value } = await read(4));
    // const imageResourcesLength = value.readUInt32BE(offset);

    // read image resource blocks
    while(true) {
      // validate signature
      ({ done, value } = await read(4));
      if( value.toString() !== '8BIM') return new Error('invalid file format');

      // image resource id
      ({ done, value } = await read(2));
      const imageResourceId = value.readUInt16BE();

      // read name
      let name = ''
      ({ done, value } = await read(1));
      const nameStringLength = value.readUInt8();
      if(nameStringLength > 0) {
        ({ done, value } = await read(nameStringLength));
        name = value.toString();
      }
      ({ done, value } = await read((nameStringLength + 1) & 0x01));

      // read data length
      ({ done, value } = await read(4));
      const dataLength = value.readUInt32BE();

      // read data
      ({ done, value } = await read(dataLength));

      console.log(JSON.stringify({ imageResourceId, name, dataLength }));
      // if (imageResourceId === 0x040C) {

      // }
      
    }


    
  //   const colorDataLength = src.readUInt32BE(offset);
  //   offset += 4 + colorDataLength

  //   const imageResourcesLength = src.readUInt32BE(offset);
  //   const end = imageResourcesLength + offset + 4;
  //   offset += 4

  //   // read Image Resource Blocks
  //   while(offset <= end) {
  //     // validate signature
  //     if(src.toString('utf-8', offset, offset + 4) !== '8BIM') throw new Error('invalid image resource block');  
  //     offset += 4;
  //     const imageResourceId = src.readUInt16BE(offset, offset + 2);
  //     offset += 2;
      
  //     let name = ''
  //     const nameStringLength = src.readUInt8(offset);
  //     offset += 1
  //     // nameStringLength += nameStringLength & 0x01;
  //     if(nameStringLength > 0) {
  //       name = src.toString('utf-8', offset, offset + nameStringLength);
  //     }
  //     offset += nameStringLength + ((nameStringLength + 1) & 0x01); // add padding
      
  //     const dataLength = src.readUInt32BE(offset);
  //     offset += 4;
  //     const data = src.slice(offset, offset + dataLength);
  //     offset += dataLength + (dataLength & 0x01);

  //     console.log(JSON.stringify({ imageResourceId, name, dataLength }));
  //     // if (imageResourceId === 0x040C) {

  //     // }

  }
  // if (src instanceof Buffer) {
  //   // 按
  //   let offset = 0; // 指向当前处理的字节
  //   const megicNumber = src.toString('utf-8', 0, 4);
  //   if(megicNumber !== '8BPS') return new Error('invalid file format');
  //   // header length: 26Byte;
  //   offset = 26;
  //   const colorDataLength = src.readUInt32BE(offset);
  //   offset += 4 + colorDataLength

  //   const imageResourcesLength = src.readUInt32BE(offset);
  //   const end = imageResourcesLength + offset + 4;
  //   offset += 4

  //   // read Image Resource Blocks
  //   while(offset <= end) {
  //     // validate signature
  //     if(src.toString('utf-8', offset, offset + 4) !== '8BIM') throw new Error('invalid image resource block');  
  //     offset += 4;
  //     const imageResourceId = src.readUInt16BE(offset, offset + 2);
  //     offset += 2;
      
  //     let name = ''
  //     const nameStringLength = src.readUInt8(offset);
  //     offset += 1
  //     // nameStringLength += nameStringLength & 0x01;
  //     if(nameStringLength > 0) {
  //       name = src.toString('utf-8', offset, offset + nameStringLength);
  //     }
  //     offset += nameStringLength + ((nameStringLength + 1) & 0x01); // add padding
      
  //     const dataLength = src.readUInt32BE(offset);
  //     offset += 4;
  //     const data = src.slice(offset, offset + dataLength);
  //     offset += dataLength + (dataLength & 0x01);

  //     console.log(JSON.stringify({ imageResourceId, name, dataLength }));
  //     // if (imageResourceId === 0x040C) {

  //     // }
  //   }
  // } else throw new Error('source must be Buffer or ReadableStream');
};
