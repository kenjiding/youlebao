export default {
  namespaced: true,
  state: {
    groupList: [],
    mealList: {},
    currentEditGroupID: null,
    isMultipleEdit: false,
    multipleIdList: [],
    batchEditColor: '',
    filtMealList: {},
  },
  getters: {},
  mutations: {
    setJoinMealAndGroupData(state, data) {
      state.groupList = [];
      state.mealList = {};
      state.filtMealList = {};
      state.groupList.push(...data.GroupData);

      data.DataList.forEach((item) => {
        state.mealList[item.ID] = item;

        const groupId = item.GroupID;
        const group = state.filtMealList[groupId];
        if (!Array.isArray(group)) {
          state.filtMealList[groupId] = [];
        }
        state.filtMealList[groupId].push(item);
      });
    },
    changeEditGroupId(state, data) {
      state.currentEditGroupID = data;
    },
    changeMealColor(state, data) {
      data.idList.forEach((item) => {
        state.mealList[item].Color = data.color;
      });
    },
    batchEditColorPreview(state, data) {
      state.batchEditColor = data;
    },
    changeGroupName(state, data) {
      const findItem = state.groupList.find(item => item.GroupID === data.id);
      findItem.GroupName = data.name;
    },
    delJoinMealGroup(state, data) {
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
      const oldItem = state.filtMealList[state.currentEditGroupID][data.oldIndex];
      state.filtMealList[state.currentEditGroupID].splice(data.oldIndex, 1);
      state.filtMealList[state.currentEditGroupID].splice(data.newIndex, 0, oldItem);
    },
    setGroupIdOfGoods(state, { goodsId, afterGroupId }) {
      // 改变商品拖入其他分组时分组ID
      state.mealList[goodsId].GroupID = afterGroupId;
    },
  },
  actions: {
    asyncGetJoinMealAsync({ commit }, vm) {
      return vm.$api['join/joinIn/getJoinInMealList']({}).then((res) => {
        commit('setJoinMealAndGroupData', res);
        return true;
      }, () => false);
    },
    asyncGetEditJoinMealAsync({ commit }, vm) {
      return vm.$api['join/joinIn/getJoinInMealListForShow']({}).then((res) => {
        commit('setJoinMealAndGroupData', res);
        return true;
      }, () => false);
    },
  },
};

