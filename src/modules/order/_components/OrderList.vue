<template>
  <el-table
    :data="dataList"
    :height="tableHeigth"
    tooltip-effect="dark"
    style="width: 100%"
    class="order-list"
    border
    highlight-current-row
    @row-click="rowClick">
    <el-table-column
      prop="OrderNum"
      show-overflow-tooltip
      label="订单号"
      min-width="200"/>
    <el-table-column
      prop="LogTime"
      show-overflow-tooltip
      width="160"
      label="购买时间"/>
    <el-table-column
      prop="GoodsName"
      show-overflow-tooltip
      label="商品"
      min-width="160"/>
    <el-table-column
      prop="TotalMoneyPrice"
      show-overflow-tooltip
      label="原总价"
      width="100"
      align="right"
      header-align="center"/>
    <el-table-column
      prop="Discount"
      show-overflow-tooltip
      label="优惠"
      width="100"
      align="right"
      header-align="center"/>
    <el-table-column
      prop="TotalMoneyPrice"
      show-overflow-tooltip
      label="应收"
      width="100"
      align="right"
      header-align="center"/>
    <el-table-column
      prop="PaidMoney"
      show-overflow-tooltip
      label="实收"
      width="100"
      align="right"
      header-align="center"/>
    <el-table-column
      :formatter="formatter"
      prop="OrderStatus"
      label="订单状态"
      width="80"
      show-overflow-tooltip/>
    <el-table-column
      prop="LeaguerCode"
      show-overflow-tooltip
      label="会员"
      min-width="160"/>
    <el-table-column
      prop="OperateEmployee"
      show-overflow-tooltip
      label="操作人"
      min-width="80"/>
    <el-table-column
      prop="TerminalName"
      show-overflow-tooltip
      label="终端"
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
      default: 60,
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
        return state.client.pageHeight - 104 - this.topHeight;
      },
    }),
  },

  methods: {
    formatter(row) {
      const status = {
        Paying: '待支付',
        Payed: '已支付',
        Refund: '已退款',
        PartReturned: '部分退货',
        Cancel: '已取消',
      };
      return status[row.OrderStatus];
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
}
</style>
