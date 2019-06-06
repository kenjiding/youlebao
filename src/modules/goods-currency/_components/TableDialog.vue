<template>
  <el-dialog
    :append-to-body="true"
    :visible="tableVisible"
    title="售币详情"
    @close="$emit('update:tableVisible', false)">
    <el-table
      :data="tableData"
      :stripe="true"
      height="400px"
      border>
      <el-table-column
        property="SetMealName"
        label="套餐名称"
        header-align="center"
        width="180px"
        show-overflow-tooltip/>
      <el-table-column
        v-if="witchType"
        property="PhysicalCoin"
        align="right"
        label="币数"/>
      <el-table-column
        v-if="!witchType"
        property="GoldCoin"
        align="right"
        label="金币数"/>
      <el-table-column
        v-if="!witchType"
        property="Coin"
        align="right"
        label="代币数"/>
      <el-table-column
        property="Price"
        align="right"
        label="单价"/>
      <el-table-column
        property="DiscountPrice"
        align="right"
        label="折扣价"/>
      <el-table-column
        property="Amount"
        align="right"
        label="购买数量"/>
      <el-table-column
        property="PayMoney"
        align="right"
        label="金额"/>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    tableVisible: {
      type: Boolean,
      default: false,
    },
    witchType: {
      type: Boolean,
      default: true,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    };
  },
  created() {},

  methods: {},
};
</script>

<style lang='scss' scoped>

</style>
