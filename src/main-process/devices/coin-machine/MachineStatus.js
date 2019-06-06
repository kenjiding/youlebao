export const MachineStatus = {
  // 未知
  unknow: {
    value: 'unknow',
    name: '未知',
  },
  // 空闲
  idle: {
    value: 'idle',
    name: '空闲',
  },
  // 正在出币
  coinOuting: {
    value: 'coinOuting',
    name: '正在出币',
  },
  // 正在清币
  coinClearing: {
    value: 'coinClearing',
    name: '正在清币',
  },
  // 暂停出币
  coinOutPause: {
    value: 'coinOutPause',
    name: '暂停出币',
  },
  // 暂停清币
  coinClearPause: {
    value: 'coinClearPause',
    name: '暂停清币',
  },
  // 出币完成
  coinOuted: {
    value: 'coinOuted',
    name: '出币完成',
  },
  // 清币完成
  coinCleared: {
    value: 'coinCleared',
    name: '清币完成',
  },
  // 出币超时
  timeOut: {
    value: 'timeOut',
    name: '出币超时',
  },
};

export const MachineStatusMap = (() => {
  const obj = {};
  Object.keys(MachineStatus).forEach((key) => {
    obj[key] = MachineStatus[key].name;
  });

  return obj;
})();

export const MachineStatusEnum = (() => {
  const obj = {};
  Object.keys(MachineStatus).forEach((key) => {
    obj[key] = MachineStatus[key].value;
  });

  return obj;
})();
