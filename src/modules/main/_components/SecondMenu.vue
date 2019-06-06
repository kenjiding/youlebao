<template>
  <div class="second-menu">
    <el-tabs
      v-model="value"
      :stretch=true
      @tab-click="handleClick">
      <el-tab-pane
        v-for="item in second"
        :key="item.path"
        :label="item.label"
        :name="item.path"/>
    </el-tabs>
    <!-- <el-radio-group v-model="value">
      <el-radio-button
        v-for="item in second"
        :key="item.path"
        :label="item.path"
        @click.native="$router.push(item.path)">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group> -->
  </div>
</template>

<script type="text/javascript">
import { mapState, mapGetters } from 'vuex';
import { flatten as _flatten } from 'lodash';

export default {
  name: 'SecondMenu',
  data() {
    return {
      value: '',
    };
  },

  computed: {
    ...mapState({
      currentPath: state => state.route.path,
      allSecond: state => state.menu.second,
    }),

    ...mapGetters({
      second: 'menu/getCurrentSecond',
    }),

    // sortedTheMenu() {
    //   return _orderBy(this.second, ['order'], ['asc']);
    // },
  },

  watch: {
    currentPath: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return;
        const menuItem = _flatten(Object.values(this.allSecond)).find(item => item.path === newVal);
        if (menuItem) {
          this.$store.commit('menu/setCurrentTop', menuItem.parent);
          this.value = menuItem.path;
        } else if (this.currentPath === '/more') {
          this.$store.commit('menu/setCurrentTop', 'more');
        } else {
          this.$store.commit('menu/setCurrentTop', null);
        }
      },
    },
  },
  methods: {
    handleClick(tab) {
      this.$router.push(tab.name);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';

.second-menu {
  -webkit-app-region: drag;
  /deep/ .el-tabs__item {
    width: 120px;
    line-height: 50px;
    text-align: center;
    box-sizing: border-box;
    -webkit-app-region: no-drag;
    color: rgba($color-white, .5);
    &.is-active {
      color: $color-white;
    }
  }
  /deep/ .el-tabs__nav-wrap{
    &::after  {
      width: 0;
    }
  }
  /deep/ .el-tabs__active-bar {
    background-color: $color-white;
    height: 3px;
  }
}

</style>
