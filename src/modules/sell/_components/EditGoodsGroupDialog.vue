<template>
  <el-dialog
    :visible="editGoodsVisible"
    :close-on-click-modal="false"
    title="修改分组"
    class="edit-group"
    width="calc(100% - 95px)"
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
      <edit-goods-group-list
        ref="groupListContent"
        @changeLoadingStatus='changeLoadingStatus'
        @refreshList="getCurrentGoodsList"
        @refreshColor="setBatchEditPreview"
        @changeTab="changeTab"
        @getListHeight="getListHeight"/>
      <edit-goods-list
        ref="goodsListContent"
        :list-height="listHeight"
        @changeLoadingStatus='changeLoadingStatus'/>
    </div>

  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import EditGoodsGroupList from './EditGoodsGroupList.vue';
import EditGoodsList from './EditGoodsList.vue';

export default {
  name: 'EditGoodsGroupDialog',
  components: {
    EditGoodsGroupList,
    EditGoodsList,
  },
  props: {
    editGoodsVisible: {
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
      isMultipleEdit: state => state.sell.isMultipleEdit,
      sellGroupList: state => state.sell.groupList,
    }),
  },
  watch: {
    pageHeight(val) {
      if (!this.editGoodsVisible) return;
      const groupHeight = this.$refs.groupListContent.$el.clientHeight;
      this.listHeight = val - groupHeight - 100 - 10;
    },
    pageWidth() {
      if (!this.editGoodsVisible) return;
      const groupHeight = this.$refs.groupListContent.$el.clientHeight;
      // 批量编辑: 标题高度 ：40, 颜色选择高度： 70，分组标题高度: 30，选择商品标题：30 + 20
      this.listHeight = this.pageHeight - groupHeight - 100 - 10;
    },
  },
  methods: {
    ...mapMutations({
      changeEditGroupId: 'sell/changeEditGroupId',
      changeBatchEdit: 'sell/changeBatchEdit',
    }),
    // 修改loading状态
    changeLoadingStatus(status) {
      this.refreshLoading = status;
    },
    saveAndClose() {
      this.$refs.groupListContent.closeSaveBatchEdit().then((res) => {
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
        // 10：上边距；100：底部快捷键+弹框头部
        const groupHeight = this.$refs.groupListContent.$el.clientHeight;
        this.listHeight = this.pageHeight - groupHeight - 100 - 10;
      });
    },
    opened() {
      this.onLoad();
    },
    changeTab() {
      this.$refs.goodsListContent.setPage();
    },
    onLoad() {
      this.$store.dispatch('sell/asyncGetEditGoodsAsync', this).then((res) => {
        this.refreshLoading = false;
        if (!res) return;
        this.$refs.groupListContent.getGroupList();
        this.$nextTick(() => {
          if (this.sellGroupList[0]) {
            this.changeEditGroupId(this.sellGroupList[0].GroupID);
          }
          // 10：上边距；100：底部快捷键+弹框头部
          const groupHeight = this.$refs.groupListContent.$el.clientHeight;
          this.listHeight = this.pageHeight - groupHeight - 100 - 10;
        });
      });
      this.$message({
        showClose: true,
        message: '设置的商品包括所有售卖终端上架、待售商品',
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
      this.$emit('update:editGoodsVisible', false);
      this.changeEditGroupId(null);
      this.changeBatchEdit(false);
      this.$store.dispatch('sell/asyncGetGoodsAsync', this);
      this.refreshLoading = true;
    },
    // 调用重新获取当前分组数据方法
    getCurrentGoodsList() {
      this.$refs.goodsListContent.setCurrentGoodsList();
    },
    // 调用设置批量编辑预览颜色
    setBatchEditPreview(color) {
      this.$refs.goodsListContent.batchEditPreview(color);
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
    height: calc(100% - 110px);
    margin: 50px 0 60px 85px;
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

