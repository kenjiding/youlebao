<template>
  <div>
    <transition
      name="fade"
      @after-enter="afterEnter"
      @after-leave="afterLeave">
      <div v-show="isMultipleEdit">
        <div
          class="batch-box">
          <span class="title">批量操作</span>
          <div>
            <el-button
              class="cancel-btn"
              size="small"
              @click="cancelBatchEdit">
              取消
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="saveBatchEdit">
              保存
            </el-button>
          </div>
        </div>
        <div
          class="color-box">
          <div class="title">选择颜色</div>
          <el-radio-group
            v-model="currentColor"
            class="select-color"
            size="small"
            @click.native="selectColor">
            <div
              v-for="col in colorsOptions"
              :class="{
                'batch-color': col === currentColor,
                'white-color': currentColor.toLowerCase() === '#ffffff'
              }"
              :key="col">
              <el-radio-button
                :style="{'background-color': col}"
                :label="col"/>
              <div class="color-mask">
                <i
                  class="el-icon-circle-check icon"/>
              </div>
            </div>
          </el-radio-group>
        </div>
        <div
          class="group-tips">
          选择要移入的分组
        </div>
      </div>
    </transition>
    <div
      ref="groupListContent"
      class="group-list">
      <draggable
        :options="{
          group: 'id',
          sort: !isMultipleEdit,
          handle: '.handle',
          ghostClass: 'current-drag',
        }"
        class="join-class-draggable"
        @start="hasMove = false"
        @end="hasMove = true"
        @update="changeGroupOrder">
        <el-button
          v-for="(group, index) in groupList"
          :key="group.GroupID"
          :data-id="group.GroupID"
          :disabled="eqCurrentGroupId(group.GroupID) && isMultipleEdit"
          :class="{
            'batch-edit': eqCurrentSelect(group.GroupID)
              && !eqCurrentGroupId(currentSelect) && isMultipleEdit,
            'handle': !isMultipleEdit && eqUnGroupId(group.GroupID),
            'grouped': eqUnGroupId(group.GroupID) && !isMultipleEdit,
            'group-active': !isMultipleEdit && eqCurrentGroupId(group.GroupID),
          }"
          class="group-btn"
          size="small"
          round
          @mouseenter.native="moveEnter"
          @mouseleave.native="moveLeave"
          @click.native="multipleEdit($event, group)">
          <i
            v-show="eqCurrentGroupId(group.GroupID)
            && !isMultipleEdit && eqUnGroupId(group.GroupID)"
            class="group-del-icon el-icon-error"
            @click="delGroup(group)"/>
          <span
            class="group-name">{{ group.GroupName }}</span>
          <i class="group-acitve-icon ych-icon-wenjianjia"/>
          <i
            v-if="eqUnGroupId(group.GroupID)"
            :class="{'current-edit': eqCurrentSelect(group.GroupID)}"
            class="group-edit-icon el-icon-edit"
            @click="editGroupName(group, index)"/>
          <div class="edit-mask">
            <i
              class="el-icon-circle-check icon"/>
          </div>
        </el-button>
      </draggable>
      <el-button
        v-if="!isMultipleEdit"
        round
        size="small"
        class="add-group"
        icon="el-icon-plus"
        @click="addGroup"/>
    </div>
    <transition
      name="fade">
      <div
        v-show="isMultipleEdit"
        class="meal-tips">
        选择需要批量操作的商品
      </div>
    </transition>
  </div>

</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import draggable from 'vuedraggable';

