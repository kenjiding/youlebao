<template>
  <div class="wrap">
    <div
      ref="searchItem"
      class="wrap-top">
      <el-radio-group
        v-model="isToday"
        @change="getInGateLog">
        <el-radio-button label="Today">今日</el-radio-button>
        <el-radio-button label="All">全部日期</el-radio-button>
      </el-radio-group>
      <el-select
        v-model="formData.MachineID"
        clearable
        placeholder="请选择项目"
        @change="getInGateLog">
        <el-option
          v-for="item in machineOptions"
          :key="item.Value"
          :label="item.Text"
          :value="item.Value"/>
      </el-select>
      <ych-read-card
        ref="GateOutReadCard"
        :auto-logout = "false"
        class="read-card"
        @change="readCardHandle"
        @logout="logoutHandle"/>
      <div class="select-time">
        <el-time-picker
          v-model="outTime"
          :clearable="false"
          :picker-options="{
            selectableRange: '00:00:00-'+maxTime
          }"
          value-format="HH:mm"
          format="HH:mm"
          placeholder="选择时间"
          @change="getInGateLog"/>
        <el-button
          type="primary"
          @click="currentTimes">现在</el-button>
      </div>
      <el-input
        v-model="formData.TicketCode"
        placeholder="请输入票码"
        clearable
        class="search-input"
        @keyup.native.enter="searchClickHandle">
        <template slot="append">
          <el-button
            type="primary"
            @click="searchClickHandle">搜索</el-button>
        </template>
      </el-input>
      <el-button
        type="primary"
        class="clear-btn"
        plain
        @click="clearSearch">重置</el-button>
    </div>
    <div class="wrap-main">
      <div class="main">
        <el-tabs
          ref="gateOutTable"
          v-model="isTime"
          class="tabs-list"
          @tab-click="getInGateLog">
          <el-tab-pane
            :label="timeLabel"
            name="isTime">
            <el-table
              v-loading="loading"
              :data="timeInGateLogTableData"
              :height="isDialog ? 270 : tableHeight"
              highlight-current-row
              style="width: 100%"
              border
              class="table-wrap"
              @row-click="selectRows">
              <el-table-column
                prop="MachineName"
                show-overflow-tooltip
                min-width="150"
                label="游玩项目"/>
              <el-table-column
                prop="LeaguerInfo"
                show-overflow-tooltip
                min-width="120"
                label="会员"/>
              <el-table-column
                prop="InGateTime"
                label="入场时间"
                show-overflow-tooltip
                width="180"/>
              <el-table-column
                prop="PlayMinutes"
                label="游玩时间(分钟)"
                align="right"
                show-overflow-tooltip
                width="120"/>
              <el-table-column
                prop="InCharge"
                label="进闸扣费"
                align="right"
                show-overflow-tooltip
                width="80"/>
              <el-table-column
                prop="OutCharge"
                label="出闸应扣费"
                align="right"
                show-overflow-tooltip
                width="100"/>
              <el-table-column
                prop="TotalCharge"
                show-overflow-tooltip
                align="right"
                label="总费用"
                width="80"/>
              <el-table-column
                prop="Reamin"
                show-overflow-tooltip
                align="right"
                label="余额"
                width="80"/>
              <el-table-column
                prop="ValueTypeName"
                show-overflow-tooltip
                align="right"
                label="使用储值"
                width="80"/>
              <el-table-column
                prop="PlayLogId"
                label="操作"
                align="center"
                fixed="right"
                width="80">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="gateOut(scope.row)">出闸</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            :label="valueLabel"
            name="isValue">
            <el-table
              v-loading="loading"
              :data="valueInGateLogTableData"
              :height="isDialog ? 270 : tableHeight"
              highlight-current-row
              style="width: 100%"
              border
              class="table-wrap"
              @row-click="selectRows">
              <el-table-column
                prop="MachineName"
                show-overflow-tooltip
                min-width="160"
                label="游玩项目"/>
              <el-table-column
                prop="LeaguerInfo"
                show-overflow-tooltip
                min-width="160"
                label="会员"/>
              <el-table-column
                prop="InGateTime"
                label="入场时间"
                show-overflow-tooltip
                width="120"/>
              <el-table-column
                prop="PlayMinutes"
                label="游玩时间(分钟)"
                show-overflow-tooltip
                align="right"
                width="120"/>
              <el-table-column
                prop="InCharge"
                label="进闸扣费"
                show-overflow-tooltip
                align="right"
                width="100"/>
              <el-table-column
                prop="ValueTypeName"
                show-overflow-tooltip
                label="使用储值"
                width="120"/>
              <el-table-column
                prop="TicketName"
                show-overflow-tooltip
                label="套票名称"
                width="120"/>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div class="pagination-wrap">
          <el-button
            v-show="isTime === 'isValue'"
            :disabled="!this.valueInGateLogTableData.length"
            type="primary"
            @click.native="clearMachine">
            清场
          </el-button>
          <el-pagination
            :total="listTotal"
            :current-page.sync="pageIndex"
            :page-size="20"
            background
            layout=" total,jumper,prev, pager, next"
            @current-change="getInGateLog"/>
        </div>
      </div>
    </div>
    <gate-out-dialog
      :btn-text="btnText"
      :btn-type="btnType"
      :gate-out-visible.sync="gateOutVisible"
      :gate-out-btn-loading="gateOutBtnLoading"
      :gate-ticket-info="gateTicketInfo"
      @gateOutReturnOrFill="gateOutReturnOrFill"/>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import GateOutDialog from './GateOutDialog.vue';

