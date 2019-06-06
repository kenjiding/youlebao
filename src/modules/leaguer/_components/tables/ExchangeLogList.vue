<template>
  <div class="exchange-log-list">
    <el-table
      :data="exchangeLogList"
      :height="listHeight"
      width="100%"
      highlight-current-row
      border>
      <el-table-column
        prop="GoodsName"
        label="商品名称"
        min-width="200"
        show-overflow-tooltip/>
      <el-table-column
        prop="Amount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="数量"
        width="80"/>
      <el-table-column
        prop="TotalFee"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="消费金额"
        width="80"/>
      <el-table-column
        prop="LogTime"
        label="兑换时间"
        show-overflow-tooltip
        width="180"/>
      <el-table-column
        prop="ExchangeNum"
        show-overflow-tooltip
        label="兑换单号"
        min-width="200"/>
    </el-table>
    <el-pagination
      :total="totalCount"
      class="table-pagination"
      background
      layout="total,prev, pager, next"
      @current-change="onLoad"
      @prev-click="onLoad"
      @next-click="onLoad"/>
  </div>
</template>

<script>
export default {
  name: 'ExchangeLogList',

  props: {
    leaguerId: {
      type: String,
      default: '',
    },
    listHeight: {
      type: Number,
      default: 360,
    },
  },

  data() {
    return {
      exchangeLogList: [],
      // pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
    };
  },

  // created() {
  //   this.onLoad(1);
  //   console.log('onload');
  // },

  methods: {
    activeShow() {
      if (this.exchangeLogList.length === 0) {
        this.onLoad(1);
      }
    },

    clear() {
      this.exchangeLogList = [];
      this.totalCount = 0;
    },

    onLoad(pageIndex) {
      if (this.leaguerId === '') {
        this.clear();
      } else {
        this.$api['leaguer/extend/getExChangeLogListForPro']({
          LeaguerID: this.leaguerId,
          PageInfo: {
            PageIndex: pageIndex,
            PageSize: this.pageSize,
          },
        }).then((res) => {
          this.exchangeLogList = res.DataList;
          this.totalCount = res.Total;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .exchange-log-list {
    .table-pagination {
      text-align: right;
      margin-top: 8px;
    }
  }

</style>

