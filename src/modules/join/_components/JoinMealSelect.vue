<template>

  <div
    v-loading="refreshLoading"
    class="join-meal-select-main">
    <div class="more-icon">
      <el-dropdown @command="handleCommand">
        <i class="ych-icon-gengduo"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="refresh">刷新入会套餐</el-dropdown-item>
          <el-dropdown-item
            command="edit"
          >设置套餐展示</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tabs
      v-if="groupList.length > 0"
      v-model="currentGroup"
      @tab-click="changeTab">
      <el-tab-pane
        v-for="group in groupList"
        :style="{
          height: isDialog ? '450px' : listHeight+'px',
          'overflow-y': 'auto'
        }"
        :ref="'group-'+group.GroupID"
        :name="group.GroupID"
        :key="group.GroupID"
        @scroll.native.passive="scrollLoading">
        <el-button
          slot="label"
          :class="{
            'group--active':group.GroupID === currentGroup
          }"
          size="small">
          {{ group.GroupName }}
        </el-button>
        <div
          class="list-panel">
          <el-card
            v-for="meal in renderMealList"
            :key="meal.ID"
            :style="{
              'background-color': meal.Color,
              'border-color': meal.Color.toLowerCase() === '#ffffff' ? '' : meal.Color}"
            class="meal-card"
            shadow='hover'
            @click.native="selectMeal(meal)">
            <div class="card">
              <div>
                <p
                  :class=" {'title-default': meal.Color.toLowerCase() === '#ffffff'}"
                  class="title">
                  {{ meal.Name }}
                </p>
              </div>
              <p
                :class="{'price-default': meal.Color.toLowerCase() === '#ffffff'}"
                class="price">
                <span>¥ {{ $number(meal.Price).format('0.00').split('.')[0] }}</span>
                <span>.{{ $number(meal.Price).format('0.00').split('.')[1] }}</span>
              </p>
              <el-tag
                v-if="meal.Tag != ''"
                :class="[
                  meal.Color.toLowerCase() === '#ffffff'?'tag-default':'tag-special'
                ]"
                class="tag"
                size="small">{{ meal.Tag }}</el-tag>
            </div>
          </el-card>
          <el-card
            v-for="n in virtualItemNum"
            :key="n"
            class="meal-card meal-card--virtual"/>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div
      v-else
      class="empty-box">
      <div class="icon-box">
        <i class="ych-icon-noshangpin"/>
      </div>
      <div class="tips">暂无入会套餐，可前往后台【商品-商品资料】模块添加入会套餐</div>
    </div>

    <fill-information
      ref="fillInformation"
      :visible="visible"
      :meal-goods="currentGoods"
      @close="handleFormClose"/>
    <edit-join-meal-dialog
      :edit-join-meal-visible.sync="editJoinMealVisible"/>
  </div>
</template>

<script>
import FillInformation from '@/modules/join/_components/FillInformation.vue';
import EditJoinMealDialog from '@/modules/join/_components/EditJoinMealDialog.vue';
import { mapGetters, mapState } from 'vuex';

const GOODS_ITEM_WIDTH = 214;

