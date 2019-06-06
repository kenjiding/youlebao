export default {
  listenWindowResize({ commit }) {
    const getClient = () => {
      const { clientWidth, clientHeight } = document.body;
      const mainMenuWidth = 80;
      const secondMenuHeight = 50;
      commit('setClientWAndH', {
        width: clientWidth,
        height: clientHeight,
        // 减去四周各20边距
        pageWidth: clientWidth - mainMenuWidth - 7,
        pageHeight: clientHeight - secondMenuHeight - 10,
      });
    };
    getClient();
    window.onresize = () => getClient();
  },
};

