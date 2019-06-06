

import FingerPrintWN from './FingerPrintWN';
import FingerPrintWN06 from './FingerPrintWN06';
import FingerPrintZA from './FingerPrintZA';
import FingerPrintVein from './FingerPrintVein';

class FingerPrintFactory {
  static getInstance(type = null) {
    let instance;
    switch (type) {
      case 'FingerprintWenN_Old':
        instance = new FingerPrintWN06();
        break;
      case 'FingerprintWenN':
        instance = new FingerPrintWN();
        break;
      case 'FingerprintZhiAng':
        instance = new FingerPrintZA();
        break;
      case 'FingerVein':
        instance = new FingerPrintVein();
        break;

      default:
        instance = null;
    }

    return instance;
  }
}

class FingerHelper {
  static _defaultDevice;
  static _defaultDeviceType;
  static _fingerDeviceTypes= [
    'FingerprintWenN_Old', // 纹宁06
    'FingerprintWenN', // 纹宁
    'FingerprintZhiAng', // 指昂
    'FingerVein', // 指静脉（微盾）
  ];

  static get defaultMachine() {
    return new Promise(async (resolve) => {
      if (FingerHelper._defaultDevice) {
        // 检查当前指纹设备是否存在
        if (await FingerHelper._defaultDevice.searchDevice) {
          return resolve(FingerHelper._defaultDevice);
        }
      }
      const device = await FingerHelper.searchDevice();
      if (device) {
        return resolve(FingerHelper._defaultDevice);
      }
      return resolve(null);
    });
  }

  static async searchDevice() {
    for (const type of FingerHelper._fingerDeviceTypes) {
      const fingerDevice = FingerPrintFactory.getInstance(type);
      if (await fingerDevice.searchDevice) {
        FingerHelper._defaultDevice = fingerDevice;
        FingerHelper._defaultDeviceType = type;
        return fingerDevice;
      }
    }
    return false;
  }
}

export default FingerHelper;
