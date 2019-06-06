<template>
  <el-dialog
    :visible="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="false"
    title="取消赠币"
    width="1000px"
    @close="$emit('update:dialogVisible', false)"
    @open="init">
    <div class="table-wrap">
      <el-time-picker
        v-model="timeVal"
        is-range
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"/>
      <ych-read-card
        ref="giftReadCard"
        class="read-card"
        @change="readCard"
        @logout="loginOut"/>

      <el-button
        type="primary"
        @click="searchHandle">搜索</el-button>
    </div>

    <el-table
      :data="tableData"
      highlight-current-row
      border
      tooltip-effect="dark"
      style="width: 100%;"
      height="300px"
      class="table"
      @current-change="selectLogItem">
      <el-table-column
        prop="LogTime"
        label="赠送时间"
        header-align="center"
        width="170px"
        align="center"/>
      <el-table-column
        prop="LeaguerInfo"
        label="会员信息"
        header-align="center"
        width="170px"
        align="center"/>
      <el-table-column
        prop="CoinNumber"
        label="赠送代币数"
        width="100"
        align="right"
        show-overflow-tooltip/>
      <el-table-column
        prop="GoldCoinNumber"
        width="100"
        align="right"
        label="赠送金币数"
        show-overflow-tooltip/>
      <el-table-column
        prop="PhCoinNumber"
        width="110"
        align="right"
        label="赠送实物币数"
        show-overflow-tooltip/>
      <el-table-column
        prop="LotteryNumber"
        label="赠送彩票"
        align="right"
        show-overflow-tooltip/>
      <el-table-column
        prop="HeapcentNumber"
        label="赠送积分"
        align="right"
        show-overflow-tooltip/>
      <el-table-column
        prop="SchemeName"
        label="赠送方案"
        align="center"
        show-overflow-tooltip/>
      <el-table-column
        prop="Operator"
        label="操作人"
        header-align="center"
        align="center"
        show-overflow-tooltip/>
      <el-table-column
        prop="OperateTermen"
        label="操作终端"
        header-align="center"
        align="center"
        show-overflow-tooltip/>
      <el-table-column
        prop="Summary"
        label="备注"
        header-align="center"
        align="center"
        width="200px"
        show-overflow-tooltip/>
    </el-table>
    <div class="pagination-wrap">
      <el-pagination
        :total="listTotal"
        :current-page.sync="pageIndex"
        :page-size="20"
        background
        layout=" total,jumper,prev, pager, next"
        @current-change="currentChange"/>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        @click="clearData"
      >关 闭</el-button>
      <el-button
        :loading="isLoading"
        type="primary"
        @click="cancelSend">确认取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',

  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      startTime: '',
      endTime: '',
      isLoading: false,
      tableData: [],
      memberCarsId: '',
      timeVal: [this.$date().set('hour', 0).set('minute', 0).set('second', 0)
        .toDate(),
      this.$date().set('hour', 23).set('minute', 59).set('second', 59)
        .toDate(),
      ],
      logItemID: '',
      pageIndex: 1,
      listTotal: null,
    };
  },

  methods: {
    loginOut() {
      this.memberCarsId = '';
      this.getData();
    },
    readCard(data) {
      this.memberCarsId = data && data.ID;
      this.getData();
    },
    currentChange(val) {
      this.pageIndex = val;
      this.getData();
    },
    init() {
      this.startTime = this.$date(this.timeVal[0]).format('YYYY-MM-DD HH:mm:ss');
      this.endTime = this.$date(this.timeVal[1]).format('YYYY-MM-DD HH:mm:ss');
      this.getData();
    },
    clearData() {
      if (this.memberCarsId) this.$refs.giftReadCard.logout();
      this.tableData = [];
      this.listTotal = null;
      this.timeVal = [this.$date().set('hour', 0).set('minute', 0).set('second', 0)
        .toDate(),
      this.$date().set('hour', 23).set('minute', 59).set('second', 59)
        .toDate(),
      ];
      this.$emit('update:dialogVisible', false);
    },
    selectLogItem(row) {
      if (!row) return;
      this.logItemID = row.LogID;
    },
    searchHandle() {
      this.pageIndex = 1;
      const time = this.timeVal;
      if (time) {
        this.startTime = this.$date(time[0]).format('YYYY-MM-DD HH:mm:ss');
        this.endTime = this.$date(time[1]).format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.startTime = '';
        this.endTime = '';
      }

      if (!this.startTime && !this.memberCarsId) {
        this.$message({
          message: '请选择筛选条件',
          type: 'warning',
        });
        return;
      }

      this.getData();
    },
    getData() {
      this.logItemID = '';

      const formData = {
        LeaguerID: this.memberCarsId,
        StartTime: this.startTime,
        EndTime: this.endTime,
      };
      formData.PageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };
      this.$api['activity-gift/givingCoin/getGivingCoinLogList'](formData).then((res) => {
        this.tableData = res.DataList;
        this.listTotal = res.Total;
      });
    },
    cancelSend() {
      if (!this.logItemID) {
        this.$message({
          type: 'warning',
          message: '请选择需要取消的记录',
        });
        return;
      }
      this.isLoading = true;
      this.$api['activity-gift/givingCoin/cancelGivingCoinLog']({
        LogID: this.logItemID,
      }).then(() => {
        this.$emit('update:dialogVisible', false);
        this.isLoading = false;
        this.clearData();
      }, () => { this.isLoading = false; });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.pagination-wrap {
  width: 100%;
  text-align: right;
  margin-top: 20px;

  /deep/ .el-pagination__jump {
    margin-left: 0;
    margin-right: 10px;
  }
}

.table {
  margin-top: 10px;
}

.table-wrap {
  /deep/ .el-date-editor {
    float: left;
  }
}

.read-card {
  width: 300px;
  float: left;
  margin: 0 10px;
}
</style>
