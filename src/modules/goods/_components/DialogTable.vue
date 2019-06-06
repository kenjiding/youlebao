<template>
  <div>
    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;"
      class="table"
      @selection-change="handleSelectionChange"
      @cell-click="itemClick">
      <el-table-column
        v-if="selectShow"
        type="selection"
        width="55"/>
      <el-table-column
        v-if="selectShow"
        prop="OrderNum"
        show-overflow-tooltip
        label="订单号"
        width="120"/>
      <el-table-column
        prop="GoodsName"
        show-overflow-tooltip
        label="团购商品名称"
        width="120"/>
      <el-table-column
        prop="MealName"
        label="套餐名称"
        show-overflow-tooltip>
        <template slot-scope="props">
          <span
            class="goodsInfo">{{ props.row.MealName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Amount"
        label="数量"
        show-overflow-tooltip
        align="right"
        header-align="center"
        width="80"/>
      <el-table-column
        prop="Price"
        label="金额"
        show-overflow-tooltip
        align="right"
        header-align="center"
        width="80"/>
    </el-table>
    <goods-detail
      ref="goodsDetail"
      :goods-id="goodsID"
      :visible="detailVisible"
      @close="handleDetailClose"
      @add="handleDetailAddToCart"/>
  </div>
</template>

<script>
import GoodsDetail from '@/modules/sell/_components/GoodsDetail.vue';

export default {
  name: '',

  components: {
    GoodsDetail,
  },

  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    selectShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      goodsID: '',
      detailVisible: false,
    };
  },

  methods: {
    handleDetailAddToCart() {},
    handleDetailClose() {
      this.detailVisible = false;
    },
    itemClick(row) {
      this.goodsID = row.GoodsInfo.GoodsID;
      this.detailVisible = true;
      console.log(this.goodsID);
      // if (column.property === 'MealName') {
      //   this.detailVisible = row;
      //   this.detailVisible = true;
      // }
    },
    // 第二期会用到
    handleSelectionChange() {
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.goodsInfo {
  color: $color-primary;

  &:hover {
    cursor: pointer;
  }
}

.table {
  margin-top: 10px;
}
</style>
