<template>
  <ych-page>
    <div
      class="sell-main">
      <el-container>
        <el-container>
          <el-main
            v-loading="refreshLoading"
            ref="goodsShowWrap"
            class="sell-main-left">
            <div class="more-icon">
              <el-dropdown @command="handleCommand">
                <i class="ych-icon-gengduo"/>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="refresh">刷新商品</el-dropdown-item>
                  <el-dropdown-item
                    command="edit"
                  >设置商品展示</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-tabs
              v-if="groupList.length > 0 "
              v-model="currentGroup"
              @tab-click="changeTab"
            >
              <el-tab-pane
                v-for="group in groupList"
                :ref="'group-'+group.GroupID"
                :name="group.GroupID"
                :style="{
                  height: listHeight+'px',
                  'overflow-y': 'auto'
                }"
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
                    v-for="goods in renderGoodsList"
                    :key="goods.ID"
                    :style="{
                      'background-color': goods.Color,
                      'border-color': goods.Color.toLowerCase() === '#ffffff' ? '' : goods.Color}"
                    class="goods-card"
                    shadow='hover'
                    @click.native="putInShoppingCart(goods)">
                    <div class="card">
                      <div>
                        <p
                          :class=" {'title-default': goods.Color.toLowerCase() === '#ffffff'}"
                          class="title">
                          {{ goods.Name }}
                        </p>
                        <i
                          :class="[
                            goods.Color.toLowerCase() === '#ffffff'?'icon-default':'icon-special'
                          ]"
                          class="ych-icon-info icon"
                          @click.stop="showGoodsDetail(goods)"/>
                      </div>
                      <p
                        :class="{'price-default': goods.Color.toLowerCase() === '#ffffff'}"
                        class="price">
                        <span>¥ {{ $number(goods.Price).format('0.00').split('.')[0] }}</span>
                        <span>.{{ $number(goods.Price).format('0.00').split('.')[1] }}</span>
                      </p>
                      <el-tag
                        v-if="goods.Tag != ''"
                        :class="[
                          goods.Color.toLowerCase() === '#ffffff'?'tag-default':'tag-special'
                        ]"
                        class="tag"
                        size="small">{{ goods.Tag }}</el-tag>
                    </div>
                  </el-card>

                  <el-card
                    v-for="n in virtualItemNum"
                    :key="n"
                    class="goods-card goods-card--virtual"/>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div
              v-else
              class="empty-box">
              <div class="icon-box">
                <i class="ych-icon-noshangpin"/>
              </div>
              <div class="tips">暂无商品，可前往后台【商品-商品资料】模块添加商品</div>
            </div>
          </el-main>
          <el-aside
            :width="cartWidth + 'px'"
            class="sell-aside">
            <shopping-cart ref="shoppingCart"/>
          </el-aside>
        </el-container>
        <shortcut-layout/>
      </el-container>

      <goods-detail
        :goods-id="detailGoodsInfo.ID"
        :visible="detailVisible"
        :can-add="true"
        @close="handleDetailClose"
        @add="handleDetailAddToCart"/>
      <edit-goods-group-dialog
        :edit-goods-visible.sync="editGoodsVisible"/>
    </div>
  </ych-page>
</template>

<script>
import GoodsDetail from '@/modules/sell/_components/GoodsDetail.vue';
import ShoppingCart from '@/modules/sell/_components/ShoppingCart.vue';
import ShortcutLayout from '@/modules/sell/_components/ShortcutLayout.vue';
import EditGoodsGroupDialog from '@/modules/sell/_components/EditGoodsGroupDialog.vue';
import { mapGetters, mapState } from 'vuex';

// 商品项卡片宽度
const GOODS_ITEM_WIDTH = 214;
const CART_WIDTH = 340;

