import { divide, multiply } from 'lodash';
import log from '@/utils/log';
import AutoResetEvent from './AutoResetEvent';
import CoinMachine from './CoinMachine';
import { MachineStatusEnum as ENUM_MACHINE_STATUS } from './MachineStatus';

export default class CoinMachineE5000 extends CoinMachine {
  /**
   * 最后错误信息
   *
   * @memberof CoinMachineE5000
   */
  lastErrorMsg;

  /**
   * 实际出币数
   *
   * @memberof CoinMachineE5000
   */
  outedCoinAmount;


  /**
   * 出币过程触发
   *
   * @memberof CoinMachineE5000
   */
  onOutCoin;


  /**
   * 暂停时触发
   *
   * @memberof CoinMachineE5000
   */
  onPauseOuted;


  /**
   * 清币过程触发
   *
   * @memberof CoinMachineE5000
   */
  onClearCoin;


  /**
   * 清币完成时触发
   *
   * @memberof CoinMachineE5000
   */
  onClearCoinCompleted;


  /**
   * 出币完成时触发
   *
   * @memberof CoinMachineE5000
   */
  onOutCoinCompleted;


  /**
   * 错误触发
   *
   * @memberof CoinMachineE5000
   */
  onError;

  /**
   * 出币事件
   *
   * @memberof CoinMachineE5000
   */
  _eventOutCoin;

  /**
   * 设备状态更新事件
   *
   * @memberof CoinMachineE5000
   */
  _eventUpdateStatus;

  /**
   * 已出币数
   *
   * @memberof CoinMachine
   */
  outedCoinAmount;

  /**
   * 设备状态更新
   *
   * @memberof CoinMachineE5000
   */
  _isUpdateStatusSuccess = false;

  /**
   * 是否清币
   *
   * @memberof CoinMachineE5000
   */
  isClearing = false;

  /**
   * 是否暂停清币
   *
   * @memberof CoinMachineE5000
   */
  isClearingPause = false;

  /**
   * 每币等待时间
   *
   * @memberof CoinMachineE5000
   */
  timePerCoin = 500;

  /**
   * 设备当前状态
   *
   * @memberof CoinMachineE5000
   */
  currentStatus = ENUM_MACHINE_STATUS.idle;

  /**
   *Creates an instance of CoinMachineE5000.
   * @param {string} portName 串口地址
   * @memberof CoinMachineE5000
   */
  constructor(portName) {
    super(portName);
    this._eventUpdateStatus = new AutoResetEvent();
    this._eventOutCoin = new AutoResetEvent();

    this.initParser(4);
  }

  /**
   * 出币
   *
   * @param {Number} coinNumber 数量
   * @returns Boolean
   * @memberof CoinMachineE5000
   */
  async outCoin(coinNumber) {
    this.lastErrorMsg = null;
    if (await !this.isMachineLink) return false;
    this.isClearing = false;
    const data = [
      divide(coinNumber, 256),
      coinNumber % 256,
    ];
    const buf = CoinMachineE5000._packageDataHandler(data);
    log.capsule('出币数：', coinNumber);

    const needTime = multiply(coinNumber, this.timePerCoin);
    log.capsule('需要等待出币时间：', needTime);
    this._eventOutCoin.reset();

    this.currentStatus = ENUM_MACHINE_STATUS.coinOuting;
    this.sendMsg(buf);
    log.capsule('已发送指令等待中...', null, 'warn');
    await this._eventOutCoin.waitOnce(needTime);
    this.currentStatus = ENUM_MACHINE_STATUS.coinouted;
    log.capsule('实际出币：', this.outedCoinAmount, 'success');
    // TODO: 触发出币完成事件
    this.outedCoinAmount = 0;
    return true;
  }

  /**
   * 清币
   *
   * @returns
   * @memberof CoinMachineE5000
   */
  clearCoin() {
    this.lastErrorMsg = null;
    const n = 60000;
    const sendData = [
      divide(n / 256),
      n % 256,
    ];
    this.isClearing = true;
    this.isClearingPause = false;
    this.currentStatus = ENUM_MACHINE_STATUS.coinClearing;

    this.sendMsg(sendData);
    return true;
  }

  /**
   * 暂停清币
   *
   * @memberof CoinMachineE5000
   */
  pauseClearCoin() {
    const n = 65534;
    const sendData = [
      divide(n / 256),
      n % 256,
    ];

    this.isClearingPause = true;
    this.currentStatus = ENUM_MACHINE_STATUS.coinClearPause;
    this.sendMsg(sendData);
  }

  /**
   * 继续清币
   *
   * @memberof CoinMachineE5000
   */
  continueClearCoin() {
    const n = 65535;
    const sendData = [
      divide(n / 256),
      n % 256,
    ];

    this.isClearingPause = false;
    this.currentStatus = ENUM_MACHINE_STATUS.coinClearing;
    this.sendMsg(sendData);
  }

  /**
   * 处理发送的数据
   * @param {Array} data 需要返送的数据
   */
  static _packageDataHandler(data = []) {
    const buf = new Uint8Array(4);
    buf[0] = 0xaa;

    for (let i = 0; i < 2; i++) {
      buf[i + 1] = data[i];
    }
    buf[3] = CoinMachine.xor(buf);
    return buf;
  }

  /**
   * 数据接收
   * @param {Array} data
   */
  onDataReceived(buf) {
    console.log(buf);

    if (buf.length < 4) {
      return false;
    }

    // 已出币数
    let outed = -1;
    const xor = buf[0] ^ buf[1] ^ buf[2];
    if (buf[0] !== 0xaa || xor !== buf[3]) {
      log.capsule('收到数据但校验未通过', null, 'error');
      return false;
    }

    outed = multiply(buf[1], 255) + buf[2];
    log.capsule('收到数据:', outed, 'success');
    if (outed !== 65534 && outed !== 65535) {
      this.outedCoinAmount = outed;
    }

    this._isUpdateStatusSuccess = true;
    this._eventOutCoin.set();
    this._eventUpdateStatus.set();

    if (this.isClearing) {
      if (this.outedCoinAmount === 0) return false;
      if (this.isClearingPause) {
        if (this.onClearCoin) {
          this.onClearCoin(this.outedCoinAmount);
        }
      } else if (this.onClearCoinCompleted) {
        this.onClearCoinCompleted(this.outedCoinAmount);
      }
    }

    return true;
  }


  /**
   * 更新设备状态
   *
   * @returns
   * @memberof CoinMachineE5000
   */
  async updateStatus() {
    let i = 0;

    while (i < 3) {
      this._isUpdateStatusSuccess = false;
      const buf = CoinMachineE5000._packageDataHandler([0x00, 0x00]);
      this.sendMsg(buf);

      this._eventUpdateStatus.reset();
      // eslint-disable-next-line
      await this._eventUpdateStatus.waitOnce(200);
      if (this._isUpdateStatusSuccess) {
        return true;
      }
      i++;
    }

    return false;
  }
}
