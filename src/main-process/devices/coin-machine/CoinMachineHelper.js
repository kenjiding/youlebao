import { list } from 'serialport';
// import { Message } from 'element-ui';

import CoinMachineY2000 from './CoinMachineY2000';
import CoinMachineE5000 from './CoinMachineE5000';

class CoinMachineFactory {
  static getInstance(type = null, portName = null) {
    let instance;
    switch (type) {
      case 'y2000':
        instance = new CoinMachineY2000(portName);
        break;

      case 'e5000':
        instance = new CoinMachineE5000(portName);
        break;

      default:
        instance = null;
    }

    return instance;
  }
}

class CoinMachineHelper {
  static _defaultMachine;

  static get defaultMachine() {
    return new Promise(async (resolve) => {
      // console.log(CoinMachineHelper._defaultMachine, '_defaultMachine');
      if (!CoinMachineHelper._defaultMachine) {
        const ports = await list();
        for (const port of ports) {
          const machine = await CoinMachineHelper.checkPort(port.comName);
          if (machine) {
            CoinMachineHelper._defaultMachine = machine;
            return resolve(CoinMachineHelper._defaultMachine);
          }
        }
        return resolve(null);
      }
      return resolve(CoinMachineHelper._defaultMachine);
    });
  }

  static async checkPort(name) {
    // const machineOfE5000 = CoinMachineFactory.getInstance('e5000', name);
    // if (await machineOfE5000.isPortOpenAndMachineLink) {
    //   // CoinMachineHelper._defaultMachine = machineOfE5000;
    //   return machineOfE5000;
    // }
    const machineOfY2000 = CoinMachineFactory.getInstance('y2000', name);
    if (await machineOfY2000.isPortOpenAndMachineLink) {
      CoinMachineHelper._defaultMachine = machineOfY2000;
      console.log(CoinMachineHelper._defaultMachine, 'y2000');
      return machineOfY2000;
    }

    return false;
  }
}

export default CoinMachineHelper;
