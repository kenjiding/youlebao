<template>
  <el-dialog
    :visible="visible"
    append-to-body
    width="1000px"
    title="退货"
    class="refund-order-dialog"
    @open="onLoad"
    @close="handleClose">
    <div class="refund-order-main">
      <div>
        <el-table
          ref="itemTable"
          :data="localItemsList"
          :height="tableHeigth"
          max-height="590px"
          tooltip-effect="dark"
          class="refund-order-list"
          style="width: 100%"
          border
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column
            v-if="partReturn"
            :selectable="canSelect"
            align="center"
            type="selection"
            width="40"/>
          <el-table-column
            prop="GoodsName"
            show-overflow-tooltip
            label="商品名称"/>
          <el-table-column
            prop="GoodsTypeName"
            width="160"
            show-overflow-tooltip
            label="商品类型"/>
          <el-table-column
            prop="UnitPrice"
            show-overflow-tooltip
            align="right"
            header-align="center"
            label="单价"/>
          <el-table-column
            prop="Amount"
            show-overflow-tooltip
            align="right"
            header-align="center"
            label="购买数量"/>
          <el-table-column
            :formatter="CanRefundAmount"
            show-overflow-tooltip
            align="right"
            header-align="center"
            label="可退数量"/>
          <el-table-column
            show-overflow-tooltip
            align="center"
            header-align="center"
            label="本次退货数量">
            <template slot-scope="scope">
              <el-input-number
                :controls="false"
                :min="0"
                :max="scope.row.Amount - scope.row.AlreadyReturnAmount"
                :disabled="scope.row.Amount - scope.row.AlreadyReturnAmount <= 0 || !partReturn"
                v-model="scope.row.RefundAmount"
                size="small"
                @blur="inputSelect(scope.row)"
                @input="refundAmountInput"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div
      slot="footer"
      class="refund-order-footer">
      <el-row class="footer-first">
        <el-col :span="6">
          <p>退商品总额:</p>
          <p class="span-total">¥{{ refundMoney | number('0.00') }}</p>
        </el-col>
        <el-col :span="6">
          <p>退货总额:</p>
          <p class="span-total">¥{{ actualRefundMoney | number('0.00') }}</p>
        </el-col>
        <el-col :span="6">
          <p>
            <span>手续费:</span>
            <span class="span-placeholder">(收取现金):</span>
          </p>
          <el-input-number
            v-model="fee"
            :controls="false"
            :min="0"
            :max="refundMoney"
            size="small"
            placeholder="请输入需要扣除的手续费"/>
        </el-col>
        <el-col :span="6">
          <p>
            <span>应退现金</span>
            <span class="span-placeholder">(现金支付总额-手续费):</span>
          </p>
          <p class="span-refund">¥{{ (totalMoney === totalCashPay
          ? actualRefundMoney : actualRefundCash) | number('0.00') }}</p>
        </el-col>
      </el-row>
      <div class="footer-last">
        <p>1.使用优惠券或满减促销的订单无法部分退货，只能整单退</p>
        <p>2.使用混合支付的订单无法部分退货，只能整单退</p>
        <el-button
          :loading="refunding"
          type="primary"
          @click="refundClick">退款
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { sumBy } from 'lodash';

