<template>
  <ych-page class="body-wrap">
    <el-card
      class="box-card">

      <div
        class="content">
        <div class="content-left">
          <img src="../../../assets/coinOn.png">
        </div>

        <div class="content-right">
          <div class="top-item">
            <div>
              <p :style="{marginTop: '10px'}">购买金额</p>
              <el-input
                ref="payMoneyInput"
                v-model="ruleForm.PayMoney"
                type="number"
                @keyup.enter.native="handlePayMoneySubmit"
                @change="clearInputData"
                @blur="checkPayMoney">
                <template slot="append">
                  <el-button @click="handlePayMoneySubmit">确定</el-button>
                </template>
              </el-input>
            </div>
            <div>
              <p :style="{marginTop: '10px'}">会员</p>
              <ych-read-card
                ref="readCardComponent"
                class="read-cart"
                @change="changeCard"
                @logout="clearData"/>
            </div>
          </div>
          <p :style="{margin: '5px 0'}">选择购币类型</p>
          <div :style="{width: '550px'}">
            <el-tabs
              v-model="activeName"
              stretch
              type="border-card"
              @tab-click="changeStatus">
              <el-tab-pane
                :disabled="tabsDisabled"
                label="存入会员卡"
                name="VirtualCoin">

                <VirtualItem
                  :discount-data="discountSetMeal"
                  :recommend-data="recommendSetMeal"
                  :recommend-info="recommendInfo"
                  @changeTotalNum="changeTotal"
                  @showTable="tableShow"/>

              </el-tab-pane>

              <el-tab-pane
                label="出实物币"
                name="PhysicalCoin">

                <PhysicalItem
                  :discount-data="discountSetMeal"
                  :recommend-data="recommendSetMeal"
                  :recommend-info="recommendInfo"
                  @changeTotalNum="changeTotal"
                  @showTable="tableShow"/>

              </el-tab-pane>
            </el-tabs>
          </div>


          <div style="clear: both;"/>
          <!-- <p>选择支付方式</p>
          <div class="pay-style">
            <el-button>默认按钮</el-button>
            <el-button>默认按钮</el-button>
            <el-button>默认按钮</el-button>
          </div> -->
          <div class='primary'>
            <el-button
              ref="paySubmit"
              :loading="buttonStatus"
              type="primary"
              @click="payHandleBefore">结账
              <span class="primary-price">￥{{ acountPlice }}</span>
            </el-button>
          </div>

        </div>

      </div>
      <TableDialog
        :table-visible.sync="tableVisible"
        :table-data="tableData"
        :witch-type="witchType"/>
    </el-card>

    <payment
      ref="Payment"
      :visible="paymentVisible"
      :actual-charge="actualCharge"
      :order-id="orderID"
      :leaguer-id="ruleForm.LeaguerID"
      @close="handleClose"
      @cancel="handleOrderCancel"
      @complete="handleOrderComplete"/>

    <order-receipt
      ref="orderReceipt"
      :order-id="orderID"
      @complete="handleReceiptComplete"
      @cancel="handleReceiptCancel"/>

  </ych-page>
</template>

<script>
import checkCoinMachineLink from '@/utils/checkCoinMachineLink';
import Payment from '@/components/payment/Payment.vue';
import OrderReceipt from '@/modules/order/_components/OrderReceipt.vue';
import TableDialog from '../_components/TableDialog.vue';
import VirtualItem from '../_components/VirtualCoin.vue';
import PhysicalItem from '../_components/PhysicalCoin.vue';

