import CoinMachineHelper from '@/main-process/devices/coin-machine/CoinMachineHelper';

function awaitMachine() {
  return new Promise(async (resolve, reject) => {
    const machineInstance = await CoinMachineHelper.defaultMachine;
    if (machineInstance) {
      const isLink = await machineInstance.isMachineLink;
      isLink ? resolve() : reject();
    } else {
      reject();
    }
  });
}

export default awaitMachine;
