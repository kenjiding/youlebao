<template>
  <div
    ref="goodsListWrap"
    :style="{
      height: listHeight+'px',
      'overflow-y': 'auto'
    }"
  >
    <draggable
      v-model="renderGoodsList"
      :options="{
        group:{
          name:isBatchEdit ? '' : 'id',
          put:false
        },
        ghostClass: 'current-drag',
        handle: '.handle',
        sort: !isBatchEdit,
        scrollSensitivity: 300,
      }"
      :move="moveItem"
      class="list-panel"
      element="div"
      @remove="removeItem"
      @end="moveEnd"
      @update="updateGoodsList">
      <el-card
        v-for="(goods, index) in renderGoodsList"
        :key="goods.ID"
        :data-id="goods.ID"
        :class="{
          'batch-edit': saveGoodsIDList.includes(goods.ID),
          'handle': !isBatchEdit
        }"
        :style="{
          'background-color': goods.Color,
          'border-color': eqGoodsColor(goods.Color) ? '' : goods.Color
        }"
        class="goods-card"
        shadow='hover'
        @click.native="shortCutClick(goods)">
        <div
          v-if="len > index"
          :key="goods.ID"
          :class="{
            'white-preview': isWhitePreview && saveGoodsIDList.includes(goods.ID),
            'other-preview': otherPreview && saveGoodsIDList.includes(goods.ID),
          }"
          class="card-content">
          <div>
            <p
              :class=" {'title-default': eqGoodsColor(goods.Color)}"
              class="title">
              {{ goods.Name }}
            </p>
            <i
              :class="[
                eqGoodsColor(goods.Color)?'icon-default':'icon-special'
              ]"
              class="ych-icon-info icon"
              @click="showGoodsDetail($event, goods)"/>
          </div>
          <p
            :class="{'price-default': eqGoodsColor(goods.Color)}"
            class="price">
            <span>¥ {{ $number(goods.Price).format('0.00').split('.')[0] }}</span>
            <span>.{{ $number(goods.Price).format('0.00').split('.')[1] }}</span>
          </p>
          <color-select
            :color="goods.Color"
            :value="currentGoodsId === goods.ID"
            @close="currentGoodsId = ''"
            @show-item="ev => showColorItem(ev, goods.ID)"
            @choose="color => chooseCard(goods, color)"/>
        </div>
        <div
          v-show="saveGoodsIDList.includes(goods.ID)"
          :style="{ 'background-color': batchEditColor}"
          class="batch-color"/>
        <div class="edit-mask">
          <i
            class="el-icon-circle-check icon"/>
        </div>
      </el-card>
      <el-card
        v-for="n in virtualItemNum"
        :key="n"
        class="goods-card goods-card--virtual"/>
    </draggable>

    <goods-detail
      :goods-id="detailGoodsInfo.ID"
      :visible="detailVisible"
      :can-add="false"
      @close="handleDetailClose"
      @add="handleDetailAddToCart"/>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import GoodsDetail from '@/modules/sell/_components/GoodsDetail.vue';
