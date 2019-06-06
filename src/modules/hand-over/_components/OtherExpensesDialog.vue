<template>
  <el-dialog
    :visible="otherExpensesVisible"
    :close-on-click-modal="false"
    title="其他支出"
    top="15vh"
    width="500px"
    class="other-expenses-dialog"
    @close="handleClose">
    <other-expenses-content/>
  </el-dialog>
</template>

<script>
import OtherExpensesContent from './OtherExpensesContent.vue';

export default {
  name: 'OtherExpensesDialog',

  components: {
    OtherExpensesContent,
  },

  // props: {
  //   otherExpensesVisible: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  data() {
    return {
      otherExpensesVisible: false,
    };
  },
  mounted() {
    this.otherExpensesVisible = true;
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

  .other-expenses-dialog {
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
