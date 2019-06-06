<template>
  <el-dialog
    :visible="visible"
    title="智能售币"
    width="920px"
    class="global-dialog"
    @close="handleClose">
    <Curency :is-readcard="true"/>
  </el-dialog>
</template>

<script>
import Curency from './index.vue';

export default {
  name: 'GoodsCurrency',

  components: {
    Curency,
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    this.visible = true;
  },
  methods: {
    handleClose() {
      // this.visible = false;
      this.$emit('close');
      this.remove();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';

.global-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
    border-top: 1px solid $border-color;

    .ych-page__wrap {
      height: 570px !important;
      background-color: $color-white;

      .box-card {
        box-shadow: none;
        border: none;
      }
    }
  }
}
</style>

