<template>
  <div class="leaguer-tables">
    <el-tabs
      v-model="activeTab"
      :height="tableHeight"
      @tab-click="activeLoad">
      <el-tab-pane
        label="订单查询"
        name="order">
        <order-list
          ref="orderList"
          :leaguer-id="leaguerId"
          :list-height="listHeight"/>
      </el-tab-pane>
      <el-tab-pane
        label="游玩记录"
        name="play">
        <play-log-list
          ref="playLogList"
          :leaguer-id="leaguerId"
          :list-height="listHeight"/>
      </el-tab-pane>
      <el-tab-pane
        label="兑换记录"
        name="exchange">
        <exchange-log-list
          ref="exchangeLogList"
          :leaguer-id="leaguerId"
          :list-height="listHeight"/>
      </el-tab-pane>
      <el-tab-pane
        label="套票"
        name="ticket">
        <ticket-list
          ref="ticketList"
          :leaguer-id="leaguerId"
          :list-height="listHeight"
          @row-click="handleRowClick"/>
      </el-tab-pane>
      <el-tab-pane
        label="预存款变更"
        name="predeposit">
        <value-change-logs
          ref="predepositLog"
          :leaguer-id="leaguerId"
          :value-type="1"
          :list-height="listHeight"/>
      </el-tab-pane>
      <el-tab-pane
        label="代币变更"
        name="coin">
        <value-change-logs
          ref="coinLog"
          :leaguer-id="leaguerId"
          :value-type="402"
          :list-height="listHeight"/>
      </el-tab-pane>
      <el-tab-pane
        label="金币变更"
        name="goldcoin">
        <value-change-logs
          ref="goldcoinLog"
          :leaguer-id="leaguerId"
          :value-type="401"
          :list-height="listHeight"/>
      </el-tab-pane>
      <el-tab-pane
        label="彩票变更"
        name="lottery">
        <value-change-logs
          ref="lotteryLog"
          :leaguer-id="leaguerId"
          :value-type="403"
          :list-height="listHeight"/>
      </el-tab-pane>
      <el-tab-pane
        label="积分变更"
        name="cent">
        <value-change-logs
          ref="centLog"
          :leaguer-id="leaguerId"
          :value-type="3"
          :list-height="listHeight"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderList from '../_components/tables/OrderList.vue';
import PlayLogList from '../_components/tables/PlayLogList.vue';
import ExchangeLogList from '../_components/tables/ExchangeLogList.vue';
import TicketList from '../_components/tables/TicketList.vue';
import ValueChangeLogs from '../_components/tables/ValueChangeLogs.vue';

export default {
  name: 'LeaguerTables',

  components: {
    OrderList,
    PlayLogList,
    TicketList,
    ExchangeLogList,
    ValueChangeLogs,
  },

  props: {
    leaguerId: {
      type: String,
      default: '',
    },
    tableHeight: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      activeTab: 'order',
    };
  },

  computed: {
    ...mapGetters({
      pageHeight: 'pageHeight',
    }),

    listHeight() {
      return this.pageHeight - 400;
    },
  },


  methods: {
    reLoad() {
      this.allClear();
      this.activeLoad();
    },

    allClear() {
      this.$refs.orderList.clear();
      this.$refs.ticketList.clear();
      this.$refs.playLogList.clear();
      this.$refs.exchangeLogList.clear();
      this.$refs.predepositLog.clear();
      this.$refs.goldcoinLog.clear();
      this.$refs.coinLog.clear();
      this.$refs.lotteryLog.clear();
      this.$refs.centLog.clear();
    },

    activeLoad() {
      switch (this.activeTab) {
        case 'order':
          this.$refs.orderList.activeShow();
          break;
        case 'play':
          this.$refs.playLogList.activeShow();
          break;
        case 'ticket':
          this.$refs.ticketList.activeShow();
          break;
        case 'exchange':
          this.$refs.exchangeLogList.activeShow();
          break;
        case 'predeposit':
          this.$refs.predepositLog.activeShow();
          break;
        case 'goldcoin':
          this.$refs.goldcoinLog.activeShow();
          break;
        case 'coin':
          this.$refs.coinLog.activeShow();
          break;
        case 'lottery':
          this.$refs.lotteryLog.activeShow();
          break;
        case 'cent':
          this.$refs.centLog.activeShow();
          break;
        default:
          break;
      }
    },

    handleRowClick(val) {
      this.$emit('row-click', val);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .leaguer-tables {
    overflow: hidden;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;

    /deep/ .el-tabs__header {
      padding: 0 30px;
      margin: 0;
      background-color: $color-white;
      border-bottom: 1px $border-color solid;
    }

    /deep/ .el-tabs__nav-wrap::after {
      background-color: unset;
    }

    /deep/ .el-tab-pane {
      padding: 5px 10px 15px;
    }
  }

</style>

