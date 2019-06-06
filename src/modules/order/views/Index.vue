<template>
  <ych-page>
    <div class="order">
      <div
        ref="orederHeader"
        class="order-header">
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
          v-model="conditions.TerminalID"
          :disabled="localTerminalOnly"
          clearable
          placeholder="请选择终端"
          @change="searchAction">
          <el-option
            v-for="item in terminalList"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <!-- <el-select
          v-model="conditions.GoodsType"
          clearable
          placeholder="请选择商品类型"
          @change="searchAction">
          <el-option
            v-for="item in goodsTypeList"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select> -->
        <el-select
          v-model="conditions.PayWay"
          clearable
          placeholder="请选择支付方式"
          @change="searchAction">
          <el-option
            v-for="item in payTypeList"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <el-input
          v-model="conditions.Condition"
          placeholder="请输入订单号/商品名称/支付单号"
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
      <div class="order-main">
        <el-tabs
          v-model="conditions.OrderStatus"
          @tab-click="searchAction">
          <el-tab-pane
            label="全部订单"
            name="All"/>
          <el-tab-pane
            label="待支付"
            name="Paying"/>
          <el-tab-pane
            label="已支付"
            name="Payed"/>
          <el-tab-pane
            label="已退款"
            name="Refund"/>
          <el-tab-pane
            label="已取消"
            name="Cancel"/>
        </el-tabs>
        <order-list
          :data-list="orderListData"
          :top-height="topBarHeight"
          @rows-click="handleListRowClick"/>
      </div>
      <div class="order-footer">
        <el-pagination
          :total="listTotal"
          :current-page.sync="pageIndex"
          :page-size="20"
          background
          layout="total,jumper,prev, pager, next"
          @current-change="currentChange"/>
      </div>
      <div class="order-aside">
        <transition
          name="slide">
          <order-detail
            v-show="showDetail"
            ref="orderDetail"
            :order="currentOrder"
            :top-height="topBarHeight"
            @close-arrow="showDetail = false"
            @reload-list="searchAction(true)"/>
        </transition>
      </div>
    </div>
  </ych-page>
</template>

<script>
import { mapState } from 'vuex';
import OrderList from '@/modules/order/_components/OrderList.vue';
import OrderDetail from '@/modules/order/_components/OrderDetail.vue';

export default {
  name: 'Order',

  components: {
    OrderList,
    OrderDetail,
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
        TerminalID: '',
        GoodsType: '',
        PayWay: '',
        Condition: '',
        OrderStatus: 'All',
      },
      term: [],
      terminalList: [],
      goodsTypeList: [],
      payTypeList: [],
      listTotal: 0,
      pageIndex: 1,
      orderListData: [],
      currentOrder: {},
      showDetail: false,
      topBarHeight: 60,
    };
  },

  computed: {
    ...mapState({
      localTerminal: (state) => {
        const terminal = state.user.info.Termina;
        return terminal || {};
      },
      tableWidth: state => state.client.pageWidth,
    }),

    localTerminalOnly() {
      return !this.$hasPermission(203001102);
    },
  },

  watch: {
    tableWidth() {
      this.topBarHeight = this.$refs.orederHeader.clientHeight;
    },
  },

  created() {
    this.getTermialList();
    this.getPayTypeList();
    // this.getGoodsTypeList();
    this.getData();
    this.searchAction();
  },

  activated() {
    this.topBarHeight = this.$refs.orederHeader.clientHeight;
  },

  methods: {
    clearSearch() {
      this.conditions.DateRange = 'Today';
      this.conditions.TerminalID = '';
      this.conditions.PayWay = '';
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
        this.conditions.StartTime = this.$date(time[0]).format('YYYY-MM-DD');
        this.conditions.EndTime = this.$date(time[1]).format('YYYY-MM-DD');
      } else {
        this.conditions.StartTime = '';
        this.conditions.EndTime = '';
      }
    },

    getPayTypeList() {
      this.$api['order/order/getAllPayType']().then((res) => {
        this.payTypeList = res.DataList;
      });
    },

    getTermialList() {
      if (this.localTerminalOnly) {
        this.terminalList = [{
          Value: this.localTerminal.TerminalId,
          Text: this.localTerminal.TerminalName,
        }];
        this.conditions.TerminalID = this.localTerminal.TerminalId;
      } else {
        this.$api['order/order/getCashBarTerminal']().then((res) => {
          this.terminalList = res.DataList;
        });
      }
    },

    getGoodsTypeList() {
      this.$api['order/goodsType/getGoodsTypeList']().then((res) => {
        this.goodsTypeList = res.DataList;
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
      if ((/^[D][0-9]*$/).test(this.conditions.Condition) && this.conditions.Condition.length >= 15) {
        this.conditions.DateRange = '';
        this.term = [];
        this.conditions.StartTime = '';
        this.conditions.EndTime = '';
      }
      this.conditions.OrderStatus = 'All';
      this.searchAction();
    },

    searchAction(isPageChange) {
      this.showDetail = false;
      if (!isPageChange) {
        this.pageIndex = 1;
      }
      this.orderListData = [];
      this.conditions.PageInfo.PageIndex = this.pageIndex;
      this.$api['order/order/getOrderList'](this.conditions)
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

.order {
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

