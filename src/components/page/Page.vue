<template>
  <div class="ych-page">
    <div
      :style="{
        width: extendWidth,
        left: `${secondMenuWidth}px`
      }"
      class="ych-page__extend">
      <slot name="extend"/>
    </div>
    <div
      :style="{
        height: computedHeight + 'px'
      }"
      :class="{
        'ych-page__wrap--bg': bg,
      }"
      class="ych-page__wrap"
    >
      <!-- <ych-scroll
        :options="{
          scrollbar: true,
          fade: false,
        }"
        class="ych-page__scroll"
      > -->
      <slot name="default"/>
      <!-- </ych-scroll> -->
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex';

export default {
  name: 'YchPage',

  props: {
    bg: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({
      pageHeight: 'pageHeight',
      second: 'menu/getCurrentSecond',
    }),

    computedHeight() {
      return this.pageHeight + 10;
    },

    secondMenuWidth() {
      const secondMenuWidth = (this.second.length) * 120;
      const secondMenuMarginLeft = 10;
      return secondMenuWidth + secondMenuMarginLeft;
    },

    extendWidth() {
      const secondMenuWidth = `${this.secondMenuWidth}px`;
      const headerRightWidth = '367px';

      return `calc(100% - ${headerRightWidth} - ${secondMenuWidth})`;
    },
  },
};
</script>

<style lang="scss">
.fade-transverse-leave-active {
  .ych-page__extend {
    display: none;
  }
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';

.ych-page {
  position: relative;

  &__wrap {
    overflow-y: scroll;
    box-sizing: border-box;
    margin-right: 2px;
    margin-left: 5px;
    padding-bottom: 10px;
    border-radius: $border-radius-small;

    &--bg{
      background-color: $color-regular-light-0;
    }
  }

  &__extend {
    position: absolute;
    top: -50px;
    // right: 300px;
    height: 50px;
  }

  // &__scroll {
  //   padding: 0 20px;
  //   // margin: 20px 0;
  //   box-sizing: border-box;
  // }
}
</style>
