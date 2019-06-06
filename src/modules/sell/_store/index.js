export default {
  namespaced: true,
  state: {
    goodsDataList: {},
    groupList: [],
    shortcutOpen: false,
    currentEditGroupID: null,
    isMultipleEdit: false,
    multipleIdList: [],
    batchEditColor: '',
    filtGoodsList: {},
  },
  getters: {
    goodsListArray(state) {
      return Object.values(state.goodsDataList);
    },

    searchGoods: (state, getters) => (searchKey) => {
      if (searchKey === '') { return []; }
      return getters.goodsListArray.filter(goods =>
        goods.Name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
        || goods.SN.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
        || goods.Barcode.toLowerCase().indexOf(searchKey.toLowerCase()) > -1);
    },
  },
  mutations: {
    changeShortCutMark(state, data) {
      state.shortcutOpen = data;
    },
    changeEditGroupId(state, data) {
      state.currentEditGroupID = data;
    },
    setGoodsAndGroupData(state, data) {
      state.groupList = [];
      state.goodsDataList = {};
      state.filtGoodsList = {};
      state.groupList.push(...data.GroupData);

      data.DataList.forEach((item) => {
        state.goodsDataList[item.ID] = item;

        const groupId = item.GroupID;
        const group = state.filtGoodsList[groupId];
        if (!Array.isArray(group)) {
          state.filtGoodsList[groupId] = [];
        }
        state.filtGoodsList[groupId].push(item);
      });
    },
    changeGoodsColor(state, data) {
      data.idList.forEach((item) => {
        state.goodsDataList[item].Color = data.color;
      });
    },
    batchEditColorPreview(state, data) {
      state.batchEditColor = data;
    },
    changeGroupName(state, data) {
      const findItem = state.groupList.find(item => item.GroupID === data.id);
      findItem.GroupName = data.name;
    },
    delGoodsGroup(state, data) {
      const groupIndex = state.groupList.findIndex(item => item.GroupID === data);
      state.groupList.splice(groupIndex, 1);
    },
    changeBatchEdit(state, data) {
      state.isMultipleEdit = data;
    },
    multipleEditList(state, data) {
      state.multipleIdList = data;
    },
    dragGroupOrder(state, data) {
      const oldItem = state.groupList[data.oldIndex];
      state.groupList.splice(data.oldIndex, 1);
      state.groupList.splice(data.newIndex, 0, oldItem);
    },
    dragGoodsOrder(state, data) {
      const oldItem = state.filtGoodsList[state.currentEditGroupID][data.oldIndex];
      state.filtGoodsList[state.currentEditGroupID].splice(data.oldIndex, 1);
      state.filtGoodsList[state.currentEditGroupID].splice(data.newIndex, 0, oldItem);
    },
    setGroupIdOfGoods(state, { goodsId, afterGroupId }) {
      // 改变商品拖入其他分组时分组ID
      state.goodsDataList[goodsId].GroupID = afterGroupId;
    },
  },
  actions: {
    asyncGetGoodsAsync({ commit }, vm) {
      return vm.$api['sell/sell/getSellGoodsList']({}).then((res) => {
        commit('setGoodsAndGroupData', res);
        return true;
      }, () => false);
    },
    asyncGetEditGoodsAsync({ commit }, vm) {
      return vm.$api['sell/sell/getSellGoodsListForShow']({}).then((res) => {
        commit('setGoodsAndGroupData', res);
        return true;
      }, () => false);
    },
  },
};

