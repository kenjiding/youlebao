<template>
  <el-dialog
    :visible="editJoinMealVisible"
    :close-on-click-modal="false"
    title="修改分组"
    class="edit-group"
    width="calc(100% - 95px)"
    append-to-body
    @close="close"
    @opened="opened">
    <el-dialog
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      width="420px"
      class="edit-tips-dialog"
      title="提示"
      append-to-body>
      <div class="content">
        <i class="el-icon-warning"/>
        分组信息未保存，是否继续
      </div>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="saveAndClose">
          保存并关闭
        </el-button>
        <el-button @click="continueClose">继续关闭</el-button>

      </div>
    </el-dialog>
    <div
      v-loading="refreshLoading"
      class="body-wrap">
      <edit-join-meal-group
        ref="joinMealGroup"
        @changeLoadingStatus='changeLoadingStatus'
        @refreshList="getCurrentGoodsList"
        @refreshColor="setBatchEditPreview"
        @changeTab="changeTab"
        @getListHeight="getListHeight"/>
      <edit-join-meal-list
        ref="joinMealList"
        :list-height="listHeight"
        @changeLoadingStatus='changeLoadingStatus'/>
    </div>

  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import EditJoinMealGroup from './EditJoinMealGroup.vue';
import EditJoinMealList from './EditJoinMealList.vue';

export default {
  name: 'EditJoinMealDialog',
  components: {
    EditJoinMealGroup,
    EditJoinMealList,
  },
  props: {
    editJoinMealVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      page: 1,
      listHeight: 0,
      refreshLoading: true,
      innerVisible: false,
    };
  },
  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
      isMultipleEdit: state => state.join.isMultipleEdit,
      sellGroupList: state => state.join.groupList,
    }),
  },
  watch: {
    pageHeight(val) {
      if (!this.editJoinMealVisible) return;
      const groupHeight = this.$refs.joinMealGroup.$el.clientHeight;
      this.listHeight = val - groupHeight - 50 - 10;
    },
    pageWidth() {
      if (!this.editJoinMealVisible) return;
      const groupHeight = this.$refs.joinMealGroup.$el.clientHeight;
      // 批量编辑: 标题高度 ：40, 颜色选择高度： 70，分组标题高度: 30，选择商品标题：30 + 20
      this.listHeight = this.pageHeight - groupHeight - 50 - 10;
    },
  },
  methods: {
    ...mapMutations({
      changeEditGroupId: 'join/changeEditGroupId',
      changeBatchEdit: 'join/changeBatchEdit',
    }),
    // 修改loading状态
    changeLoadingStatus(status) {
      this.refreshLoading = status;
    },
    saveAndClose() {
      this.$refs.joinMealGroup.closeSaveBatchEdit().then((res) => {
        if (!res) return;
        this.innerVisible = false;
        this.resetData();
      });
    },
    continueClose() {
      this.innerVisible = false;
      this.resetData();
    },
    getListHeight() {
      this.$nextTick(() => {
        // 10：上边距；50：弹框头部
        const groupHeight = this.$refs.joinMealGroup.$el.clientHeight;
        this.listHeight = this.pageHeight - groupHeight - 50 - 10;
      });
    },
    opened() {
      this.onLoad();
    },
    changeTab() {
      this.$refs.joinMealList.setPage();
    },
    onLoad() {
      this.$store.dispatch('join/asyncGetEditJoinMealAsync', this).then((res) => {
        this.refreshLoading = false;
        if (!res) return;
        this.$refs.joinMealGroup.getGroupList();
        this.$nextTick(() => {
          if (this.sellGroupList[0]) {
            this.changeEditGroupId(this.sellGroupList[0].GroupID);
          }
          // 10：上边距；50：弹框头部
          const groupHeight = this.$refs.joinMealGroup.$el.clientHeight;
          this.listHeight = this.pageHeight - groupHeight - 50 - 10;
        });
      });

      this.$message({
        showClose: true,
        message: '设置的入会套餐包括所有售卖终端上架、待售入会套餐',
        type: 'warning',
        duration: 5000,
      });
    },
    close() {
      if (!this.isMultipleEdit) {
        this.resetData();
        return;
      }
      this.innerVisible = true;
    },
    resetData() {
      this.$emit('update:editJoinMealVisible', false);
      this.changeEditGroupId(null);
      this.changeBatchEdit(false);
      this.$store.dispatch('join/asyncGetJoinMealAsync', this);
      this.refreshLoading = true;
    },
    // 调用重新获取当前分组数据方法
    getCurrentGoodsList() {
      this.$refs.joinMealList.setCurrentMealList();
    },
    // 调用设置批量编辑预览颜色
    setBatchEditPreview(color) {
      this.$refs.joinMealList.batchEditPreview(color);
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/styles/theme.scss";
.edit-tips-dialog {
  $two-px:2px;
  /deep/ .el-dialog__header {
    padding: 15px;
    height: 50px;
    color: $font-color-regular;
    box-sizing: border-box;
    .el-dialog__headerbtn {
      top: 9px;
      font-size: $font-size-regular + $two-px;
    }
  }
  /deep/ .el-dialog__body {
    padding: 10px 15px;
  }
  /deep/ .el-dialog__footer {
    padding: 0 20px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      height: 30px;
      width: 90px;
      font-size: $font-size-special;
      padding: 0;
      line-height: 30px;
    }
  }
  .content {
    color: $font-color-primary;
  }
  i {
    color: $color-warning;
    font-size: $font-size-regular;
  }
}
.edit-group {
  $two-px:2px;
  /deep/ .el-dialog {
    height: calc(100% - 60px);
    margin: 50px 0 10px 85px;
    margin-top: 50px!important;
    overflow: hidden;
    .el-dialog__body {
      padding: 10px 0 0 20px;
      border-radius: $border-radius-small + $two-px;
      // stylelint-disable-next-line
      background-color: #FCFCFC;
    }
  }
  /deep/ .el-dialog__header {
    padding: 14px 20px;
    height: 50px;
    color: $font-color-regular;
    border-bottom: 1px solid $border-color;
    box-sizing: border-box;
    .el-dialog__headerbtn {
      top: 9px;
      font-size: $font-size-regular + $two-px;
    }
  }
  .batch-box {
    height: 40px;
    display: flex;
    .title {
      font-size: $font-size-regular;
      color: $font-color-regular;
      margin-right: 10px;
    }
    button {
      font-size: $font-size-primary + $two-px;
      padding: 0;
      height: 25px;
    }
  }
  .group-tips {
    height: 30px;
    color: $font-color-regular;
  }
  .goods-tips {
    height: 30px;
    margin-top: 20px;
    color: $font-color-regular;
  }
}
.body-wrap {
  height: 100%;
}
.color-box {
  height: 70px;
  .title {
    height: 20px;
  }
}
.select-color {
  display: flex;
  height: 20px;
  /deep/ .el-radio-button {
    width: 60px;
    height: 20px;
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
.edit-mask {
  display: none;
}
.batch-edit {
  height: 20px;
  width: 60px;
  margin-right: 10px;
  position: relative;
  .edit-mask {
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
    background-color: rgba($color-black, .4);
  }
}
</style>

