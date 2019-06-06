<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="payment-dialog"
    width="800px"
    @open="onLoad"
    @close="handleClose">
    <div
      v-loading="loading"
      element-loading-text="查询订单中"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      class="payment-main">
      <el-container>
        <el-aside
          class="left"
          width="250px">
          <div class="left-title">
            <p class="actual-charge">
              <span>应收</span>
              <span>¥ {{ actualChargeStrArray[0] }}
              </span>
              <span>.{{ actualChargeStrArray[1] }}
              </span>
            </p>
            <p
              v-show="zeroOffMoney && this.onlyCashPay"
              class="zero-off">
              (已抹零: ¥ {{ zeroOffMoney | number('0.00') }})
            </p>
          </div>
          <div class="menu-wraper">
            <!-- <ych-scroll> -->
            <template
              v-for="(type,index) in payMoneyList">
              <el-row
                v-show="type.Kind === 'PrePaid'? canUsePrepaid : true"
                :key="type.ID"
                :class="{
                  'list-row--active':type.ID === currentPayTypeID
                }"
                class="list-row"
                @click.native="selectedPayType(type,index)">
                <el-col>
                  <p
                    :class="{ 'over-length': type.Name.length>=6}"
                    :style="type.Kind === 'PrePaid'? 'line-height: 20px':'40px'">
                    <span>{{ type.Name }}</span><br>
                    <span
                      v-if="type.Kind === 'PrePaid'"
                      class="list-row__prepaid">
                      余额: {{ $number(prepaidRemian).format('0.00') }}</span>
                  </p>
                  <p
                    v-if="type.PayMoney > 0 && type.Kind != 'Scan'"
                    class="list-row__money">
                    <span>¥ {{ $number(type.PayMoney).format('0.00') }}</span>
                  </p>
                  <i
                    v-else
                    :class="getIcon(type.Kind)"
                    class="list-icon"/>
                </el-col>
                <div class="triangle"/>
              </el-row>
            </template>
            <!-- </ych-scroll> -->
          </div>
        </el-aside>
        <el-main class="right">
          <div
            v-show="!showUnableScan"
            class="calculator">
            <div class="calculator-header">
              <el-row
                v-show="currentKindVisible === 'NoSummary'">
                <el-col :span="18">
                  <el-input
                    ref="CashMoneyInput"
                    v-model="money"
                    :maxlength="8"
                    class="input-money"
                    type="number"
                    @keydown.native="keyPress($event)"
                    @input="numberLimited"
                    @focus="handleFocusZeroClear($event)">
                    <p
                      slot="prefix"
                      class="p-slot">¥</p>
                    <i
                      v-show="money.toString().length > 0"
                      slot="suffix"
                      class="ych-icon-close icon-slot"
                      @click="clearMoney"/>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <p
                    v-show="currentPayMoney.Kind === 'Cash'"
                    class="giveCharge">
                    找零：¥ {{ giveCharge| number('0.00') }}
                  </p>
                </el-col>
              </el-row>
              <el-row v-show="currentKindVisible === 'Scan'"><!--微信支付宝-->
                <el-col :span="24">
                  <p class="scanPayment">请扫顾客微信或支付宝的付款码</p>
                </el-col>
              </el-row>
              <el-row
                v-show="currentKindVisible === 'Default'"
                :gutter="10">
                <el-col :span="10">
                  <el-input
                    ref="OtherMoneyInput"
                    v-model="money"
                    :maxlength="8"
                    class="input-money"
                    @keydown.native="keyPress($event)"
                    @input="numberLimited"
                    @focus="handleFocusZeroClear($event)">
                    <p
                      slot="prefix"
                      class="p-slot">¥</p>
                    <i
                      v-show="money.toString().length > 0"
                      slot="suffix"
                      class="ych-icon-close icon-slot"
                      @click="clearMoney"/>
                  </el-input>
                </el-col>
                <el-col :span="14">
                  <el-input
                    ref="OtherMoneySummary"
                    v-model="localSummary"
                    class="other-summary"
                    placeholder="请输入备注"
                    maxlength="32"/>
                </el-col>
              </el-row>
            </div>
            <div class="calculator-body">
              <el-row>
                <el-col
                  v-for="(number, index) in numberList"
                  :key="index"
                  :span="5"
                  :class="{'el-col-golden':number.title.indexOf('¥')===0}"
                  @click.native="inputNumber(number.value)">
                  <p v-if="number.title !== 'Backspace'">{{ number.title }}</p>
                  <i
                    v-if="number.title === 'Backspace'"
                    class="ych-icon-backspace icon-backspace"/>
                </el-col>
              </el-row>
            </div>
          </div>
          <div
            v-show="!showUnableScan"
            class="footer">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-select
                  :remote-method="handleSearchMethod"
                  :loading="searching"
                  v-model="searchKey"
                  placeholder="请选择导购员"
                  filterable
                  remote
                  @change="handleSelectChange">
                  <el-option
                    v-for="item in searchResult"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-input
                  v-model="receiptSummary"
                  placeholder="输入小票备注"
                  maxlength="32"/>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-button
                  class="footer-button--cancel"
                  @click="cancelPayClick">
                  <span>取消支付</span><br>
                  <span>( Esc )</span>
                </el-button>
              </el-col>
              <el-col :span="17">
                <el-button
                  :disabled="disableSubmitPay"
                  :loading="paying"
                  class="footer-button--confirm"
                  @click="confirmPayClick">
                  <span>确认支付</span><br>
                  <span>( Enter )</span>
                </el-button>
              </el-col>
            </el-row>
          </div>
          <scan-payment-static-page v-show="showUnableScan"/>
        </el-main>
      </el-container>

      <PaymentScan
        ref="PaymentScan"
        :visible.sync="scanPayShow"
        :scan-pay-money="scanPayMoney"
        :order-id="orderId"
        @close="handleScanClose"
        @complete="handleScanPaymentComplete"
        @cancel="handleScanPaymentCancel"/>
    </div>
  </el-dialog>
