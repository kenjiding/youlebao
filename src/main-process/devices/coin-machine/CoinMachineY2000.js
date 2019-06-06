import { multiply } from 'lodash';
// import iconv from 'iconv-lite';
import log from '@/utils/log';
import { sleep, arrayBufferToString } from '@/utils/tools';
import AutoResetEvent from './AutoResetEvent';
import CoinMachine from './CoinMachine';
import { MachineStatusEnum, MachineStatusMap } from './MachineStatus';

/**
 * Y2000协议的柜台售币机
 *
 * @export
 * @class CoinMachineY2000
 * @extends {CoinMachine}
 */
export default class CoinMachineY2000 extends CoinMachine {
  /**
   * 刷新状态通知
   *
   * @memberof CoinMachineY2000
   */
  _eventUpdateStatus;

  /**
   * 出币完成通知
   *
   * @memberof CoinMachineY2000
   */
  _eventOutCoin;

  /**
   * 询问ID标识通知
   *
   * @memberof CoinMachineY2000
   */
  _eventGetId;

  /**
   * 判断是否获取ID和版本成功
   *
   * @memberof CoinMachineY2000
   */
  _isGetIdAndVersionSuccess;

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
   * 暂停清币时触发
   *
   * @memberof CoinMachineY2000
   */
  onClearPauseOuted;

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
   * 当前出币数
   *
   * @memberof CoinMachineY2000
   */
  currentOutCoin;

  /**
   * 需要出币数
   *
   * @memberof CoinMachineY2000
   */
  _needOutCoin;

  /**
   * 记录上次状态
   *
   * @memberof CoinMachineY2000
   */
  previousStatus;

  /**
   * 最后错误信息
   *
   * @memberof CoinMachineY2000
   */
  _lastErrorMsg;

  /**
   * 更新设备状态定时器
   *
   * @memberof CoinMachineY2000
   */
  timer;

  /**
   * 出币时 空闲状态 容错总次数
   *
   * @memberof CoinMachineY2000
   */
  _outCoinFaultToleranceNum = 10;

  /**
   * 当前 空闲状态 次数
   *
   * @memberof CoinMachineY2000
   */
  _currentFaultToleranceNum = 0;

  /**
   *发送队列
   *
   * @memberof CoinMachineY2000
   */
  _sendQueue = [];

  /**
   * 是否已暂停
   *
   * @memberof CoinMachineY2000
   */
  hasPaused = false;

  /**
   * 当前状态
   *
   * @memberof CoinMachineY2000
   */
  _currentStatus = MachineStatusEnum.unknow;

  /**
   * 判断更新是否成功的标识
   *
   * @memberof CoinMachineY2000
   */
  _isUpdateStatusSuccess = false;

  /**
   *是否正在循环执行发送队列
   *
   * @memberof CoinMachineY2000
   */
  _isExecutingQueue = false;

  /**
   *Creates an instance of CoinMachineY2000.
   * @param {*} portName 串口地址
   * @memberof CoinMachineY2000
   */
  constructor(portName) {
    super(portName);
    this._eventOutCoin = new AutoResetEvent();
    this._eventUpdateStatus = new AutoResetEvent();
    this._eventGetId = new AutoResetEvent();

    // this.usePort.resume();
    // this.usePort.on('data', (chunk) => {
    //   this.onDataReceived.call(this, chunk);
    // });

    // this.initParser(8, this.onDataReceived);

    this.initAgreementParser(CoinMachineY2000.verifyArgeement, this.onDataReceived);
  }

  /**
   * 当前设备状态-get
   *
   * @memberof CoinMachineY2000
   */
  get currentStatus() {
    return this._currentStatus;
  }

  /**
   * 当前设备状态-set
   *
   * @memberof CoinMachineY2000
   */
  set currentStatus(val) {
    if (this._currentStatus !== val) {
      this.previousStatus = this.currentStatus;
      this._currentStatus = val;
    }
  }

  // get popSendQueue() {
  //   return this._sendQueue.pop() || null;
  // }

