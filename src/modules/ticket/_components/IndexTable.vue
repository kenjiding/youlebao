<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    :height="tableHeight"
    tooltip-effect="dark"
    style="width: 100%"
    class="table-wrap"
    border
    highlight-current-row
    @selection-change="handleSelectionChange"
    @row-click="rowClick">
    <el-table-column
      :selectable="isSelect"
      type="selection"
      width="36"/>
    <el-table-column
      prop="PackageTicketName"
      show-overflow-tooltip
      label="套票名称"
      header-align="center"
      align="center"
      width="150"/>
    <el-table-column
      prop="SerialNumber"
      show-overflow-tooltip
      header-align="center"
      align="center"
      width="100"
      label="打印序号"/>
    <el-table-column
      :formatter="formatter"
      prop="Status"
      header-align="center"
      align="center"
      label="状态"
      show-overflow-tooltip
      width="80"/>
    <el-table-column
      prop="LogTime"
      width="160"
      header-align="center"
      align="center"
      show-overflow-tooltip
      label="购买时间"/>
    <el-table-column
      prop="OverdueTime"
      width="160"
      header-align="center"
      align="center"
      show-overflow-tooltip
      label="过期时间"/>
    <el-table-column
      prop="Price"
      show-overflow-tooltip
      align="right"
      label="售价"
      width="80"/>
    <el-table-column
      prop="LeaguerCode"
      header-align="center"
      align="center"
      show-overflow-tooltip
      width="130"
      label="会员"/>
    <el-table-column
      prop="RegisterInfo"
      show-overflow-tooltip
      header-align="center"
      align="center"
      label="购票信息"/>
    <el-table-column
      prop="OrderNum"
      show-overflow-tooltip
      header-align="center"
      align="center"
      width="130"
      label="订单号"/>
    <el-table-column
      prop="TerminalType"
      width="130"
      header-align="center"
      align="center"
      label="操作终端"/>
    <el-table-column
      prop="OperateEmployeeName"
      width="130"
      header-align="center"
      align="center"
      label="操作员"/>
    <el-table-column
      prop="ChannelName"
      width="130"
      header-align="center"
      align="center"
      label="购买渠道"/>
  </el-table>
</template>

<script>
export default {
  name: '',
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    tableHeight: {
      type: Number,
      default: 630,
    },
  },
  data() {
    return {
      selectRow: [],
    };
  },

  methods: {
    isSelect(row) {
      if (row.Status === 'Returned') {
        return false;
      }
      return true;
    },
    formatter(row) {
      const status = {
        UnUsed: '未使用',
        InUse: '使用中',
        Complete: '已完成',
        Returned: '已退货',
        Overdue: '已过期',
        Cancel: '会员已注销',
      };
      return status[row.Status];
    },
    rowClick(val) {
      this.$emit('rows-click', val);
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.table-wrap {
  width: 100%;
}
</style>
