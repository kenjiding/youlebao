import { pick as _pick } from 'lodash';

export const state = {
  client: {
    width: 0,
    height: 0,
    pageWidth: 0,
    pageHeight: 0,
  },
  isCheckVersion: false,
};

/* eslint-disable no-shadow */
export const mutations = {
  setClientWAndH(state, data = {}) {
    Object.assign(state.client, _pick(data, ['width', 'height', 'pageWidth', 'pageHeight']));
  },

  changeCheckVersion(state, is) {
    state.isCheckVersion = is;
  },
};
