<template>
  <el-table
    :data="dataList"
    :height="tableHeigth"
    tooltip-effect="dark"
    style="width: 100%"
    class="order-list"
    border
    @row-click="rowClick">
    <el-table-column
      prop="ExchangeNum"
      show-overflow-tooltip
      min-width="200"
      label="兑换单号"/>
    <el-table-column
      prop="LogTime"
      width="160"
      label="兑换时间"/>
    <el-table-column
      prop="LeaguerCode"
      show-overflow-tooltip
      label="会员"
      min-width="160"/>
    <el-table-column
      prop="GoodsName"
      show-overflow-tooltip
      label="商品"
      min-width="140"/>
    <el-table-column
      prop="PriceRate"
      label="兑换比例"
      align="right"
      header-align="center"
      width="80"/>
    <el-table-column
      :formatter="valueTypeFormatter"
      prop="ExchangeValueType"
      show-overflow-tooltip
      label="兑换类型"
      width="80"/>
    <el-table-column
      prop="OriginalTotalPrice"
      show-overflow-tooltip
      align="right"
      header-align="center"
      label="原总金额"
      width="80"/>
    <el-table-column
      prop="Discount"
      show-overflow-tooltip
      align="right"
      header-align="center"
      label="折扣"
      width="80"/>
    <el-table-column
      prop="TotalPrice"
      show-overflow-tooltip
      align="right"
      header-align="center"
      label="应付"
      width="80"/>
    <el-table-column
      :formatter="statusFormatter"
      prop="Status"
      label="状态"
      width="80"/>
    <el-table-column
      prop="TerminalName"
      show-overflow-tooltip
      label="操作终端"
      min-width="80"/>
    <el-table-column
      prop="EmployeeName"
      show-overflow-tooltip
      label="收银员"
      min-width="80"/>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: '',
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    topHeight: {
      type: Number,
      default: 70,
    },
  },
  data() {
    return {
      selectRow: [],
    };
  },

  computed: {
    ...mapState({
      tableHeigth(state) {
        return state.client.pageHeight - 70 - this.topHeight;
      },
    }),
  },

  methods: {
    statusFormatter(row) {
      const status = {
        Paying: '待支付',
        Payed: '已支付',
        Refund: '已退款',
        PartReturned: '部分退货',
        Cancel: '已取消',
      };
      return status[row.Status];
    },

    valueTypeFormatter(row) {
      const value = {
        3: '积分',
        401: '金币',
        402: '代币',
        403: '彩票',
      };
      return value[row.ExchangeValueType];
    },

    rowClick(val) {
      this.$emit('rows-click', val);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.order-list {
  width: 100%;
  margin-top: 10px;

  /deep/ .el-table__body-wrapper {
    .el-table__body {
      tr {
        text-align: center;
      }
    }
  }
}
</style>
