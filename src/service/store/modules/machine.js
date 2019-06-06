export default {
  namespaced: true,
  state: {
    machineVerson: '',
    machineID: '',
    cupStatus: null,
    outCoinNum: 0,

    machineInfo: {
      IsEnable: false,
      BindCoinTerID: '',
      BindCoinTerBindID: '',
      CoinTerStateName: '',
      Version: '',
      Amont: '',
      TopAmont: '',
      BottomAmont: '',
    },
    machineIsLink: false,
  },

  getters: {
  },

  mutations: {
    setVersion(state, data) {
      state.machineVerson = data.v;
      state.machineID = data.id;
    },
    changeOutCoinNum(state, data) {
      state.outCoinNum = data;
    },
    changeMachine(state, data) {
      state.machineMethods = data;
    },

    changeCupStatus(state, data) {
      state.cupStatus = data;
    },

    changeMachineIsLink(state, data) {
      state.machineIsLink = data;
    },

    saveMachineInfo(state, data) {
      Object.assign(state.machineInfo, data);
    },
  },

  actions: {
    getMachineInfo({ commit, state }, vm) {
      return new Promise((resolve, reject) => {
        vm.$api['physicalCoin/updatePhysicalCoinTerminal']({
          MachineID: state.machineID || null,
          Version: state.machineVerson || null,
        }).then((res) => {
          commit('saveMachineInfo', res);
          resolve();
        }, () => {
          reject();
        });
      });
    },
  },
};