export default {
  name: 'Sell',

  components: {
    ShoppingCart,
    GoodsDetail,
    ShortcutLayout,
    EditGoodsGroupDialog,
  },

  data: () => ({
    active: false,
    currentGroup: null,
    detailGoodsInfo: {
      Name: '',
    },
    detailVisible: false,
    page: 1,
    refreshLoading: false,
    manualGateOutVisible: false,
    cartWidth: CART_WIDTH,
    editGoodsVisible: false,
  }),

  computed: {
    ...mapState({
      filtGoodsList: state => state.sell.filtGoodsList,
    }),
    ...mapGetters({
      pageHeight: 'pageHeight',
      pageWidth: 'pageWidth',
    }),

    listHeight() {
      return this.pageHeight - 100;
    },
    currentGroupGoodsList() {
      return this.filtGoodsList[this.currentGroup] || [];
    },
    renderGoodsList() {
      return this.currentGroupGoodsList.slice(0, this.renderLength);
    },
    groupList() {
      const originGroupList = [...this.$store.state.sell.groupList];
      return originGroupList.filter(item => this.filtGoodsList[item.GroupID] !== undefined);
    },
    renderLength: {
      get() {
        const len = this.page * this.colLength * this.rowLength;
        return len > 200 ? 200 : len;
      },
    },
    rowLength() {
      return Math.ceil(this.listHeight / 130) || 0;
    },
    colLength() {
      return parseInt((this.pageWidth - 360) / GOODS_ITEM_WIDTH, 10) || 0;
    },

    virtualItemNum() {
      const marginRight = 10;
      const paddingLeft = 10;
      const goodsListWidth = this.pageWidth - CART_WIDTH - marginRight - paddingLeft;

      // eslint-disable-next-line radix
      const eachRowNumber = parseInt(goodsListWidth / GOODS_ITEM_WIDTH);
      if (eachRowNumber <= 0) {
        return 0;
      }
      const rem = this.renderGoodsList.length % eachRowNumber;
      return rem === 0 ? 0 : (eachRowNumber - rem);
      // return eachRowNumber - (this.currentGroupGoodsList.length % eachRowNumber);
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
    handleCommand(cmd) {
      const opr = {
        refresh: this.refresh,
        edit: this.editGroup,
      };
      const fn = opr[cmd];
      fn && fn();
    },

    refresh() {
      this.refreshLoading = true;
      this.$store.dispatch('gobalConfig/asyncTicketRegister', this);
      this.$store.dispatch('sell/asyncGetGoodsAsync', this).then(() => {
        this.refreshLoading = false;
      });
    },

    editGroup() {
      this.$api['sell/sell/checkSetGoodsShow']({}).then(() => {
        this.editGoodsVisible = true;
      }, () => {});
    },

    scrollLoading(event) {
      const isMaxLength = this.renderLength >= this.currentGroupGoodsList.length;
      if (this.renderLength >= 200 || isMaxLength) return;
      if (event.target.scrollHeight <= event.target.scrollTop + event.target.clientHeight + 260) {
        this.page++;
      }
    },

    changeTab() {
      this.$nextTick(() => {
        const firstInstance = this.$refs[`group-${this.currentGroup}`][0];
        firstInstance.$el.scrollTop = 0;
        this.page = 1;
      });
    },

    onLoad() {
      this.$store.dispatch('sell/asyncGetGoodsAsync', this);
      if (this.groupList[0]) {
        this.currentGroup = this.groupList[0].GroupID;
      }
    },

    showGoodsDetail(goods) {
      this.detailGoodsInfo = goods;
      this.detailVisible = true;
    },

    putInShoppingCart(goods) {
      this.$refs.shoppingCart.addGoodsToShoppingCart(goods, true);
    },

    handleDetailClose() {
      this.detailGoodsInfo = {};
      this.detailVisible = false;
    },

    handleDetailAddToCart() {
      this.putInShoppingCart(this.detailGoodsInfo);
      this.detailGoodsInfo = {};
      this.detailVisible = false;
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  @import "@/styles/mixins.scss";
  .sell-main {
    height: 100%;
    overflow: hidden;
    /deep/ .el-container.is-vertical {
      height: 100%;
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
    &-left {
      position: relative;
      margin-right: 10px;
      overflow: hidden;
      // stylelint-disable-next-line
      background-color: #FCFCFC;
      padding: 10px 0 0 10px;
      border-radius: $border-radius-small;

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
          width: 90px;
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
          box-shadow: 2px 0 8px -2px rgba($color-black, .3);
        }
        .el-tabs__nav-next.is-disabled {
          box-shadow: -2px 0 8px -2px rgba($color-black, .3);
        }
      }
    }
    /deep/ .el-aside {
      border-radius: $border-radius-small;
    }
    .sell-footer {
      padding: 0;
      height: 50px!important;
      /deep/ .el-button {
        height: 40px;
        width: 80px;
        padding: 0;
        background-color: rgba($color-white, .8);
        margin-right: 10px;
        border-radius: $border-radius-small;
        &:hover {
          background-color: $color-white;
        }
        > span {
          display: flex;
          height: 40px;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          .cut-name {
            font-size: $font-size-primary;
            color: $font-color-regular;
          }
          .cut-key {
            font-size: $font-size-mini;
            color: rgba($font-color-primary, .6);
          }
        }
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
    align-content: flex-start;
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
    .goods-card{
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
        font-size: $font-size-primary + $four-px;
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
      line-height: 20px;
      border: 0;
      padding: 0 5px;
      font-size: $font-size-mini;
      display: none;

      &-special {
        background-color: transparentize($color-white, .6);
      }

      &-default {
        background-color: rgba($color-black, .3);
      }
    }

    .icon {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: $font-size-regular;
      display: none;
      &:hover {
        color: $color-primary;
        opacity: 1;
      }

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
