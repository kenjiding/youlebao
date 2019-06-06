<template>
  <el-dialog
    :visible.sync="visible"
    title="会员入会"
    top="15vh"
    width="900px"
    class="join-meal-dialog"
    @close="handleClose">
    <join-meal-select
      :is-dialog="true"/>
  </el-dialog>
</template>

<script>
import JoinMealSelect from '@/modules/join/_components/JoinMealSelect.vue';

export default {
  name: 'JoinMealDialog',

  components: {
    JoinMealSelect,
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
      this.$emit('close');
      this.remove();
    },
  },
};
</script>

<style lang="scss">
  @import "@/styles/theme.scss";
  .join-meal-dialog {
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
v
