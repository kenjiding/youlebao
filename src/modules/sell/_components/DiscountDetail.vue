<template>
  <el-dialog
    :visible.sync="localVisible"
    :append-to-body="true"
    :width="listWidth +'px'"
    title="商品折扣信息"
    class="discount-detail-dialog"
  >
    <el-table
      :data="list"
      border
      highlight-current-row
    >
      <el-table-column
        property="GoodsName"
        show-overflow-tooltip
        label="商品名称"
        width="180"/>
      <el-table-column
        property="SchemeName"
        show-overflow-tooltip
        label="促销方案"
        width="120"/>
      <el-table-column
        property="Amount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="数量"
        width="80"/>
      <el-table-column
        property="OriginalPrice"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="单价"
        width="100"/>
      <el-table-column
        property="DiscountPrice"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="折后单价"
        width="100"/>
      <el-table-column
        property="TotalAmount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="总价"
        width="120"/>
      <el-table-column
        property="DiscountAmount"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="折扣金额"
        width="120"/>
      <el-table-column
        property="AccountsPayable"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="折后总价"
        width="120"/>
      <el-table-column
        :formatter="remainFormatter"
        property="UseTimes"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="剩余购买数量"/>
    </el-table>
  </el-dialog>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex';

export default {
  name: 'DiscountDetail',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    list: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters({
      pageWidth: 'pageWidth',
    }),

    listWidth() {
      return (this.pageWidth - 100) > 1200 ? 1200 : (this.pageWidth - 100);
    },

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
    remainFormatter(row) {
      if (row.UseTimes === '无限制') {
        return '无限制';
      }
      const remain = Number(row.UseTimes | 0) - row.FrequencyLogUseTimes;
      return remain >= 0 ? remain : 0;
    },

  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .discount-detail-dialog {
    /deep/ .el-dialog__body {
      padding: 20px;
    }
  }
</style>
