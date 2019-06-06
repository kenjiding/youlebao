<template>
  <el-dialog
    :visible.sync="swipingCardVisible"
    :close-on-click-modal="false"
    title="游乐扣费"
    top="15vh"
    width="800px"
    class="swiping-card-dialog"
    @close="handleClose"
    @opened="autoReadCard">
    <swiping-card-content
      ref="swipingCard"
      :is-dialog="true"/>
  </el-dialog>
</template>

<script>
import SwipingCardContent from './SwipingCardContent.vue';

export default {
  name: 'SwipingCardDialog',

  components: {
    SwipingCardContent,
  },
  data() {
    return {
      swipingCardVisible: false,
    };
  },
  mounted() {
    this.swipingCardVisible = true;
  },
  methods: {
    handleClose() {
      this.$emit('close');
      this.remove();
    },
    autoReadCard() {
      this.$nextTick(() => {
        this.$refs.swipingCard.autoRead();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .swiping-card-dialog {
    border-radius: $border-radius;
    $two-px:2px;
    /deep/ .el-dialog {
      border-radius: $border-radius;
    }
    /deep/ .el-dialog__header {
      padding: 14px 20px 14px 30px;
      height: 50px;
      box-sizing: border-box;
    }
    /deep/ .el-dialog__headerbtn {
      top: 9px;
      font-size: $font-size-regular + $two-px;
    }
    /deep/ .el-dialog__body {
      height: 580px;
      padding: 0;
      .el-card.is-always-shadow {
        border-radius: 0;
        box-shadow: none!important;
      }
    }
  }
</style>
