import ref from 'ref';
import RefArray from 'ref-array';

import { fingerVeinApi } from '../../dll/finger-devices';

/**
 * 纹宁指纹仪
 *
 * @export
 * @class FingerPrintVein
 * @extends {fingerPrintApi}
 */
export default class FingerPrintVein {
  /**
   * 设备类型
   *
   * @memberof FingerPrintVein
   */
  _deviceType = 'FingerVein'

  /**
   * 设备操作句柄
   *
   * @memberof FingerPrintVein
   */
  _handle;

  /**
   * 指纹图像数组
   *
   * @memberof FingerPrintVein
   */
  allSign = [];

  /**
   * 回发消息
   *
   * @memberof FingerPrintVein
   */
  message;

  /**
   * 重复计时器
   *
   * @memberof FingerPrintVein
   */
  interval;

  /**
   * 超时计时器
   *
   * @memberof FingerPrintVein
   */
  timeOut;

  /**
   * 读取指纹中事件
   *
   * @memberof FingerPrintVein
   */
  onReading;

  /**
   * 读取指纹完成事件
   *
   * @memberof FingerPrintVein
   */
  onComplete;

  /**
   *Creates an instance of FingerPrintVein.
   * @memberof FingerPrintVein
   */
  constructor() {
    // super();
    this.fingerPrintApi = fingerVeinApi();
  }

  get deviceType() {
    return this._deviceType;
  }

  get currentMessage() {
    return this.message;
  }

  /**
   * 查找指纹设备,如果找到便初始化
   *
   * @memberof FingerPrintVein
   */
  get searchDevice() {
    return this.initDevice();
  }

  /**
   * 初始化指纹设备
   *
   * @memberof FingerPrintVein
   */
  initDevice() {
    const dataByteArray = new RefArray(ref.types.byte, 32);
    const refDataByte = ref.alloc(dataByteArray);
    // 初始化指纹设备
    const res = this.fingerPrintApi.FVAPI_GetSerialNumber(refDataByte, 0);
    console.log(res, 'FingerPrintVein');
    if (!res) {
      this._handle = refDataByte.toString().trim();
      return true;
    }
    return false;
  }

  /**
   * 初始化指纹设备
   *
   * @memberof FingerPrintVein
   */
  get getRegData() {
    this.allSign = [];
    this.timer();
    this.timeOut = setTimeout(() => {
      clearInterval(this.interval);
      this.emmitReadingMsg('读取超时，请重试！');
      this.onComplete(null);
    }, 30000);// 30秒没走完流程超时关闭
    return true;
  }

  /**
   * 轮询计时器
   *
   * @memberof FingerPrintVein
   */
  timer() {
    this.emmitReadingMsg(`请${this.allSign.length ? '再次' : ''}放入手指[${this.allSign.length + 1}/2]`);
    this.interval = setInterval(() => {
      this.waitFingerIn();
    }, 1000);
  }

  waitFingerIn() {
    // 检查手指放置
    if (this.fingerPrintApi.FVAPI_FingerDetect(0) === 3) {
      clearInterval(this.interval);
      // 读取手指
      const data = this.getFingerData();
      if (data) {
        this.allSign.push(data);
        if (this.allSign.length >= 2) {
          clearTimeout(this.timeOut);
          this.emmitReadingMsg('');
          this.createTemplate();
        } else {
          this.emmitReadingMsg('请拿开手指');
          setTimeout(() => {
            this.timer();
          }, 2000);
        }
      } else {
        this.timer();
      }
    }
  }

  getFingerData() {
    // 创建指纹静脉字节
    const dataByteArray = new RefArray(ref.types.byte, 512);
    const refDataByte = ref.alloc(dataByteArray);

    const res = this.fingerPrintApi.FVAPI_FetchVeinTemplate(refDataByte, 5000);
    if (res) {
      return null;
    }
    // console.log(realData);
    return refDataByte;
  }

  createTemplate() {
    let resStr = null;
    // console.log(this.allSign);
    const res = this.fingerPrintApi.FVAPI_SameFingerCheck(
      this.allSign[0],
      this.allSign[1],
      0x03,
    );
    if (!res) {
      const resData = this.allSign[0];
      // 转换为Base64字符串
      let bString = '';
      resData.forEach((val) => {
        bString += String.fromCharCode(val);
      });
      resStr = btoa(bString);
    }
    // console.log(resData);
    this.onComplete(resStr);
  }

  emmitReadingMsg(val) {
    this.message = val;
    this.onReading && this.onReading();
  }

  /**
   * 读取指纹（读卡）
   *
   * @memberof FingerPrintVein
   */
  get readFinger() {
    let resStr = null;
    const data = this.getFingerData();
    if (data) {
      // 转换为Base64字符串
      let bString = '';
      data.forEach((val) => {
        bString += String.fromCharCode(val);
      });
      resStr = btoa(bString);
    }
    return resStr;
  }

  /**
   * 取消获取模板
   *
   * @memberof FingerPrintVein
   */
  get cancelRegister() {
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    return true;
  }
}
