<template>
  <el-dialog
    :visible.sync="outCoinVisible"
    :close-on-click-modal="false"
    class="wrap-top"
    title="出币异常记录"
    width="1024px"
    @close="dialogClose"
    @open="currentChange">
    <el-radio-group
      v-model="formData.DateRange"
      @change="currentChange">
      <el-radio-button label="Today">今日</el-radio-button>
      <el-radio-button label="Yesterday">昨天</el-radio-button>
      <el-radio-button label="ThirtyDays">近30天</el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-model="timeVal"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="selectDate"/>

    <ych-read-card
      ref="giftReadCard"
      class="read-card"
      @change="readCardHandle"
      @logout="logoutHandle"/>

    <div class="wrap-main">
      <el-tabs
        v-model="formData.State"
        @tab-click="currentChange">
        <el-tab-pane
          name="1"
          label="异常"/>
        <el-tab-pane
          name="2"
          label="已完成"/>
      </el-tabs>
      <Table
        :table-data="tableData"
        :tabs-status="formData.State"
        @update-table="currentChange"/>
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
  </el-dialog>
</template>

<script>
import Table from './LogTable.vue';

export default {
  name: 'OutCoinLog',
  components: {
    Table,
  },

  props: {},

  data() {
    return {
      tableData: [],
      timeVal: [],
      pageIndex: 1,
      listTotal: null,

      formData: {
        State: '1',
        StartDate: '',
        EndDate: '',
        LeaguerID: '',
        DateRange: 'Today',
        PageInfo: {},
      },
      outCoinVisible: false,
    };
  },

  mounted() {
    this.outCoinVisible = true;
  },

  methods: {
    currentChange() {
      this.pageIndex = 1;
      this.getTableData();
    },
    selectDate() {
      this.formData.DateRange = '';
      this.pageIndex = 1;
      this.getTableData();
    },
    dialogClose() {
      // this.$refs.giftReadCard.logout();
      // this.logoutHandle();
      this.$emit('close');
      this.remove();
    },
    logoutHandle() {
      this.formData.State = '1';
      this.formData.StartDate = '';
      this.formData.EndDate = '';
      this.formData.LeaguerID = '';
      this.formData.DateRange = 'Today';
      this.formData.PageInfo = {};
      this.tableData = [];
    },
    readCardHandle(data) {
      this.formData.LeaguerID = data && data.ID;
      this.getTableData();
    },
    getTableData() {
      const time = this.timeVal;
      if (time) {
        this.formData.StartDate = this.$date(time[0]).format('YYYY-MM-DD');
        this.formData.EndDate = this.$date(time[1]).format('YYYY-MM-DD');
      } else {
        this.formData.StartDate = '';
        this.formData.EndDate = '';
      }
      this.formData.PageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };

      this.$api['physicalCoin/queryGetPhysicalCoinErrorTreate'](this.formData).then((res) => {
        this.tableData = res.DataList;
        this.listTotal = res.Total;
      });
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

  /deep/ .el-dialog__header {
    border-bottom: 1px solid $border-color;
    padding: 20px;
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
