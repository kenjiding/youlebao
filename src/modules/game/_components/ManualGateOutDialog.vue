<template>
  <el-dialog
    :visible.sync="manualGateOutVisible"
    :close-on-click-modal="false"
    title="手工清场"
    top="15vh"
    width="900px"
    class="manual-gate-out-dialog"
    @close="handleClose"
    @opened="autoReadCard">
    <manual-gate-out-content
      ref="ManualGateOut"
      :is-dialog="true"/>
  </el-dialog>
</template>

<script>
import ManualGateOutContent from './ManualGateOutContent.vue';

export default {
  name: 'ManualGateOutDialog',

  components: {
    ManualGateOutContent,
  },
  data() {
    return {
      manualGateOutVisible: false,
    };
  },
  // props: {
  //   manualGateOutVisible: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  mounted() {
    this.manualGateOutVisible = true;
  },
  methods: {
    handleClose() {
      this.$emit('close');
      this.remove();
    },
    autoReadCard() {
      this.$nextTick(() => {
        this.$refs.ManualGateOut.autoRead();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .manual-gate-out-dialog {
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
