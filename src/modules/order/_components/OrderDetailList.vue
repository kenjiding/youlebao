<template>
  <div class="detail-sub-list">
    <el-tabs
      v-model="currentTab">
      <el-tab-pane
        label="商品详情"
        name="goods">
        <el-table
          :height="tableHeigth"
          :data="goodsList"
          highlight-current-row
          border
          tooltip-effect="dark"
          style="width: 100%"
          class="child-list">
          <el-table-column
            prop="GoodsName"
            show-overflow-tooltip
            label="商品名称"
            width="160"/>
          <el-table-column
            prop="GoodsTypeName"
            show-overflow-tooltip
            width="80"
            label="商品类型"/>
          <el-table-column
            prop="UnitPrice"
            show-overflow-tooltip
            label="单价"
            align="right"
            header-align="center"
            width="80"/>
          <el-table-column
            prop="Amount"
            show-overflow-tooltip
            label="数量"
            align="right"
            header-align="center"
            width="80"/>
          <el-table-column
            prop="AlreadyReturnAmount"
            show-overflow-tooltip
            label="已退数量"
            align="right"
            header-align="center"
            width="80"/>
          <el-table-column
            prop="YhqNumber"
            show-overflow-tooltip
            label="优惠券"/>
          <el-table-column
            prop="Summary"
            show-overflow-tooltip
            label="备注"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        label="支付方式"
        name="pay">
        <el-table
          :data="payTypeList"
          :height="tableHeigth"
          tooltip-effect="dark"
          border
          highlight-current-row
          style="width: 100%"
          class="child-list">
          <el-table-column
            prop="PayNum"
            show-overflow-tooltip
            label="支付号"/>
          <el-table-column
            prop="PayTypeName"
            show-overflow-tooltip
            width="120"
            label="支付方式名称"/>
          <el-table-column
            prop="Money"
            show-overflow-tooltip
            width="80"
            align="right"
            header-align="center"
            label="金额"/>
          <!-- <el-table-column
            :formatter="formatter"
            prop="PayState"
            show-overflow-tooltip
            label="支付状态"/> -->
          <el-table-column
            prop="Summary"
            show-overflow-tooltip
            label="备注"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: '',
  props: {
    goodsList: {
      type: Array,
      default: () => [],
    },
    payTypeList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      currentTab: 'goods',
    };
  },

  computed: mapState({
    tableHeigth(state) {
      return state.client.pageHeight - 520;
    },
  }),

  methods: {
    formatter(row) {
      const status = {
        Payed: '已支付',
        Paying: '支付中',
      };
      return status[row.PayState];
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.detail-sub-list {

  /deep/ .el-tabs__header {
    height: 40px;
    margin: 0 20px 5px;
    // border-bottom: 2px $border-color solid;
  }

  /deep/ .el-tabs__content {
    padding: 0 20px;
  }

}
</style>