export default {
  name: '',

  components: {
    TableDialog,
    Payment,
    OrderReceipt,
    VirtualItem,
    PhysicalItem,
  },

  props: {
    isReadcard: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      ruleForm: {
        PayMoney: '',
        LeaguerID: '',
      },
      typeActive: false,
      paymentVisible: false,
      actualCharge: 0,
      orderID: '',
      buttonStatus: false,
      tableVisible: false,
      tableData: [],
      acountPlice: '',
      enterLoading: false,
      active: false,
      witchType: true,
      outCoinVisible: false,
      activeName: 'PhysicalCoin',
      outCoinCount: '',
      discountSetMeal: {
        GoodsList: [],
      },
      recommendSetMeal: {
        GoodsList: [],
      },
      recommendInfo: '',
      rules: {
        PayMoney: [
          {
            required: true, message: '请输入购买金额', trigger: 'blur', pattern: /^[1-9]\d*(\.\d+)?$/,
          },
        ],
        LeaguerID: [
          { required: true, message: '请读卡' },
        ],
      },
      printing: false,
    };
  },

  computed: {
    tabsDisabled() {
      return !this.ruleForm.LeaguerID;
    },
  },

  mounted() {
    setTimeout(() => {
      this.isReadcard && this.$refs.readCardComponent.onRead();
      this.$refs.payMoneyInput.$el.children[0].focus();
    }, 500);
  },

  activated() {
    setTimeout(() => {
      this.$refs.payMoneyInput.focus();
    }, 500);
  },

  methods: {
    checkPayMoney() {
      if (this.ruleForm.PayMoney.indexOf('.') > -1) {
        const num = this.ruleForm.PayMoney.split('.')[0];
        if (Number(num) > 999999) {
          this.ruleForm.PayMoney = '999999';
        } else {
          this.ruleForm.PayMoney = num;
        }
      } else if (Number(this.ruleForm.PayMoney) > 999999) {
        this.ruleForm.PayMoney = '999999';
      }
    },
    changeTotal(val, coinNum) {
      this.acountPlice = val;
      this.outCoinCount = coinNum;
    },
    getData() {
      this.enterLoading = true;
      this.$api['goods-currency/coin/getMaxDiscountSellCoinMeal']({
        LeaguerID: this.ruleForm.LeaguerID,
        PayMoney: this.ruleForm.PayMoney,
        CoinType: this.activeName,
      }).then((res) => {
        this.active = true;
        this.enterLoading = false;

        this.discountSetMeal = res.DiscountSetMeal;
        this.recommendSetMeal = res.RecommendSetMeal;
        this.recommendInfo = res.RecommendInfo;
        // 每次获取新的数据都清空结算值
        this.acountPlice = '';
        // this.acountPlice = res.DiscountSetMeal.TotalPrice;
      }, () => {
        this.active = false;
        this.enterLoading = false;
      });
    },
    handleClose() {

    },

    selectCoinType(type) {
      this.activeName = type;
      this.typeActive = !this.typeActive;

      this.changeStatus();
    },

    handleOrderComplete() {
      this.$api['sell/order/orderPaymentCompleted']({
        OrderID: this.orderID,
      }).then(() => {
        this.paymentVisible = false;

        this.$message({
          message: '订单支付成功',
          type: 'success',
        });

        if (this.activeName === 'PhysicalCoin') {
          this.outCoin(this.outCoinCount);
        } else {
          this.$refs.orderReceipt.onPrint();
        }
      });
    },

    handleReceiptComplete() {
      this.printing = false;
      this.$refs.readCardComponent.logout();
    },

    handleReceiptCancel() {
      this.printing = false;
      this.$refs.readCardComponent.logout();
    },

    outCoin(num) {
      const _this = this;
      this.outCoinVisible = true;
      this.$createOutCoin({
        $props: {
          animationVisible: 'outCoinVisible',
          outCoin: num,
        },
        $events: {
          complete() {
            _this.startReceiptPrint();
          },
          closeDialog() {
            _this.outCoinVisible = false;
          },
          error() {
            _this.orderError();
            _this.startReceiptPrint();
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

    orderError() {
      this.$api['physicalCoin/orderOutCoinError']({
        OrderID: this.orderID,
      });
    },
    handleOrderCancel() {
      this.$api['sell/order/cancelOrder']({
        OrderID: this.orderID,
      }).then(() => {
        this.paymentVisible = false;

        this.$message({
          message: '订单已取消',
          type: 'success',
        });
      });
    },

    payHandleBefore() {
      if (this.enterLoading) return;
      if (this.activeName === 'VirtualCoin') {
        this.acountPlice && this.virtualCoinPay();
      } else {
        this.acountPlice && this.physicalCoinPay();
      }
    },
    virtualCoinPay() {
      this.buttonStatus = true;
      this.payHandle();
    },
    physicalCoinPay() {
      this.buttonStatus = true;
      checkCoinMachineLink().then(() => {
        this.payHandle();
      }, () => {
        this.$alert(
          '<p>无法售卖实物币，售币机未连接。</p><p>请尝试以下方法解决：</p><p>1.检查连接线是否正常</p><p>2.重启售币机</p>',
          '提示', {
            dangerouslyUseHTMLString: true,
            type: 'error',
          },
        );
        this.buttonStatus = false;
      });
    },
    payHandle() {
      this.$api['goods-currency/coin/saveMaxDicountCoinOrder']({
        LeaguerID: this.ruleForm.LeaguerID,
        PayMoney: this.acountPlice,
        CoinType: this.activeName,
      }).then((res) => {
        this.actualCharge = res.ActualCharge;
        this.orderID = res.OrderID;
        this.paymentVisible = true;
        this.buttonStatus = false;
      }, () => {
        this.buttonStatus = false;
      });
    },

    handlePayMoneySubmit() {
      this.checkPayMoney();
      if (!/^[1-9]\d*(\.\d+)?$/.test(this.ruleForm.PayMoney)) {
        this.$message({
          message: '请输入正确的购买金额！',
          type: 'warning',
        });
        return;
      }
      this.changeStatus();
      if (!this.ruleForm.LeaguerID && this.$device.readerCall(true) !== -1 && this.$refs.readCardComponent.selectedType === 'member') {
        this.$refs.readCardComponent.onRead();
      }
      this.$refs.paySubmit.$el.focus();
    },

    changeStatus() {
      this.getData();
      this.witchType = this.activeName === 'PhysicalCoin';
    },

    tableShow(data) {
      if (!this.active) return;
      this.tableVisible = true;
      this.tableData = data;
    },

    changeCard(data) {
      if (data) {
        this.activeName = 'VirtualCoin';
        this.ruleForm.LeaguerID = data.ID;
      }
      this.changeStatus();
    },

    clearInputData(val) {
      if (val !== 0) return;
      this.ruleForm.PayMoney = '';
      this.acountPlice = '';
      this.active = false;
      this.discountSetMeal = {
        GoodsList: [],
      };
      this.recommendSetMeal = {
        GoodsList: [],
      };
      this.recommendInfo = '';
    },
    clearData() {
      this.activeName = 'PhysicalCoin';
      this.ruleForm.LeaguerID = '';
      this.ruleForm.PayMoney = '';
      this.acountPlice = '';
      this.active = false;
      this.discountSetMeal = {
        GoodsList: [],
      };
      this.recommendSetMeal = {
        GoodsList: [],
      };
      this.recommendInfo = '';
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.read-cart {
  min-width: 290px !important;
}

.top-item {
  width: 600px;
  overflow: hidden;

  div {
    float: left;
    width: 250px;

    &:first-child {
      margin-right: 10px;
    }
  }
}

.body-wrap {
  /deep/ .ych-page__wrap {
    // stylelint-disable-next-line
    background-color: #5A6882;
    position: relative;
  }
}

.primary {
  width: 550px;

  /deep/ .el-button {
    display: block;
    width: 100%;
    float: right;
    margin-bottom: 30px;
    margin-top: 20px;
    height: 70px;
    border-radius: $border-radius-small;
    padding: 0 20px;
    box-sizing: border-box;

    span {
      display: inline-block;
      height: 100%;
      color: $color-white;
      text-align: left;
      width: 100%;
      vertical-align: middle;

      .primary-price {
        font-size: $font-size-secondary;
        width: 90%;
        text-align: right;
        line-height: 70px;
      }
    }
  }
}

.pay-style {
  /deep/ .el-button {
    margin-left: 0;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.box-card {
  width: 900px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);

  /deep/ .el-card__body {
    width: 100%;
    overflow: hidden;
    padding: 0;
  }
}

.content {
  width: 100%;

  &-left {
    width: 35%;
    float: left;
    overflow: hidden;
    height: 563px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      margin: 0 auto;
    }
  }

  &-right {
    width: 65%;
    float: left;

    /deep/ .el-input-number {
      input {
        height: 40px;
      }
    }

    p {
      padding: 10px 0;
    }
  }
}

</style>
