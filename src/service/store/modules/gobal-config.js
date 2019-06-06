export default {
  namespaced: true,
  state: {
    receiptPrintSetting: {},
    ticketRegister: null,
    IsEnable: false,
    payTypes: [],
    guiderList: [],
    extensionModule: [],
  },
  getters: {
    getReceiptPrintSetting(state) {
      return state.receiptPrintSetting || {};
    },
    getTicketRegister(state) {
      return state.ticketRegister || {};
    },
    hasTicketRegister(state) {
      if (state.ticketRegister) {
        return Object.values(state.ticketRegister).some(val => val === true);
      }
      return false;
    },
    getPayTypes(state) {
      return state.payTypes || [];
    },
    getGuiderList(state) {
      return state.guiderList || [];
    },
    getExtensionModule(state) {
      return state.extensionModule;
    },
  },
  mutations: {
    setReceiptPrintSetting(state, data) {
      state.receiptPrintSetting = data;
    },
    setTicketRegister(state, data) {
      state.ticketRegister = data;
    },

    setPhysicalCoinModel(state, data) {
      state.IsEnable = data;
    },
    setPayTypes(state, data) {
      let cashType = null;
      data.DataList.forEach((type) => {
        if (type.Kind === 'Cash') {
          cashType = type;
        } else {
          state.payTypes.push({ ...type });
        }
      });
      if (data.ScanUsable) {
        state.payTypes.unshift({
          ID: '00000000-0000-0000-0000-000000000000',
          Name: '扫码支付',
          Kind: 'Scan',
          PayMoney: 0,
          Summary: '',
          OrderIndex: data.ScanOrderIndex,
        });
      }
      // 现金排序最前
      if (cashType !== null) {
        state.payTypes.unshift({ ...cashType });
      }
    },
    setGuiderList(state, data) {
      state.guiderList = data.DataList.map(item => ({
        label: `${item.GuiderName}[${item.GuiderCode}]`,
        value: item.GuiderCode,
      }));
    },
    setExtensionModule(state, data) {
      state.extensionModule = data;
    },
  },
  actions: {
    asyncGobalConfig({ dispatch }, vm) {
      dispatch('user/asyncGetUserInfo', vm, { root: true });
      dispatch('asyncReceiptPrintSetting', vm);
      dispatch('asyncTicketRegister', vm);
      dispatch('checkMachineOpen', vm);
      dispatch('asyncPayTypes', vm);
      dispatch('asyncGuiderList', vm);
      dispatch('asyncHasRoamAuth', vm);
    },

    asyncReceiptPrintSetting({ commit }, vm) {
      vm.$api['other/getTicketPrintInfo']().then((res) => {
        commit('setReceiptPrintSetting', res);
      });
    },

    asyncTicketRegister({ commit }, vm) {
      vm.$api['ticket/getTicketRegister']().then((res) => {
        commit('setTicketRegister', res);
      });
    },

    checkMachineOpen({ commit }, vm) {
      vm.$api['physicalCoin/checkPhysicalCoinModel']().then((res) => {
        commit('setPhysicalCoinModel', res.IsEnable);
      });
    },

    asyncPayTypes({ commit }, vm) {
      vm.$api['pay/getPayTypeList']().then((res) => {
        commit('setPayTypes', res);
      });
    },

    asyncGuiderList({ commit }, vm) {
      vm.$api['pay/getGuiderFuzzyList']().then((res) => {
        commit('setGuiderList', res);
      });
    },

    asyncHasRoamAuth({ commit }, vm) {
      vm.$api['login/getBusinessExtMod']().then((res) => {
        commit('setExtensionModule', res.ExtensionModule);
      });
    },
  },
};
