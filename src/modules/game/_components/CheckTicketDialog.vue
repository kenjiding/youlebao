<template>
  <el-dialog
    :visible="checkTicketVisible"
    :close-on-click-modal="false"
    title="验票过闸"
    top="15vh"
    width="900px"
    class="check-ticket-dialog"
    @close="handleClose"
    @opened="autoReadCard">
    <check-ticket
      ref="CheckTicket"
      :is-dialog="true"/>
  </el-dialog>
</template>

<script>
import CheckTicket from './CheckTicketContent.vue';

export default {
  name: 'CheckTicketDialog',

  components: {
    CheckTicket,
  },
  data() {
    return {
      checkTicketVisible: false,
    };
  },
  // props: {
  //   checkTicketVisible: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  mounted() {
    this.checkTicketVisible = true;
  },
  methods: {
    handleClose() {
      this.$refs.CheckTicket.saveTicketSet();
      this.$emit('close');
      this.remove();
    },
    autoReadCard() {
      this.$refs.CheckTicket.getSaveTicketSet();
      this.$nextTick(() => {
        this.$refs.CheckTicket.autoRead();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .check-ticket-dialog {
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