export default {
  name: 'RefundOrder',

  props: {
    orderId: {
      type: String,
      default: '',
    },
    leaguerId: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    itemList: {
      type: Array,
      default: () => { []; },
    },
    partReturn: {
      type: Boolean,
      default: false,
    },
    totalFee: {
      type: Number,
      default: 0,
    },
    totalCashPay: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      fee: 0,
      localItemsList: [],
      selectedItem: [],
      refunding: false,
    };
  },

  computed: {
    ...mapState({
      tableHeigth(state) {
        return state.client.pageHeight - 300;
      },
    }),

    refundMoney() {
      const sum = sumBy(this.selectedItem, item => (item.RefundAmount || 0) * item.UnitPrice);
      return sum;
    },

    refundFee() {
      const sum = sumBy(this.selectedItem, item => (item.RefundAmount || 0) * item.Fee).toFixed(2);
      return sum;
    },

    actualRefundMoney() {
      return this.refundMoney - this.fee;
    },

    actualRefundCash() {
      return this.totalCashPay - this.fee;
    },
  },

  methods: {
    onLoad() {
      this.localItemsList = this.itemList.map(item => ({ ...item, RefundAmount: null }));
      if (this.localItemsList.length >= 1) {
        this.localItemsList.forEach((item) => {
          item.RefundAmount = item.Amount - item.AlreadyReturnAmount > 0
            ? item.Amount - item.AlreadyReturnAmount : 0;
        });
        this.$nextTick(() => {
          this.$refs.itemTable.toggleAllSelection();
          this.fee = sumBy(this.localItemsList, item =>
            (item.RefundAmount || 0) * item.Fee).toFixed(2);
          // if (!this.partReturn) {
          //   const checkboxlist = document.getElementsByClassName('el-checkbox__original');
          //   for (let index = 0; index < checkboxlist.length; index++) {
          //     console.log(checkboxlist[index].disabled);
          //     checkboxlist[index].disabled = true;
          //     console.log(checkboxlist[index].disabled);
          //   }
          // }
        });
      }
    },

    refundAmountInput() {
      this.fee = this.refundFee;
    },

    CanRefundAmount(row) {
      return row.Amount - row.AlreadyReturnAmount;
    },

    canSelect(row) {
      return row.RefundAmount > 0;
    },

    handleSelectionChange(val) {
      this.selectedItem = val;
      this.fee = this.refundFee;
    },

    refundClick() {
      this.refunding = true;
      const orderItem = this.selectedItem.filter(item => item.RefundAmount > 0).map(item => ({
        ID: item.OrderItemId, ReturnAmount: item.RefundAmount,
      }));
      if (orderItem.length === 0) {
        this.$message({
          message: '请选择退货商品，并填写退货数量',
          type: 'warning',
        });
        this.refunding = false;
        return;
      }
      if (this.selectedItem.some(item => item.GoodsType === 1 && item.RefundAmount > 0)
        && this.$electronStore.get('commonForm').logoutSetting === 'Need') {
        this.$confirm('退货商品中包含入会商品，继续退货将注销会员卡，是否继续？', '提示', { type: 'warning' }).then(() => {
          this.checkLeaguerPassword(orderItem);
        }).catch(() => {
          this.refunding = false;
        });
      } else {
        this.refundAction(orderItem, false);
      }
    },

    checkLeaguerPassword(orderItem) {
      this.$prompt(null, '请输入会员密码', {
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
          this.refundAction(orderItem, false);
        }, () => {
          this.refunding = false;
        });
      }).catch(() => {
        this.refunding = false;
      });
    },

    refundAction(orderItem, isTicketForce) {
      this.$api['order/order/returnAndRefund']({
        OrderItem: orderItem,
        Fee: this.fee,
        IsTicketForce: isTicketForce,
      }, {
        errorCodeIgnore: ['22014'],
      }).then(() => {
        this.$message({
          message: '退货成功',
          type: 'success',
        });
        this.refunding = false;
        this.fee = 0;
        this.$emit('complete');
      }, (res) => {
        if (!res.ResponseStatus) {
          this.refunding = false;
          return;
        }
        if (!isTicketForce && res.ResponseStatus.ErrorCode === '22014') {
          this.$confirm(`${res.ResponseStatus.Message},是否强制退票？`, '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
          }).then(() => {
            this.refundAction(orderItem, true);
          }).catch(() => {
            this.refunding = false;
          });
        } else {
          this.refunding = false;
        }
      });
    },

    handleClose() {
      this.$emit('update:visible', false);
    },

    inputSelect(row) {
      if (row.RefundAmount) {
        this.$refs.itemTable.toggleRowSelection(row, true);
      } else {
        this.$refs.itemTable.toggleRowSelection(row, false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.refund-order {
  &-list {
    /deep/ .el-input-number {
      width: 100px;
    }
  }

  &-footer {
    text-align: left;

    .footer-first {
      height: 100px;
      line-height: 30px;
      padding: 20px;

      /deep/ .el-col {
        p:first-child {
          font-size: $font-size-primary;
          color: $font-color-primary;
          // margin-right: 20px;
        }
      }

      .span-total {
        font-size: $font-size-regular;
        color: $font-color-regular;
      }

      .span-refund {
        font-size: $font-size-regular;
        color: $color-warning;
      }

      .span-placeholder{
        color: $font-color-placeholder;
      }

      /deep/ .el-input {
        width: 180px;
      }

      /deep/ .el-input__inner {
        text-align: left;
      }
    }

    .footer-last {
      // position: relative;
      padding: 10px;
      background-color: $color-bg-regular;
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;

      p {
        line-height: 24px;
        font-size: $font-size-primary;
        color: $font-color-placeholder;
        margin-left: 20px;
      }
      p:first-child {
        margin-top: 6px;
      }
      p:nth-child(2) {
        margin-bottom: 6px;
      }

      /deep/ .el-button {
        position: absolute;
        bottom: 20px;
        right: 30px;
        width: 320px;
      }
    }

  }
}

.refund-order-dialog {
  margin-bottom: 0;
  $two-px:2px;

  /deep/ .el-dialog__header {
    height: 50px;
    padding: 0;
    border-bottom: 1px $border-color solid;
  }

  /deep/ .el-dialog__title {
    padding-left: 30px;
    line-height: 50px;
    font-size: $color-bg-primary + $two-px;
    color: $font-color-regular;
  }

  /deep/ .el-dialog__body {
    padding: 0;
  }

  /deep/ .el-dialog__footer {
    padding: 0;
  }
}

</style>

