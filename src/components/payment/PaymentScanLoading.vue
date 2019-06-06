<template>
  <div class="scan-loading-main">
    <div
      v-loading="loading"
      class="icon-loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 1)"
      element-loading-customClass=""/>
    <div class="tip">
      <p class="tip-special">等待顾客付款</p>
      <p v-show="countDown>-1">{{ countDown }}s内未支付将自动取消订单</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentScanLoading',

  props: {
    orderId: {
      type: String,
      default: '',
    },
    scanCode: {
      type: String,
      default: '',
    },
    scanPayMoney: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    loading: false,
    currentIndex: 0,
    countDown: -1,
    interval: 0,
    payLogId: '',
  }),

  methods: {
    onLoad() {
      this.loading = true;
      this.currentIndex = 0;
      this.countDown = -1;
      this.scanPayOrder();
    },

    scanPayOrder() {
      this.$api['pay/payForOrder']({
        OrderID: this.orderId,
        PayTypeID: '00000000-0000-0000-0000-000000000000',
        PayKind: 'Scan',
        Money: this.scanPayMoney,
        Summary: this.scanCode,
      }).then((res) => {
        this.payLogId = res.PayLogID;
        this.$nextTick(() => {
          this.queryPayResult();
          this.countDown = 30;
          this.interval = setInterval(() => {
            this.countDown > 0
              ? this.countDown--
              : this.timeOutStop();
          }, 1000);
        });
      }, () => {
        this.$emit('fail');
      });
    },

    timeOutStop() {
      // this.$emit('fail');
      clearInterval(this.interval);
      this.currentIndex = 10;
    },

    queryPayResult() {
      if (this.currentIndex < 10) {
        this.$api['pay/getPayResult']({
          PayLogID: this.payLogId,
        }).then((res) => {
          if (res.PayState === 'Userpaying') {
            this.currentIndex += 1;
            setTimeout(() => { this.queryPayResult(); }, 2500);
          } else if (res.PayState === 'Success') {
            this.$emit('success');
            clearInterval(this.interval);
          } else {
            this.$emit('fail');
            clearInterval(this.interval);
          }
        }, () => {
          setTimeout(() => { this.queryPayResult(); }, 2500);
        });
      } else {
        this.$emit('fail');
        clearInterval(this.interval);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.scan-loading-main{
  width: 360px;
  height: 360px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-primary;
  color: $font-color-placeholder;
  text-align: center;

  .tip {
    margin-bottom: 20px;
  }

  .tip-special {
    padding: 20px;
    font-size: $font-size-regular;
    color: $font-color-primary;
  }

  .icon-loading {
    width: 147px;
    height: 147px;

    /deep/ .el-icon-loading {
      // stylelint-disable-next-line
      font-size: 147px;
    }
  }
}
</style>
