<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    :height="tableHeigth"
    tooltip-effect="dark"
    style="width: 100%"
    class="table-wrap"
    @selection-change="handleSelectionChange"
    @row-dblclick="rowClick">
    <el-table-column
      width="150px"
      prop="TerminalName"
      label="终端名称"/>
    <el-table-column
      prop="LogTime"
      width="150px"
      label="操作时间"/>
    <!-- <el-table-column
      prop="InperiodDatetime"
      label="账期"
      width="100px"
      show-overflow-tooltip/> -->
    <el-table-column
      prop="OperateTerminal"
      label="操作终端"/>
    <el-table-column
      prop="OperateEmp"
      label="操作人"/>
    <el-table-column
      :label="witchTab === 'add' ? '加币前币数' : '应余币数'"
      prop="OldAmount"
      header-align="right"
      align="right"
      width="100px"/>
    <el-table-column
      :label="witchTab === 'add' ? '加币数量' : '误差'"
      header-align="right"
      align="right"
      prop="Amount"/>
    <el-table-column
      :label="witchTab === 'add' ? '加币后币数' : '实际清点'"
      prop="NewAmount"
      header-align="right"
      align="right"
      width="100px"/>
    <el-table-column
      prop="Summary"
      label="备注"/>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: '',
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    witchTab: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      selectRow: [],
    };
  },

  computed: mapState({
    tableHeigth(state) {
      return state.client.pageHeight - 380;
    },
  }),

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

