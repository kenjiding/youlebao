import ref from 'ref';
import RefArray from 'ref-array';

import deviceApi from '../dll/card-reader';

export function readCard(event) {
  const res = {
    cardNumber: '',
    cardID: '',
    errorCode: 0,
    errorMsg: '',
  };
  try {
    const deviceInstance = deviceApi();

    const aliveState = deviceInstance.card_Alive();
    if (aliveState === 0) {
      const byteArray = new RefArray(ref.types.byte, 16);
      const idBuffer = ref.alloc(byteArray);
      const readState = deviceInstance.card_GetCardIDAndType(idBuffer);
      const numberBuffer = ref.alloc(byteArray);
      const readNumber = deviceInstance.card_ReadBlock(34, numberBuffer);
      if (readState === 0) {
        deviceInstance.card_Beep(10);
        let cardID = '';

        idBuffer.forEach((item) => {
          let tmp = item.toString(16);
          if (tmp.length === 1) {
            tmp = `0${tmp}`;
          }
          cardID += tmp;
        });
        res.cardID = cardID;
        // event.returnValue = res;
      } else {
        res.errorCode = readState;
        res.errorMsg = readState === -4 ? '读卡器上无卡' : '读卡异常';
        event.returnValue = res;
        return;
      }
      if (readNumber === 0) {
        // \0结尾的
        const endindex = numberBuffer.findIndex(item => item.toString() === '255');

        if (endindex > -1) {
          const actualBuffer = numberBuffer.slice(0, endindex);
          res.cardNumber = actualBuffer.toString();
        } else {
          res.cardNumber = numberBuffer.toString();
        }
      } else {
        res.errorCode = readState;
        res.errorMsg = readState === -4 ? '读卡器上无卡' : '读卡异常';
        event.returnValue = res;
        return;
      }
      event.returnValue = res;
    } else {
      res.errorCode = aliveState;
      res.errorMsg = '读卡器未连接';
      event.returnValue = res;
    }
  } catch (error) {
    res.errorCode = 9999;
    res.errorMsg = '动态库组件异常';
    event.returnValue = res;
  }
}

export function readEmpCard(event) {
  const res = {
    cardNumber: '',
    cardID: '',
    errorCode: 0,
    errorMsg: '',
  };
  try {
    const deviceInstance = deviceApi();

    const aliveState = deviceInstance.card_Alive();
    if (aliveState === 0) {
      const byteArray = new RefArray(ref.types.byte, 16);
      const idBuffer = ref.alloc(byteArray);
      const readState = deviceInstance.card_GetEmpCardID(idBuffer);
      if (readState === 0) {
        deviceInstance.card_Beep(10);
        let cardID = '';

        idBuffer.forEach((item) => {
          let tmp = item.toString(16);
          if (tmp.length === 1) {
            tmp = `0${tmp}`;
          }
          cardID += tmp;
        });
        res.cardID = cardID;
        event.returnValue = res;
      } else {
        res.errorCode = readState;
        res.errorMsg = readState === -4 ? '读卡器上无卡' : '读卡异常';
        event.returnValue = res;
        return;
      }
      event.returnValue = res;
    } else {
      res.errorCode = aliveState;
      res.errorMsg = '读卡器未连接';
      event.returnValue = res;
    }
  } catch (error) {
    res.errorCode = 9999;
    res.errorMsg = '动态库组件异常';
    event.returnValue = res;
  }
}

export function readerCall(event) {
  try {
    const deviceInstance = deviceApi();
    const state = deviceInstance.card_Alive();
    event.returnValue = state;
  } catch (e) {
    event.returnValue = -1;
  }
}
