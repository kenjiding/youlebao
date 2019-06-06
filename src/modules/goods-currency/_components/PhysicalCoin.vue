<template>
  <div class="ticke">
    <div
      :class="{
        ['ticke-item']: true,
        ['active-item']: activeItem === 'discountItem',
      }"
      @click="selectCoinType('discountItem',discountData.PhysicalCoinCount)">
      <div
        v-if="discountHasData"
        :style="{padding: '10px'}">
        <div class="ticke-item_info"/>
        <div class="ticke-item_top">
          <p>{{ discountData.PhysicalCoinCount }} <span>币</span></p>
          <p
            :class="{
              textActive: active,
              'currence-right': true,
            }"
            @click="getTableInfo('discount')">详情</p>
        </div>
        <div class="ticke-item_mini">
          <span>￥{{ discountData.TotalPrice }}</span>
          <span>{{ discountData.CoinPrice }}元/币</span>
        </div>
      </div>
      <div
        v-else
        class="noData">暂无符合的套餐</div>
    </div>

    <div
      :class="{
        ['ticke-item']: true,
        ['active-item']: activeItem === 'recommendItem',
      }"
      @click="selectCoinType('recommendItem',recommendData.PhysicalCoinCount)">
      <div
        v-if="recommendtHasData"
        :style="{padding: '10px'}">
        <div class="ticke-item_info">
          <span>推荐</span>
          <el-tooltip
            :content="recommendInfo"
            class="item"
            effect="dark"
            placement="top">
            <span>{{ recommendInfo }}</span>
          </el-tooltip>
        </div>
        <div class="ticke-item_top">
          <p>{{ recommendData.PhysicalCoinCount }} <span>币</span></p>
          <p
            :class="{
              textActive: active,
              'currence-right': true,
            }"
            @click="getTableInfo('recommend')">详情</p>
        </div>
        <div class="ticke-item_mini">
          <span>￥{{ recommendData.TotalPrice }}</span>
          <span>{{ recommendData.CoinPrice }}元/币</span>
        </div>
      </div>
      <div
        v-else
        class="noData">暂无推荐的套餐</div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  props: {
    discountData: {
      type: Object,
      default: () => ({}),
    },
    recommendData: {
      type: Object,
      default: () => ({}),
    },

    recommendInfo: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      active: true,
      activeItem: 'discountItem',
    };
  },
  computed: {
    discountHasData() {
      return this.discountData.GoodsList.length > 0;
    },
    recommendtHasData() {
      return this.recommendData.GoodsList.length > 0;
    },
  },

  watch: {
    discountData: {
      handler() {
        this.activeItem = 'discountItem';
        this.selectCoinType('discountItem', this.discountData.PhysicalCoinCount);
      },
      deep: true,
    },
    recommendData: {
      handler() {
        this.activeItem = 'discountItem';
        this.selectCoinType('discountItem', this.discountData.PhysicalCoinCount);
      },
      deep: true,
    },
  },

  methods: {
    selectCoinType(val, coin) {
      this.activeItem = val;
      const totalNum = val === 'discountItem' ? this.discountData.TotalPrice : this.recommendData.TotalPrice;
      this.$emit('changeTotalNum', totalNum, coin);
    },
    getTableInfo(val) {
      let table;
      if (val === 'recommend') {
        table = this.recommendData.GoodsList;
      } else {
        table = this.discountData.GoodsList;
      }
      this.$emit('showTable', table);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.noData {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-secondary;
  color: $font-color-placeholder;
}

.active-item {
  // stylelint-disable-next-line
  background-color: rgba(50,139,235,.2);
  border: 1px solid $color-primary !important;
}

.currence-right {
  cursor: pointer;
  color: $font-color-placeholder;
}

.ticke-item_info {
  margin: 10px 0 30px 10px;
  min-height: 20px;
  span {
    display: inline-block;
    font-size: $font-size-primary;
    // stylelint-disable-next-line
    color: #FF8E04;

    &:nth-child(1) {
      width: 60px;
      height: 20px;
      margin-right: 10px;
      border-radius: $border-radius;
      background-color: $color-warning;
      text-align: center;
      line-height: 20px;
      color: $color-white;
    }

    &:nth-child(2) {
      width: 65%;
      float: right;
      // stylelint-disable-next-line
      font-size: 15px;

      @include ellipsis(2);
    }
  }
}

.textActive {
  color: $color-primary;
}

.ticke-item_mini {
  padding: 30px 20px 20px;
  border-top: 1px solid $border-color;

  span {
    // stylelint-disable-next-line
    font-size: 20px;
    display: inline-block;
    width: 50%;
    color: $font-color-currency;

    &:nth-child(2) {
      text-align: right;
      font-size: $font-size-primary;
      color: $font-color-secondary;
    }
  }
}

.ticke {
  display: flex;
  justify-content: space-between;
  /* width: 320px; */
  &-item {
    width: 45%;
    height: 240px;
    float: left;
    box-sizing: border-box;
    border: 1px solid $border-color;

    &:hover {
      border: 1px solid $color-primary !important;
    }
  }
}

.ticke-item_top {
  padding: 10px 10px 40px;

  p {
    display: inline-block;
    font-size: $font-size-secondary;

    span {
      font-size: $font-size-primary;
    }

    &:nth-child(1) {
      width: 80%;
      font-weight: 700;
      color: $color-black;
      // stylelint-disable-next-line
    }

    &:nth-child(2) {
      width: 20%;
      text-align: right;
      font-size: $font-size-primary;
    }
  }

}
</style>
