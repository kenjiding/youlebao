<template>
  <div
    class="item-wrap">
    <p
      class="top-p"
      @dblclick="dbclickHandle">
      <span :style="{color: textColor}">{{ name }}</span>
      <span
        @click="closeItem"><i class="el-icon-close"/></span>
      <span
        @click="dbclickHandle"><i class="ych-icon-kuozhan"/></span>
    </p>
    <ych-read-card
      ref="readCardComponent"
      v-model="memberCode"
      @change="changeCard"
      @logout="clearData"/>
  </div>
</template>

<script>
export default {
  name: '',

  props: {
    textColor: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      memberCode: '',
    };
  },
  created() {},

  methods: {
    dbclickHandle() {
      this.$emit('dblclick-item');
    },
    closeItem() {
      this.$emit('close-item');
    },
    changeCard() {},
    clearData() {},
  },
};
</script>

<style lang='scss' scoped>
/* stylelint-disable */
@import "@/styles/theme.scss";

.item-wrap {
  width: 340px;
  background-color: #EEEEEE;
  border: 1px solid $border-color;
  padding: 15px;
  margin: 0 0 10px;

  .top-p{
    overflow: hidden;
    margin-bottom: 10px;

    span {
      display: inline-block;
      float: right;
      color: $font-color-secondary;

      .ych-icon-kuozhan {
        float: right;
        color: $font-color-secondary;
        font-size: $font-size-primary;
        margin: 2px 10px 0 0;
      }

      &:nth-child(1) {
        color: $color-danger;
        float: left;
      }

    }
  }
}
</style>
