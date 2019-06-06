<template>
  <div class="wrap">
    <div
      ref="searchItem"
      class="wrap-top" >
      <el-radio-group
        v-model="formData.DateRange"
        @change="quickQuery">
        <el-radio-button label="Today">今日</el-radio-button>
        <el-radio-button label="Yesterday">昨日</el-radio-button>
        <el-radio-button label="OneWeek">近7日</el-radio-button>
        <el-radio-button label="ThirtyDays">近30日</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="timeVal"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="datePickerClick"/>
      <ych-read-card
        ref="CancelReadCard"
        class="read-card"
        @change="readCardHandle"
        @logout="logoutHandle"/>
      <el-select
        v-model="formData.MachineID"
        clearable
        placeholder="选择项目"
        @change="searchClick">
        <el-option
          v-for="item in machineOptions"
          :key="item.Value"
          :label="item.Text"
          :value="item.Value"/>
      </el-select>
    </div>
    <div class="wrap-main">
      <div class="main">
        <el-table
          :data="cancelTableData"
          :height="isDialog ? 320 : tableHeight"
          highlight-current-row
          border
          class="table-wrap">
          <el-table-column
            prop="LeaguerCode"
            show-overflow-tooltip
            width="180"
            label="会员"/>
          <el-table-column
            prop="MachineName"
            show-overflow-tooltip
            label="游玩项目"
            width="120"/>
          <el-table-column
            prop="MachineType"
            show-overflow-tooltip
            label="项目类型"
            width="120"/>
          <el-table-column
            prop="SaleTime"
            show-overflow-tooltip
            label="游玩时间"
            width="180"/>
          <el-table-column
            prop="Amount"
            show-overflow-tooltip
            label="消费数量"
            width="120"/>
          <el-table-column
            prop="Summary"
            show-overflow-tooltip
            label="备注"
            min-width="180"/>
          <el-table-column
            prop="PlayLogId"
            label="操作"
            fixed="right"
            width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="cancelOrder(scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination
            :total="listTotal"
            :current-page.sync="pageIndex"
            :page-size="20"
            background
            layout=" total,jumper,prev, pager, next"
            @current-change="getData"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'CancelOrderContent',
  components: {},
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        StartDate: '',
        EndDate: '',
        LeaguerID: '',
        MachineID: '',
        DateRange: 'Today',
        PageInfo: {},
      },
      cancelTableData: [],
      timeVal: [],
      listTotal: null,
      pageIndex: 1,
      machineOptions: [],
      tableHeight: 0,
    };
  },
  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
    }),
  },
  watch: {
    pageHeight(val) {
      this.tableHeight = val - this.$refs.searchItem.clientHeight - 60;
    },
    pageWidth() {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 60;
    },
  },
  activated() {
    this.$nextTick(() => {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 60;
    });
  },
  created() {
    this.getData();
    this.getSelectList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 60;
    });
  },
  methods: {
    autoRead() {
      this.$nextTick(() => {
        this.$refs.CancelReadCard.onRead();
      });
    },
    cancelOrder(row) {
      this.$confirm('是否取消该机台消费, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api['game/machine/cancelMachineCoinIn']({
          ID: row.ID,
        }).then(() => {
          this.$message({
            type: 'success',
            message: '取消成功!',
          });
          this.pageIndex = 1;
          this.getData();
        });
      }).catch(() => {});
    },
    logoutHandle() {
      this.formData.LeaguerID = '';
      this.getData();
    },
    readCardHandle(data) {
      data && (this.formData.LeaguerID = data.ID || '');
      // this.formData.DateRange = 'ALL';
      this.formData.LeaguerID && this.searchClick();
    },
    datePickerClick(value) {
      this.formData.DateRange = value ? '' : 'Today';
      this.searchClick();
    },
    quickQuery() {
      this.timeVal = '';
      this.searchClick();
    },
    searchClick() {
      this.pageIndex = 1;
      this.getData();
    },
    getSelectList() {
      this.$api['game/machine/getAllMachine']().then((res) => {
        this.machineOptions = res.DataList;
      });
    },
    getData() {
      const time = this.timeVal;
      if (time) {
        [this.formData.StartDate, this.formData.EndDate] = time;
      } else {
        this.formData.StartDate = '';
        this.formData.EndDate = '';
      }
      this.formData.PageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };

      this.$api['game/machine/playLog'](this.formData).then((res) => {
        this.listTotal = res.Total;
        this.cancelTableData = res.DataList;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
.pagination-wrap {
  width: 100%;
  height: 60px;
  text-align: right;
  background-color: $color-white;
  border-top: solid 1px $border-color;
  box-sizing: border-box;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
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

.wrap-main {
  width: 100%;
  overflow: hidden;
}

.wrap {
  width: 100%;
  background: $color-white;
  border-radius: $border-radius;
}
.wrap-top {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 20px 10px;
  /deep/ .el-radio-group {
    margin-right: 10px;
    margin-bottom: 10px;
    flex: 0 0 300px;
    .el-radio-button__inner {
      width: 75px;
      padding: 12px 0;
    }
  }
  /deep/ .el-date-editor {
    flex: 0 0 240px;
    margin-right: 10px;
  }

  /deep/ .el-select {
    margin-right: 10px;
    flex: 0 0 220px;
  }
}
.read-card {
  flex: 0 0 320px;
  margin-right: 10px;
}
</style>
