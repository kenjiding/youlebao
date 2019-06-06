<template>
  <div class="exchange-detail">
    <div class="exchange-detail-header">
      <div>
        <p>{{ detailData.ExchangeNum }}</p>
      </div>
      <el-tag
        :type="orderStatusType[detailData.Status]"
        size="mini"
        class="tag-state">{{ orderStatusChs[detailData.Status] }}
      </el-tag>
    </div>
    <div class="exchange-detail-main">
      <p>
        <span>操作人:</span>
        <span>{{ detailData.EmployeeName }}</span>
      </p>
      <p>
        <span>会员:</span>
        <span>{{ detailData.Leaguer }}</span>
      </p>
      <p>
        <span>操作终端:</span>
        <span>{{ detailData.TerminalName }}</span>
      </p>
      <p>
        <span>兑换价:</span>
        <span>{{ detailData.TotalPrice + valueTypeChs[detailData.ExchangeValueType] }}</span>
      </p>
      <p>
        <span>渠道:</span>
        <span>{{ detailData.ChannelName }}</span>
      </p>
      <p>
        <span>总成本:</span>
        <span>{{ detailData.TotalCost + valueTypeChs[detailData.ExchangeValueType] }}</span>
      </p>
    </div>
    <div
      :style="{
        height: listHeigth + 'px'
      }"
      class="exchange-detail-list">
      <el-tabs
        v-model="currentTab">
        <el-tab-pane
          label="商品详情"
          name="goods">
          <el-table
            :height="tableHeigth"
            :data="detailData.GoodsList"
            tooltip-effect="dark"
            border
            style="width: 100%"
            class="child-list">
            <el-table-column
              prop="GoodsName"
              show-overflow-tooltip
              label="商品名称"
              width="140"/>
            <el-table-column
              prop="GoodsNO"
              show-overflow-tooltip
              min-width="110"
              label="商品编号"/>
            <el-table-column
              prop="Amount"
              show-overflow-tooltip
              align="right"
              header-align="center"
              label="兑换数量"
              width="80"/>
            <el-table-column
              prop="TotalPrice"
              show-overflow-tooltip
              align="right"
              header-align="center"
              label="原总金额"
              width="80"/>
            <el-table-column
              prop="DiscountPrice"
              show-overflow-tooltip
              align="right"
              header-align="center"
              label="折扣"
              width="80"/>
            <el-table-column
              prop="PayValue"
              show-overflow-tooltip
              align="right"
              header-align="center"
              label="应付"
              width="80"/>
            <el-table-column
              prop="TotalCost"
              show-overflow-tooltip
              align="right"
              header-align="center"
              label="总成本"
              width="80"/>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="exchange-detail-footer">
      <div v-if="isUnSend">
        <el-button
          @click="cancelClick">取消兑换</el-button>
        <el-button
          type="primary"
          @click="pickClick">取货</el-button>
      </div>
      <div v-else-if="canRefund">
        <el-button
          @click="refundClick">退货</el-button>
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

    <exchange-receipt
      ref="exchangeReceipt"
      :order-id="exchangeLogId"/>

  </div>
</template>

<script>
import ExchangeReceipt from '@/modules/goods-exchange/_components/ExchangeReceipt.vue';
import { mapState } from 'vuex';

export default {
  name: 'OrderDetail',

  components: {
    ExchangeReceipt,
  },

  props: {
    exchangeLogId: {
      type: String,
      default: '',
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
        Completed: 'success',
        Return: 'info',
      },
      valueTypeChs: {
        3: '积分',
        401: '金币',
        402: '代币',
        403: '彩票',
      },
      currentTab: 'goods',
      refundOrderVisible: false,
    };
  },

  computed: {
    ...mapState({
      listHeigth(state) {
        return state.client.pageHeight - 393;
      },

      tableHeigth(state) {
        return state.client.pageHeight - 450;
      },
    }),

    hasTicket() {
      if (this.detailData.GoodsData) {
        return this.detailData.GoodsData.some(item => item.GoodsType === 102);
      }
      return false;
    },

    isUnSend() {
      return this.detailData.LogisticsStatus === 'UnSend'
        && (this.detailData.Status === 'Payed' || this.detailData.Status === 'Paying');
    },

    canRefund() {
      return this.detailData.Status === 'Payed' || this.detailData.Status === 'PartReturned';
    },
  },


  methods: {
    onLoad() {
      this.$api['goods-exchange/exchange/getLogDetail']({
        ExchangeLogID: this.exchangeLogId,
      }).then((res) => {
        this.detailData = res;// LogisticsStatus
      });
    },

    showRightPage() {
      this.closeArrow = !this.closeArrow;
      this.$emit('close-arrow');
    },

    refundClick() {
      this.$confirm('确定退货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api['goods-exchange/exchange/returnOrder']({
          ExchangeLogID: this.exchangeLogId,
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退货成功!',
          });
          // this.onLoad();
          this.$emit('reload-list');
        });
      }).catch(() => {});
    },

    handleRefundComplete() {
      this.refundOrderVisible = false;
      // this.onLoad();
      this.$emit('reload-list');
    },

    rePrintClick() {
      this.$refs.exchangeReceipt.onPrint(true);
    },

    pickClick() {
      this.$api['goods-exchange/exchange/sendAndReceive']({
        ExchangeLogID: this.exchangeLogId,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '取货成功!',
        });
        // this.onLoad();
        this.$emit('reload-list');
      });
    },

    cancelClick() {
      this.$api['goods-exchange/exchange/cancelOrder']({
        ExchangeLogID: this.exchangeLogId,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '取消兑换单成功!',
        });
        // this.onLoad();
        this.$emit('reload-list');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.exchange-detail {
  width: 700px;
  // height: 610px;
  background-color: $color-white;
  box-shadow: -6px 0 10px 0 rgba(0, 0, 0, .2);

  &-header {
    height: 30px;
    line-height: 30px;
    padding: 20px 10px 0;
    margin-left: 20px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;

    p {
      font-size: $font-size-regular;
    }

    .tag-state {
      margin: 5px;
    }
  }

  &-main {
    width: 620px;
    height: 90px;
    margin: 0 10px;
    padding: 10px 20px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    p {
      width: 253px;
      height: 30px;
      line-height: 30px;
      font-size: $font-size-primary;
      color: $font-color-regular;

      span:first-child {
        color: $font-color-placeholder;
        margin-right: 10px;
        display: inline-block;
        width: 60px;
        text-align: right;
      }
    }
  }

  &-list {
    /deep/ .el-tabs__header {
      height: 40px;
      margin: 0 20px 5px;
    }

    /deep/ .el-tabs__content {
      padding: 0 20px;
    }

    .child-list {
      /deep/ .has-gutter {
        th {
          height: 40px;
          padding: 0;
          text-align: center;
        }
      }

      /deep/ .el-table__body-wrapper {
        .el-table__body {
          tr {
            text-align: center;
          }
        }
      }
    }
  }

  &-footer {
    height: 40px;
    width: 680px;
    padding: 10px;
    border-top: 1px $border-color solid;
    text-align: right;

    /deep/ .el-button {
      width: 140px;
    }

    /deep/ .el-button--primary {
      width: 140px;
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
