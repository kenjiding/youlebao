export default {
  namespaced: true,
  state: {
    tipsNotReadStore: [],
  },

  getters: {
  },

  mutations: {
    saveIndexedDB(state, data) {
      const cache = data.filter(item => item.isRead === 'notRead');

      state.tipsNotReadStore = cache;
    },
  },

  actions: {
  },
};
