<template>
  <div class="play-log-list">
    <el-table
      :data="playLogList"
      :height="listHeight"
      highlight-current-row
      border>
      <el-table-column
        prop="MachineName"
        show-overflow-tooltip
        label="游玩项目"
        width="180"/>
      <el-table-column
        prop="MachineType"
        show-overflow-tooltip
        label="项目类型"
        width="100"/>
      <el-table-column
        prop="SaleTime"
        label="游玩时间"
        show-overflow-tooltip
        width="160"/>
      <el-table-column
        prop="Amount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="消费数量"
        width="120"/>
      <el-table-column
        prop="Summary"
        show-overflow-tooltip
        label="备注"
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
  name: 'PlayLogList',

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
      playLogList: [],
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
      if (this.playLogList.length === 0) {
        this.onLoad(1);
      }
    },

    clear() {
      this.playLogList = [];
      this.totalCount = 0;
    },

    onLoad(pageIndex) {
      if (this.leaguerId === '') {
        this.clear();
      } else {
        this.$api['leaguer/extend/getLeagerPlayLog']({
          LeaguerID: this.leaguerId,
          PageInfo: {
            PageIndex: pageIndex,
            PageSize: this.pageSize,
          },
        }).then((res) => {
          this.playLogList = res.DataList;
          this.totalCount = res.Total;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .play-log-list {
    .table-pagination {
      text-align: right;
      margin-top: 8px;
    }
  }

</style>

