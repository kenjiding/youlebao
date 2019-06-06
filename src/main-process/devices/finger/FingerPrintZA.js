import ref from 'ref';
import RefArray from 'ref-array';

import { fingerZAApi } from '../../dll/finger-devices';

/**
 * 纹宁指纹仪
 *
 * @export
 * @class FingerPrintZA
 * @extends {fingerPrintApi}
 */
export default class FingerPrintZA {
  /**
   * 设备类型
   *
   * @memberof FingerPrintZA
   */
  _deviceType = 'FingerprintZhiAng'

  /**
   * 设备操作句柄
   *
   * @memberof FingerPrintZA
   */
  _handle;

  /**
   * 当前指纹图像索引
   *
   * @memberof FingerPrintZA
   */
  currentImgIndex;

  /**
   * 当前指纹图像索引
   *
   * @memberof FingerPrintZA
   */
  deviceAddr;

  /**
   * 回发消息
   *
   * @memberof FingerPrintZA
   */
  message;

  /**
   * 重复计时器
   *
   * @memberof FingerPrintZA
   */
  interval;

  /**
   * 超时计时器
   *
   * @memberof FingerPrintZA
   */
  timeOut;

  /**
   * 读取指纹中事件
   *
   * @memberof FingerPrintZA
   */
  onReading;

  /**
   * 读取指纹完成事件
   *
   * @memberof FingerPrintZA
   */
  onComplete;

  /**
   *Creates an instance of FingerPrintZA.
   * @memberof FingerPrintZA
   */
  constructor() {
    // super();
    this.fingerPrintApi = fingerZAApi();
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
   * @memberof FingerPrintZA
   */
  get searchDevice() {
    return this.initDevice();
  }

  /**
   * 初始化指纹设备
   *
   * @memberof FingerPrintZA
   */
  initDevice() {
    const refHandle = ref.alloc(ref.types.int);// 设备句柄
    // 初始化指纹设备
    const res = this.fingerPrintApi.ZAZOpenDeviceEx(refHandle, 2, 0, 0, 2, 0);
    console.log(res || 1, 'FingerPrintZA');
    if (!res) {
      this._handle = refHandle.deref();
      // console.log(this._handle, refHandle.deref());
      return true;
    }
    return false;
  }

  /**
   * 获取指纹注册信息
   *
   * @memberof FingerPrintZA
   */
  get getRegData() {
    this.currentImgIndex = 1;
    this.deviceAddr = 0xffffffff;
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
   * @memberof FingerPrintZA
   */
  timer() {
    this.emmitReadingMsg(`请${this.currentImgIndex > 1 ? '再次' : ''}放入手指[${this.currentImgIndex}/2]`);
    this.interval = setInterval(() => {
      this.waitFingerIn();
    }, 1000);
  }

  waitFingerIn() {
    const res = this.getFingerData();
    if (res) {
      this.currentImgIndex++;
      clearInterval(this.interval);
      if (this.currentImgIndex > 2) {
        clearTimeout(this.timeOut);
        this.emmitReadingMsg('');
        this.createTemplate();
      } else {
        this.emmitReadingMsg('请拿开手指');
        setTimeout(() => {
          this.timer();
        }, 2000);
      }
    }
  }

  getFingerData() {
    const res = this.fingerPrintApi.ZAZGetImage(this._handle, this.deviceAddr);
    if (res) {
      return false;
    }
    // 获取指纹特征
    const extractRes = this.fingerPrintApi.ZAZGenChar(
      this._handle,
      this.deviceAddr,
      this.currentImgIndex,
    );
    if (extractRes) {
      this.emmitReadingMsg('指纹不清晰，请再试一次');
      return false;
    }
    return true;
  }

  createTemplate() {
    let resStr = null;
    const templateData = new RefArray(ref.types.byte, 512);
    const refTemplateData = ref.alloc(templateData);
    const dataLength = ref.alloc(ref.types.int);// 模板长度

    const resReg = this.fingerPrintApi.ZAZRegModule(this._handle, this.deviceAddr);
    // console.log(resReg);
    if (resReg) {
      this.onComplete(null);
      return;
    }

    const res = this.fingerPrintApi.ZAZUpChar(
      this._handle,
      this.deviceAddr,
      2,
      refTemplateData,
      dataLength,
    );
    if (!res) {
      const resData = refTemplateData.slice(0, dataLength.deref() - 1);

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
   * @memberof FingerPrintZA
   */
  get readFinger() {
    let resStr = null;
    const templateData = new RefArray(ref.types.byte, 512);
    const refTemplateData = ref.alloc(templateData);
    const dataLength = ref.alloc(ref.types.int);// 模板长度

    const data = this.getFingerData();
    if (data) {
      const res = this.fingerPrintApi.ZAZUpChar(
        this._handle,
        this.deviceAddr,
        1,
        refTemplateData,
        dataLength,
      );
      if (!res) {
        const resData = refTemplateData.slice(0, dataLength.deref() - 1);

        // 转换为Base64字符串
        let bString = '';
        resData.forEach((val) => {
          bString += String.fromCharCode(val);
        });
        resStr = btoa(bString);
      }
    }
    return resStr;
  }

  /**
   * 取消获取模板
   *
   * @memberof FingerPrintZA
   */
  get cancelRegister() {
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    return true;
  }
}
