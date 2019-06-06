<template>
  <div class="ticket-list">
    <el-table
      :data="ticketList"
      :height="listHeight"
      highlight-current-row
      border
      @row-click="handleRowClick">
      <el-table-column
        prop="PackageTicket"
        show-overflow-tooltip
        label="套票名称"
        min-width="160"/>
      <el-table-column
        prop="SerialNumber"
        show-overflow-tooltip
        label="打印序号"
        min-width="140"/>
      <el-table-column
        prop="Status"
        label="状态"
        width="80"/>
      <el-table-column
        prop="ChargeMode"
        show-overflow-tooltip
        label="票种"
        width="80"/>
      <el-table-column
        prop="BuyTime"
        label="购买时间"
        show-overflow-tooltip
        width="160"/>
      <el-table-column
        prop="OverdueTime"
        show-overflow-tooltip
        label="过期时间"
        width="160"/>
      <el-table-column
        prop="SaleMoney"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="售价"
        width="80"/>
    </el-table>
    <el-pagination
      :total="totalCount"
      class="table-pagination"
      background
      layout="total, prev, pager, next"
      @current-change="onLoad"
      @prev-click="onLoad"
      @next-click="onLoad"/>
  </div>
</template>

<script>
export default {
  name: 'TicketList',

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
      ticketList: [],
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
      if (this.ticketList.length === 0) {
        this.onLoad(1);
      }
    },

    clear() {
      this.ticketList = [];
      this.totalCount = 0;
    },

    onLoad(pageIndex) {
      if (this.leaguerId === '') {
        this.clear();
      } else {
        this.$api['leaguer/leaguer/getLeaguerPackageTickets']({
          LeaguerID: this.leaguerId,
          PageInfo: {
            PageIndex: pageIndex,
            PageSize: this.pageSize,
          },
        }).then((res) => {
          this.ticketList = res.DataList;
          this.totalCount = res.Total;
        });
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

  .ticket-list {
    position: relative;

    .table-pagination {
      text-align: right;
      margin-top: 8px;
    }
  }

</style>

