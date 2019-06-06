// import { Message } from 'element-ui';
import SerialPort from 'serialport';

import AreementParser from './AgreementParser';

// eslint-disable-next-line
const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default class CoinMachine {
  /**
   * 当前使用串口实例
   *
   * @memberof CoinMachine
   */
  usePort;

  /**
   * 串口名称
   *
   * @memberof CoinMachine
   */
  portName;

  /**
   * 机器唯一标识
   *
   * @memberof CoinMachine
   */
  id;

  /**
   * 机器版本号
   *
   * @memberof CoinMachine
   */
  version;

  /**
   * 每币等待时间
   *
   * @memberof CoinMachine
   */
  timePerCoin = 500;

  /**
   * 等待售币机响应的超时时间
   *
   * @memberof CoinMachine
   */
  timeout = 250;

  /**
   * 触发数据接收解析器的字节长度
   *
   * @memberof CoinMachine
   */
  byteLengthOfParser = 4;

  constructor(portName) {
    this.portName = portName;
    this.initSerialPort();
  }

  /**
   * 判断设备端口是否连接
   *
   * @readonly
   * @memberof CoinMachine
   */
  get isMachineLink() {
    return new Promise(async (resolve) => {
      const isOpen = await this.open();
      if (!isOpen) return resolve(false);
      const timer = setTimeout(() => resolve(false), 3000);
      const isUpdateStatus = await this.updateStatus();
      clearTimeout(timer);
      if (!isUpdateStatus) {
        this.close();
        this.lastErrorMsg = '售币机断开连接';
        return resolve(false);
      }
      return resolve(true);
    });
  }

  /**
   * 判断端口 与 设备是否连接
   *
   * @readonly
   * @memberof CoinMachine
   */
  get isPortOpenAndMachineLink() {
    return new Promise(async (resolve) => {
      const isOpen = await this.open();
      if (!isOpen) return resolve(false);
      const isUpdateStatus = await this.updateStatus();
      if (!isUpdateStatus) {
        this.close();
        this.lastErrorMsg = '售币机断开连接';
        return resolve(false);
      }
      return resolve(true);
    });
  }

  initSerialPort() {
    this.usePort = new SerialPort(
      this.portName,
      {
        autoOpen: false,
        baudRate: 19200,
      },
    );
  }

  /**
   * 初始化解析器
   *
   * @param {number} [length=0]
   * @memberof CoinMachine
   */
  initParser(length = 0, callback) {
    if (Number.isNaN(length) || length <= 0) {
      throw new Error('触发数据接收解析器的字节长度必须大于0');
    }

    const { parsers } = SerialPort;
    const parser = this.usePort.pipe(new parsers.ByteLength({ length }));
    parser.on('data', data => callback.call(this, data));
  }

  initAgreementParser(verifyFn, callback) {
    if (typeof verifyFn !== 'function') {
      throw new Error('触发数据接收解析器的校验方法参数类型必须为Function');
    }

    const parser = this.usePort.pipe(new AreementParser({ verifyFn }), { end: false });
    parser.on('data', data => callback.call(this, data));
  }

  /**
   * 打开串口
   *
   * @returns
   * @memberof CoinMachine
   */
  open() {
    return new Promise((resolve) => {
      if (!this.usePort.isOpen) {
        this.usePort.open((err) => {
          if (err) {
            // throw new Error(err);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    });
  }

  /**
   * 关闭串口
   *
   * @memberof CoinMachine
   */
  close() {
    if (this.usePort && this.usePort.isOpen) {
      this.usePort.close();
    }
  }

  /**
   * 验签 —— 处理发送数据
   *
   * @param {Array} data
   */
  static xor(data = []) {
    if (data.length === 0) return 0;
    let xorres = data[0];
    for (let i = 1; i < data.length - 1; i++) {
      xorres ^= data[i];
    }
    return xorres;
  }

  /**
   * 发送数据到串口
   *
   * @param {byte} data
   */
  sendMsg(data) {
    // TODO:  lock
    try {
      this.usePort.write(data);
    } catch (e) {
      console.log(e);
      // TODO: 加错误日志
    }
  }
}
