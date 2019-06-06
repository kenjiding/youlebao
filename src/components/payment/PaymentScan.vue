<template>
  <el-dialog
    :visible="visible"
    :show-close="state === 'Scaning'"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    top="25vh"
    custom-class="sell-payment-scan-page-dialog"
    width="400px"
    @open="onLoad"
    @close="closeClick">
    <div class="scan-page">
      <div
        v-if="state === 'Scaning'"
        class="scan-main">
        <span>¥{{ scanPayMoney }}</span>
        <i class="ych-icon-scan-phone icon-scan"/>
        <el-form
          ref="form"
          :model="fromModel"
          label-width="80px"
          @submit.native.prevent="onSubmit">
          <el-form-item label-width="0">
            <el-input
              ref="scanPaymentCode"
              v-model="fromModel.ScanPaymentCode"
              placeholder="请扫顾客微信或支付宝的付款码"/>
          </el-form-item>
        </el-form>
      </div>
      <div
        v-else-if="state === 'Fail'"
        class="scan-fail">
        <div class="icon-fail">
          <i class="ych-icon-close icon-fail-child"/>
        </div>
        <span class="scan-fail-special">支付失败</span>
        <span>未能获取到支付结果，将取消订单!</span>
        <el-button
          @click="cancelClick">取消订单</el-button>
      </div>
      <div v-show="state === 'Querying'">
        <PaymentScanLoading
          ref="PaymentScanLoading"
          :order-id="orderId"
          :scan-code="fromModel.ScanPaymentCode"
          :scan-pay-money="scanPayMoney"
          @fail="handleScanPayFail"
          @success="handleScanPaySuccess"/>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import PaymentScanLoading from '@/components/payment/PaymentScanLoading.vue';

export default {
  name: 'PaymentScan',

  components: {
    PaymentScanLoading,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    scanPayMoney: {
      type: Number,
      default: 0,
    },
    orderId: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    state: 'Scaning', // 'Fail','Querying'
    fromModel: {
      ScanPaymentCode: '',
    },
    payLogId: '',
    paying: false, // 防止网络延迟多次提交
  }),

  methods: {
    onLoad() {
      this.state = 'Scaning';
      this.fromModel.ScanPaymentCode = '';
      this.$nextTick(() => {
        this.$refs.scanPaymentCode.$el.children[0].focus();
      });
    },

    cancelClick() {
      this.$emit('cancel');
      this.$emit('close');
    },

    closeClick() {
      this.$emit('close');
    },

    onSubmit() {
      if (this.paying) {
        return;
      }
      this.paying = true;
      // this.$api['pay/payForOrder']({
      //   OrderID: this.orderId,
      //   PayTypeID: '00000000-0000-0000-0000-000000000000',
      //   PayKind: 'Scan',
      //   Money: this.scanPayMoney,
      //   Summary: this.fromModel.ScanPaymentCode,
      // }).then((res) => {
      //   this.payLogId = res.PayLogID;
      this.state = 'Querying';
      this.$nextTick(() => {
        this.$refs.PaymentScanLoading.onLoad();
        // this.paying = false;
      });
      // }, () => {
      //   this.paying = false;
      //   this.state = 'Fail';
      // });
    },

    handleScanPaySuccess() {
      this.paying = false;
      this.$emit('complete');
      this.$emit('update:visible', false);
    },

    handleScanPayFail() {
      this.paying = false;
      this.state = 'Fail';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.scan-page {
  width: 360px;
  // height: 300px;
}

.scan-main{
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
  align-items: center;

  span {
    font-size: $font-size-secondary;
    color: $font-color-currency;
  }

  .icon-scan {
    // stylelint-disable-next-line
    font-size: 159px;
    color: $color-primary;
    margin: 20px;
  }

  /deep/ .el-input {
    width: 320px;
  }

  /deep/ .el-input__inner {
    width: 320px;
  }

  /deep/ .el-button {
    width: 320px;
    height: 50px;
    position: absolute;
    bottom: 30px;
  }
}

.scan-fail {
  height: 360px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-primary;
  color: $font-color-placeholder;

  &-special {
    font-size: $font-size-regular;
    color: $font-color-primary;
  }

  .icon-fail {
    width: 180px;
    height: 180px;
    border-radius: $border-radius-circle;
    text-align: center;
    margin: 20px;
    // stylelint-disable-next-line
    background-color: rgba(#D0021B, .1);

    &-child {
      // stylelint-disable-next-line
      font-size: 150px;
      line-height: 180px;
      // stylelint-disable-next-line
      color: rgba(#D0021B, .6);
    }
  }

  /deep/ .el-button {
    width: 320px;
    height: 50px;
  }
}
</style>
