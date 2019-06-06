<template>
  <el-dialog
    :visible.sync="localVisible"
    :append-to-body="true"
    :title="valueType === 402 ? '代币详情':'金币详情'"
    width="900px"
    class="account-detail-dialog"
    @open="onLoad(1)"
  >
    <el-tabs
      v-model="valueStatus"
      @tab-click="onLoad(1)">
      <el-tab-pane
        label="可用批次"
        name="Effective"/>
      <el-tab-pane
        label="已过期"
        name="Lapsed"/>
      <el-tab-pane
        label="已使用"
        name="Use"/>
      <el-tab-pane
        label="全部"
        name="All"/>
    </el-tabs>
    <el-table
      :data="list"
      border
      highlight-current-row
      height="400px"
    >
      <el-table-column
        property="OccurrenceTime"
        show-overflow-tooltip
        label="发生时间"
        width="160"/>
      <el-table-column
        property="ValidStartDate"
        label="生效日期"
        width="120"/>
      <el-table-column
        property="ValidEndDate"
        label="过期日期"
        width="120"/>
      <el-table-column
        property="ValueStatus"
        label="状态"
        width="80"/>
      <el-table-column
        property="TotalAmount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="总数量"
        width="100"/>
      <el-table-column
        property="RemainAmount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="剩余数量"
        width="100"/>
      <el-table-column
        property="OverdueAmount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="过期数量"
        width="100"/>
      <el-table-column
        property="IsRepair"
        label="是否已补币"
        width="100"/>
      <el-table-column
        property="MallName"
        show-overflow-tooltip
        label="商城"
        width="100"/>
      <el-table-column
        property="Summary"
        show-overflow-tooltip
        label="备注"
        width="160"/>
    </el-table>
    <el-pagination
      :total="totalCount"
      class="table-pagination"
      background
      layout="total,prev, pager, next"
      @current-change="onLoad"
      @prev-click="onLoad"
      @next-click="onLoad"/>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: 'AccountDetail',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    leaguerId: {
      type: String,
      default: '',
    },

    valueType: {
      type: Number,
      default: 402,
    },
  },

  data() {
    return {
      list: [],
      pageSize: 10,
      totalCount: 0,
      valueStatus: 'Effective',
    };
  },

  computed: {
    localVisible: {
      get() {
        return this.visible;
      },

      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },

  methods: {
    // statusFormatter(row) {
    //   const statusChs = {
    //     Effective: '生效中',
    //     Lapsed: '已过期',
    //     Use: '已使用',
    //   };
    //   return statusChs[row.ValueStatus];
    // },
    // isRepairFormatter(row) {
    //   return row ? 1 : 0;
    // },

    onLoad(pageIndex) {
      if (this.leaguerId) {
        this.$api['leaguer/leaguer/getLeaguerValueBatchChanged']({
          LeaguerID: this.leaguerId,
          ChangeType: this.valueType,
          PageInfo: {
            PageIndex: pageIndex,
            PageSize: this.pageSize,
          },
          ValueStatus: this.valueStatus,
        }).then((res) => {
          this.list = res.DataList;
          this.totalCount = res.Total;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .table-pagination {
    text-align: right;
    margin-top: 8px;
  }

  .account-detail-dialog {
    /deep/ .el-dialog__body {
      padding: 20px;
    }
  }
</style>