export default {
  name: 'EditJoinMealGroup',
  components: { draggable },
  props: {
    refreshLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentSelect: '',
      // 修改当前分组数据
      changeGroupData: {
        id: '',
        name: '',
      },
      currentColor: '',
      colorsOptions: ['#ef7063', '#ff7faa', '#eda95d', '#88c865', '#a4a4a7', '#70b8ef', '#c78fdc', '#ffffff'],
      saveGroupList: [],
      hasMove: true,
    };
  },

  computed: {
    ...mapState({
      currentGroupId: state => state.join.currentEditGroupID,
      isMultipleEdit: state => state.join.isMultipleEdit,
      multipleIdList: state => state.join.multipleIdList,
      sellGroupList: state => state.join.groupList,
      filtMealList: state => state.join.filtMealList,
    }),
    groupList: {
      get() {
        return this.saveGroupList;
      },
      set(val) {
        this.saveGroupList = val;
      },
    },
  },
  watch: {
    isMultipleEdit(val) {
      if (!val) {
        this.currentColor = '';
        this.currentSelect = '';
      }
    },
  },
  methods: {
    ...mapMutations({
      changeEditGroupId: 'join/changeEditGroupId',
      changeGroupName: 'join/changeGroupName',
      delJoinMealGroup: 'join/delJoinMealGroup',
      changeBatchEdit: 'join/changeBatchEdit',
      changeGoodsColor: 'join/changeGoodsColor',
      batchEditColorPreview: 'join/batchEditColorPreview',
      dragGroupOrder: 'join/dragGroupOrder',
    }),
    ...mapActions({
      asyncGetEditJoinMealAsync: 'join/asyncGetEditJoinMealAsync',
    }),

    // 添加hover效果
    moveEnter(ev) {
      if (!this.hasMove) return;
      ev.currentTarget.classList.add('hover-status');
    },

    // 移除hover效果
    moveLeave(ev) {
      ev.currentTarget.classList.remove('hover-status');
    },

    // 批量编辑当前选中
    eqCurrentSelect(id) {
      return this.currentSelect === id;
    },

    // 当前选中分组
    eqCurrentGroupId(id) {
      return this.currentGroupId === id;
    },

    // 筛选未分组
    eqUnGroupId(id) {
      // 未分组ID
      const unGroupId = '00000000-0000-0000-0000-000000000000';
      return unGroupId !== id;
    },

    afterEnter() {
      this.$emit('getListHeight');
    },

    afterLeave() {
      this.$emit('getListHeight');
    },

    cancelBatchEdit() {
      this.changeBatchEdit(false);
    },

    getGroupList() {
      this.saveGroupList = [...this.sellGroupList];
    },

    // 批量编辑状态切换分组
    multipleEdit(ev, group) {
      if (!this.isMultipleEdit) {
        this.changeGoodsList();
        this.changeEditGroupId(group.GroupID);
        return;
      }
      ev.preventDefault();
      if (this.currentSelect === group.GroupID) {
        this.currentSelect = '';
      } else {
        this.currentSelect = group.GroupID;
      }
    },

    // 批量编辑状态选择分组颜色
    selectColor(ev) {
      if (!this.isMultipleEdit) return;
      ev.preventDefault();
      if (this.currentColor === ev.target.textContent) {
        this.currentColor = '';
      } else {
        this.currentColor = ev.target.textContent;
      }
      this.batchEditColorPreview(this.currentColor);
    },

    // 直接关闭弹框保存修改
    closeSaveBatchEdit() {
      return this.$api['sell/sell/updateGoodsShow']({
        GoodsIDList: this.multipleIdList,
        Color: this.currentColor,
        GroupID: this.currentSelect || this.currentGroupId,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!',
        });
        return true;
      }, () => false);
    },

    // 保存批量编辑
    saveBatchEdit() {
      this.$emit('changeLoadingStatus', true);
      this.$api['sell/sell/updateGoodsShow']({
        GoodsIDList: this.multipleIdList,
        Color: this.currentColor,
        GroupID: this.currentSelect || this.currentGroupId,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!',
        });
        this.changeBatchEdit(false);
        this.asyncGetEditJoinMealAsync(this).then((res) => {
          this.$emit('changeLoadingStatus', false);
          if (!res) return;
          this.$emit('refreshList');
          this.$emit('changeTab');
        });
      }, () => { this.$emit('changeLoadingStatus', false); });
    },

    // 切换分组
    changeGoodsList() {
      this.currentSelect = '';
      this.$emit('changeTab');
    },

    // 处理其他分组与未分组互换位置复原
    recoverGroup() {
      this.saveGroupList.splice(0, this.saveGroupList.length);
      this.$nextTick(() => {
        this.saveGroupList.push(...this.sellGroupList);
        this.hasMove = true;
      });
    },

    // 修改分组顺序
    changeGroupOrder(ev) {
      // 未分组不能与其他分组更改顺序
      if (ev.newIndex >= (this.groupList.length - 1)) {
        this.recoverGroup();
        this.$message({
          type: 'warning',
          message: '未分组不支持排序,默认排最后!',
        });
        return;
      }
      this.$emit('changeLoadingStatus', true);
      if (ev.newIndex === ev.oldIndex) {
        this.hasMove = true;
        this.$emit('changeLoadingStatus', false);
        return;
      }
      this.setGoodsGroup(ev.item.dataset.id, ev.newIndex, ev.item.innerText).then((res) => {
        // 互换数组位置
        if (res) {
          this.dragGroupOrder({
            oldIndex: ev.oldIndex,
            newIndex: ev.newIndex,
          });
        }
        setTimeout(() => {
          this.$emit('changeLoadingStatus', false);
        }, 100);
        this.recoverGroup();
      });
    },

    // 删除分组
    deleteGoodsGroup(id) {
      this.$api['sell/sell/deleteGoodsGroup']({
        GoodsGroupID: id,
      }).then(() => {
        this.delJoinMealGroup(id);
        this.delGroupItem(id);
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.$emit('changeLoadingStatus', true);
        this.asyncGetEditJoinMealAsync(this).then((res) => {
          this.$emit('changeLoadingStatus', false);
          if (res && this.sellGroupList[0]) {
            this.changeEditGroupId(this.groupList[0].GroupID);
          }
        });
      }, () => {});
    },

    delGroup(group) {
      const currentDel = this.filtMealList[group.GroupID] || [];
      let tips = '删除该分组，是否继续?';
      if (currentDel.length > 0) {
        tips = `【${group.GroupName}】下有商品，确认删除，商品将回到未分组，是否继续?`;
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deleteGoodsGroup(group.GroupID);
      }).catch(() => {});
    },

    // 添加分组成功回调
    addSuccess() {
      this.$emit('changeLoadingStatus', true);
      this.asyncGetEditJoinMealAsync(this).then((res) => {
        this.$emit('changeLoadingStatus', false);
        res && (this.saveGroupList = [...this.sellGroupList]);
      });
    },

    // 编辑分组成功回调
    editSuccess(val) {
      // 编辑分组
      this.currentSelect = '';
      this.changeGroupData.name = val;
      this.changeGroupName(this.changeGroupData);
      this.changeName();
    },

    // 添加、修改、改变分组顺序
    setGoodsGroup(id, index, val, operate) {
      if (val === this.changeGroupData.name.trim()) return false;
      this.$message.closeAll();
      return this.$api['sell/sell/setGoodsGroup']({
        ID: id,
        Index: index,
        GroupName: val,
        GroupType: 'JoinSetMeal',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功',
        });
        const opr = {
          add: this.addSuccess,
          edit: this.editSuccess,
        };
        const fn = opr[operate];
        fn && fn(val);
        return true;
      }, () => false);
    },

    // 修改分组名称
    changeName() {
      const findItem = this.saveGroupList.find(item => item.GroupID === this.changeGroupData.id);
      findItem.GroupName = this.changeGroupData.name;
    },

    // 删除分组
    delGroupItem(data) {
      const groupIndex = this.saveGroupList.findIndex(item => item.GroupID === data);
      this.saveGroupList.splice(groupIndex, 1);
    },

    addGroup() {
      this.commonPrompt('', 0, 'add');
    },

    editGroupName(group, index) {
      this.currentSelect = group.GroupID;
      this.changeGroupData.id = group.GroupID;
      this.changeGroupData.name = group.GroupName;
      this.commonPrompt(group, index, 'edit');
    },

    validatorGroupName(groupName, opr) {
      const val = groupName.trim();
      if (groupName.length > 6) {
        return '最多输入6位字符';
      }
      if (val === '') {
        return '请输入分组名称';
      }
      const groupIndex = this.groupList.findIndex(item => item.GroupName.trim() === val);
      const isEdit = (opr === 'edit' && (val !== this.changeGroupData.name.trim()));
      if (groupIndex > -1 && (opr === 'add' || isEdit)) {
        return '已存在该分组，请重新输入';
      }
      return true;
    },

    commonPrompt(group, index, opr) {
      const title = opr === 'edit' ? '修改分组' : '新增分组';
      let isFirst = true;
      this.$prompt('', title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputErrorMessage: '',
        inputValidator: (val) => {
          if (isFirst) {
            isFirst = false;
            return true;
          }
          return this.validatorGroupName(val, opr);
        },

        inputValue: opr === 'edit' ? group.GroupName : '',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const result = this.validatorGroupName(instance.inputValue, opr);
            if (result === true) done();
          } else {
            done();
          }
        },
      }).then(({ value }) => {
        const val = value.trim();
        if (opr === 'edit') {
          this.setGoodsGroup(group.GroupID, index, val, 'edit');
        } else {
          this.setGoodsGroup('', index, val, 'add');
        }
      }).catch(() => {
        if (opr === 'edit') {
          this.currentSelect = '';
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";
.group-list {
  min-height: 40px;
  position: relative;
  display: flex;
  /deep/ .el-card {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
  }
  .add-group {
    width: 60px;
    height: 30px;
    margin-right: 10px;
    padding: 0;
    /deep/ i {
      font-size: $font-size-primary;
      color: $color-primary;
      // stylelint-disable-next-line
      font-weight: bold;
    }
  }
}
.group-edit-icon {
  display: none;
}

.group-name {
  margin-left: 0!important;
}
.group-btn.current-drag {
  background: $color-regular!important;
  border-color: $color-regular!important;
  .group-name {
    display: none;
  }
  .group-edit-icon {
    display: none;
  }
}
.group-btn.is-disabled{
  background-color: $color-bg-table!important;
  border-color: $color-bg-table!important;
  color: $color-white!important;
  &:hover {
    background-color: $color-bg-table!important;
    color: $color-white!important;
  }
}
.group-del-icon {
  position: absolute;
  cursor: pointer;
  color: $color-danger;
  top: -5px;
  left: -6px;
  font-size: $font-size-primary;
  z-index: 1;
}
.group-acitve-icon {
  display: none;
}
.group-btn {
  /deep/ &.el-button {
    &:hover {
      background-color: $color-white;
      border-color: $border-color;
    }
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  margin: 0 10px 10px 0;
  position: relative;
  // stylelint-disable-next-line
  transition: width linear .2s;
  width: 120px;
  height: 30px;
  color: $font-color-primary;
  padding: 0 5px;
  line-height: 30px;
  // stylelint-disable-next-line
  font-size: 13px;
  .current-edit {
    background-color: rgba($color-black, .1);
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: $border-radius-circle;
  }
}
.hover-status {
  /deep/ &.el-button {
    &:hover {
      //stylelint-disable-next-line
      background-color:#EBF3FD;
      //stylelint-disable-next-line
      border-color: #C2DCF9;
    }
  }
}
.group-active {
  &:hover {
    color: $color-white;
    border-color: $color-primary!important;
    background-color: $color-primary!important;
  }
  padding-left: 10px;
  color: $color-white;
  border-color: $color-primary!important;
  background-color: $color-primary!important;
  .group-edit-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    &:hover {
      background-color: rgba($color-black, .1);
      border-radius: $border-radius-circle;
    }
  }
  /deep/ &.el-button {
    &.grouped {
      > span {
        justify-content: space-between;
      }
    }
  }
}
.join-class-draggable {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  /deep/ .el-card + .group-btn {
    background-color: $color-regular!important;
    // stylelint-disable-next-line
    border-color: #C2DCF9;
    color: $color-primary;
    > span {
      justify-content: center!important;
    }
    .group-acitve-icon {
      display: block;
      color: $color-white;
    }
    .group-name {
      display: none;
    }
    .group-edit-icon {
      display: none;
    }
  }
}

.edit-mask {
  display: none;
}

.batch-edit {
  height: 30px;
  width: 120px;
  margin-right: 10px;
  position: relative;

  .edit-mask {
    position: absolute;
    color: $color-white;
    font-size: $font-size-primary;
    top: 0;
    left: -1px;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    // stylelint-disable-next-line
    border-radius: 20px!important;
    background-color: $color-primary;
  }
}

.batch-box {
  $two-px:2px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
  .title {
    font-size: $font-size-regular;
    color: $font-color-regular;
    margin-right: 10px;
  }
  button {
    font-size: $font-size-primary;
  }
  .cancel-btn {
    color: $font-color-placeholder!important;
    &:hover {
      color: $color-primary!important;
    }
  }
}
.group-tips {
  height: 20px;
  color: $font-color-secondary;
}
.meal-tips {
  height: 20px;
  margin-top: 10px;
  color: $font-color-secondary;
}
.color-box {
  height: 70px;
  .title {
    height: 20px;
    color: $font-color-secondary;
  }
  /deep/ .el-radio-button {
    &:focus {
      box-shadow: none!important;
    }
  }
}
.select-color {
  display: flex;
  height: 20px;
  /deep/ .el-radio-button {
    width: 60px;
    height: 30px;
    margin-right: 10px;
    border-radius: $border-radius-small;
    border: 1px solid $border-color;
    box-sizing: border-box;
    cursor: pointer;
    .el-radio-button__inner {
      display: none;
    }
  }
}
.color-mask {
  display: none;
}
.batch-color {
  height: 30px;
  width: 60px;
  margin-right: 10px;
  position: relative;
  .color-mask {
    position: absolute;
    color: $color-white;
    font-size: $font-size-primary;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-radius: $border-radius;
  }
}
.white-color {
  .color-mask {
    color: $color-primary;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity linear .3s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
