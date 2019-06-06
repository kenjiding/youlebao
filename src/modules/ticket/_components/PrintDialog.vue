<template>
  <el-dialog
    :visible="dialogVisible"
    :append-to-body="true"
    :show-close='false'
    title="打印机信息">
    <el-table
      :data="filterPrint"
      highlight-current-row
      border
      @current-change="handleCurrentChange">
      <el-table-column
        property="name"
        label="打印机名称"
        show-overflow-tooltip/>
        <!-- <el-table-column
        :formatter="formatter"
        property="status"
        label="是否可用"/>
      <el-table-column
        property="isDefault"
        label="是否是默认"/> -->
    </el-table>
    <div class="buttonStyle">
      <el-button
        @click="$emit('cancel')">取消</el-button>
      <el-button
        type="primary"
        @click="selectPrint">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: '',

  props: {
    printData: {
      type: Array,
      default: () => [],
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      rowData: null,
    };
  },

  computed: {
    filterPrint() {
      return this.printData.filter(element => element.status === 0);
    },

  },

  methods: {
    // formatter(row) {
    //   return row.status === 0 ? '是' : '否';
    // },
    handleCurrentChange(row) {
      this.rowData = row;
    },
    selectPrint() {
      if (this.rowData) {
        this.$emit('select-print', this.rowData);
      } else {
        this.$message({
          message: '您还没有选择打印机',
          type: 'warning',
        });
      }
    },
  },
};
</script>

<style lang='scss' scoped>

.buttonStyle {
  text-align: right;
  margin-top: 20px;
}
</style>
