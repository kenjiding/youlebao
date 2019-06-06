<template>
  <div class="order-list">
    <el-table
      :data="orderList"
      :height="listHeight"
      highlight-current-row
      border>
      <el-table-column
        prop="GoodName"
        show-overflow-tooltip
        min-width="200"
        label="商品名称"/>
      <el-table-column
        prop="Amount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="数量"
        width="80"/>
      <el-table-column
        prop="SellMoney"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="消费金额"
        width="100"/>
      <el-table-column
        prop="LogTime"
        label="消费时间"
        show-overflow-tooltip
        width="160"/>
      <el-table-column
        prop="ChannelName"
        label="渠道"
        min-width="80"/>
      <el-table-column
        prop="PayStateName"
        label="状态"
        width="80"/>
      <el-table-column
        prop="OrderNo"
        show-overflow-tooltip
        label="订单号"
        width="200"/>
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
  name: 'OrderList',

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
      orderList: [],
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
      if (this.orderList.length === 0) {
        this.onLoad(1);
      }
    },

    clear() {
      this.orderList = [];
      this.totalCount = 0;
    },

    onLoad(pageIndex) {
      if (this.leaguerId === '') {
        this.clear();
      } else {
        this.$api['leaguer/leaguer/getLeaguerOrderItemList']({
          LeaguerID: this.leaguerId,
          PageInfo: {
            PageIndex: pageIndex,
            PageSize: this.pageSize,
          },
        }).then((res) => {
          this.orderList = res.DataList;
          this.totalCount = res.Total;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .order-list {
    .table-pagination {
      text-align: right;
      margin-top: 8px;
    }
  }

</style>

