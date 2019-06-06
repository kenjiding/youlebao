<template>
  <el-dialog
    :visible.sync="otherRevenueVisible"
    :close-on-click-modal="false"
    title="其他收入"
    top="15vh"
    width="500px"
    class="other-revenue-dialog"
    @close="handleClose">
    <other-revenue-content/>
  </el-dialog>
</template>

<script>
import OtherRevenueContent from './OtherRevenueContent.vue';

export default {
  name: 'OtherRevenueDialog',

  components: {
    OtherRevenueContent,
  },
  data() {
    return {
      otherRevenueVisible: false,
    };
  },
  // props: {
  //   otherRevenueVisible: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  mounted() {
    this.otherRevenueVisible = true;
  },
  methods: {
    handleClose() {
      this.$emit('close');
      this.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .other-revenue-dialog {
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
        height: 440px;
        padding: 0;
      }
    }
  }
</style>
