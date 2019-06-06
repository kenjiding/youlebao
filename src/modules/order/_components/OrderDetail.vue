<template>
  <div class="order-detail">
    <div class="order-detail-header">
      <div>
        <p>优惠</p>
        <p>{{ detailData.Discount || '-' }}{{ detailData.Discount?'元':'' }}</p>
      </div>
      <div>
        <p>应收</p>
        <p>{{ detailData.NeedPay }}元</p>
      </div>
      <div>
        <p>实收</p>
        <p class="p-total">{{ detailData.PaidMoney }}元</p>
      </div>
      <div>
        <p>已退</p>
        <p :class="detailData.ReturnMoney ? 'p-refund':''">
          {{ detailData.ReturnMoney || '-' }}{{ detailData.ReturnMoney?'元':'' }}
        </p>
      </div>
      <div>
        <p>支付方式</p>
        <p>{{ detailData.PayType }}</p>
      </div>
    </div>
    <div class="order-detail-main">
      <p>
        <span>账期:</span>
        <span>{{ detailData.PeriodName }}</span>
      </p>
      <p>
        <span>操作人:</span>
        <span>{{ detailData.OperateEmployeeName }}</span>
      </p>
      <p>
        <span>订单号码:</span>
        <span>{{ detailData.OrderNum }}</span>
      </p>
      <p>
        <span>操作终端:</span>
        <span>{{ detailData.TerminalName }}</span>
      </p>
      <p>
        <span>购买渠道:</span>
        <span>{{ detailData.ChannelName }}</span>
      </p>
      <p>
        <span>购买时间:</span>
        <span>{{ detailData.LogTime }}</span>
      </p>
      <el-tag
        :type="orderStatusType[detailData.OrderStatus]"
        class="tag-state">{{ orderStatusChs[detailData.OrderStatus] }}</el-tag>
    </div>
    <div
      :style="{
        height: listHeigth + 'px'
    }">
      <order-detail-list
        :goods-list="detailData.GoodsData"
        :pay-type-list="detailData.PaylogData"
      />
    </div>
    <div class="order-detail-footer">
      <div v-show="detailData.OrderStatus === 'Paying' && !detailData.IsOnlineOrder">
        <el-button
          :loading="paying"
          type="primary"
          @click="continueToPayClick">继续支付</el-button>
        <el-button
          :loading="canceling"
          type="primary"
          @click="cancelClick">取消订单</el-button>
      </div>
      <div v-show="showButton">
        <el-button
          v-show="detailData.LogisticsState === 'UnSend'"
          :loading="pickingup"
          @click="pickUpGoodsClick">取货</el-button>
        <el-button
          @click="refundClick">退货</el-button>
        <el-button
          v-show="hasTicket"
          type="primary"
          @click="printTicketClick">打印/绑定套票</el-button>
        <el-button
          type="primary"
          @click="rePrintClick">重打小票</el-button>
      </div>
    </div>

    <p
      class="close-arrow"
      @click="showRightPage">
      <i class="el-icon-arrow-right"/>
    </p>

    <refund-order
      :visible.sync="refundOrderVisible"
      :total-money="Number(detailData.TotalMoney)"
      :order-id="order.ID"
      :leaguer-id="detailData.LeaguerID"
      :item-list="detailData.GoodsData"
      :part-return="detailData.IsCanPartReturn"
      :total-fee="Number(detailData.TotalFee)"
      :total-cash-pay="Number(detailData.TotalCashPay)"
      @complete="handleRefundComplete"/>

    <out-ticket
      ref="outTicket"
      :default-tab="outTicketType"
      :visible.sync="outTicketVisible"
      :ticket-list="ticketList"
      is-reprint
      @closed="handleOutTicketClosed"/>

    <order-receipt
      ref="orderReceipt"
      :order-id="order.ID"
      @complete="handleReceiptComplete"
      @cancel="handleReceiptCancel"/>

    <payment
      ref="Payment"
      :visible="paymentVisible"
      :actual-charge="continuePayMoney"
      :order-id="order.ID"
      :leaguer-id="detailData.LeaguerID"
      @close="handleClose"
      @cancel="handlePaymentCancel"
      @complete="handlePaymentComplete"/>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import OrderDetailList from '@/modules/order/_components/OrderDetailList.vue';
