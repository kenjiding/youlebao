export default {
  namespaced: true,
  state: {
    rejoinSetting: {},
    subCardDeposit: {},
  },
  getters: {
    getRejoinSetting(state) {
      return state.rejoinSetting;
    },
    getSubCardDeposit(state) {
      return state.subCardDeposit;
    },
  },
  mutations: {
    setRejoinSetting(state, data) {
      state.rejoinSetting = data;
    },
    setSubCardDeposit(state, data) {
      state.subCardDeposit = data;
    },
  },
  actions: {
    asyncRejoinSetting({ commit }, vm) {
      vm.$api['leaguer/leaguer/getRejoinSet']({}).then((res) => {
        commit('setRejoinSetting', res);
      });
    },
    asyncSubCardDeposit({ commit }, vm) {
      vm.$api['leaguer/leaguer/getSubCardDeposit']({}).then((res) => {
        commit('setSubCardDeposit', res);
      });
    },
  },
};