  /**
   * 轮询定时器
   *
   * @memberof CoinMachineY2000
   */
  set timerEnabled(val) {
    if (val) {
      if (!this.timer) {
        // 先执行一次，因setInterval会在500ms后才开始
        // this.timerElapsed.call(this);
        this.timer = setInterval(() => this.timerElapsed.call(this), 500);
      }
    } else if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  set lastErrorMsg(val) {
    this._lastErrorMsg = val;
    if (val) {
      console.log('发生错误', val);
      this.onError && this.onError(val, this.currentStatus);
    }
  }

  get lastErrorMsg() {
    return this._lastErrorMsg;
  }

  popSendQueue() {
    return this._sendQueue.pop() || null;
  }

  /**
   *添加到发送消息队列
   *
   * @param {*} val
   * @memberof CoinMachineY2000
   */
  pushSendQueue(val) {
    if (val) {
      this._sendQueue.push(val);
      if (!this._isExecutingQueue) {
        this.executeSendMsg();
      }
    }
  }

  /**
   * 轮询设备状态执行体
   *
   * @memberof CoinMachineY2000
   */
  async timerElapsed() {
    this.pushSendQueue([0x22]);
  }

  get lastOutCoin() {
    return this.currentOutCoin;
  }

  /**
   * 处理发送数据
   *
   * @static
   * @param {array} [data=[]] 数据
   * @returns
   * @memberof CoinMachineY2000
   */
  static _packageDataHandler(data = []) {
    const buf = new Uint8Array(8);
    buf[0] = 0xfc;
    for (let i = 0; i < 6; i++) {
      buf[i + 1] = data[i];
    }
    buf[7] = CoinMachine.xor(buf);
    return buf;
  }

  /**
   * 校验通讯协议
   * @param {Buffer} buf
   */
  static verifyArgeement(buf) {
    return CoinMachine.xor(buf) === buf[buf.length - 1];
  }

  /**
   *发送信息到串口
   *
   * @memberof CoinMachineY2000
   */
  async executeSendMsg(msg) {
    const data = msg || this.popSendQueue();
    // 待发送队列数据为空，直接中断
    if (!data) {
      this._isExecutingQueue = false;
      return;
    }
    this._isExecutingQueue = true;
    const sendData = CoinMachineY2000._packageDataHandler(data);
    if (this.usePort.isOpen) {
      this.usePortWrite(sendData);
    } else {
      if (!this.usePort) {
        this.initSerialPort();
      }

      const isOpen = await this.open();
      if (isOpen) {
        this.usePortWrite(sendData);
      } else {
        await sleep(80);
        this.executeSendMsg();
      }
    }
  }

  usePortWrite(sendData) {
    const typeMap = {
      17: '亮控制',
      18: '闪烁控制',
      33: '开始出币',
      34: '询问状态',
      35: '暂停出币',
      36: '继续出币',
      49: '清币',
      50: '暂停清币',
      51: '继续清币',
      147: '重置',
      146: '币杯状态检查',
      149: '币杯模式',
      150: '唯一ID',
    };
    this.usePort.write(sendData, async () => {
      log.capsule('发送指令', typeMap[sendData[1]]);
      log.capsule(`发送数据，长度${sendData.length}`, sendData);
      this.usePort.drain(async () => {
        log.success('>>>>>>> 发送完毕 >>>>>>>>');
        await sleep(80);
        this.executeSendMsg();
      });
    });
  }

  /**
   *重启设备
   *
   * @returns Boolean
   * @memberof CoinMachineY2000
   */
  async reset(isIgnore = false) {
    // 初始化 空闲状态累加次数
    this._currentFaultToleranceNum = 0;

    this.pushSendQueue([0x93]);
    await this._eventUpdateStatus.waitOnce(this.timeout);
    if (await this.updateStatus()) {
      if (this.currentStatus === MachineStatusEnum.idle) {
        return true;
      } else if (await this.updateStatus()) {
        if (this.currentStatus === MachineStatusEnum.idle) {
          return true;
        }
      }
    }

    isIgnore || (this.lastErrorMsg = '重启售币机失败');
    return false;
  }

  /**
   *接收数据
   *
   * @param {*} buf
   * @returns
   * @memberof CoinMachineY2000
   */
  async onDataReceived(buf) {
    log.capsule(`串口返回数据，长度${buf.length}`, arrayBufferToString(buf), 'success');
    await sleep(6);
    if (buf.length < 8) return false;

    if (CoinMachine.xor(buf) !== buf[buf.length - 1]) {
      log.capsule('收到数据但校验未通过', buf, 'error');
      return false;
    }

    switch (buf[1]) {
      // 回应唯一ID查询
      case 0x69:
        this.receivedOfUniqueId(buf);
        break;
      // 回应状态询问
      case 0xB1:
        this.receivedOfStatusQuery(buf);
        break;

      default:
        break;
    }

    return true;
  }

  /**
   *更新设备状态
   *
   * @returns
   * @memberof CoinMachineY2000
   */
  async updateStatus() {
    let i = 0;
    while (i < 2) {
      this._isUpdateStatusSuccess = false;
      this.pushSendQueue([0x22]);
      this._eventUpdateStatus.reset();
      await this._eventUpdateStatus.waitOnce(this.timeout);
      this._eventUpdateStatus.reset();
      if (this._isUpdateStatusSuccess) {
        return true;
      }

      i++;
      await sleep(100);
    }

    return false;
  }

  /**
   *出币
   *
   * @async
   * @param {number} [coinNumber=0] 出币数量
   * @memberof CoinMachineY2000
   */
  async outCoin(coinNumber = 0) {
    if (coinNumber <= 0) return false;
    this.lastErrorMsg = null;
    this._needOutCoin = coinNumber;
    if (!(await this.reset())) return false;
    // 确认设备重启后，是否为空闲状态
    if (this.currentStatus !== MachineStatusEnum.idle) {
      if (!(await this.reset())) return false;
    }

    const sendData = [
      0x21,
      (coinNumber >> 24) & 0xFF,
      (coinNumber >> 16) & 0xFF,
      (coinNumber >> 8) & 0xFF,
      (coinNumber >> 0) & 0xFF,
    ];

    this.currentStatus = MachineStatusEnum.coinOuting;
    let needTime = multiply(coinNumber, this.timePerCoin);
    needTime = needTime > 10000 ? needTime : 10000;

    this.currentOutCoin = 0;
    this.pushSendQueue(sendData);

    this.timerEnabled = true;
    this.hasPaused = false;

    this._eventOutCoin.reset();
    await this._eventOutCoin.waitOnce(needTime);
    this._eventOutCoin.reset();

    if (this.currentOutCoin < coinNumber) {
      log.capsule('当前状态', MachineStatusMap[this.currentStatus]);
      while (this.hasPaused) {
        while (this.currentStatus === MachineStatusEnum.coinOutPause) {
          await sleep(100);
          log.capsule('当前状态', MachineStatusMap[this.currentStatus]);
          log.capsule('当前出币数', this.currentOutCoin);
        }

        this.hasPaused = false;
        await this._eventOutCoin.waitOnce(needTime);
        this._eventOutCoin.reset();

        if (this.currentOutCoin >= coinNumber) break;
      }

      await this.updateStatus();
    }
    log.capsule('当前状态', MachineStatusMap[this.currentStatus]);
    if (this.currentStatus === MachineStatusEnum.coinOuted || this.currentOutCoin === coinNumber) {
      this.onOutCoinCompleted && this.onOutCoinCompleted(this.currentOutCoin);
    }

    // 出币超时
    if (this.currentStatus === MachineStatusEnum.coinOuting && this.currentOutCoin < coinNumber) {
      this.handleTimeout();
    }
    // await sleep(1000);
    this.currentOutCoin = 0;
    this.timerEnabled = false;

    return true;
  }

  /**
   *暂停出币
   *
   * @returns
   * @memberof CoinMachineY2000
   */
  async pauseOutCoin() {
    if (!(await this.updateStatus())) {
      return false;
    }

    this.hasPaused = true;
    this.lastErrorMsg = null;

    this.pushSendQueue([0x23]);
    this.updateStatus();

    return true;
  }

  /**
   *继续出币
   *
   * @returns
   * @memberof CoinMachineY2000
   */
  async continueOutCoin() {
    log.success('继续出币');
    if (!(await this.updateStatus())) {
      return false;
    }

    this.lastErrorMsg = null;
    this.pushSendQueue([0x24]);
    this.updateStatus();

    return true;
  }

  /**
   *清币
   *
   * @async
   * @returns
   * @memberof CoinMachineY2000
   */
  async clearCoin() {
    this.lastErrorMsg = null;
    if (await !this.isMachineLink) return false;

    if (
      (this.currentStatus !== MachineStatusEnum.idle)
      && (this.currentStatus !== MachineStatusEnum.coinCleared)
    ) {
      if (!(await this.reset())) return false;
    }

    const sendData = [0x31];
    this.timerEnabled = false;
    this.pushSendQueue(sendData);
    this.timerEnabled = true;

    this.currentStatus = MachineStatusEnum.coinClearing;

    return true;
  }

  /**
   *暂停清币
   *
   * @async
   * @returns
   * @memberof CoinMachineY2000
   */
  async pauseClearCoin() {
    if (!(await this.updateStatus())) {
      return false;
    }

    if (this.currentStatus === MachineStatusEnum.coinClearing) {
      this.lastErrorMsg = null;
      this.pushSendQueue([0x32]);
    } else {
      this.lastErrorMsg = '当前状态不允许暂停清币';
    }

    return true;
  }

  /**
   *继续清币
   *
   * @returns
   * @memberof CoinMachineY2000
   */
  async continueClearCoin() {
    if (!(await this.updateStatus())) {
      return false;
    }

    if (this.currentStatus === MachineStatusEnum.coinClearPause) {
      this.lastErrorMsg = null;
      this.timerEnabled = false;
      this.pushSendQueue([0x33]);
      this.timerEnabled = true;
      this.currentStatus = this.previousStatus;
    }

    return true;
  }

  /**
   *询问售币机唯一标识
   *
   * @memberof CoinMachineY2000
   */
  async getIdAndVersion() {
    this.id = null;
    let i = 0;
    while (i < 2) {
      this._isGetIdAndVersionSuccess = false;
      this.pushSendQueue([0x96]);

      this._eventGetId.reset();
      await this._eventGetId.waitOnce(200);
      this._eventGetId.reset();

      if (this._isGetIdAndVersionSuccess) {
        return this.id;
      }

      i++;
      await sleep(100);
    }

    return null;
  }

  /**
   *设置币杯模式
   *
   * @async
   * @param {boolean} [isSetCupModel=true]
   * @memberof CoinMachineY2000
   */
  async setCoinCupModel(isSetCupModel = true) {
    const sendData = [
      0x95,
      isSetCupModel ? 0x00 : 0x01,
    ];

    this.pushSendQueue(sendData);
    await sleep(20);
  }

  /**
   * 回应唯一ID查询
   *
   * @param {Array} buf
   * @returns
   * @memberof CoinMachineY2000
   */
  receivedOfUniqueId(buf) {
    if (buf[2].length < 12) return;
    this.id = CoinMachineY2000.byteToString(buf.slice(3, 15));

    this.version = (buf[15] << 8 | buf[16]).toString();
    this._isGetIdAndVersionSuccess = true;
    this._eventGetId.set();
  }

  /**
   * 状态查询
   *
   * @param {array} buf
   * @memberof CoinMachineY2000
   */
  receivedOfStatusQuery(buf) {
    this._isUpdateStatusSuccess = true;
    this._eventUpdateStatus.set();
    const outamount = (buf[2] << 24) + (buf[3] << 16) + (buf[4] << 8) + buf[5];
    this.currentOutCoin = outamount;
    log.capsule('设备返回，当前出币', outamount, 'success');
    const map = {
      1: this.handleCoinOuting,
      2: this.handleOutCoinPause,
      3: this.handleOutCoinCompleted,
      4: this.handleMachineIdle,
      5: this.handleCoinClearing,
      6: this.handleCoinClearPause,
      7: this.handleCoinCleared,
      8: this.handleTimeout,
    };
    const type = buf[6] & 0x0f;
    const fn = map[type];
    const statusMap = {
      1: '出币中',
      2: '出币暂停',
      3: '出币完成',
      4: '空闲',
      5: '清币中',
      6: '清币暂停',
      7: '清币完成',
      8: '超时',
    };
    log.capsule('设备返回,状态', statusMap[type], 'success');
    fn && fn.call(this, outamount);
  }

  /**
   * 1:正在出币中
   *
   * @param {number} amount 当前出币数
   * @memberof CoinMachineY2000
   */
  handleCoinOuting(amount = 0) {
    this.currentStatus = MachineStatusEnum.coinOuting;
    log.capsule('正在出币', amount);
    if (this.onOutCoin) {
      this.onOutCoin(amount);
    }
  }

  /**
   * 2:暂停出币
   *
   * @param {number} [amount=0] 当前出币数
   * @memberof CoinMachineY2000
   */
  handleOutCoinPause(amount = 0) {
    this.currentStatus = MachineStatusEnum.coinOutPause;
    if (this.onPauseOuted) {
      log.capsule('暂停出币', amount);
      this.onPauseOuted(amount);
    }
    this.hasPaused = true;
  }

  /**
   * 3:出币完成
   *
   * @param {number} [amount=0] 当前出币数
   * @memberof CoinMachineY2000
   */
  handleOutCoinCompleted(amount = 0) {
    this.currentStatus = MachineStatusEnum.coinOuted;
    log.capsule('出币完成', amount);
    if (this.onOutCoinCompleted) {
      this.onOutCoinCompleted(amount);
    }
    this.timerEnabled = false;
    this._eventOutCoin.set();
  }

  /**
   * 4:售币机空闲状态
   *
   * @memberof CoinMachineY2000
   */
  handleMachineIdle(amount) {
    // 处理状态 从“出币中” 到 “空闲”的异常情况
    if (this.currentStatus === MachineStatusEnum.coinOuting) {
      // 当实出币数 = 应出币数，等于出币已完成
      if (this._needOutCoin === this.currentOutCoin) {
        this.handleOutCoinCompleted(amount);
      } else {
        // 否则是异常，
        if (this._currentFaultToleranceNum < this._outCoinFaultToleranceNum) {
          this._currentFaultToleranceNum++;
          return;
        }
        this._currentFaultToleranceNum = 0;
        this.handleTimeout();
        return;
      }
    }
    this.currentStatus = MachineStatusEnum.idle;
  }

  /**
   * 5:正在清币
   *
   * @param {number} [amount=0] 出币数量
   * @memberof CoinMachineY2000
   */
  handleCoinClearing(amount = 0) {
    this.currentStatus = MachineStatusEnum.coinClearing;

    if (!this.timer) {
      this.timerEnabled = true;
    }

    if (this.onClearCoin) {
      this.onClearCoin(amount);
    }
  }

  /**
   * 6:暂停清币
   *
   * @param {number} [amount=0] 出币数量
   * @memberof CoinMachineY2000
   */
  handleCoinClearPause(amount = 0) {
    this.currentStatus = MachineStatusEnum.coinClearPause;
    if (this.onClearPauseOuted) {
      this.onClearPauseOuted(amount);
    }
    this.hasPaused = true;
  }

  /**
   * 7:清币完成
   *
   * @param {number} [amount=0] 出币数量
   * @memberof CoinMachineY2000
   */
  handleCoinCleared(amount = 0) {
    this.currentStatus = MachineStatusEnum.coinCleared;
    if (this.onClearCoinCompleted) {
      this.onClearCoinCompleted(amount);
    }
    this.timerEnabled = false;
    this.reset(true);
  }

  /**
   * 8:出币超时
   *
   * @memberof CoinMachineY2000
   */
  handleTimeout(amount = 0) {
    if (this.currentOutCoin === this._needOutCoin) {
      this.handleOutCoinCompleted(amount);
      return;
    }
    this.currentStatus = MachineStatusEnum.timeOut;
    if (this.onError) {
      this.onError('设备超时', this.currentStatus);
    }
    this.timerEnabled = false;
  }

  /**
   * byte[] 16进制 转 字符串
   *
   * @static
   * @param {Array} [arr=[]]
   * @returns
   * @memberof CoinMachineY2000
   */
  static byteToString(arr = []) {
    if (typeof arr === 'string') {
      return arr;
    }
    let val = '';
    for (let i = 0; i < arr.length; i++) {
      val += arr[i].toString(16);
    }
    return val;
  }
}
