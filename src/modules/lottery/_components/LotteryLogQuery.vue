<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="彩票暂存记录"
    top="15vh"
    width="900px"
    class="lottery-query-dialog"
    append-to-body
    @close="handleClose"
    @open="onLoad">
    <div class="lottery-query">
      <div
        ref="queryHeader"
        class="lottery-query-header">
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
        <el-select
          v-model="conditions.HasTaked"
          clearable
          placeholder="状态"
          @change="searchAction">
          <el-option
            v-for="item in stateList"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <ych-read-card
          ref="readCard"
          class="read-card"
          @change="handlReadCard"
          @logout="handleLogout"/>

        <el-input
          v-model="conditions.LotNumber"
          placeholder="请输入存票单号/存票单二维码"
          clearable
          class="search-input"
          @input="handlCodeInput"
          @keyup.native.enter="searchClick">
          <template slot="append">
            <el-button
              @click.native="searchClick">搜索</el-button>
          </template>
        </el-input>
        <el-button
          type="primary"
          class="clear-btn"
          plain
          @click="clearSearch">重置</el-button>
      </div>
      <div class="lottery-query-main">
        <el-table
          :data="dataList"
          height="300px"
          tooltip-effect="dark"
          style="width: 100%"
          class="log-list"
          border
          highlight-current-row>
          <el-table-column
            prop="LogTime"
            show-overflow-tooltip
            label="暂存日期"
            width="160"/>
          <el-table-column
            prop="TakeOutLeaguerName"
            show-overflow-tooltip
            label="存入会员"
            min-width="160"/>
          <el-table-column
            prop="LotteryCount"
            label="暂存数量"
            width="100"
            align="right"
            header-align="center"/>
          <el-table-column
            :formatter="formatter"
            prop="HasTaked"
            label="状态"
            width="80"/>
          <el-table-column
            prop="TakeOutTime"
            show-overflow-tooltip
            label="取票时间"
            width="160"/>
          <el-table-column
            prop="LeaguerName"
            show-overflow-tooltip
            min-width="160"
            label="暂存会员"/>
          <el-table-column
            prop="Summary"
            show-overflow-tooltip
            label="备注"
            width="200"
            align="right"
            header-align="center"/>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.HasTaked"
                type="text"
                @click="handleRowClick(scope.row)">重新打印</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="lottery-query-footer">
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
  name: 'Order',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      localVisible: false,
      conditions: {
        PageInfo: {
          PageIndex: 1,
          PageSize: 20,
        },
        DateRange: 'Today',
        StartTime: '',
        EndTime: '',
        HasTaked: null,
        LeaguerId: '',
        TakeOutLeaguer: '',
        LotNumber: '',
      },
      term: [],
      stateList: [{
        Text: '全部',
        Value: null,
      }, {
        Text: '未取票',
        Value: false,
      }, {
        Text: '已取票',
        Value: true,
      }],
      dataList: [],
      listTotal: 0,
      pageIndex: 1,
      topBarHeight: 60,
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.localVisible;
      },

      set(val) {
        this.localVisible = val;
        this.$emit('update:visible', val);
      },
    },
  },

  watch: {
    visible(val) {
      this.localVisible = val;
    },
  },

  created() {
    this.getData();
    // this.searchAction();
  },

  methods: {
    onLoad() {
      this.searchAction();
    },

    handleClose() {
      this.clearSearch();
      this.$emit('close');
    },

    clearSearch() {
      this.conditions.DateRange = 'Today';
      this.conditions.HasTaked = null;
      this.conditions.PageInfo = {
        PageIndex: 1,
        PageSize: 20,
      };
      this.conditions.LotNumber = '';
      this.$refs.readCard.clearLeaguer();
      this.handleLogout();
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
        this.conditions.TakeOutLeaguer = leaguer.ID;
        this.searchAction();
      }
    },

    handleLogout() {
      this.conditions.TakeOutLeaguer = '';
      this.searchAction();
    },

    handlCodeInput(val) {
      const hasIndex = val.indexOf('saveLotteryID');
      if (hasIndex > -1) {
        this.conditions.LotNumber = val.substring(hasIndex, val.length).replace('saveLotteryID=', '');
      }
    },

    searchClick() {
      if (this.conditions.LotNumber) {
        this.conditions.DateRange = '';
        this.conditions.StartTime = '';
        this.conditions.EndTime = '';
      }
      this.conditions.HasTaked = null;
      this.searchAction();
    },

    searchAction(isPageChange) {
      this.showDetail = false;
      if (!isPageChange) {
        this.pageIndex = 1;
      }
      this.dataList = [];
      this.conditions.PageInfo.PageIndex = this.pageIndex;
      this.$api['lottery/lottery/getTempTicketList'](this.conditions)
        .then((res) => {
          this.dataList = res.DataList;
          this.listTotal = res.Total;
        });
    },

    formatter(row) {
      return row.HasTaked ? '已取票' : '未取票';
    },

    currentChange() {
      this.searchAction(true);
    },

    handleRowClick(row) {
      this.$emit('print', row);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.lottery-query {
  position: relative;
  background-color: $color-white;
  border-radius: $border-radius;
  overflow: hidden;

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
      width: 410px;
      margin-right: 10px;

      .el-button {
        color: $color-primary;
      }
    }

    /deep/ .el-select {
      width: 120px;
      margin-right: 10px;
      margin-bottom: 10px;
    }

    /deep/ .el-radio-group {
      margin-right: 10px;
    }
  }

  &-main {
    padding: 10px;

    /deep/ .el-tabs__header {
      background-color: $color-white;
      margin: 0;
      margin-bottom: 5px;

      .el-tabs__nav {
        margin-left: 30px;
      }
    }
  }

  &-footer {
    width: 100%;
    padding-top: 14px;
    height: 46px;
    text-align: right;
  }

}

.lottery-query-dialog {
  margin-bottom: 0;
  $two-px:2px;

  // .log-query {
  //   width: 100px !important;
  //   background-color: $color-white;
  // }

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
    padding: 0 20px;
  }
}

</style>

