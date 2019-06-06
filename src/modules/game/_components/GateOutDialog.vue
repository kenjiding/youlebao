<template>
  <el-dialog
    :visible="gateOutVisible"
    :close-on-click-modal="false"
    class="gate-out-dialog"
    title="出闸退补票"
    width="500px"
    append-to-body
    @close="closeDialog">
    <div class="ticket-info">
      <div class="ticket-name">{{ gateTicketInfo.TicketName }}</div>
      <div class="gate-info">
        <div class="item">
          <span>游玩时间</span>
          <span>{{ gateTicketInfo.PlayMinutes }}分钟</span>
        </div>
        <div class="item">
          <span>已消费</span>
          <span>￥{{ gateTicketInfo.TotalCharge }}</span>
        </div>
        <div
          v-if="btnType == 'primary'"
          class="item">
          <span>剩余金额</span>
          <span class="return-money">￥{{ gateTicketInfo.Reamin }}</span>
        </div>
        <div
          v-if="btnType == 'danger'"
          class="item">
          <span>欠费金额</span>
          <span class="fill-money">￥{{ Math.abs(gateTicketInfo.Reamin) }}</span>
        </div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        :type="btnType"
        :loading="gateOutBtnLoading"
        @click="gateOut">
        {{ btnText }}￥{{ Math.abs(gateTicketInfo.Reamin) }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'GateOutDialog',

  components: {},

  props: {
    gateOutVisible: {
      type: Boolean,
      default: false,
    },
    gateTicketInfo: {
      type: Object,
      default: () => ({}),
    },
    btnText: {
      type: String,
      default: '退款',
    },
    btnType: {
      type: String,
      default: 'primary',
    },
    gateOutBtnLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    gateOut() {
      this.$emit('gateOutReturnOrFill');
    },
    closeDialog() {
      this.$emit('update:gateOutVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.gate-out-dialog {
  /deep/ .el-dialog__header {
    border-bottom: 1px solid $border-color;
  }
  /deep/ .el-dialog__body {
    padding: 40px 20px;
  }
  /deep/ .el-dialog__footer {
    border-top: 1px solid $border-color;
    padding: 10px 70px;
    /deep/ .el-button {
      width: 100%;
    }
  }
}
.ticket-info {
  outline: 0;
}
.ticket-name {
  margin-bottom: 20px;
  padding-left: 50px;
  font-size: $font-size-regular;
}
.gate-info {
  display: flex;
  .item {
    flex: 1;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    span {
      color: $font-color-regular;
      font-size: $font-size-regular;
      &:first-child {
        font-size: $font-size-primary;
        color: $font-color-placeholder;
      }
    }
    .return-money {
      color: $color-primary;
    }
    .fill-money {
      color: $color-danger;
    }
    &:nth-child(2){
      border-left: 1px solid  $border-color;
      border-right: 1px solid  $border-color;
    }
  }
}
</style>