</template>

<script>
import { sumBy, subtract } from 'lodash';
import { mapGetters } from 'vuex';
import PaymentScan from '@/components/payment/PaymentScan.vue';
import ScanPaymentStaticPage from '@/components/payment/ScanPaymentStaticPage.vue';

export default {
  name: 'Payment',

  components: {
    PaymentScan,
    ScanPaymentStaticPage,
  },

  props: {
    actualCharge: {
      type: Number,
      default: 0,
    },
    orderId: {
      type: String,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    leaguerId: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    payMoneyList: [],
    submitList: [],
    currentPayTypeID: '',
    currentSelectIndex: 0, // 支付方式选择索引
    numberList: [
      {
        title: '1',
        value: '1',
      },
      {
        title: '2',
        value: '2',
      },
      {
        title: '3',
        value: '3',
      },
      {
        title: '¥100',
        value: 100,
      },
      {
        title: '4',
        value: '4',
      },
      {
        title: '5',
        value: '5',
      },
      {
        title: '6',
        value: '6',
      },
      {
        title: '¥50',
        value: 50,
      },
      {
        title: '7',
        value: '7',
      },
      {
        title: '8',
        value: '8',
      },
      {
        title: '9',
        value: '9',
      },
      {
        title: '¥20',
        value: 20,
      },
      {
        title: '.',
        value: '.',
      },
      {
        title: '0',
        value: '0',
      },
      {
        title: 'Backspace',
        value: 'Backspace',
      },
      {
        title: '¥10',
        value: 10,
      },
    ],
    prepaidRemian: 0,
    prepaidIslock: false,
    money: '',
    giveCharge: 0,
    localSummary: '',
    shoppingGuideCode: '',
    receiptSummary: '',
    scanUsable: false,
    scanPayMoney: 0,
    scanPayShow: false,
    currentIndex: 0,
    loading: false,
    paying: false,
    password: '',
    zeroOff: 1,
    // 导购
    searchKey: '',
    searching: false,
    searchResult: [],
  }),

  computed: {
    ...mapGetters({
      gobalGuiderList: 'gobalConfig/getGuiderList',
    }),

    canUsePrepaid() {
      return Boolean(this.leaguerId) && !this.prepaidIslock;
    },

    onlyCashPay() {
      if (this.payMoneyList.filter(item => item.PayedMoney > 0 && item.Kind !== 'Cash').length > 0) {
        return false;
      }
      if (this.payMoneyList.filter(item => item.PayMoney > 0).length === 1) {
        return this.currentPayMoney.Kind === 'Cash';
      }
      return false;
    },

    // 剩余金额
    surplusMoney() {
      const sum = sumBy(this.payMoneyList, 'PayMoney');
      return subtract(this.actualCharge, sum);
    },

    currentPayMoney() {
      return this.payMoneyList.find(item => item.ID === this.currentPayTypeID) || {};
    },

    currentKindVisible() {
      switch (this.currentPayMoney.Kind) {
        case 'Cash':
        case 'PrePaid':
          return 'NoSummary';
        // case 'WeixinBarcodePay':
        // case 'AliPayBarcodePay':
        case 'Scan':
          return 'Scan';
        default:
          return 'Default';
      }
    },

    // 抹零金额
    zeroOffMoney() {
      if (this.payMoneyList.filter(item => (item.PayedMoney > 0 || item.PayMoney > 0)
        && item.Kind !== 'Cash').length > 0) {
        return 0;
      }
      if (this.zeroOff < 2) {
        let decimalstr = this.$number(this.actualCharge).format('0.00').split('.')[1];
        if (this.zeroOff === 1) {
          decimalstr = `0${decimalstr.substring(1)}`;
        }
        return Number(`0.${decimalstr}`);
      }
      return 0;
    },

    actualChargeStrArray() {
      let str;
      if (this.onlyCashPay) {
        str = this.$number(this.actualCharge - this.zeroOffMoney).format('0.00');
      } else {
        str = this.$number(this.actualCharge).format('0.00');
      }
      return str.split('.');
    },

    disableSubmitPay() {
      if (this.onlyCashPay) {
        return Number(this.surplusMoney.toFixed(2)) - this.zeroOffMoney > 0;
      }
      return this.surplusMoney > 0;
    },

    showUnableScan() {
      return this.currentPayMoney.Kind === 'UnableScan' && !this.scanUsable;
    },
  },

  created() {
  },

  methods: {
    onLoad() {
      this.password = '';
      this.searchResult = this.gobalGuiderList;
      this.getLeaguerPrepaid();
      this.getPayTypeList();
      window.addEventListener('keydown', this.setKeydownListen);
    },

    setKeydownListen(event) {
      // const this = this;
      const key = event.keyCode;

      if (key === 13 && !this.disableSubmitPay) {
        // 防止手抖多次点击
        if (this.paying
        || this.scanPayShow
        || this.showUnableScan) {
          return;
        }
        this.confirmPayClick();
      } else if (key === 27) {
        // 防止手抖多次点击
        if (this.scanPayShow) {
          if (this.$refs.PaymentScan.state === 'Querying') {
            return;
          }
          this.handleScanClose();
          if (this.$refs.PaymentScan.state === 'Fail') {
            this.handleScanPaymentCancel();
          }
          return;
        }
        if (this.paying) {
          return;
        }
        this.cancelPayClick();
      } else if (key === 38) {
        // 防止手抖多次点击
        if (this.paying || this.scanPayShow) {
          return;
        }
        if (this.currentSelectIndex > 0) {
          this.currentSelectIndex--;
          const type = this.payMoneyList[this.currentSelectIndex];
          this.selectedPayType(type, this.currentSelectIndex);
        }
      } else if (key === 40) {
        // 防止手抖多次点击
        if (this.paying || this.scanPayShow) {
          return;
        }
        if (this.currentSelectIndex < this.payMoneyList.length - 1) {
          this.currentSelectIndex++;
          const type = this.payMoneyList[this.currentSelectIndex];
          this.selectedPayType(type, this.currentSelectIndex);
        }
      }
    },

    getPayTypeList() {
      this.loading = true;
      this.payMoneyList = [];
      this.currentSelectIndex = 0;
      this.$api['pay/getPayTypeList']({
        OrderID: this.orderId,
      }).then((res) => {
        let cashType = null;
        let prepaidType = null;
        // 无支付方式
        if (res.DataList.length <= 0) {
          this.loading = false;
          return;
        }
        res.DataList.forEach((type) => {
          if (type.Kind === 'Cash') {
            cashType = type;
          } else if (type.Kind === 'PrePaid') {
            prepaidType = type;
          } else {
            this.payMoneyList.push({ ...type, PayMoney: 0 });
          }
        });

        this.scanUsable = res.ScanUsable;
        if (res.ScanUsable) {
          this.payMoneyList.unshift({
            ID: '00000000-0000-0000-0000-000000000000',
            Name: '扫码支付',
            Kind: 'Scan',
            PayedMoney: res.ScanPayMoney,
            PayMoney: 0,
            Summary: '',
          });
        } else {
          this.payMoneyList.push({
            ID: '00000000-0000-0000-0000-000000000000',
            Name: '扫码支付',
            Kind: 'UnableScan',
            PayedMoney: res.ScanPayMoney,
            PayMoney: 0,
            Summary: '',
          });
        }
        // 现金
        if (cashType !== null) {
          this.payMoneyList.unshift({ ...cashType, PayMoney: 0 });
        }
        // 预存款排序最前
        if (prepaidType !== null && this.canUsePrepaid) {
          this.payMoneyList.unshift({ ...prepaidType, PayMoney: 0 });
        }

        this.zeroOff = res.ZeroOff;

        // 初始化
        let defaultIndex = 0;
        if (this.payMoneyList[0].Kind === 'PrePaid' && this.canUsePrepaid && this.prepaidRemian <= 0) {
          defaultIndex = 1;
        }

        this.currentPayTypeID = this.payMoneyList[defaultIndex].ID;

        if (this.payMoneyList[defaultIndex].Kind === 'Cash') {
          this.money = (this.actualCharge - this.zeroOffMoney).toFixed(2);
          this.payMoneyList[defaultIndex].PayMoney = this.actualCharge - this.zeroOffMoney;
        } else if (this.payMoneyList[defaultIndex].Kind === 'PrePaid' && this.canUsePrepaid) {
          if (this.surplusMoney <= 0 || this.prepaidRemian <= 0) {
            this.payMoneyList[defaultIndex].PayMoney = 0;
            this.money = 0;
          } else {
            const remain = this.surplusMoney < this.prepaidRemian
              ? this.surplusMoney
              : this.prepaidRemian;
            this.payMoneyList[defaultIndex].PayMoney = remain;
            this.money = remain.toFixed(2);
          }
        } else {
          this.money = this.actualCharge.toString();
          this.payMoneyList[defaultIndex].PayMoney = this.actualCharge;
        }

        // 0元订单立马完成
        if (this.actualCharge === 0 && this.orderId) {
          this.zeroPayAction();
        } else if (this.actualCharge - this.zeroOffMoney === 0 && this.currentPayMoney.Kind === 'Cash') {
          this.zeroPayAction();
        } else {
          this.loading = false;
          // 首选是扫码立马唤起扫码界面this.$nextTick(() => {
          this.$nextTick(() => {
            if (this.currentKindVisible === 'NoSummary') {
              this.$refs.CashMoneyInput.$el.children[0].focus();
            } else if (this.currentKindVisible === 'Default') {
              this.$refs.OtherMoneyInput.$el.children[0].focus();
            } else {
              this.scanPayAction();
            }
          });
        }
      }, () => {
        this.loading = false;
      });
    },

    getLeaguerPrepaid() {
      if (this.leaguerId) {
        this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
          LeaguerID: this.leaguerId,
          ValueTypes: [1],
        }).then((res) => {
          if (res.DataList.length > 0) {
            this.prepaidRemian = res.DataList[0].Remain;
            this.prepaidIslock = res.DataList[0].Status === 'Locked';
          }
        }, () => {
          this.loading = false;
        });
      }
    },

    zeroPayAction() {
      this.paying = true;
      this.$api['pay/payForOrder']({
        OrderID: this.orderId,
        LeaguerID: this.leaguerId,
        PayTypeID: this.currentPayMoney.ID,
        PayKind: this.currentPayMoney.Kind,
        Money: this.actualCharge,
        Summary: '',
      }).then(() => {
        this.paying = false;
        this.orderCompleteAction();
      }, () => {
        this.paying = false;
        this.cancelPayClick();
      });
      this.loading = false;
    },

    getIcon(kind) {
      const map = {
        Cash: 'ych-icon-wallet',
        Prepaid: 'ych-icon-coin',
        Scan: 'ych-icon-scan',
        UnableScan: 'ych-icon-scan',
      };
      return map[kind] || 'ych-icon-account-book';
    },

    numberLimited(val) {
      this.currentPayMoney.PayMoney = 0;
      let moneyString = /^\d{0,8}\.{0,1}(\d{1,2})?$/.test(val) ? val.toString() : val.substring(0, val.length - 1);

      if (this.currentPayMoney.Kind === 'Cash') {
        const surplusMoney = this.surplusMoney - this.zeroOffMoney;
        this.giveCharge = Number(moneyString) - surplusMoney > 0
          ? subtract(Number(moneyString), surplusMoney) : 0;
        this.currentPayMoney.PayMoney = Number(moneyString);
      } else if (this.currentPayMoney.Kind === 'PrePaid' && this.canUsePrepaid) {
        if (this.prepaidRemian < Number(moneyString)) {
          moneyString = this.prepaidRemian.toFixed(2);
        }
        if (this.surplusMoney < Number(moneyString)) {
          moneyString = this.surplusMoney.toFixed(2);
        }
        this.currentPayMoney.PayMoney = Number(moneyString);
        this.money = moneyString;
        val = moneyString;
      } else if (this.surplusMoney - Number(moneyString) < 0) {
        moneyString = this.surplusMoney.toFixed(2);
        this.currentPayMoney.PayMoney = Number(moneyString);
        this.$nextTick(() => {
          this.money = moneyString;
          val = moneyString;
        });
      } else {
        this.$nextTick(() => {
          val = moneyString;
          this.money = moneyString;
          this.currentPayMoney.PayMoney = Number(val);
        });
      }
    },

    selectedPayType(payType, currentId) {
      this.currentSelectIndex = currentId;
      if (payType.Kind === 'UnableScan') {
        // 切换到当前选中的支付方式
        this.currentPayTypeID = payType.ID;
        return;
      }

      if (this.currentPayMoney.PayMoney === this.actualCharge - this.zeroOffMoney && this.currentPayMoney.Kind === 'Cash') {
        this.currentPayMoney.PayMoney = 0;
      } else if (this.currentPayMoney.PayMoney === this.actualCharge || this.currentPayMoney.Kind === 'Scan') {
        this.currentPayMoney.PayMoney = 0;
      } else if (this.currentPayMoney.Kind !== 'UnableScan') {
        this.currentPayMoney.PayMoney = Number(this.money);
      }
      this.currentPayMoney.Summary = this.localSummary;
      this.localSummary = '';

      // 切换到当前选中的支付方式
      this.currentPayTypeID = payType.ID;
      // 清空支付的金额
      if (this.surplusMoney > 0) {
        this.currentPayMoney.PayMoney = 0;
      }


      this.$nextTick(() => {
        // 重算
        if (this.surplusMoney > 0 && this.currentPayMoney.PayMoney === 0) {
          if (this.currentPayMoney.Kind === 'Cash' && this.surplusMoney === this.actualCharge) {
            this.currentPayMoney.PayMoney = Number(this.actualCharge - this.zeroOffMoney);
          } else if (this.currentPayMoney.Kind === 'PrePaid' && this.canUsePrepaid) {
            if (this.surplusMoney <= 0 || this.prepaidRemian <= 0) {
              this.currentPayMoney.PayMoney = 0;
            } else {
              this.currentPayMoney.PayMoney = this.surplusMoney < this.prepaidRemian
                ? this.surplusMoney
                : this.prepaidRemian;
            }
          } else {
            this.currentPayMoney.PayMoney = this.surplusMoney;
          }
        }

        this.money = this.currentPayMoney.PayMoney.toFixed(2);

        this.$nextTick(() => {
          if (this.currentKindVisible === 'NoSummary') {
            this.$refs.CashMoneyInput.$el.children[0].blur();
            this.$refs.CashMoneyInput.$el.children[0].focus();
          } else if (this.currentKindVisible === 'Default') {
            this.$refs.OtherMoneySummary.$el.children[0].focus();
          } else {
            this.scanPayAction();
          }
        });
      });
    },

    inputNumber(val) {
      if (this.currentKindVisible === 'Scan') { return; }
      let moneyString = this.money;
      // 模拟输入
      if (moneyString === '' && val !== 'Backspace' && val !== '.') {
        this.money = val;
        moneyString = val;
      } else if (val === 'Backspace') {
        this.money = moneyString.toString().substring(0, moneyString.length - 1);
      } else if (moneyString.length > 8 || Number(moneyString) >= 99999999) {
        //
      } else if (val === '.') {
        if (moneyString === '') {
          this.money = `0${val}`;
        } else if (moneyString.toString().indexOf('.') < 0) {
          this.money = moneyString + val;
        }
        //
      } else if (moneyString.toString().indexOf('.') >= 0) {
        if (Number(val) < 10) {
          moneyString += val;
        } else {
          moneyString = val.toString();// 快捷输入
        }
        const decimal = String(moneyString).split('.');
        if (decimal.length === 1) {
          this.money = decimal[0].toString();
        } else {
          this.money = `${decimal[0]}.${decimal[1].substring(0, 2)}`;
        }
        moneyString = this.money;
      } else if (moneyString === '0') {
        this.money = val.toString();
      } else {
        if (Number(val) < 10) {
          moneyString += val;
        } else {
          moneyString = val.toString();// 快捷输入
        }
        this.money = moneyString;
      }
      // 计算
      this.currentPayMoney.PayMoney = 0;
      if (this.currentPayMoney.Kind === 'Cash') {
        const surplusMoney = this.surplusMoney - this.zeroOffMoney;
        // console.log(Number(moneyString));
        this.giveCharge = Number(this.money) - surplusMoney > 0
          ? subtract(Number(this.money), surplusMoney) : 0;
        this.currentPayMoney.PayMoney = Number(this.money);
      } else if (this.currentPayMoney.Kind === 'PrePaid' && this.canUsePrepaid) {
        if (this.prepaidRemian < Number(moneyString)) {
          moneyString = this.prepaidRemian.toFixed(2);
        }
        if (this.surplusMoney < Number(moneyString)) {
          moneyString = this.surplusMoney.toFixed(2);
        }
        this.currentPayMoney.PayMoney = Number(moneyString);
        this.money = moneyString;
        val = moneyString;
      } else {
        if (this.surplusMoney <= 0) {
          this.money = '0';
        } else if (this.surplusMoney - Number(this.money) <= 0) {
          this.money = this.surplusMoney.toFixed(2);
        }
        this.currentPayMoney.PayMoney = Number(this.money);
      }
    },

    keyPress(event) {
      if ((event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode === 8 || event.keyCode === 110
      || event.keyCode === 190) {
        event.returnValue = true;
        // this.inputNumber(`${event.key}`);
      } else {
        event.returnValue = false;
      }
    },

    handleFocusZeroClear(e) {
      e.currentTarget.select();
      if (this.money === '0') {
        this.money = '';
      }
    },

    clearMoney() {
      this.money = '';
      this.currentIndex = 0;
      this.currentPayMoney.PayMoney = 0;
      this.giveCharge = 0;
      this.localSummary = '';
      this.shoppingGuideCode = '';
      this.searchKey = '';
      this.receiptSummary = '';
    },

    cancelPayClick() {
      this.payMoneyList.forEach((type) => {
        type.PayMoney = 0;
      });
      this.clearMoney();
      this.$emit('cancel');
      this.$emit('close');
    },

    confirmPayClick() {
      if (this.currentPayMoney.Kind === 'Scan') {
        this.scanPayAction();
      } else {
        this.normalPayAction();
      }
    },

    normalPayAction() {
      this.paying = true;
      this.currentPayMoney.Summary = this.localSummary;
      this.submitList = this.payMoneyList.filter(item => item.PayMoney > 0);
      const listLength = this.submitList.length;
      this.submitList.reverse();
      if (listLength > 1) {
        this.submitList.splice(
          listLength - 2, 1,
          ...this.submitList.splice(listLength - 1, 1, this.submitList[listLength - 2]),
        );
      }
      this.currentIndex = 0;
      this.$nextTick(() => { this.pay(); });
    },

    pay() {
      if (this.currentIndex < this.submitList.length) {
        const item = this.submitList[this.currentIndex];
        if (item.Kind === 'Scan') {
          this.currentIndex += 1;
          this.pay();
        } else {
          // let actualPayMoney = item.PayMoney;
          if (item.Kind === 'Cash') {
            const giveCharge = Number(-this.surplusMoney);
            item.PayMoney = Number((item.PayMoney + this.surplusMoney).toFixed(2));
            // if (this.submitList.length === 1) {
            //   item.PayMoney -= this.zeroOffMoney;
            // }
            if (giveCharge > 0) {
              item.Summary = `找零:${this.$number(giveCharge).format('0.00')}`;
            }
          }
          if (item.Kind === 'PrePaid') {
            this.prepaidAction(item);
          } else {
            this.defualtPayAction(item);
          }
        }
      } else {
        this.submitList = [];
        this.payMoneyList.forEach((type) => {
          type.PayMoney = 0;
        });
        this.paying = false;
        this.orderCompleteAction();
      }
    },

    defualtPayAction(item) {
      this.$api['pay/payForOrder']({
        OrderID: this.orderId,
        LeaguerID: this.leaguerId,
        PayTypeID: item.ID,
        PayKind: item.Kind,
        Money: Number((item.PayMoney).toFixed(2)),
        Summary: item.Summary,
        Password: this.password,
      }).then(() => {
        this.currentIndex += 1;
        this.pay();
      }, () => {
        this.paying = false;
        this.cancelPayClick();
      });
    },

    scanPayAction() {
      if (this.currentPayMoney.PayMoney > 0) {
        this.scanPayMoney = Number(this.currentPayMoney.PayMoney.toFixed(2));
        this.scanPayShow = true;
        this.paying = true;
        // this.$nextTick(() => {
        // this.$refs.PaymentScan.onLoad();
        // });
      }
    },

    prepaidAction(item) {
      this.$prompt('', '请输入会员密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        showClose: false,
        closeOnClickModal: false,
        inputPattern: /^\d{6,}$/,
        inputErrorMessage: '会员密码格式不正确',
      }).then(({ value }) => {
        const encryptedPwd = window.btoa(value);
        this.$api['leaguer/leaguer/checkLgPwd']({
          LeaguerID: this.leaguerId,
          PassWord: encryptedPwd,
        }).then(() => {
          this.password = value;
          this.defualtPayAction(item);
        }, () => {
          this.pay();
        });
      }).catch(() => {
        this.paying = false;
        if (this.submitList.length > 1) {
          this.cancelPayClick();
        }
      });
    },

    handleClose() {
      window.removeEventListener('keydown', this.setKeydownListen);
    },

    handleScanPaymentComplete() {
      this.normalPayAction();
    },

    handleScanClose() {
      this.scanPayShow = false;
      this.paying = false;
    },

    handleScanPaymentCancel() {
      this.cancelPayClick();
    },

    handleSearchMethod(query) {
      this.searching = true;
      setTimeout(() => {
        this.searching = false;
        if (query) {
          this.searchResult = this.gobalGuiderList.filter(guider =>
            guider.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
        } else {
          this.searchResult = this.gobalGuiderList;
        }
      }, 200);
    },

    handleSelectChange(selectItem) {
      this.shoppingGuideCode = selectItem.toString();
    },

    orderCompleteAction() {
      if (this.shoppingGuideCode) {
        this.$api['pay/addOrderGuiderFuzzy']({
          OrderID: this.orderId,
          GuiderCode: this.shoppingGuideCode,
        });
      }
      this.$emit('complete', this.receiptSummary);
      this.clearMoney();
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  @import "@/styles/mixins.scss";

  .payment-dialog {
    /deep/ .el-dialog__body {
      padding: 0;
    }

    /deep/ .el-dialog__header {
      display: none;
    }
  }

  .payment-main {
    width: 800px;
    // height: 580px;
  }

  .left {
    width: 230px;
    padding: 0;
    background-color: $color-regular;
    $four-px: 4px;


    &-title {
      width: 210px;
      // height: 70px;
      min-height: 50px;
      padding: 10px 20px;
      color: $color-white;
      border-bottom: 4px solid rgba($color-black, .2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .actual-charge {
        margin-top: 10px;
        line-height: 33px;

        span {
          font-size: $font-size-secondary;
        }

        span:first-child {
          font-size: $font-size-regular;
          margin-right: 5px;
        }

        span:last-child {
          font-size: $font-size-regular + $four-px;
        }

      }

      .zero-off {
        height: 20px;
        line-height: 20px;
        font-size: $font-size-primary;
        color: rgba(255, 255, 255, .5);
      }
    }

    .menu-wraper {
      height: 486px;
      overflow: hidden;
      padding: 10px;
      overflow-y: auto;
      overflow-x: hidden;
      // background-color: $color-white;
    }

    .list-row {
      height: 70px;
      width: 220px;
      line-height: 50px;
      color: $color-regular-light-2;
      background-color: rgba($color-white, .6);
      margin: 5px 0;
      padding: 10px;
      font-size: $font-size-primary + $four-px;
      position: relative;

      .over-length {
        width: 60%;
        height: 50px;
        line-height: 24px;
        @include ellipsis(2);
      }

      &__money {
        text-align: right;
        font-size: $font-size-regular;
        color: $font-color-currency;
        position: absolute;
        right: 10px;
        top: 10px;
      }

      &__prepaid {
        line-height: 20px;
        color: $color-regular-light-2;
        font-size: $font-size-special;
      }

      .triangle {
        width: 0;
        height: 0;
        border-width: 8px 0 8px 8px;
        border-style: solid;
        border-color: transparent $color-white transparent;
        // margin: 15px auto;
        position: absolute;
        right: -8px;
        margin: 16px 0;
        display: none;
      }

      &--active {
        background-color: $color-white;

        .triangle {
          display: block !important;
        }
      }

      .list-icon {
        position: absolute;
        right: 20px;
        top: 10px;
        color: $color-regular;
        opacity: .6;
        // stylelint-disable-next-line
        font-size: $font-size-bigger;
      }
    }
  }

  .right {
    padding: 0;
    background-color: $color-bg-primary;

    .footer {
      width: 510px;
      padding: 20px;
      background-color: $color-white;
      box-shadow: 0 0 10px 0 transparentize($color-black, .8);

      &-button--cancel {
        height: 80px;
        width: 100%;
        margin-top: 18px;
        background-color: $color-bg-primary;
        color: $font-color-primary;
        font-size: $font-size-regular;

        span:last-child {
          font-size: $font-size-special;
          color: $font-color-placeholder;
        }
      }

      &-button--confirm {
        height: 80px;
        width: 100%;
        margin-top: 18px;
        background-color: $color-danger;
        color: $color-white;
        font-size: $font-size-regular;

        span:last-child {
          font-size: $font-size-special;
          color: transparentize($color-white, .4);
        }
      }

      /deep/ .el-input__inner {
        background-color: $color-bg-primary;
      }
    }
  }

  .calculator {
    width: 510px;
    padding: 20px;
    background-color: $color-bg-primary;
    $two-px: 2px;
    $four-px: 4px;

    &-header {
      padding: 20px 20px 10px;
      background-color: $color-info;

      .giveCharge {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: $font-color-primary;
        font-size: $font-size-primary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .scanPayment {
        height: 50px;
        color: $font-color-primary;
        background-color: $color-white;
        border-radius: $border-radius-small;
        line-height: 50px;
        text-align: center;
      }

      .p-slot {
        line-height: 50px;
        margin-left: 22px;
        color: $font-color-placeholder;
        font-size: $font-size-primary + $two-px;
      }

      .icon-slot {
        line-height: 50px;
        color: $font-color-placeholder;
        font-size: $font-size-regular + $four-px;
      }

      .other-summary {
        /deep/ .el-input__inner {
          padding-left: 12px;
        }
      }

      /deep/ .el-input__inner {
        height: 50px;
        padding-left: 43px;
      }

      .input-money {
        font-size: $font-size-regular + $four-px;
      }
    }

    &-body {
      padding: 10px 15px 15px;
      background-color: rgba($color-info, .6);

      /deep/ .el-col {
        height: 60px;
        width: 110px;
        line-height: 60px;
        color: $font-color-primary;
        background-color: $color-white;
        border-radius: $border-radius-small;
        text-align: center;
        margin: 5px;
        font-size: $font-size-regular + $four-px;
      }

      .el-col-golden {
        color: rgba($color-black, .6);
        background-color: $font-color-golden;
      }

      .icon-backspace {
        color: $font-color-placeholder;
        font-size: $font-size-secondary;
      }
    }
  }
</style>

