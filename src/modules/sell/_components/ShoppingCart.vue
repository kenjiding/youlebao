<template>
  <div class="shopping-cart-main">
    <div class="header">
      <read-card
        ref="cardReader"
        :value="cardKeyValue"
        :auto-logout="false"
        @change="handleReadLeaguer"
        @logout ="handleLeaguerLogout"/>
    </div>
    <div class="list">
      <div class="list-header">
        <el-row>
          <el-col
            :span="12">名称
          </el-col>
          <el-col
            :span="4"
            class="p-center">
            <p>数量</p>
          </el-col>
          <el-col :span="6">
            <p class="p-last">小计</p>
          </el-col>
          <el-col :span="2">
            <el-popover
              v-model="closeAll"
              placement="left"
              width="160">
              <p class="close-tips">是否清空购物车</p>
              <div class="btn-group">
                <el-button
                  size="mini"
                  @click="closeAll = false">取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="clearAllClick">确定</el-button>
              </div>
              <i
                v-show="shoppingList.length"
                slot="reference"
                class="ych-icon-close icon-close"/>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div
        :style="{
          height: listHeight+'px'
        }"
        class="menu-wraper">
        <div
          v-show="shoppingList.length <= 0"
          class="img-empty">
          <img
            src="../../../assets/empty-box.png">
          <div>赶快添加商品吧~</div>
        </div>
        <template
          v-for="goods in shoppingList">
          <el-row
            :key="goods.ID"
            :class="{'current-row': currentSelect === goods.ID}"
            class="list-row"
            @click.native="changeGoods(goods)">
            <el-col :span="12">
              <p>{{ goods.Name }}</p>
            </el-col>
            <el-col :span="4">
              <el-input-number
                :name="`input_${goods.ID}`"
                v-model="goods.Amount"
                :controls="false"
                :max="goods.Type === '102' ? 100 : 9999"
                :min="1"
                :class="{'current-change': currentSelect === goods.ID}"
                size="small"
                @keydown.enter.native="rowCalculate(goods)"
                @blur="rowCalculate(goods)"
                @focus="rowFocus($event)"/>
                <!-- @keydown.native="keyPress($event)" -->
            </el-col>
            <el-col :span="6">
              <p class="list-row-price">
                <span>
                  {{
                    $number(goods.totalPrice).format('0.00').split('.')[0]
                  }}
                </span>
                <span>
                  .{{
                    $number(goods.totalPrice).format('0.00').split('.')[1]
                  }}
                </span>
              </p>
            </el-col>
            <el-col :span="2">
              <i
                class="ych-icon-close icon-close"
                @click="removeGoodsfromShoppingCart(goods.ID)"/>
            </el-col>
          </el-row>
        </template>
      </div>
    </div>
    <div class="search">
      <quick-search
        :query-coupon="true"
        @selected="handleQuickSearchSelected"/>
    </div>
    <div class="footer">
      <el-row class="footer-row">
        <el-col :span="12">
          <p>共{{ totalAmount }}项，合计：</p>
        </el-col>
        <el-col :span="12">
          <p class="footer-row-price">¥ {{ totalCharge }}</p>
        </el-col>
      </el-row>
      <el-row
        v-if="couponNumber != '' || totalDiscount > 0"
        class="footer-row">
        <el-col :span="12">
          <i
            class="ych-icon-info icon-discount"
            @click="discountDetailVisible=true"/>
          <span>立减：</span>
        </el-col>
        <el-col :span="12">
          <p class="footer-row-price">- ¥ {{ totalDiscount }}</p>
        </el-col>
      </el-row>
      <el-row
        v-else
        class="footer-row">
        <el-col :span="24">
          <p class="p-special">暂无优惠</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-button
            class="button-hold"
            type="warning"
            @click="holdingOrder()">
            <span>{{ holding?'恢复':'挂单' }}</span><br>
            <span class="span-special">(F11)</span>
          </el-button>
        </el-col>
        <el-col :span="18">
          <el-button
            :disabled="shoppingList.length === 0 "
            :loading="checkingOut"
            class="button-confirm"
            type="danger"
            @click="checkOut()">
            <p v-show="!checkingOut">
              <span>
                <span>结账:</span><br>
                <span class="span-special">(Enter)</span>
              </span>
              <span class="button-confirm-price">
                <span>¥ {{ $number(actualCharge).format('0.00').split('.')[0] }}</span>
                <span>.{{ $number(actualCharge).format('0.00').split('.')[1] }}</span>
              </span>
            </p>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="wave-img">
      <img src="../../../assets/down-wave.png">
    </div>
    <payment
      ref="Payment"
      :visible="paymentVisible"
      :actual-charge="actualCharge"
      :order-id="orderID"
      :leaguer-id="leaguerId"
      @close="handleClose"
      @cancel="handleOrderCancel"
      @complete="handleOrderComplete"/>

    <fill-extend-info
      ref="fillExtendInfo"
      :visible="fillExtendVisible"
      :leaguer="currentLeaguer"
      @close="handleCancelFillExtend"
      @submit="handleGetExtendInfo"/>

    <out-ticket
      ref="outTicket"
      :default-tab="outTicketType"
      :leaguer="currentLeaguer"
      :visible.sync="outTicketVisible"
      :ticket-list="ticketList"
      need-tips
      @closed="handleOutTicketClosed"/>

    <order-receipt
      ref="orderReceipt"
      :order-id="orderID"
      @complete="handleReceiptComplete"
      @cancel="handleReceiptCancel"/>

    <discount-detail
      :visible.sync="discountDetailVisible"
      :list="discountDetailList"/>

  </div>