import RefundOrder from '@/modules/order/_components/RefundOrder.vue';
import OutTicket from '@/modules/sell/_components/OutTicket.vue';
import OrderReceipt from '@/modules/order/_components/OrderReceipt.vue';
import Payment from '@/components/payment/Payment.vue';

export default {
  name: 'OrderDetail',

  components: {
    OrderDetailList,
    RefundOrder,
    OutTicket,
    OrderReceipt,
    Payment,
  },

  props: {
    order: {
      type: Object,
      default: () => {},
    },
    topHeight: {
      type: Number,
      default: 60,
    },
  },

  data() {
    return {
      detailData: {},
      closeArrow: true,
      orderStatusChs: {
        Paying: '待支付',
        Payed: '已支付',
        Refund: '已退款',
        PartReturned: '部分退货',
        Cancel: '已取消',
      },
      orderStatusType: {
        Paying: 'primary',
        Payed: 'success',
        Refund: 'warning',
        Cancel: 'info',
      },
      refundOrderVisible: false,
      ticketList: [],
      paying: false,
      canceling: false,
      paymentVisible: false,
      outCoinVisible: false,
      outTicketVisible: false,
      outTicketType: 'print',
      printing: false,
      pickingup: false, // 取货中
    };
  },

  computed: {
    ...mapState({
      listHeigth(state) {
        return state.client.pageHeight - this.topHeight - 296;
      },
    }),

    hasTicket() {
      if (this.detailData.GoodsData) {
        return this.detailData.GoodsData.some(item => item.GoodsType === 102
        && item.AlreadyReturnAmount < item.Amount);
      }
      return false;
    },

    showButton() {
      return this.detailData.OrderStatus === 'PartReturned' || this.detailData.OrderStatus === 'Payed';
    },

    continuePayMoney() {
      return Number((this.detailData.NeedPay - this.detailData.PaidMoney).toFixed(2));
    },

    outCoinAmount() {
      const coin = this.goodsInCompleteOrder.find(item => item.GoodsType === 101);
      if (coin) {
        return coin.Number;
      }
      return 0;
    },
  },


  methods: {
    onLoad() {
      this.$api['order/order/getOrderItemDetails']({
        OrderID: this.order.ID,
      }).then((res) => {
        this.detailData = res;
      });
    },

    showRightPage() {
      this.closeArrow = !this.closeArrow;
      this.$emit('close-arrow');
    },

    refundClick() {
      this.refundOrderVisible = true;
    },

    handleRefundComplete() {
      this.refundOrderVisible = false;
      // this.onLoad();
      this.$emit('reload-list');
    },

    printTicketClick() {
      this.$api['sell/ticket/getTicketSaleLogByOrder']({
        OrderID: this.order.ID,
      }).then((res) => {
        this.ticketList = res.DataList;
        if (this.ticketList.length > 0) {
          this.outTicketType = res.IsPrint ? 'print' : 'bind';
          this.outTicketVisible = true;
        }
      });
    },

    rePrintClick() {
      this.$refs.orderReceipt.onPrint(true);
    },

    continueToPayClick() {
      this.paying = true;
      this.paymentVisible = true;
    },

    cancelClick() {
      this.canceling = true;
      this.$api['sell/order/cancelOrder']({
        OrderID: this.order.ID,
      }).then(() => {
        this.canceling = false;
        this.$message({
          message: '订单已取消',
          type: 'success',
        });
        // this.onLoad();
        this.$emit('reload-list');
      }, () => {
        this.canceling = false;
      });
    },

    handleClose() {
      this.paying = false;
      this.paymentVisible = false;
    },

    handlePaymentCancel() {
      this.paying = false;
      // this.cancelClick();
    },

    handlePaymentComplete(summary) {
      this.paymentVisible = false;

      this.$api['sell/order/orderPaymentCompleted']({
        OrderID: this.order.ID,
        Summary: summary,
      }).then(() => {
        this.$message({
          message: '订单支付成功',
          type: 'success',
        });
        // this.onLoad();
        this.$emit('reload-list');
        this.$nextTick(() => {
          this.orderCompletedFollowOperaction();
        });
      }, () => {
        this.paying = false;
      });
    },

    handleReceiptComplete() {
      this.printing = false;
    },

    handleReceiptCancel() {
      this.printing = false;
    },

    orderCompletedFollowOperaction() {
      this.$api['sell/sell/orderCompletedFollowOperaction']({
        OrderID: this.order.ID,
      }).then((res) => {
        this.goodsInCompleteOrder = res.DataList;
        this.paying = false;
        this.$nextTick(() => {
          this.ticketList = res.DataList.filter(item => item.GoodsType === 102);
          if (this.ticketList.length > 0) {
            this.outTicketType = res.IsPrint ? 'print' : 'bind';
            this.outTicketVisible = true;
          } else if (this.outCoinAmount) {
            this.StartOutCoin();
          } else {
            this.$refs.orderReceipt.onPrint();
          }
        });
      }, () => {
        this.paying = false;
      });
    },

    handleOutTicketClosed() {
      if (this.outCoinAmount) {
        this.StartOutCoin();
      } else {
        this.$refs.orderReceipt.onPrint();
      }
    },

    StartOutCoin() {
      const _this = this;
      this.outCoinVisible = true;
      this.$createOutCoin({
        $props: {
          animationVisible: 'outCoinVisible',
          outCoin: 'outCoinAmount',
        },
        $events: {
          // 关闭dialog之后的回调
          closeDialog() {
            _this.outCoinVisible = false;
          },
          // 完成之后的回调
          complete() {
            _this.startReceiptPrint();
            // this.clearShoppingCart();
          },
          // 错误回调
          error() {
            _this.startReceiptPrint();
            _this.$api['physicalCoin/orderOutCoinError']({
              OrderID: this.order.ID,
            });
          },
        },
      });
    },

    startReceiptPrint() {
      if (!this.printing) {
        this.printing = true;
        this.$refs.orderReceipt.onPrint();
      }
    },

    // 取货按钮事件
    pickUpGoodsClick() {
      this.pickingup = true;
      this.$api['order/order/sendAndReceiveOrder']({
        OrderID: this.order.ID,
      }).then(() => {
        this.$message({
          message: '订单取货成功',
          type: 'success',
        });
        this.pickingup = false;
        this.onLoad();
      }, () => {
        this.pickingup = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.order-detail {
  width: 700px;
  // height: 610px;
  background-color: $color-white;
  box-shadow: -6px 0 10px 0 rgba(0, 0, 0, .2);

  &-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;

    > div{
      width: 140px;
      height: 80px;
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      justify-content: center;

      p {
        font-size: $font-size-regular;
      }

      p:first-child {
        font-size: $font-size-special;
        color: $font-color-primary;
        margin-bottom: 5px;
      }

      .p-total {
        color: $font-color-special;
      }

      .p-refund {
        color: $font-color-currency;
      }
    }
  }

  &-main {
    width: 660px;
    height: 90px;
    margin: 0 10px;
    padding: 10px;
    border-top: 1px $border-color solid;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    p {
      width: 275px;
      height: 30px;
      line-height: 30px;
      font-size: $font-size-primary;
      color: $font-color-regular;

      span:first-child {
        color: $font-color-placeholder;
        margin-right: 10px;
      }
    }

    .tag-state {
      position: absolute;
      right: 20px;
    }
  }

  &-footer {
    height: 40px;
    width: 680px;
    padding: 10px;
    border-top: 1px $border-color solid;
    text-align: right;

    /deep/ .el-button--primary {
      width: 200px;
    }
  }

  .close-arrow {
    display: flex;
    width: 35px;
    height: 35px;
    border-radius: $border-radius-circle;
    position: absolute;
    left: -20px;
    top: 48%;
    font-size: $font-size-regular;
    background-color: $color-white;
    border: 1px solid $border-color;
    justify-content: center;
    align-items: center;
    color: $font-color-secondary;
    z-index: 2000;
  }
}

</style>
