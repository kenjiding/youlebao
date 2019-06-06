<template>
  <ych-page>
    <div class="exchange-query">
      <div
        ref="exchangeHeader"
        class="exchange-query-header">
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
          v-model="conditions.OperateTerminal"
          clearable
          placeholder="请选择终端"
          @change="searchAction">
          <el-option
            v-for="item in terminalList"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <el-select
          v-model="conditions.ChannelID"
          clearable
          placeholder="请选择渠道"
          @change="searchAction">
          <el-option
            v-for="item in channelList"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <el-input
          v-model="conditions.Condition"
          placeholder="请输入订单号/商品名称"
          clearable
          class="search-input"
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
      <div class="exchange-query-main">
        <exchange-order-list
          :data-list="orderListData"
          :top-height="topBarHeight"
          @rows-click="handleListRowClick"/>
      </div>
      <div class="exchange-query-footer">
        <el-pagination
          :total="listTotal"
          :current-page.sync="pageIndex"
          :page-size="20"
          background
          layout="total,jumper,prev, pager, next"
          @current-change="currentChange"/>
      </div>
      <div class="exchange-query-aside">
        <transition
          name="slide">
          <exchange-detail
            v-show="showDetail"
            ref="orderDetail"
            :exchange-log-id="currentOrder.ExchangeLogID"
            @close-arrow="showDetail = false"
            @reload-list="searchAction(true)"/>
        </transition>
      </div>
    </div>
  </ych-page>
</template>

<script>
import { mapState } from 'vuex';
import ExchangeOrderList from '@/modules/goods-exchange/_components/ExchangeOrderList.vue';
import ExchangeDetail from '@/modules/goods-exchange/_components/ExchangeDetail.vue';

export default {
  name: 'ExchangeQuery',

  components: {
    ExchangeOrderList,
    ExchangeDetail,
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
        StartDate: '',
        EndDate: '',
        OperateTerminal: '',
        GoodsType: '',
        ChannelID: '',
        Condition: '',
      },
      term: [],
      terminalList: [],
      channelList: [],
      listTotal: 0,
      pageIndex: 1,
      orderListData: [],
      currentOrder: {},
      showDetail: false,
      topBarHeight: 70,
    };
  },

  computed: {
    ...mapState({
      tableWidth: state => state.client.pageWidth,
    }),
  },

  watch: {
    tableWidth() {
      this.topBarHeight = this.$refs.exchangeHeader.clientHeight;
    },
  },

  activated() {
    this.topBarHeight = this.$refs.exchangeHeader.clientHeight;
  },

  created() {
    this.getTermialList();
    this.getChannelList();
    this.getData();
    this.searchAction();
  },

  methods: {
    clearSearch() {
      this.conditions.DateRange = 'Today';
      this.conditions.OperateTerminal = '';
      this.conditions.ChannelID = '';
      this.conditions.Condition = '';
      this.conditions.PageInfo = {
        PageIndex: 1,
        PageSize: 20,
      };
      this.term = [];
      this.$refs.readCard.clearLeaguer();
      this.handleLogout();
    },
    getData() {
      const time = this.term;
      if (time) {
        this.conditions.StartDate = this.$date(time[0]).format('YYYY-MM-DD');
        this.conditions.EndDate = this.$date(time[1]).format('YYYY-MM-DD');
      } else {
        this.conditions.StartDate = '';
        this.conditions.EndDate = '';
      }
    },

    getChannelList() {
      this.$api['goods-exchange/channel/getChannelExceptGroupBuy']().then((res) => {
        this.channelList = res.DataList;
      });
    },

    getTermialList() {
      this.$api['order/order/getCashBarTerminal']().then((res) => {
        this.terminalList = res.DataList;
      });
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
      leaguer && (this.conditions.LeaguerID = leaguer.ID);
      this.searchAction();
    },

    handleLogout() {
      this.conditions.LeaguerID = '';
      this.searchAction();
    },

    searchClick() {
      if ((/^[E][0-9]*$/).test(this.conditions.Condition) && this.conditions.Condition.length >= 15) {
        this.conditions.DateRange = '';
        this.term = [];
        this.conditions.StartDate = '';
        this.conditions.EndDate = '';
      }
      this.searchAction();
    },

    searchAction(isPageChange) {
      this.showDetail = false;
      if (!isPageChange) {
        this.pageIndex = 1;
      }
      this.orderListData = [];
      this.conditions.PageInfo.PageIndex = this.pageIndex;
      this.$api['goods-exchange/exchange/exchangeQuery'](this.conditions)
        .then((res) => {
          this.orderListData = res.DataList;
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

.exchange-query {
  position: relative;
  background-color: $color-white;
  border-radius: $border-radius;

  &-header {
    padding: 20px 20px 0;
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
    padding: 0 20px;

    /deep/ .el-tabs__header {
      background-color: $color-white;
      margin: 0;

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
    background-color: $color-white;

    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }

  &-aside {
    width: 700px;
    z-index: 2000;
    position: absolute;
    right: 0;
    bottom: 0;

    .slide-enter-active {
      transition: all .3s ease;
    }
    .slide-leave-active {
      transition: all .8s ease;
    }
    .slide-enter,
    .slide-leave-to {
      transform: translateX(700px);
      opacity: 0;
    }
  }
}

</style>

