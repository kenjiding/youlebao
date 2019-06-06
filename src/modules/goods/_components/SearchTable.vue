<template>
  <el-table
    :data="ChannelOrderList"
    height="550"
    border
    class="table-wrap">
    <el-table-column
      prop="OrderNum"
      show-overflow-tooltip
      label="订单号"
      header-align="center"
      align="center"
      min-width="200"/>
    <el-table-column
      prop="ThirdOrderNum"
      show-overflow-tooltip
      header-align="center"
      align="center"
      label="第三方订单号"
      min-width="200"/>
    <el-table-column
      prop="Code"
      show-overflow-tooltip
      header-align="center"
      align="center"
      label="验证码"
      width="150"/>
    <el-table-column
      prop="ChannelName"
      show-overflow-tooltip
      label="渠道"
      header-align="center"
      align="center"
      width="100"/>
    <el-table-column
      prop="GoodsName"
      show-overflow-tooltip
      header-align="center"
      align="center"
      label="渠道商品名称"
      min-width="160"/>
    <el-table-column
      prop="GoodsClassName"
      show-overflow-tooltip
      label="商品类型"
      header-align="center"
      align="center"
      width="80"/>
    <el-table-column
      prop="Amount"
      label="数量"
      show-overflow-tooltip
      align="right"
      width="80"/>
    <el-table-column
      prop="Price"
      label="金额"
      show-overflow-tooltip
      align="right"
      width="80"/>
    <el-table-column
      prop="BuyerInfo"
      show-overflow-tooltip
      header-align="center"
      align="center"
      label="购买人信息"
      min-width="160"/>
    <el-table-column
      prop="UsedTime"
      label="核销时间"
      header-align="center"
      align="center"
      width="160"/>
    <el-table-column
      prop="Operator"
      show-overflow-tooltip
      label="操作员工"
      header-align="center"
      align="center"
      width="100"/>
    <el-table-column
      prop="InGateTime"
      show-overflow-tooltip
      header-align="center"
      align="center"
      label="过闸时间"
      width="160"/>
  </el-table>
</template>

<script>
export default {
  name: '',

  props: {
    searchData: {
      type: Object,
      default: () => ({
        ChannelID: '',
        GoodsClassID: '',
        Date: '',
        Keyword: '',
      }),
    },
  },

  data() {
    return {
      ChannelOrderList: [],
    };
  },

  watch: {
    searchData() {
      console.log(123);
      this.searchData();
    },
  },
  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$api['goods/groupBuy/getChannelOrder'](this.searchData).then((res) => {
        this.ChannelOrderList = res.DataList;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.table-wrap {
  width: 100%;
  margin-top: 10px;
}
</style>
