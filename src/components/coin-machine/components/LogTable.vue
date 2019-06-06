<template>
  <el-dialog
    :visible="logTableVisible"
    :append-to-body="true"
    title="详情"
    width="80%"
    @close="closeDialog">
    <div class="wrap-top">
      <el-date-picker
        v-model="timeVal"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="searchData"/>

      <!-- <el-select
        v-model="formData.TerminalID"
        clearable
        placeholder="请选择终端"
        @change="searchData">
        <el-option
          v-for="item in machineOptions"
          :key="item.Value"
          :label="item.TermName"
          :value="item.TermID"/>
      </el-select> -->

      <el-button
        type="primary"
        @click.native="searchData">搜索</el-button>

      <div class="wrap-main">
        <el-tabs
          v-model="tabName"
          @tab-click="searchData">
          <el-tab-pane
            name="add"
            label="加币记录"/>
          <el-tab-pane
            name="clear"
            label="清币记录"/>
        </el-tabs>
        <Table
          :table-data="tableData"
          :witch-tab="tabName"
          @rows-click="rightPageShow"
          @selection-change="handleSelect"/>
        <div class="pagination-wrap">
          <el-pagination
            :total="listTotal"
            :current-page.sync="pageIndex"
            :page-size="20"
            background
            layout=" total,jumper,prev, pager, next"
            @current-change="getTableData"/>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Table from './AddClearLogTable.vue';

export default {
  name: '',
  components: {
    Table,
  },
  props: {
    logTableVisible: {
      type: Boolean,
      default: false,
    },
    itemLogData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      tableData: [],
      timeVal: [],

      tabName: 'add',
      pageIndex: 1,
      listTotal: null,

      machineOptions: [],
      formData: {
        TerminalID: '',
        IsOnleyAddLog: true,
        StartTime: '',
        EndTime: '',
        StockID: '',
        PageInfo: {},
      },
    };
  },

  watch: {
    logTableVisible(val) {
      if (!val) return;
      this.getTableData();
    },
  },

  created() {},

  methods: {
    searchData() {
      this.pageIndex = 1;
      this.getTableData();
    },
    closeDialog() {
      this.$emit('update:logTableVisible', false);
      this.formData.StartTime = '';
      this.formData.EndTime = '';
    },
    getMachineList() {
      this.$api['physicalCoin/getPhysicalCoinTer']().then((res) => {
        this.machineOptions = res.DataList;
      });
    },
    getTableData() {
      const time = this.timeVal;
      if (time) {
        this.formData.StartTime = this.$date(time[0]).format('YYYY-MM-DD');
        this.formData.EndTime = this.$date(time[1]).format('YYYY-MM-DD');
      } else {
        this.formData.StartTime = '';
        this.formData.EndTime = '';
      }
      this.formData.PageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };
      this.formData.IsAddLog = this.tabName === 'add';
      this.formData.TerminalID = this.itemLogData.TerminalID;
      this.formData.StockID = this.itemLogData.StockID;

      this.$api['physicalCoin/getPhysicalCoinTerminalStockLog'](this.formData).then((res) => {
        this.tableData = res.DataList;
        this.listTotal = res.Total;
      });
    },
    handleSelect() {},
    rightPageShow() {},
    searchClickHandle() {

    },
    datePickerClick(val) {
      console.log(val);
    },
    searchClick() {

    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.wrap-main {
  width: 100%;
  margin-top: 10px;
  overflow: hidden;
  position: relative;

  /deep/ .el-tabs__header {
    background-color: $color-white;
    margin: 0;

    .el-tabs__nav {
      margin-left: 30px;
    }
  }
}

.pagination-wrap {
  width: 100%;
  height: 60px;
  text-align: right;
  background-color: $color-white;
  border-top: solid 1px $border-color;

  /deep/ .el-button--primary {
    float: left;
    margin: 10px 0 0 20px;
  }

  /deep/ .el-pagination {
    width: 80%;
    float: right;
    margin: 15px 20px 0 0;
    .el-pagination__jump {
      margin-left: 0;
      margin-right: 10px;
    }
  }
}

.wrap-top {
  /deep/ .el-radio-group {
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
  }

  /deep/ .el-date-editor {
    width: 250px;
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
  }

  /deep/ .ych-read-card {
    width: 330px;
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
  }

  .search-input {
    width: 500px;
    .el-button--primary {
      background-color: $color-primary;
      color: $color-white;
      border-radius: 0;
      border: 0;
      height: 40px;
    }
  }

  /deep/ .el-select {
    margin-right: 10px;
    margin-bottom: 10px;

    float: left;
  }
}
</style>
