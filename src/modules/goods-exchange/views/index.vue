<template>
  <ych-page class="wrap">
    <div class="wrap-left">
      <div
        class="topNav"
        @click="clickHandle">
        <span
          lang="Lottery"
          class="type-btn">
          新增彩票兑换
        </span>
        <span
          lang="Integral"
          class="type-btn">
          新增积分兑换
        </span>
        <span
          lang="Token"
          class="type-btn">
          新增代币兑换
        </span>
        <span
          lang="Gold"
          class="type-btn">
          新增金币兑换
        </span>

        <el-popover
          v-model="popoverVisible"
          class="clearButton"
          placement="right">
          <p>确定清空？</p>
          <div style="text-align: right">
            <el-button
              size="mini"
              type="text"
              @click="popoverVisible = false">取消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="clearData">确定</el-button>
          </div>
          <el-button
            slot="reference"
            plain
            size="medium">清空</el-button>
        </el-popover>
      </div>
    </div>
    <div
      :style="{height: screenHeight + 'px',}"
      class="wrap-right">
      <div
        ref="leftMain"
        class="left-mian">
        <ExchangeItem
          v-for="(item, index) in exchangeItemList"
          ref="exchangeItem"
          :key="item.randomID"
          :item-height="screenHeight"
          :item-data="item"
          :over-status="item.isShow"
          @save-close="saveClose(index)"
          @change-item="changeItemHandle(index)"
          @close-info="deleteInfoItem(index)"
          @print="printAction"/>
      </div>
      <div
        ref="rightItem"
        class="right-mian"/>
    </div>

    <exchange-receipt
      ref="exchangeReceipt"
      :order-id="exchangeLogId"/>

  </ych-page>
</template>

<script>
import { mapState } from 'vuex';
// import { throttle } from 'lodash';

import ExchangeReceipt from '@/modules/goods-exchange/_components/ExchangeReceipt.vue';
import ExchangeItem from '../_components/ExchangeItem.vue';

export default {
  name: 'ExchangeGoods',
  components: {
    ExchangeItem,
    ExchangeReceipt,
  },
  data() {
    return {
      exchangeItemList: [],
      exchangeLogId: '',
      popoverVisible: false,
    };
  },

  computed: {
    ...mapState({
      screenWidth: state => state.client.pageWidth,
      screenHeight: state => state.client.pageHeight - 90,
    }),
  },

  // watch: {
  //   screenWidth() {
  //     throttle(function () {
  //       this.appendNodes;
  //     }, 1000);
  //     this.appendNodes();
  //   },
  // },

  updated() {
    this.appendNodes();
  },

  methods: {
    saveClose(index) {
      this.deleteInfoItem(index);
    },
    clearData() {
      this.popoverVisible = false;
      this.exchangeItemList = [];
    },
    changeItemHandle(index) {
      const deleteItems = this.exchangeItemList.splice(index, 1);
      this.exchangeItemList.unshift(deleteItems[0]);
    },
    deleteInfoItem(index) {
      this.exchangeItemList.splice(index, 1);
    },
    clickHandle(e) {
      const mark = e.target.lang;
      const methodsHandle = {
        Lottery: this.LotteryHandle,
        Integral: this.IntegralHandle,
        Token: this.TokenHandle,
        Gold: this.GoldHandle,
      };
      methodsHandle[mark] && methodsHandle[mark]();
    },
    LotteryHandle() {
      this.handleMethods('#E54B5E', '#E54B5E', '彩票兑换', 'Lottery');
    },
    IntegralHandle() {
      this.handleMethods('#67C23A', '#67C23A', '积分兑换', 'Integral');
    },
    TokenHandle() {
      this.handleMethods('#007AFF', '#007AFF', '代币兑换', 'Token');
    },
    GoldHandle() {
      this.handleMethods('#b94acf', '#b94acf', '金币兑换', 'Gold');
    },
    appendNodes() {
      // const leftBoxNum = (this.screenWidth + 87) > 1170 ? 2 : 1;
      const leftBoxNum = 2;

      let elements = document.getElementsByClassName('item-wrap');
      const nodes = Array.prototype.slice.call(elements);

      const parents = this.$refs.rightItem;
      const mainItem = this.$refs.leftMain;

      // 标记左侧是否删除过组件，同时右侧是否还存在组件。目的是为了重新分配组件的位置
      let markNUm = false;
      if (mainItem.childNodes.length < leftBoxNum && parents.childNodes.length > 0) {
        markNUm = true;
      }
      nodes.forEach((item, index) => {
        if (index > leftBoxNum - 1) {
          parents.appendChild(item);
        }

        if (markNUm) {
          // 当左侧删除过组件，需要把右侧的第一个组件放到左侧空缺的位置
          mainItem.appendChild(parents.childNodes[0]);
          markNUm = false;
        }
      });

      elements = null;
    },
    handleMethods(text, bg, itemName, itemType) {
      const randomCode = `mark${+new Date()}name`;

      if (this.exchangeItemList.length > 7) {
        this.$message({
          message: '当前添加的兑换项不能超过8个',
          type: 'warning',
        });
        return;
      }

      // 关闭商品查询窗口
      this.$refs.exchangeItem && this.$refs.exchangeItem.forEach((el) => {
        el.goodsQueryVisible = false;
      });


      this.exchangeItemList.unshift({
        textColor: text,
        bgColor: bg,
        name: itemName,
        type: itemType,
        randomID: randomCode,
      });
    },

    printAction(logId) {
      this.exchangeLogId = logId;
      this.$nextTick(() => {
        this.$refs.exchangeReceipt.onPrint();
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.clearButton {
  width: 0 !important;
  height: 0 !important;
}

.wrap {
  width: 100%;
  &-left {
    width: 100%;
    height: 70px;
    border-radius: $border-radius;
    // stylelint-disable-next-line
    background-color: #5A6882;
    overflow: hidden;

    .topNav {
      margin: 10px 0 0 10px;
      span {
        display: inline-block;
        width: 160px;
        height: 50px;
        border-radius: $border-radius;
        margin-right: 10px;
        background-color: $color-white;
        box-sizing: border-box;
        text-align: center;
        line-height: 50px;
        color: $font-color-secondary;
        cursor: pointer;

        &:hover {
          opacity: .9;
        }

        &:nth-child(1) {
          color: $color-danger;
        }
        &:nth-child(2) {
          color: $color-success;
        }
        &:nth-child(3) {
          color: $color-primary;
        }
        &:nth-child(4) {
          // stylelint-disable-next-line
          color: #B94ACF;
        }
      }
    }
  }

  &-right {
    width: 100%;
    /* min-width: 1200px; */
    overflow: auto;
    margin-top: 20px;
    box-sizing: border-box;

    .left-mian {
      /deep/ .ych-icon-kuozhan {
        display: none;
      }
    }

    .right-mian {
      width: 375px;
      overflow: auto;
      /* height: 655px;
      padding-bottom: 60px; */
      box-sizing: border-box;

      /deep/ .conten-show {
        display: none;
      }

      /deep/ .top-value {
        display: none;
      }

      /deep/ .wave-img {
        width: 100%;
        height: 4px;
        background-color: $color-bg-table;
        border-bottom-left-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
        img {
          display: none;
        }
      }

      /deep/ .item-wrap {
        margin-right: 0;

        .top {
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
