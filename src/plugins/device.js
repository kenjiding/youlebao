// eslint-disable-next-line
import { ipcRenderer } from 'electron';
import { Message } from 'element-ui';

const device = {
  /**
   * 读卡器检测
   */
  readerCall(isIgnoreError = false) {
    const info = ipcRenderer.sendSync('readerCall');
    if (!isIgnoreError && info !== 0) {
      console.log(isIgnoreError);
      Message.error('读卡器未连接');
    }
    return info;
  },

  /**
   * 读会员卡
   */
  readCard(isIgnoreError = false) {
    const info = ipcRenderer.sendSync('readCard');
    if (!isIgnoreError && info.errorCode !== 0) {
      Message.error(info.errorMsg);
    }
    return info;
  },

  /**
   * 读员工卡
   */
  readEmpCard(isIgnoreError = false) {
    const info = ipcRenderer.sendSync('readEmpCard');
    if (!isIgnoreError && info.errorCode !== 0) {
      Message.error(info.errorMsg);
    }
    return info;
  },

  /**
   * 身份证读卡器
   */
  readIDCard(isIgnoreError = false) {
    const info = ipcRenderer.sendSync('readIDCard');
    if (!isIgnoreError && info.errorCode !== 0) {
      Message.error(info.errorMsg);
    }
    return info;
  },

  /**
   * 身份证读卡器检测
   */
  readIDCardCall(isIgnoreError = false) {
    const info = ipcRenderer.sendSync('readIDCardCall');
    if (!isIgnoreError && info !== 0) {
      Message.error('身份证读卡器未连接');
    }
    return info;
  },
};

export default device;