export default {
  name: 'JoinMealSelect',

  components: {
    FillInformation,
    EditJoinMealDialog,
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    active: false,
    currentGroup: null,
    currentGoods: {},
    visible: false,
    refreshLoading: false,
    page: 1,
    editJoinMealVisible: false,
  }),

  computed: {
    ...mapState({
      filtMealList: state => state.join.filtMealList,
    }),
    ...mapGetters({
      pageHeight: 'pageHeight',
      pageWidth: 'pageWidth',
    }),
    currentGroupMealList() {
      return this.filtMealList[this.currentGroup] || [];
    },
    renderMealList() {
      return this.currentGroupMealList.slice(0, this.renderLength);
    },
    listHeight() {
      // 分组高度:40，padding-top:10
      return this.pageHeight - 50 || 450;
    },
    groupList() {
      const originGroupList = [...this.$store.state.join.groupList];
      return originGroupList.filter(item => this.filtMealList[item.GroupID] !== undefined);
    },
    renderLength: {
      get() {
        const rowLength = Math.ceil(this.listHeight / 130) || 0;
        // padding-left: 10;
        const colLength = parseInt((this.pageWidth - 10) / GOODS_ITEM_WIDTH, 10) || 0;
        const len = this.page * colLength * rowLength;
        return len > 100 ? 100 : len;
      },
    },

    virtualItemNum() {
      const paddingLeft = 10;
      const listWidth = this.pageWidth - paddingLeft;

      // eslint-disable-next-line radix
      const eachRowNumber = parseInt(listWidth / GOODS_ITEM_WIDTH);
      if (eachRowNumber <= 0) {
        return 0;
      }
      const rem = this.currentGroupMealList.length % eachRowNumber;
      return rem === 0 ? 0 : (eachRowNumber - rem);
    },
  },
  mounted() {
    this.$watch('groupList', {
      handler(val) {
        if (!(Array.isArray(val) && val.length > 0)) return;
        this.currentGroup = val[0].GroupID;
        this.$nextTick(() => {
          const firstInstance = this.$refs[`group-${this.currentGroup}`][0];
          firstInstance && this.changeTab(firstInstance);
        });
      },
      immediate: true,
    });
    this.onLoad();
  },
  methods: {
    scrollLoading({ target = {} }) {
      const currentList = this.filtMealList[this.currentGroup] || [];
      const currentListLength = currentList.length;
      const isMaxLength = this.renderLength >= currentListLength;

      if (this.renderLength >= 200 || isMaxLength) return;
      const { scrollHeight = 0, scrollTop = 0, clientHeight = 0 } = target;

      if (scrollHeight <= scrollTop + clientHeight + 100) {
        this.page++;
      }
    },
    changeTab() {
      this.page = 1;
    },
    onLoad() {
      this.refreshLoading = true;
      this.$store.dispatch('join/asyncGetJoinMealAsync', this).then((res) => {
        this.refreshLoading = false;
        if (!res) return;
        if (this.groupList[0]) {
          this.currentGroup = this.groupList[0].GroupID;
        }
      });
    },

    selectMeal(meal) {
      this.$api['join/joinIn/checkLgJoinNeedAuth']({
        GoodsID: meal.ID,
      }).then(() => {
        this.currentGoods = meal;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs.fillInformation.onLoad();
        });
      });
    },

    handleFormClose() {
      this.visible = false;
    },

    handleCommand(cmd) {
      const opr = {
        refresh: this.refresh,
        edit: this.editGroup,
      };
      const fn = opr[cmd];
      fn && fn();
    },

    refresh() {
      this.onLoad();
    },

    editGroup() {
      this.$api['join/joinIn/checkSetJoinInShow']({}).then(() => {
        this.editJoinMealVisible = true;
      }, () => {});
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  @import "@/styles/mixins.scss";
  .join-meal-select-main {
    padding: 10px 0 0 10px;
    border-radius: $border-radius;
    position: relative;
    // stylelint-disable-next-line
    background-color: #FCFCFC;
    overflow: hidden;
    min-height: 500px;
    height: calc(100%);
    box-sizing: border-box;
    .empty-box {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .icon-box {
        border-radius: $border-radius-circle;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;
        background-color: $color-bg-table;
        margin-bottom: 20px;
      }
      .tips {
        color: $font-color-primary;
        font-size: $font-size-primary;
      }
      i {
        // stylelint-disable-next-line
        font-size: 50px;
        color: $font-color-placeholder;
      }
    }
    .more-icon {
      position: absolute;
      right: 5px;
      top: 12px;
      cursor: pointer;
      i {
        color: $font-color-secondary;
      }
      &:hover {
        i {
          color: $color-primary;
        }
      }
    }
    /deep/ .el-tabs__active-bar {
      opacity: 0;
    }

    /deep/ .el-tabs__nav-wrap::after {
      height: 0;
    }

    /deep/ .el-tabs__item {
      padding: 0 8px 0 0;
      height: 30px;
      line-height: 30px;

      .el-button {
        width: 80px;
        height: 30px;
        color: $font-color-primary;
        padding: 0 5px;
        line-height: 30px;
        // stylelint-disable-next-line
        font-size: 13px;
        // stylelint-disable-next-line
        border-radius: 20px;
        @include ellipsis(1)
      }

      .el-button.is-plain:hover {
        color: $color-primary;
        border-color: $color-primary;
      }
    }

    /deep/ .el-tabs__header {
      margin-bottom: 10px;
      margin-right: 30px;
      $two-px: 2px;
      .el-tabs__nav-wrap.is-scrollable {
        padding: 0 30px;
      }
      .el-tabs__nav-prev, .el-tabs__nav-next {
        line-height: 30px;
        height: 30px;
        width: 30px;
        z-index: 3;
        text-align: right;
        i {
          font-size: $font-size-primary + $two-px;
          font-weight: 800;
        }
        &:hover {
          color: $color-primary;
        }
      }
      .el-tabs__nav-prev {
        text-align: left;
      }
      .el-tabs__nav-prev.is-disabled {
        box-shadow: 2px -2px 8px -2px rgba($color-black, .3);
      }
      .el-tabs__nav-next.is-disabled {
        box-shadow: -2px 0 8px -2px rgba($color-black, .3);
      }
    }
  }

  .group--active {
    color: $color-white !important;
    border-color: $color-primary !important;
    background-color: $color-primary;
  }

  .list-panel {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    /deep/ .el-card.is-hover-shadow:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
    }
    /deep/ .el-card {
      min-width: 204px;
      height: 120px;
      margin: 0 10px 10px 0;
      border-radius: $border-radius;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-app-region: no-drag;
      position: relative;
    }
    .meal-card {
      overflow: inherit;
      flex: 1;

      &--virtual {
        visibility: hidden;
      }

      &::before {
        position: absolute;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        top: -1px;
        left: -1px;
        content: '';
        box-sizing: border-box;
        border-radius: $border-radius;
        background-color: rgba($color-black, 0);
      }
      &:active {
        &::before {
          background-color: rgba($color-black, .1);
        }
      }
      &:hover {
        i {
          display: block;
        }
        .tag {
          display: block;
        }
      }
    }
    /deep/ .el-card__body {
      position: relative;
    }
  }

  .card {
    height: 80px;
    color: $color-white;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    $two-px: 2px;
    $four-px: 4px;

    .title {
      font-size: $font-size-regular + $four-px;
      @include ellipsis(2);
      &-default {
        color: $font-color-regular;
        @include ellipsis(2)
      }
    }

    .price {
      width: 90px;
      position: absolute;
      bottom: 10px;
      left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      span {
        font-size: $font-size-primary;
      }

      span:first-child {
        font-size: $font-size-regular - $two-px;
      }

      &-default {
        color: $font-color-currency;
      }
    }

    .tag {
      height: 20px;
      position: absolute;
      bottom: 10px;
      right: 4px;
      color: $color-white;
      border: 0;
      padding: 0 5px;
      display: none;

      &-special {
        background-color: transparentize($color-white, .6);
      }

      &-default {
        background-color: transparentize($color-black, .7);
      }
    }

    .icon {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: $font-size-primary + $two-px;
      display: none;

      &-special {
        color: $color-white;
        opacity: .8;
      }

      &-default {
        color: $color-black;
        opacity: .2;
      }
    }
  }
</style>
