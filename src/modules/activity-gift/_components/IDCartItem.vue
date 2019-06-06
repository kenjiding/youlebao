<template>
  <el-card
    class="box-card cart-item">
    <div
      slot="header">
      顾客信息
    </div>
    <div
      class="text item">
      {{ '会员号： ' + (cardData.LeaguerCode || '-') }}
    </div>
    <div
      class="text item">
      {{ '会员级别： ' + (cardData.LeaguerLevelName || '-') }}
    </div>
    <div
      class="text item">
      {{ '会员名称： ' + (cardData.RealName || '-') }}
    </div>
    <div
      v-for="(item, index) in cardData.LgValues || []"
      :key="index"
      class="text item">
      {{ item.ValueName + '：' + item.AllAmount }}
    </div>
    <div class="tips">备注：输入身份证号筛选散客赠币方案</div>
  </el-card>
</template>

<script>
export default {
  name: '',

  props: {
    cardData: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      customerInfoList: {},
    };
  },
  created() {},

  methods: {},
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.cart-item {
  min-width: 290px;
  max-width: 310px;
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  height: 100%;
  flex: 1;
  &:nth-child(1) {
    margin-left: 0;
  }

  /deep/ .el-card__header {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    background-color: $color-bg-table;
  }

  /deep/ .el-card__body {
    padding: 20px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    .item {
      height: 30px;
      line-height: 30px;
      font-size: $font-size-primary;
    }
  }
}
.tips {
  color: $font-color-placeholder;
  font-size: $font-size-primary;
  margin-top: 50px;
}
</style>
