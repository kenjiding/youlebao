<template>
  <ych-page
    bg
    class="body-wrap">
    <el-card
      class="box-card">
      <other-expenses-content/>
    </el-card>
  </ych-page>
</template>

<script>
import OtherExpensesContent from '../_components/OtherExpensesContent.vue';

export default {
  name: 'OtherExpenses',
  components: {
    OtherExpensesContent,
  },
  data() {
    return {};
  },

  computed: {},
  created() {},

  methods: {},
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
.body-wrap {
  /deep/ .ych-page__wrap {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }
}
.box-card {
  width: 500px;
  height: 440px;
  background-color: $color-bg-primary;
  margin: 0 auto;
  box-sizing: border-box;

  /deep/ .el-card__body {
    padding: 0;
  }
}
</style>
