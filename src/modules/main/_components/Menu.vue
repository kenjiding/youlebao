<template>
  <div class="menu-wraper">
    <!-- <ych-scroll> -->
    <div
      v-for="item in top"
      :key="item.name"
      :class="{
        'menu-item--active': current === item.name
      }"
      class="menu-item"
      @click="setCurrentTop(item.name)">
      <i :class="item.icon"/>
      <span>{{ item.label }}</span>
    </div>
    <div
      :class="{
        'menu-item--active': current === 'more'
      }"
      class="main-setting"
      @click="setCurrentTop('more')">
      <i class="ych-icon-logo"/>
      <span>更多</span>
    </div>
  <!-- </ych-scroll> -->
  </div>

</template>

<script type="text/javascript">
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Menu',
  data() {
    return {
      // menuData: this.$menus.topMenus,
    };
  },

  computed: {
    ...mapState({
      // top: state => state.menu.top,
      current: state => state.menu.currentTop,
    }),

    ...mapGetters({
      top: 'menu/getTop',
      second: 'menu/getCurrentSecond',
    }),
  },

  mounted() {
    // this.setCurrentTop(this.top && this.top[0].name);
  },

  methods: {
    setCurrentTop(name = '') {
      if (!name) return;
      this.$store.commit('menu/setCurrentTop', name);
      this.$nextTick(() => {
        if (this.second && this.second[0]) {
          this.$router.push(this.second[0].path);
        } else if (name === 'more') {
          this.$router.push('/more');
        }
      });
    },
    // queryMore() {
    //   console.log(222);
    //   this.$store.commit('menu/setCurrentTop', 'more');
    //   this.$router.push('/more');
    // },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';

// .menu-wraper {
//   height: 400px;
//   overflow: hidden;
// }
.main-setting {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  font-size: $font-size-primary;
  color: rgba($color-white, .6);
  cursor: pointer;
  transition: .2;
  position: relative;
  -webkit-app-region: no-drag;

  i {
    // stylelint-disable-next-line
    font-size: 24px;
    color: rgba($color-white, .6);
    margin-bottom: 5px;
  }

  &:hover,
  &.menu-item--active {
    background-color: $color-primary;
    color: $color-white;
    i {
      color: $color-white;
    }
  }
}
.menu-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  font-size: $font-size-primary;
  color: rgba($color-white, .6);
  cursor: pointer;
  transition: .2;
  position: relative;
  -webkit-app-region: no-drag;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10px;
    width: 60px;
    height: 1px;
    background-color: rgba($color-white, .2);
  }

  &:last-child::after {
    height: 0;
  }

  i {
    // stylelint-disable-next-line
    font-size: 24px;
    color: rgba($color-white, .6);
    margin-bottom: 5px;
  }

  &:hover,
  &.menu-item--active {
    background-color: $color-primary;
    color: $color-white;

    &::after {
      height: 0;
    }

    i {
      color: $color-white;
    }
  }
}
</style>
