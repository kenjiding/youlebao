import { Transform } from 'stream';
import log from '@/utils/log';
import { arrayBufferToString } from '@/utils/tools';

export default class AgreementParser extends Transform {
  buffer = Buffer.alloc(0);
  verifyFn;

  constructor(options = {}) {
    super(options);

    if (typeof options.verifyFn !== 'function') {
      throw new Error('verifyFn必须为Function');
    }

    this.verifyFn = options.verifyFn;
  }

  _transform(chunk, encoding, cb) {
    let data = Buffer.concat([this.buffer, chunk]);
    log.capsule('当前接收数据', arrayBufferToString(chunk), 'warning');
    log.capsule('组装后数据', arrayBufferToString(data), 'success');
    const dataLength = data.length;
    if (this.verifyFn(data) && dataLength >= 8) {
      log.success('>>>>>>> 组装完成，并通过校验 >>>>>>>>');
      const pushData = data.slice(0, dataLength);
      data = data.slice(dataLength);
      cb(null, pushData);
      this.buffer = Buffer.alloc(0);
      return;
    }
    log.warning('>>>>>>> 数据不完整，等待下条数据 >>>>>>>>');

    this.buffer = data;
    cb(null);
  }

  _flush(cb) {
    this.push(this.buffer);
    this.buffer = Buffer.alloc(0);
    cb(null);
  }
}
