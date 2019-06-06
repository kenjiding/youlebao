import ref from 'ref';
import RefArray from 'ref-array';

import { fingerWNApi } from '../../dll/finger-devices';

/**
 * 纹宁指纹仪
 *
 * @export
 * @class FingerPrintWN
 * @extends {fingerPrintApi}
 */
export default class FingerPrintWN {
  /**
   * 设备类型
   *
   * @memberof FingerPrintWN
   */
  _deviceType = 'FingerprintWenN'

  /**
   * 设备操作句柄
   *
   * @memberof FingerPrintWN
   */
  _handle;

  /**
   * 指纹图像宽度
   *
   * @memberof FingerPrintWN
   */
  _imgWidth;

  /**
   * 指纹图像高度
   *
   * @memberof FingerPrintWN
   */
  _imgHeight;

  /**
   * 当前指纹图像索引
   *
   * @memberof FingerPrintWN
   */
  currentImgIndex;

  /**
   * 指纹图像数组
   *
   * @memberof FingerPrintWN
   */
  allSign = [];

  /**
   * 回发消息
   *
   * @memberof FingerPrintWN
   */
  message;

  /**
   * 重复计时器
   *
   * @memberof FingerPrintWN
   */
  interval;

  /**
   * 超时计时器
   *
   * @memberof FingerPrintWN
   */
  timeOut;

  /**
   * 读取指纹中事件
   *
   * @memberof FingerPrintWN
   */
  onReading;

  /**
   * 读取指纹完成事件
   *
   * @memberof FingerPrintWN
   */
  onComplete;

  /**
   *Creates an instance of FingerPrintWN.
   * @memberof FingerPrintWN
   */
  constructor() {
    // super();
    this.fingerPrintApi = fingerWNApi();
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
   * @memberof FingerPrintWN
   */
  get searchDevice() {
    const deviceCount = this.fingerPrintApi.WM_GetDeviceCount();
    console.log(deviceCount, 'FingerPrintWN');
    if (deviceCount) {
      return this.initDevice();
    }
    return false;
  }

  /**
   * 初始化指纹设备
   *
   * @memberof FingerPrintWN
   */
  initDevice() {
    const refHandle = ref.alloc(ref.types.int);// 设备句柄
    const refImgWidth = ref.alloc(ref.types.int);// 指纹图片宽度
    const refImgHeight = ref.alloc(ref.types.int);// 指纹图片高度
    // 初始化指纹设备
    const initState = this.fingerPrintApi.WM_Init();
    const res = this.fingerPrintApi.WM_OpenDevice(0, refHandle);
    // console.log(`initDevice||${initState}||${res}`);
    // 获取指纹图像宽高
    this.fingerPrintApi.WM_GetImageInfo(refImgWidth, refImgHeight);
    if (!initState && !res) {
      this._handle = refHandle.deref();
      // console.log(this._handle, refHandle.deref());
      this._imgWidth = refImgWidth.deref();
      this._imgHeight = refImgHeight.deref();
      return true;
    }
    return false;
  }

  /**
   * 获取指纹注册信息
   *
   * @memberof FingerPrintWN
   */
  get getRegData() {
    this.currentImgIndex = 0;
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
   * @memberof FingerPrintWN
   */
  timer() {
    this.emmitReadingMsg(`请${this.allSign.length ? '再次' : ''}放入手指[${this.allSign.length + 1}/3]`);
    this.interval = setInterval(() => {
      this.waitFingerIn();
    }, 1000);
  }

  waitFingerIn() {
    const data = this.getFingerData();
    if (data) {
      this.allSign.push(data);
      clearInterval(this.interval);
      if (this.allSign.length >= 3) {
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
    // 创建指纹图像字节
    const imgLength = ref.alloc(ref.types.int);// 指纹长度
    const imgByteArray = new RefArray(ref.types.byte, this._imgWidth * this._imgHeight);
    const refImgByte = ref.alloc(imgByteArray);

    const res = this.fingerPrintApi.WM_GetImage(this._handle, 0, refImgByte, imgLength);
    if (res) {
      return null;
    }
    // 获取指纹特征
    const extractdata = new RefArray(ref.types.byte, imgLength.deref());
    const dataLength = ref.alloc(ref.types.int);// 特征长度
    const refExtractdata = ref.alloc(extractdata);

    const extractRes = this.fingerPrintApi.WM_Extract(
      refImgByte,
      this._imgWidth,
      this._imgHeight,
      refExtractdata,
      dataLength,
    );
    if (extractRes) {
      this.emmitReadingMsg('指纹不清晰，请再试一次');
      return null;
    }
    const realData = refExtractdata.slice(0, dataLength.deref() - 1);
    // console.log(realData);
    return realData;
  }

  createTemplate() {
    let resStr = null;
    const templateData = new RefArray(ref.types.byte, 2048);
    const refTemplateData = ref.alloc(templateData);
    const dataLength = ref.alloc(ref.types.int);// 模板长度
    console.log(this.allSign);
    const res = this.fingerPrintApi.WM_GenTemplate(
      this.allSign[0],
      this.allSign[1],
      this.allSign[2],
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
   * @memberof FingerPrintWN
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
   * @memberof FingerPrintWN
   */
  get cancelRegister() {
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    return true;
  }
}