</template>

<script>
import Payment from '@/components/payment/Payment.vue';
import QuickSearch from '@/modules/sell/_components/QuickSearch.vue';
import FillExtendInfo from '@/modules/sell/_components/FillExtendInfo.vue';
import OutTicket from '@/modules/sell/_components/OutTicket.vue';
import ReadCard from '@/components/read-card/ReadCard.vue';
import OrderReceipt from '@/modules/order/_components/OrderReceipt.vue';
import DiscountDetail from '@/modules/sell/_components/DiscountDetail.vue';
import { mapGetters } from 'vuex';
import checkCoinMachineLink from '@/utils/checkCoinMachineLink';

export default {
  name: 'ShoppingCart',

  components: {
    Payment,
    QuickSearch,
    FillExtendInfo,
    OutTicket,
    ReadCard,
    OrderReceipt,
    DiscountDetail,
  },

  data() {
    return {
      cardKeyValue: '',
      leaguerId: '',
      currentLeaguer: {},
      currentAddGoods: {},
      couponNumber: '',
      shoppingList: [],
      holdingList: [], // 挂起的购物列表
      totalCharge: 0,
      totalDiscount: 0,
      actualCharge: 0,
      timeStamp: '',
      checkingOut: false, // 下单状态
      orderID: '',
      paymentVisible: false, // 支付界面显示
      extendInfo: '', // 额外信息
      fillExtendVisible: false, // 额外信息界面显示
      goodsInCompleteOrder: [], // 订单完成后续操作商品
      outTicketVisible: false, // 打印/绑定套票界面显示
      outTicketType: 'print', // 套票界面默认显示的标签页
      closeAll: false,
      outCoinVisible: false, // 出币界面显示
      currentSelect: '', // 当前选择的商品
      discountDetailVisible: false, // 优惠详细显示
      discountDetailList: [], // 优惠详细信息列表
      checkoutLeaguerId: '',
      printing: false, // 小票打印标识，防止多次触发（出币）
    };
  },

  computed: {
    ...mapGetters({
      pageHeight: 'pageHeight',
      hasTicketRegister: 'gobalConfig/hasTicketRegister',
    }),

    listHeight() {
      return this.pageHeight - 370;
    },

    totalAmount() {
      let sum = 0;
      this.shoppingList.forEach((item) => {
        sum += Number(item.Amount);
      });
      return sum;
    },

    holding() {
      return this.holdingList.length > 0;
    },

    goodsData() {
      const data = [];
      this.shoppingList.forEach((goods) => {
        if (goods.Amount > 0) {
          data.push({
            GoodsID: goods.ID,
            Amount: goods.Amount,
          });
        }
      });
      return data;
    },

    needExtendInfo() {
      return this.shoppingList.some(item => item.NeedExtraInfo === true);
    },

    ticketList() {
      return this.goodsInCompleteOrder.filter(item => item.GoodsType === 102);
    },

    needOutCoin() {
      const coinGoods = this.shoppingList.filter(item => item.Type === '101' || item.Type === '6');
      const physicalCoin = coinGoods.find(goods => goods.CoinType === 'PhysicalCoin');
      if (physicalCoin) {
        return true;
      }
      const autoCoin = coinGoods.find(goods => goods.CoinType === 'AutoCoin');
      if (autoCoin && !this.leaguerId) {
        return true;
      }
      return false;
    },

    outCoinAmount() {
      const coin = this.goodsInCompleteOrder.find(item => item.GoodsType === 101);
      if (coin) {
        return coin.Number;
      }
      return 0;
    },
  },

  created() {
    window.addEventListener('keydown', this.sellKeydownListen);
  },

  methods: {
    changeGoods(item) {
      this.currentSelect = item.ID;
      this.$nextTick(() => {
        if (document.getElementsByName(`input_${item.ID}`)[0]) {
          document.getElementsByName(`input_${item.ID}`)[0].focus();
        }
      });
    },
    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.leaguerId = leaguer.ID;
        this.currentLeaguer = leaguer;
      }
    },

    handleGetLeaguer(leaguer) {
      let leaguerId = '';
      if (leaguer) {
        leaguerId = leaguer.ID;
      }
      if (this.currentAddGoods.ID) {
        this.checkAndAddGoods(leaguerId, this.currentAddGoods, true);
      }
      if (this.checkingOut) {
        this.checkFinalLeaguer();
      }
    },

    handleLeaguerLogout() {
      this.leaguerId = '';
      this.currentLeaguer = {};
    },

    sellKeydownListen(event) {
      const _self = this;
      const key = event.keyCode;
      // 防止手抖多次点击
      if (this.$route.path !== '/sell'
      || _self.checkingOut
      || event.target.localName === 'input'
      || this.$store.state.sell.shortcutOpen) { return; }

      if (key === 13 && _self.shoppingList.length > 0) {
        _self.checkOut();
      } else if (key === 122) {
        _self.holdingOrder();
      }
    },

    addGoodsToShoppingCart(goods, needFocus) {
      if (!this.leaguerId) {
        this.currentAddGoods = goods;
        if (this.$device.readerCall(true) === -1 || this.$refs.cardReader.selectedType === 'keyboard') {
          this.checkAndAddGoods(this.leaguerId, goods, needFocus);
        } else {
          this.$refs.cardReader.onRead(this.handleGetLeaguer);
        }
      } else {
        this.checkAndAddGoods(this.leaguerId, goods, needFocus);
      }
    },

    checkAndAddGoods(leaguerId, goods, needFocus) {
      // 检查是否可加入购物车
      this.$api['sell/sell/checkGoodsCanSale']({
        GoodsID: goods.ID,
        LeaguerID: leaguerId,
      }).then(() => {
        this.currentSelect = goods.ID;

        const findedGoods = this.shoppingList.find(item => item.ID === goods.ID);
        if (findedGoods !== undefined) {
          Object.assign(findedGoods, {
            Amount: Number(findedGoods.Amount) + 1,
            Price: goods.Price,
            totalPrice: findedGoods.Price * (Number(findedGoods.Amount) + 1),
          });
        } else {
          this.shoppingList.push({
            ID: goods.ID,
            Name: goods.Name,
            Price: goods.Price,
            Amount: 1,
            totalPrice: goods.Price,
            Type: goods.Type,
            CoinType: goods.CoinType,
            NeedExtraInfo: goods.NeedExtraInfo,
          });
        }
        if (findedGoods !== undefined || this.shoppingList.length === 1) {
          this.calculate();
        }
        if (needFocus) {
          this.$nextTick(() => {
            document.getElementsByName(`input_${goods.ID}`)[0].focus();
          });
        } else {
          this.calculate();
        }
        this.currentAddGoods = {};
      }, () => {
        this.currentAddGoods = {};
      });
    },

    rowFocus(e) {
      e.currentTarget.select();
    },

    removeGoodsfromShoppingCart(goodsId) {
      const index = this.shoppingList.findIndex(goods => goods.ID === goodsId);
      this.shoppingList.splice(index, 1);
      if (this.shoppingList.length === 0) {
        this.clearShoppingCart();
      } else {
        this.calculate();
      }
    },

    clearAllClick() {
      this.clearShoppingCart();
      this.closeAll = false;
    },

    clearShoppingCart() {
      this.shoppingList = [];
      this.totalCharge = 0;
      this.totalDiscount = 0;
      this.actualCharge = 0;
      this.goodsInCompleteOrder = [];
      this.couponNumber = '';
      this.discountDetailList = [];
      // this.extendInfo = '';
    },

    rowCalculate(row) {
      row.totalPrice = row.Price * row.Amount;
      this.calculate();
      if (document.getElementsByName(`input_${row.ID}`)[0]) {
        document.getElementsByName(`input_${row.ID}`)[0].blur();
      }
    },

    calculate() {
      if (this.goodsData.length > 0) {
        this.timeStamp = new Date().getTime();
        const { timeStamp } = this;
        this.$api['sell/sell/calculateShoppingCart']({
          GoodsData: this.goodsData,
          LeaguerID: this.leaguerId,
          CouponNumber: this.couponNumber,
          TimeStamp: timeStamp,
        }).then((res) => {
          this.discountDetailList = res.Data.filter(item => item.DiscountAmount > 0);
          if (timeStamp === this.timeStamp) {
            this.totalCharge = res.TotalCharge;
            this.totalDiscount = res.TotalDiscount;
            this.actualCharge = res.ActualCharge;
          }
        });
      }
    },

    holdingOrder() {
      if (this.holding) {
        this.shoppingList = this.holdingList;
        this.holdingList = [];
        this.calculate();
      } else {
        this.holdingList = this.shoppingList;
        this.$refs.cardReader.logout();
        this.clearShoppingCart();
      }
    },

    handleCancelFillExtend() {
      this.checkingOut = false;
      this.fillExtendVisible = false;
    },

    handleGetExtendInfo(extendInfoJson) {
      this.extendInfo = extendInfoJson;
      this.fillExtendVisible = false;
      this.createOrder();
    },

    checkOut() {
      this.checkingOut = true;
      const checkId = this.leaguerId;
      this.checkoutLeaguerId = checkId;
      if (this.$device.readerCall(true) !== -1 && this.$refs.cardReader.selectedType === 'member') {
        this.$refs.cardReader.onRead(this.handleGetLeaguer);
      } else {
        this.$nextTick(() => {
          this.checkFinalLeaguer();
        });
      }
    },

    // 1.检查前后读取的会员是否一致
    checkFinalLeaguer() {
      if (!this.checkoutLeaguerId) {
        this.checkMachineLinkState();
        return;
      }
      if (this.checkoutLeaguerId === this.leaguerId) {
        this.checkMachineLinkState();
        return;
      }
      this.$confirm('会员不一致，请确认会员卡').then(() => {
        this.checkMachineLinkState();
      }).catch(() => {
        this.checkingOut = false;
        this.checkoutLeaguerId = '';
      });
    },

    // 2.检查是否有实物币或无卡自动币，有则检查售币机连接状态
    checkMachineLinkState() {
      if (this.needOutCoin) {
        checkCoinMachineLink().then(() => {
          this.confirmPay();
        }, () => {
          this.$alert(
            '<p>无法售卖实物币，售币机未连接。</p><p>请尝试以下方法解决：</p><p>1.检查连接线是否正常</p><p>2.重启售币机</p>',
            '提示', {
              dangerouslyUseHTMLString: true,
              type: 'error',
            },
          );
          // this.$message({
          //   message: '柜台售币机连接异常,无法售卖实物币',
          //   type: 'error',
          // });
          this.checkingOut = false;
          this.checkoutLeaguerId = '';
        });
      } else {
        this.confirmPay();
      }
    },

    // 3.检查是否需要填写额外信息
    confirmPay() {
      if (this.needExtendInfo && this.hasTicketRegister) {
        this.fillExtendVisible = true;
      } else {
        this.createOrder();
      }
    },

    createOrder() {
      this.$api['sell/order/createOrder']({
        GoodsData: this.goodsData,
        LeaguerID: this.leaguerId,
        CouponNumber: this.couponNumber,
        TimeStamp: this.timeStamp,
        ExtendInfo: this.extendInfo,
      }).then((res) => {
        this.orderID = res.OrderID;
        this.actualCharge = res.ActualCharge;
        this.paymentVisible = true;
        this.extendInfo = '';
      }, () => {
        this.checkingOut = false;
      });
    },

    handleClose() {
      this.checkingOut = false;
      this.paymentVisible = false;
    },

    handleOrderCancel() {
      this.$api['sell/order/cancelOrder']({
        OrderID: this.orderID,
      }).then(() => {
        this.$message({
          message: '订单已取消',
          type: 'success',
        });
      });
    },

    handleOrderComplete(summary) {
      this.paymentVisible = false;

      this.$api['sell/order/orderPaymentCompleted']({
        OrderID: this.orderID,
        Summary: summary,
      }).then(() => {
        this.$message({
          message: '订单支付成功',
          type: 'success',
        });
        this.$nextTick(() => {
          this.orderCompletedFollowOperaction();
        });
      }, () => {
        this.checkingOut = false;
      });
    },

    handleReceiptComplete() {
      this.printing = false;
      this.checkingOut = false;
      this.$refs.cardReader.logout();
      this.clearShoppingCart();
    },

    handleReceiptCancel() {
      this.printing = false;
      this.checkingOut = false;
      this.$refs.cardReader.logout();
      this.clearShoppingCart();
    },

    orderCompletedFollowOperaction() {
      this.$api['sell/sell/orderCompletedFollowOperaction']({
        OrderID: this.orderID,
      }).then((res) => {
        this.goodsInCompleteOrder = res.DataList;
        // this.checkingOut = false;
        this.$nextTick(() => {
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
        this.checkingOut = false;
      });
    },

    handleOutTicketClosed() {
      if (this.outCoinAmount) {
        this.StartOutCoin();
      } else {
        this.$refs.orderReceipt.onPrint();
      }
    },

    handleQuickSearchSelected(selectedItem, isCouponData) {
      if (isCouponData) {
        this.couponNumber = selectedItem.Number;
        this.calculate();
      } else {
        this.addGoodsToShoppingCart(selectedItem, false);
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
          },
          // 错误回调
          error() {
            _this.$api['physicalCoin/orderOutCoinError']({
              OrderID: _this.orderID,
            });
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
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .shopping-cart-main {
    width: 340px;

    .header {
      height: 40px;
      padding: 10px 10px 20px;
      // stylelint-disable-next-line
      background-color: #F3F3F5;
    }
  }

  .list {
    &-header {
      width: 330px;
      height: 30px;
      padding-left: 10px;
      font-size: $font-size-primary;
      line-height: 30px;
      // stylelint-disable-next-line
      background-color: #F3F3F5;
      color: $font-color-placeholder;
      overflow: hidden;

      div {
        text-align: left;
      }

      .p-center {
        text-align: center;
        // padding-left: 25px;
      }

      .p-last {
        text-align: right;
        padding-right: 10px;
      }
    }

    .menu-wraper {
      // height: 420px;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: $color-white;

      .img-empty {
        // height: 210px;
        // width: 120px;
        position: absolute;
        bottom: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: $font-color-placeholder;
        text-align: center;
        img {
          margin-bottom: 10px;
        }
        // stylelint-disable-next-line
        // font-size: 120px;
      }
      /deep/ .cube-scroll-wrapper {
        overflow-y: scroll;
      }
    }

    &-row {
      width: 340px;
      height: 40px;
      padding-left: 10px;
      background-color: $color-white;
      font-size: $font-size-primary;
      line-height: 40px;
      color: $font-color-regular;
      border-bottom: 1px solid $color-bg-table;
      overflow: hidden;
      $two-px: 2px;
      cursor: pointer;

      &-price {
        width: 90%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          font-size: $font-size-primary - $two-px;
        }

        span:first-child {
          font-size: $font-size-primary;
        }
      }
      .amount {
        width: 60px;
        display: block;
        text-align: center;
      }
      /deep/ .el-input-number {
        width: 60px;
        top: -2px;
      }

      /deep/ .el-input__inner {
        padding: 0 10px;
        height: 28px;
        border-width: 0;
      }
      .current-change {
        /deep/ .el-input__inner {
          border-width: 1px;
        }
      }
    }
  }
  .current-row {
    // stylelint-disable-next-line
    background-color: rgba($color-primary, .05);
  }
  .search {
    height: 60px;
    background-color: $color-white;
    box-sizing: border-box;
    border-bottom: 1px dashed $font-color-placeholder;
  }

  .footer {
    height: 150px;
    padding: 0 10px;
    box-sizing: border-box;
    color: $color-white;
    background-color: $color-white;
    font-size: $font-size-primary;
    $two-px: 2px;
    $four-px: 4px;

    &-row {
      width: 300px;
      height: 40px;
      padding: 0 10px;
      margin-left: 20px;
      color: $font-color-primary;
      line-height: 35px;
      overflow: hidden;
      &:first-child {
        line-height: 45px;
      }

      &-price {
        width: 90%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: $font-size-primary + $two-px;
      }

      .icon-discount {
        font-size: $font-size-primary + $two-px;
        // stylelint-disable-next-line
        color: #F5A623;
        margin-right: 8px;
        line-height: 35px;
      }

      .p-special {
        color: $font-color-placeholder;
      }
    }

    &-line {
      width: 320px;
      height: 0;
      border: .5px solid $font-color-placeholder;
      opacity: .2;
    }

    .button-hold {
      height: 60px;
      color: $color-white;
      border: 0;
      // stylelint-disable-next-line
      // background-color: #FFA30D;
      // &:hover {
      //   // stylelint-disable-next-line
      //   background-color: #E8950B;
      // }
    }

    .button-confirm {
      height: 60px;
      width: 100%;
      border: 0;
      color: $color-white;
      padding: 0 10px 0 20px;
      p {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
      }

      &-price {
        span {
          font-size: $font-size-regular + $four-px;
        }

        span:first-child {
          font-size: $font-size-secondary;
        }
      }
    }
    /deep/ .el-button--danger.is-disabled {
      background-color: $color-danger;
    }
    .span-special {
      font-size: $font-size-special;
      color: transparentize($color-white, .4);
    }
  }
  .wave-img {
    font-size: 0;
    img {
      width: 340px;
      height: 10px;
    }
  }
  .btn-group {
    text-align: right;
  }
  .close-tips {
    padding: 10px;
  }
  .icon-close {
    font-size: $font-size-regular;
    color: $font-color-placeholder;
    height: 40px;
    cursor: pointer;
    &:hover {
      color: $color-danger;
    }
  }

</style>

