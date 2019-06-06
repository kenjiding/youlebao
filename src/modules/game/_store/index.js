export default {
  namespaced: true,
  state: {
    swipingCardMachineId: '',
    checkInfo: {
      checkMachineId: '',
      IsOut: false,
      IsLeaguer: true,
    },
  },
  getters: {
  },
  mutations: {
    setswipingCardMachineId(state, data) {
      state.swipingCardMachineId = data;
    },
    setCheckMachineId(state, data) {
      Object.assign(state.checkInfo, data);
    },
  },
  actions: {
  },
};

