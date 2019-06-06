<template>
  <el-dialog
    :visible="visible"
    title="会员漫游"
    top="12vh"
    width="930px"
    class="roam-logs-dialog"
    @close="handleClose"
    @open="onLoad">
    <div class="roam-logs">
      <div
        class="roam-logs-header">
        <el-radio-group
          v-model="conditions.DateRange"
          @change="handleDateRangChange">
          <el-radio-button label="Today">今日</el-radio-button>
          <el-radio-button label="Yesterday">昨日</el-radio-button>
          <el-radio-button label="OneWeek">近7日</el-radio-button>
          <el-radio-button label="ThirtyDays">近30日</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="term"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDatePickerChange"/>
        <ych-read-card
          ref="readCard"
          class="read-card"
          @change="handlReadCard"
          @logout="handleLogout"/>
        <el-select
          v-model="conditions.ValueType"
          clearable
          placeholder="请选择储值类型"
          @change="searchAction">
          <el-option
            v-for="item in ValueTypes"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <el-select
          v-model="conditions.RoamType"
          clearable
          placeholder="请选择转账类型"
          @change="searchAction">
          <el-option
            v-for="item in RoamTypes"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <el-button
          type="primary"
          class="clear-btn"
          plain
          @click="clearSearch">重置</el-button>
      </div>
      <div class="roam-logs-main">
        <el-table
          :data="roamListData"
          height="430px"
          tooltip-effect="dark"
          style="width: 100%"
          border
          highlight-current-row>
          <el-table-column
            prop="RoamTime"
            show-overflow-tooltip
            width="160"
            label="漫游时间"/>
          <el-table-column
            prop="LeaguerCode"
            show-overflow-tooltip
            label="会员"
            min-width="160"/>
          <el-table-column
            prop="Amount"
            show-overflow-tooltip
            label="漫游数量"
            min-width="100"/>
          <el-table-column
            prop="ValueType"
            show-overflow-tooltip
            label="储值类型"
            min-width="80"/>
          <el-table-column
            :formatter="tranRoamTypeChs"
            prop="RoamType"
            show-overflow-tooltip
            label="转账类型"
            min-width="80"/>
          <el-table-column
            prop="RelatedBizName"
            show-overflow-tooltip
            label="相关门店"/>
        </el-table>
      </div>
      <div class="roam-logs-footer">
        <el-pagination
          :total="listTotal"
          :current-page.sync="pageIndex"
          :page-size="20"
          background
          layout="total,jumper,prev, pager, next"
          @current-change="currentChange"/>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'RoamLogs',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      conditions: {
        PageInfo: {
          PageIndex: 1,
          PageSize: 20,
        },
        DateRange: 'Today',
        LeaguerID: '',
        StartTime: '',
        EndTime: '',
        RoamType: '',
        ValueType: '',
      },
      term: [],
      listTotal: 0,
      pageIndex: 1,
      roamListData: [],
      RoamTypes: [{
        Text: '转出',
        Value: 'Out',
      },
      {
        Text: '转入',
        Value: 'In',
      },
      {
        Text: '取消转出',
        Value: 'Cacnel',
      },
      ],
      ValueTypes: [{
        Text: '预存款',
        Value: '1',
      },
      {
        Text: '积分',
        Value: '3',
      },
      {
        Text: '金币',
        Value: '401',
      }, {
        Text: '代币',
        Value: '402',
      }, {
        Text: '彩票',
        Value: '403',
      }],
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.searchAction();
      }
    },
  },

  methods: {
    onLoad() {
      this.$nextTick(() => {
        this.$refs.readCard && this.$refs.readCard.onRead();
      });
    },

    handleClose() {
      this.clear();
      this.$emit('update:visible', false);
    },

    clearSearch() {
      this.clear();
      this.handleLogout();
    },

    clear() {
      Object.assign(this.conditions, {
        DateRange: 'Today',
        RoamType: '',
        ValueType: '',
        PageInfo: {
          PageIndex: 1,
          PageSize: 20,
        },
      });
      this.term = [];
      this.$refs.readCard.clearLeaguer();
    },

    getData() {
      const time = this.term;
      if (time) {
        this.conditions.StartTime = this.$date(time[0]).format('YYYY-MM-DD');
        this.conditions.EndTime = this.$date(time[1]).format('YYYY-MM-DD');
      } else {
        this.conditions.StartTime = '';
        this.conditions.EndTime = '';
      }
    },

    tranRoamTypeChs(row) {
      const roamTypeChs = {
        Out: '转出',
        In: '转入',
        Cacnel: '取消转出',
      };
      return roamTypeChs[row.RoamType];
    },

    handleDateRangChange() {
      this.term = [];
      this.getData();
      this.searchAction();
    },

    handleDatePickerChange() {
      this.conditions.DateRange = '';
      this.getData();
      this.searchAction();
    },

    handlReadCard(leaguer) {
      if (leaguer) {
        this.conditions.LeaguerID = leaguer.ID;
        this.searchAction();
      }
    },

    handleLogout() {
      this.conditions.LeaguerID = '';
      this.searchAction();
    },

    searchClick() {
      // this.conditions.DateRange = '';
      // this.term = [];
      // this.conditions.StartTime = '';
      // this.conditions.EndTime = '';
      // this.conditions.OrderStatus = 'All';
      this.searchAction();
    },

    searchAction(isPageChange) {
      this.showDetail = false;
      if (!isPageChange) {
        this.pageIndex = 1;
      }
      this.orderListData = [];
      this.conditions.PageInfo.PageIndex = this.pageIndex;
      this.$api['leaguer/leaguer/getLgRoamRecordByCash'](this.conditions)
        .then((res) => {
          this.roamListData = res.DataList;
          this.listTotal = res.Total;
        });
    },

    currentChange() {
      this.searchAction(true);
    },

    handleListRowClick(row) {
      this.currentOrder = row;
      this.$nextTick(() => {
        this.$refs.orderDetail.onLoad();
        this.showDetail = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.roam-logs {
  width: 930px;
  height: 600px;
  position: relative;
  background-color: $color-white;
  border-radius: $border-radius;
  overflow: hidden;

  &-dialog {
    margin-bottom: 0;
    $two-px:2px;

    .dialog-content{
      top: 0 !important;
      border-radius: $border-radius;
    }

    /deep/ .el-dialog__header {
      height: 50px;
      padding: 0;
      border-bottom: 1px $border-color solid;
    }

    /deep/ .el-dialog__title {
      padding-left: 30px;
      line-height: 50px;
      font-size: $color-bg-primary + $two-px;
      color: $font-color-regular;
    }

    /deep/ .el-dialog__body {
      padding: 0;
      position: relative;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      border-top: 1px $border-color solid;

      .el-button {
        width: 120px;
      }
    }
  }

  &-header {
    padding: 10px 10px 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    /deep/ .el-date-editor {
      width: 250px;
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .read-card {
      width: 320px;
      margin-right: 10px;
    }

    .search-input {
      width: 470px;
      margin-right: 10px;

      .el-button {
        color: $color-primary;
      }
    }

    /deep/ .el-select {
      margin-right: 10px;
      margin-bottom: 10px;
    }

    /deep/ .el-radio-group {
      margin-right: 10px;
    }
  }

  &-main {
    padding: 0 10px;
  }

  &-footer {
    width: 100%;
    padding-top: 14px;
    height: 46px;
    text-align: right;
  }
}

</style>

