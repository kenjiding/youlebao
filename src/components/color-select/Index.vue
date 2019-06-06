<template>
  <el-popover
    v-clickoutside="clickOutside"
    :value="value"
    placement="bottom"
    popper-class="select-color-popover"
    trigger="manual"
  >
    <el-button
      slot="reference"
      :style="{
        'border-color':
          color.toLowerCase() === '#ffffff' ? '#dddddd' : 'rgba(255,255,255,.6)'
      }"
      class="color-select"
      @click.native="$emit('show-item', $event)"/>
    <div
      v-for="col in colorsOptions"
      :key="col"
      :label="col"
      :value="col"
      @click="$emit('choose', col)">
      <div
        :style="{'background-color':col}"
        class="color"/>
    </div>
  </el-popover>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';

export default {
  name: 'ColorSelect',
  directives: { Clickoutside },
  props: {
    color: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    colorsOptions: ['#ef7063', '#ff7faa', '#eda95d', '#88c865', '#70b8ef', '#c78fdc', '#a4a4a7', '#ffffff'],
  }),

  methods: {
    clickOutside() {
      if (!this.value) return;
      this.$emit('close');
    },
  },

};
</script>
<style lang="scss">
@import "@/styles/theme.scss";
// 编辑商品分组颜色选择样式
.select-color-popover {
  min-width: 42px!important;
  width: 42px!important;
  padding: 5px 0 0!important;
  cursor: pointer;
  > div {
    padding: 0 3px;
    margin-bottom: 5px;
    &:hover {
      background-color: $color-bg-table!important;
    }
  }
  .popper__arrow {
    display: none!important;
  }
  .color {
    height: 20px;
    border: 1px solid $border-color;
  }
}

</style>
<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  .color-select {
    height: 20px;
    width: 36px;
    padding: 0;
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: transparent;
    font-size: $font-size-mini;
    &:hover,
    &:focus,
    &:active{
      background: transparent;
      box-shadow: 0 0 5px rgba($color-black, .3);
    }
  }
</style>
