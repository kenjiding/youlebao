<template>
  <el-dialog
    :visible="cancelOrderVisible"
    :close-on-click-modal="false"
    title="取消游乐扣费"
    top="15vh"
    width="900px"
    class="cancel-order-dialog"
    @close="handleClose"
    @opened="autoReadCard">
    <cancel-order
      ref="CancelOrder"
      :is-dialog="true"/>
  </el-dialog>
</template>

<script>
import CancelOrder from './CancelOrderContent.vue';

export default {
  name: 'CancelOrderDialog',

  components: {
    CancelOrder,
  },
  data() {
    return {
      cancelOrderVisible: false,
    };
  },
  // props: {
  //   cancelOrderVisible: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  mounted() {
    this.cancelOrderVisible = true;
  },
  methods: {
    handleClose() {
      this.$emit('close');
      this.remove();
    },
    autoReadCard() {
      this.$nextTick(() => {
        this.$refs.CancelOrder.autoRead();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .cancel-order-dialog {
    border-radius: $border-radius;
    $two-px:2px;
    /deep/ .el-dialog {
      border-radius: $border-radius;
      .el-dialog__header {
        border-bottom: 1px solid $border-color;
        padding: 14px 20px 14px 30px;
        height: 50px;
        box-sizing: border-box;
      }
      .el-dialog__headerbtn {
        top: 9px;
        font-size: $font-size-regular + $two-px;
      }
      .el-dialog__body {
        height: 500px;
        padding: 0;
      }
    }
  }
</style>