export default {
  name: 'ManualGateOutContent',
  components: {
    GateOutDialog,
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        IsToday: true,
        LeaguerID: '',
        MachineID: '',
        TicketCode: '',
        IsOut: false,
        OutHour: '',
        OutMinute: '',
        IsTime: true,
        PageInfo: {},
      },
      maxTime: '23:59:00',
      outTime: '',
      isTime: 'isTime',
      isToday: 'Today',
      currentSelectRow: {},
      timeInGateLogTableData: [],
      valueInGateLogTableData: [],
      machineOptions: [],
      timeLabel: '计时类游乐',
      valueLabel: '计次类游乐',
      loading: false,
      gateOutVisible: false,
      gateOutBtnLoading: false,
      btnText: '退款',
      btnType: 'primary',
      gateTicketInfo: {},
      isReturn: false,
      tableHeight: 0,
      listTotal: null,
      pageIndex: 1,
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
      this.tableHeight = val - this.$refs.searchItem.clientHeight - 115;
    },
    pageWidth() {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 115;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 115;
    });
  },
  activated() {
    this.outTime = this.$date().format('HH:mm');
    this.$nextTick(() => {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 115;
    });
  },
  methods: {
    init() {
      this.getAllByValueGates();
      this.outTime = this.$date().format('HH:mm');
      if (this.outTime) {
        const currentTime = this.outTime.split(':');
        [this.formData.OutHour, this.formData.OutMinute] = currentTime;
      }
      this.getInGateLog();
    },
    clearSearch() {
      this.formData.TicketCode = '';
      this.formData.MachineID = '';
      this.isToday = 'Today';
      this.outTime = this.$date().format('HH:mm');
      this.$refs.GateOutReadCard.logout();
    },
    autoRead() {
      this.$nextTick(() => {
        this.$refs.GateOutReadCard.onRead();
      });
    },
    logoutHandle() {
      this.formData.LeaguerID = '';
    },
    readCardHandle(data) {
      data && (this.formData.LeaguerID = data.ID || '');
      this.pageIndex = 1;
      this.getInGateLog();
    },
    currentTimes() {
      this.outTime = this.$date().format('HH:mm');
      this.pageIndex = 1;
      this.getInGateLog();
    },
    // 根据项目获取可过闸套票
    getInGateLog() {
      this.currentSelectRow = {};
      this.formData.IsTime = (this.isTime === 'isTime');
      this.formData.IsToday = (this.isToday === 'Today');
      if (this.outTime) {
        const outTime = this.outTime.split(':');
        [this.formData.OutHour, this.formData.OutMinute] = outTime;
      }
      this.formData.PageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };
      this.loading = true;
      this.$api['game/machine/getInGateLog'](this.formData).then((res) => {
        this.maxTime = this.$date().format('HH:mm:ss');
        this.loading = false;
        this.listTotal = res.Total;
        if (this.isTime === 'isTime') this.timeInGateLogTableData = res.DataList;
        else this.valueInGateLogTableData = res.DataList;
        this.getMachineInSum();
      }, () => {
        this.loading = false;
      });
    },
    gateOut(row) {
      this.gateTicketInfo = row;
      this.currentSelectRow = row;
      if (row.ValueType === 'Cash') {
        if (row.Reamin === 0) {
          this.isReturn = false;
          this.gateOutReturnOrFill();
        } else {
          if (row.Reamin > 0) {
            this.btnType = 'primary';
            this.btnText = '退款';
            this.isReturn = true;
          } else {
            this.btnType = 'danger';
            this.btnText = '收取欠款';
            this.isReturn = false;
          }
          this.gateOutVisible = true;
        }
      } else {
        this.$confirm(`<div>出闸时间: ${this.outTime} </div><div>消费金额: ${row.TotalCharge} </div>`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
        }).then(() => {
          this.clearMachine();
        }).catch(() => {});
      }
    },
    gateOutReturnOrFill() {
      let url = 'game/machine/outGateFillTicket';
      if (this.isReturn) {
        url = 'game/machine/outGateReturnTicket';
      }
      this.gateOutBtnLoading = true;
      this.$api[url]({
        LogID: this.currentSelectRow.LogID,
        OutHour: this.formData.OutHour,
        OutMinute: this.formData.OutMinute,
      }).then(() => {
        this.gateOutBtnLoading = false;
        this.gateOutVisible = false;
        this.$message({
          message: '出闸成功',
          type: 'success',
        });
        this.pageIndex = 1;
        this.getInGateLog();
      }, () => {
        this.gateOutBtnLoading = false;
      });
    },
    // 获取计时/计次总数
    getMachineInSum() {
      this.$api['game/machine/getMachineInSum']({
        MachineID: this.formData.MachineID,
        LeaguerID: this.formData.LeaguerID,
        IsToday: this.isToday === 'Today',
        TicketCode: this.formData.TicketCode,
      }).then((res) => {
        this.timeLabel = `计时类游乐(${res.TimeTotalCount})`;
        this.valueLabel = `计次类游乐(${res.ValueTotalCount})`;
      });
    },
    // 获取所有扣值闸机下拉
    getAllByValueGates() {
      this.$api['game/machine/getAllByValueGates']({
        IsOut: '',
      }).then((res) => {
        this.machineOptions = res.DataList;
      });
    },
    selectRows(row) {
      this.currentSelectRow = row;
    },
    searchClickHandle() {
      if (!this.formData.TicketCode) {
        this.$message({
          message: '请输入票码',
          type: 'warning',
        });
        return;
      }
      this.pageIndex = 1;
      this.getInGateLog();
    },
    clearMachine() {
      this.$api['game/machine/clearMachineIn']({
        LogID: this.isTime === 'isTime' ? this.currentSelectRow.LogID : '',
        OutHour: this.formData.OutHour,
        OutMinute: this.formData.OutMinute,
        IsToday: this.isToday === 'Today',
        MachineID: this.formData.MachineID,
      }).then(() => {
        this.$message({
          message: '清场成功',
          type: 'success',
        });
        this.pageIndex = 1;
        this.getInGateLog();
        this.maxTime = this.$date().format('HH:mm:ss');
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  background-color: $color-white;
  border-top: solid 1px $border-color;
  box-sizing: border-box;
  /deep/ .el-button {
    width: 100px;
  }
  /deep/ .el-pagination {
    flex: 1;
    text-align: right;
  }
}
.select-time {
  width: 170px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  /deep/ .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  /deep/ .el-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    flex: 0 0 50px;
    height: 40px;
    padding: 12px 0;
    text-align: center;
  }
}
.wrap-main {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  overflow: hidden;
}

.wrap {
  width: 100%;
  background: $color-white;
  border-radius: $border-radius;
}

.tabs-list {
  /deep/ .el-tabs__header {
    margin: 0;
    height: 30px;
    margin-bottom: 5px;
    .el-tabs__nav-scroll {
      padding-left: 30px;
    }
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
    }
  }
}
.wrap-top {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 20px 10px;
  /deep/ .el-radio-group {
    margin-right: 10px;
    flex: 0 0 180px;
    .el-radio-button__inner {
      width: 90px;
      padding: 12px 0;
    }
  }
  .search-input {
    width: 360px;
    margin-right: 10px;
  }
  .check-input {
    flex: 0 0 200px;
    margin-right: 10px;
  }
  .code-input {
    flex: 0 0 280px;
    margin-right: 10px;
  }

  /deep/ .el-select {
    margin-right: 10px;
    margin-bottom: 10px;
    flex: 0 0 220px;
  }
}

.read-card {
  flex: 0 0 200px;
  margin-right: 10px;
}
</style>
