<template>
  <div
    v-clickoutside="clickOutside"
    :class="{
      'wrap-active': isShow,
    }"
    class="wrap">
    <div
      :style="{
        height: isShow ? Math.abs(topPosition) + 'px' : 0,
      }"
      class="more-wrap">
      <div class="tips">将常用功能拖入快捷栏</div>
      <draggable
        v-model="moreKeyList"
        :options="{
          group: isShow && isCanRrag ? 'name' : ''
        }"
        :class="{'show-more': isShow}"
        element="ul"
        class="more-key"
        @start="moreStart">
        <li
          v-for="item in moreKeyList"
          :key="item.id"
          class="item">{{ item.label }}</li>
      </draggable>
    </div>
    <div class="cut-wrap">
      <draggable
        v-model="shortCutList"
        :options="{
          group: isShow && isCanRrag ? 'name' : '',
          handle: '.handle',
        }"
        :style="{
          width: this.isShow ? 'calc(100% - 50px)' : this.shortCutWrapWidth
        }"
        :class="{'is-drag': isShow}"
        element="ul"
        class="added"
        @choose="isCanRrag = true">
        <li
          v-for="(item, index) in shortCutList"
          :key="item.id"
          :class="{
            handle: isShow,
          }"
          :style="{'padding-top': isShow ? 0 : '5px'}"
          class="item"
          @click="shortCutClick(item)">
          <span class="cut-name">{{ item.label }}</span>
          <span
            v-if="!isShow"
            class="cut-key">(F{{ index + 1 }})</span>
        </li>
        <div
          v-show="isShow"
          :style="{
            left: shortCutWrapWidth
          }"
          class="virtual-wrap">
          <li
            v-for="n in virtualItemNum"
            :key="n"
            class="virtual-item"/>
        </div>
      </draggable>
      <div
        :class="{
          'change-cut--active': isShow
        }"
        class="change-cut"
        @click="showMoreShortcut">
        <i
          :class="{
            'ych-icon-setup--active': isShow,
          }"
          class="ych-icon-setup"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import Clickoutside from 'element-ui/src/utils/clickoutside';
import shortcutKeyConfig from '@/config/datas/shortcut';

const SHORTCUT_ITEM_HEIGHT = 107;
const MAX = 8;
const DEFAULT_SHORTCUT = ['leaguer-join', 'order-back', 'game-deduction'];

export default {
  name: 'Layout',
  components: {
    draggable,
  },

  directives: { Clickoutside },

  data() {
    return {
      isShow: false,
      isCanRrag: true,
      shortCutList: [],
      keyconfig: shortcutKeyConfig,
      moreKeyList: [],
      isMark: false,
    };
  },
  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
      shortCutMark: state => state.sell.shortcutOpen,
    }),
    topPosition() {
      if (this.isShow) {
        return -((Math.ceil(this.rowsNum) * 50) + 31);
      }
      return 81;
    },
    rowsNum() {
      const maxLength = Math.floor((this.pageWidth - 15) / SHORTCUT_ITEM_HEIGHT);
      return this.moreKeyList.length / maxLength;
    },

    virtualItemNum() {
      return MAX - this.shortCutList.length;
    },

    shortCutWrapWidth() {
      return `${(this.shortCutList.length || 8) * SHORTCUT_ITEM_HEIGHT}px`;
    },
  },
  watch: {
    isShow(newVal) {
      if (!newVal) {
        const storeArr = this.shortCutList.map(item => item.name);
        this.$electronStore.set('shortCutList', storeArr);
      }
    },
  },
  mounted() {
    this.init();
    window.addEventListener('keydown', this.addListener);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.addListener);
  },

  methods: {
    init() {
      let shortCutInStore = this.$electronStore.get('shortCutList');
      if (
        !shortCutInStore
        || (Array.isArray(shortCutInStore) && shortCutInStore.length <= 0)
      ) {
        shortCutInStore = DEFAULT_SHORTCUT;
      }

      this.keyconfig.forEach((item) => {
        if (shortCutInStore.includes(item.name)) {
          this.shortCutList.push(item);
        } else {
          this.moreKeyList.push(item);
        }
      });
    },

    clickOutside() {
      this.isShow && (this.isShow = false);
    },

    addListener({ keyCode }) {
      if ((keyCode < 112 || keyCode > 119) || this.$route.name !== 'sell' || this.shortCutMark) return;
      const shortCutItem = this.shortCutList[keyCode - 112];
      shortCutItem && this.execShortCutMethod(shortCutItem);
    },

    execShortCutMethod(item) {
      const _this = this;

      this.$store.commit('sell/changeShortCutMark', true);

      const funName = `$create${item.method}`;
      this[funName] ? this[funName]({
        onClose() {
          _this.$store.commit('sell/changeShortCutMark', false);
        },
      }) : this.$message.warning(`快捷方式“${item.label}”，暂未开放`);
    },
    moreStart() {
      if (this.shortCutList.length === MAX) {
        this.isCanRrag = false;
        this.$message({
          message: `最多添加${MAX}个快捷方式`,
          type: 'warning',
        });
      }
    },
    shortCutClick(item) {
      if (!this.isShow) {
        this.execShortCutMethod(item);
      }
    },
    showMoreShortcut() {
      this.isShow = !this.isShow;
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/styles/theme.scss";
.added {
  display: flex;
  flex-wrap: nowrap;
  height: 60px;
  align-items: center;
  transition: width .3s linear;
}
.wrap {
  position: absolute;
  bottom: 0;
  padding-left: 10px;
  padding-right: 10px;
  background: $color-regular;
  box-sizing: border-box;
  width: calc(100% - 15px);


  &-active {
    box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, .2);

    .more-wrap {
      border-bottom: 1px solid $border-color;
    }
  }
}
.tips {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  color: $color-white;
  font-size: $font-size-primary;
}

.virtual-wrap {
  display: flex;
  height: 100%;
  position: absolute;
  top: 0;
  align-items: center;
}

.cut-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  position: relative;
  background-color: $color-regular;
  z-index: 2;

  li {
    height: 40px;
    width: 100px;
    padding: 0;
    margin-right: 7px;
    box-sizing: border-box;
    border-radius: $border-radius-small;

    &.virtual-item {
      border: 1px dashed rgba($color-white, .8);
    }
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba($color-white, .8);
    cursor: pointer;
    padding-top: 5px;
    justify-content: center;
    &:hover {
      background-color: $color-white;
    }
    .cut-name {
      font-size: $font-size-primary;
      color: $font-color-regular;
    }
    .cut-key {
      font-size: $font-size-mini;
      color: rgba($font-color-primary, .6);
      line-height: 1;
      margin-top: 5px;
    }
  }
}
// .wrap.show-select {
//   width: calc(100% - 50px);
// }
.change-cut {
  height: 40px;
  width: 50px;
  text-align: center;
  line-height: 40px;
  background-color: rgba($color-white, .8);
  border-radius: $border-radius-small;
  cursor: pointer;

  &--active,
  &:hover {
    background-color: $color-white;
  }
  i {
    font-size: $font-size-regular;
  }
}
.more-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  background: $color-regular;
  box-sizing: border-box;
  transition: all .3s linear;
}
.more-key {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 50px;
  .item {
    height: 40px;
    width: 100px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    background-color: rgba($color-white, .8);
    margin-right: 7px;
    border-radius: $border-radius-small;
    font-size: $font-size-primary;
    color: $font-color-regular;
    cursor: pointer;
    &:hover {
      background-color: $color-white;
    }
  }
}
</style>