// 商品项卡片宽度
const GOODS_ITEM_WIDTH = 214;
export default {
  name: 'EditGoodsList',
  components: {
    draggable,
    GoodsDetail,
  },
  props: {
    listHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      page: 1,
      // 当前分组商品
      currentRenderGoodsList: [],
      detailVisible: false,
      detailGoodsInfo: {
        Name: '',
      },
      changeColorData: {
        idList: [],
        color: '',
      },
      moveTime: 0,
      moveInterval: null,
      // 储存批量商品ID
      saveGoodsIDList: [],
      isBatchEdit: false,
      goodsListScrollTop: 0,
      // 初始化渲染条数
      len: 50,
      // 用于手动触发颜色选择下啦
      currentGoodsId: '',
    };
  },

  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
      sellGroupList: state => state.sell.groupList,
      currentGroupId: state => state.sell.currentEditGroupID,
      isMultipleEdit: state => state.sell.isMultipleEdit,
      goodsDataList: state => state.sell.goodsDataList,
      batchEditColor: state => state.sell.batchEditColor,
      filtGoodsList: state => state.sell.filtGoodsList,
    }),
    renderGoodsList: {
      get() {
        return this.currentRenderGoodsList;
      },
      set(val) {
        this.currentRenderGoodsList = val;
      },
    },
    virtualItemNum() {
      const marginRight = 10;
      const marginLeft = 5;
      const paddingLeft = 20;
      const goodsListWidth = this.pageWidth - marginLeft - marginRight - paddingLeft;

      // eslint-disable-next-line radix
      const eachRowNumber = parseInt(goodsListWidth / GOODS_ITEM_WIDTH);
      if (eachRowNumber <= 0) {
        return 0;
      }
      const rem = this.renderGoodsList.length % eachRowNumber;
      return rem === 0 ? 0 : (eachRowNumber - rem);
    },
    isWhitePreview() {
      return this.isMultipleEdit && this.batchEditColor && this.batchEditColor.toLowerCase() === '#ffffff';
    },
    otherPreview() {
      return this.isMultipleEdit && this.batchEditColor && this.batchEditColor.toLowerCase() !== '#ffffff';
    },
  },
  watch: {
    currentGroupId: {
      immediate: true,
      handler(val) {
        this.len = 50;
        if (val) {
          const currentList = this.filtGoodsList[val] || [];
          this.currentRenderGoodsList = currentList.slice(0, 200);
          // 防止切换分组卡顿
          setTimeout(() => {
            const timers = setInterval(() => {
              if (this.len >= 200) {
                clearInterval(timers);
                return;
              }
              this.len += 25;
            }, 150);
          }, 300);
        }
      },
    },

    saveGoodsIDList(val) {
      this.isBatchEdit = !!val.length;
      this.changeBatchEdit(this.isBatchEdit);
      const copyList = [...val];
      this.multipleEditList(copyList);
    },

    isMultipleEdit(val) {
      if (!val) this.resetData();
    },
  },
  methods: {
    ...mapMutations({
      changeGoodsColor: 'sell/changeGoodsColor',
      changeBatchEdit: 'sell/changeBatchEdit',
      multipleEditList: 'sell/multipleEditList',
      batchEditColorPreview: 'sell/batchEditColorPreview',
      setGroupIdOfGoods: 'sell/setGroupIdOfGoods',
      dragGoodsOrder: 'sell/dragGoodsOrder',
    }),

    eqGoodsColor(color) {
      return color.toLowerCase() === '#ffffff';
    },

    showColorItem(ev, id) {
      if (!this.isBatchEdit) {
        this.currentGoodsId = id;
        ev.stopPropagation();
      }
    },
    // 批量编辑颜色预览
    batchEditPreview(color) {
      const copyGoodsDataList = Object.assign({}, this.goodsDataList);
      const copySaveGoodsIDList = [...this.saveGoodsIDList];
      copySaveGoodsIDList.forEach((item) => {
        copyGoodsDataList[item].Color = color;
      });
    },
    // 重置
    resetData() {
      this.changeColorData = {
        idList: [],
        color: '',
      };
      this.saveGoodsIDList = [];
      this.isBatchEdit = false;
      this.batchEditColorPreview('');
    },
    // 初始化页码
    setPage() {
      this.$nextTick(() => {
        this.$refs.goodsListWrap.scrollTop = 0;
        this.page = 1;
      });
    },
    // 获取当前分组商品
    setCurrentGoodsList() {
      const currentList = this.filtGoodsList[this.currentGroupId] || [];
      this.currentRenderGoodsList = currentList.slice(0, 200);
    },
    // 商品移动
    moveItem(ev) {
      // 判断商品是否移入分组列表
      const toClassName = ev.to.className === 'goods-class-draggable';
      if (toClassName && (this.moveInterval === null)) {
        this.moveInterval = setInterval(() => {
          this.moveTime++;
        }, 200);
      }
    },
    addGoodsToGroup(item, toGroupId) {
      const groupId = toGroupId;
      const group = this.filtGoodsList[groupId];
      if (!Array.isArray(group)) {
        this.filtGoodsList[groupId] = [];
      }
      this.filtGoodsList[groupId].push(item);
    },
    // 修改商品分组
    removeItem(ev) {
      // 当前移动的商品
      let formItem;
      // 当前移动商品索引
      const formIndex = this.filtGoodsList[this.currentGroupId].findIndex((item) => {
        if (item.ID !== ev.item.dataset.id) return false;
        formItem = item;
        return true;
      });
      // 判断商品是否移入分组与移入时间
      if (ev.newIndex !== this.sellGroupList.length && this.moveTime >= 1) {
        const addGroupId = this.sellGroupList[ev.newIndex].GroupID;
        if (addGroupId !== this.currentGroupId) {
          this.updateGoodsForGroup(ev.item.dataset.id, addGroupId, formIndex, formItem);
        }
      }
      this.setCurrentGoodsList();
    },
    // 商品拖入分组更新
    updateGoodsForGroup(goodsID, groupID, formIndex, formItem) {
      this.$api['sell/sell/updateGoodsForGroup']({
        GoodsID: goodsID,
        GroupID: groupID,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '更改成功!',
        });
        this.filtGoodsList[this.currentGroupId].splice(formIndex, 1);
        this.addGoodsToGroup(formItem, groupID);
        // 拖入商品到分组成功后改变商品分组ID
        this.setGroupIdOfGoods({
          goodsId: goodsID,
          afterGroupId: groupID,
        });
        this.setCurrentGoodsList();
      }, () => {});
    },
    moveEnd() {
      this.currentGoodsId = '';
      clearInterval(this.moveInterval);
      this.moveTime = 0;
      this.moveInterval = null;
    },
    // 修改当前分组商品顺序
    updateGoodsList(evt) {
      if (evt.oldIndex === evt.newIndex) return;
      const sortList = [];
      this.currentRenderGoodsList.forEach((item) => {
        sortList.push(item.ID);
      });
      this.updateGoodsForGoodsIndex(evt, sortList);
    },
    updateGoodsForGoodsIndex(evt, sortList) {
      this.$emit('changeLoadingStatus', true);
      this.$api['sell/sell/updateGoodsForGoodsIndex']({
        GoodsIDList: sortList,
      }).then(() => {
        this.$emit('changeLoadingStatus', false);
        this.dragGoodsOrder({
          oldIndex: evt.oldIndex,
          newIndex: evt.newIndex,
        });
        this.$message({
          type: 'success',
          message: '更改成功!',
        });
      }, () => {
        this.$emit('changeLoadingStatus', false);
        this.setCurrentGoodsList();
      });
    },
    // 修改商品颜色
    updateGoodsColor() {
      this.$api['sell/sell/updateGoodsShow']({
        GoodsIDList: this.isBatchEdit ? this.saveGoodsIDList : this.changeColorData.idList,
        Color: this.changeColorData.color,
        GroupID: this.currentGroupId,
      }).then(() => {
        this.changeGoodsColor(this.changeColorData);
        this.setCurrentGoodsList();
      }, () => {
        this.setCurrentGoodsList();
      });
    },
    // 点击批量编辑
    shortCutClick(goods) {
      if (this.changeColorData.idList.length > 0) {
        this.saveGoodsIDList = [];
        this.changeColorData.idList = [];
      }
      this.isBatchEdit = true;
      const hasIndex = this.saveGoodsIDList.findIndex((item => item === goods.ID));
      if (hasIndex === -1) {
        this.saveGoodsIDList.push(goods.ID);
      } else {
        this.saveGoodsIDList.splice(hasIndex, 1);
      }
    },
    showGoodsDetail(ev, goods) {
      if (!this.isBatchEdit) {
        this.detailGoodsInfo = goods;
        this.detailVisible = true;
        ev.stopPropagation();
      }
    },
    handleDetailClose() {
      this.detailGoodsInfo = {};
      this.detailVisible = false;
    },
    handleDetailAddToCart() {
      this.detailGoodsInfo = {};
      this.detailVisible = false;
    },
    changeColor(val) {
      this.changeColorData.color = val;
      this.updateGoodsColor();
    },
    // 修改单个商品颜色
    chooseCard(goods, val) {
      this.currentGoodsId = '';
      if (this.isBatchEdit) {
        const hasIndex = this.saveGoodsIDList.findIndex((item => item === goods.ID));
        if (hasIndex === -1) {
          this.saveGoodsIDList.push(goods.ID);
        }
        return;
      }
      this.changeColorData.idList = [];
      this.changeColorData.idList.push(goods.ID);
      this.changeColor(val);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.list-panel {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: flex-start;
  // stylelint-disable-next-line
  -webkit-user-select: none;
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
    position: relative;
    -webkit-app-region: no-drag;
  }
  /deep/ .el-card__body {
    position: absolute;
    padding: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .current-drag {
    background: $color-regular!important;
    border-color: $color-regular!important;
    /deep/ .el-card__body {
      display: none;
    }
  }
  .batch-color {
    position: absolute;
    z-index: 1;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border-radius: $border-radius;
  }
}

.goods-card{
  overflow: inherit;
  flex: 1;
  position: relative;

  &--virtual {
    visibility: hidden;
  }
  &:hover {
    i {
      display: block;
    }
  }
  .white-preview {
    .price {
      color: $font-color-currency;
    }
    .title {
      color: $font-color-regular;
    }
    .color-box {
      border-color: $font-color-placeholder!important;
    }
  }
  .other-preview {
    p {
      color: $color-white;
    }
    .color-box {
      border-color: $color-white!important;
    }
  }
}

.card-content {
  height: 100%;
  position: absolute;
  width: 100%;
  padding: 20px;
  z-index: 2;
  box-sizing: border-box;
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

.edit-mask {
  display: none;
}
.batch-edit {
  .edit-mask {
    position: absolute;
    left: -1px;
    top: -1px;
    color: $color-white;
    font-size: $font-size-bigger;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-radius: $border-radius;
    background-color: rgba($color-black, .4);
    z-index: 3;
  }
}
</style>
