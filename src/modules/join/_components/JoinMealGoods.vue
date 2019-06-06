<template>
  <div>
    <div class="meal-goods">
      <div class="meal-goods-header">
        <el-row>
          <el-col
            :span="12">入会商品
          </el-col>
          <el-col
            :span="4"
            class="p-center">
            <p>数量</p>
          </el-col>
          <el-col :span="6">
            <p class="p-last">小计</p>
          </el-col>
          <el-col :span="2">
            <el-popover
              v-model="closeAll"
              placement="left"
              width="160">
              <p class="close-tips">是否清空入会商品</p>
              <div class="btn-group">
                <el-button
                  size="mini"
                  @click="closeAll = false">取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="clearAllClick">确定</el-button>
              </div>
              <i
                v-show="localGoodsList.length && canDelete"
                slot="reference"
                class="ych-icon-close icon-close"/>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div class="menu-wraper">
        <template
          v-for="goods in localGoodsList">
          <el-row
            :key="goods.GoodsID"
            class="meal-goods-row">
            <!-- <el-col :span="2">
              <i
                class="ych-icon-close icon-close"
                @click="removeGoods(goods.GoodsID)"/>
            </el-col> -->
            <el-col :span="12">
              <p>{{ goods.GoodsName }}</p>
            </el-col>
            <el-col :span="4">
              <el-input-number
                v-if="!Boolean(goods.Fixed) && canDelete"
                v-model="goods.Amount"
                :controls="false"
                :max="goods.Type === '102' ? 100 : 9999"
                :min="1"
                size="small"
                @blur="calculate"/>
              <p
                v-else
                class="p-amount">{{ goods.Amount }}</p>
            </el-col>
            <el-col :span="6">
              <p class="meal-goods-row-price">
                <span>
                  ¥ {{
                    $number(goods.Price * goods.Amount).format('0.00').split('.')[0]
                  }}
                </span>
                <span>
                  .{{
                    $number(goods.Price * goods.Amount).format('0.00').split('.')[1]
                  }}
                </span>
              </p>
            </el-col>
            <el-col :span="2">
              <i
                v-if="!Boolean(goods.Fixed) && canDelete"
                class="ych-icon-close icon-close"
                @click="removeGoodsfromShoppingCart(goods.GoodsID)"/>
            </el-col>
          </el-row>
        </template>
      </div>
      <div class="meal-goods-footer">
        <el-row class="meal-goods-footer-row">
          <el-col :span="8">
            <p>共{{ totalAmount }}项，合计：</p>
          </el-col>
          <el-col :span="16">
            <p class="footer-row-price">¥ {{ totalCharge | number('0.00') }}</p>
          </el-col>
        </el-row>
        <el-row
          v-if=" totalDiscount > 0"
          class="meal-goods-footer-row">
          <el-col :span="8">
            <i
              class="ych-icon-info icon-discount"
              @click="discountDetailVisible=true"/>
            <span>立减：</span>
          </el-col>
          <el-col :span="16">
            <p class="footer-row-price">- ¥ {{ totalDiscount | number('0.00') }}</p>
          </el-col>
        </el-row>
        <el-row
          v-else
          class="meal-goods-footer-row">
          <el-col :span="24">
            <p class="p-special">暂无优惠</p>
          </el-col>
        </el-row>
        <el-row
          class="meal-goods-footer-row">
          <el-col :span="8">
            <span>应付：</span>
          </el-col>
          <el-col :span="16">
            <p class="footer-row-price p-actual"> ¥ {{ actualCharge | number('0.00') }}</p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="wave-img">
      <img src="../../../assets/down-wave-border.png">
    </div>

    <discount-detail
      :visible.sync="discountDetailVisible"
      :list="discountDetailList"/>
  </div>
</template>

<script>
import DiscountDetail from '@/modules/sell/_components/DiscountDetail.vue';
import { sumBy } from 'lodash';

export default {
  name: 'JoinMealGoods',

  components: {
    DiscountDetail,
  },

  props: {
    mealId: {
      type: String,
      default: '',
    },
    mealGoods: {
      type: Array,
      default: () => [],
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    localGoodsList: [],
    totalCharge: 0,
    totalDiscount: 0,
    actualCharge: 0,
    joinGoods: {},
    closeAll: false,
    discountDetailVisible: false,
    discountDetailList: [],
  }),

  computed: {
    fixedCharge() {
      const fixedGoods = this.mealGoods.filter(goods => goods.Fixed === 1);
      return sumBy(fixedGoods, 'Price');
    },

    totalAmount() {
      return sumBy(this.localGoodsList, 'Amount');
    },
  },


  methods: {
    onLoad() {
      this.localGoodsList = [];
      this.localGoodsList.push(...this.mealGoods);
      this.$nextTick(() => {
        this.calculate();
      });
    },

    clearAllClick() {
      this.clearShoppingCart();
      this.closeAll = false;
    },

    clearShoppingCart() {
      this.localGoodsList = this.localGoodsList.filter(goods => goods.Fixed === 1);
      this.discountDetailList = [];
      this.totalCharge = this.fixedCharge;
      this.totalDiscount = 0;
      this.actualCharge = this.fixedCharge;
    },

    removeGoodsfromShoppingCart(goodsId) {
      const index = this.localGoodsList.findIndex(goods => goods.GoodsID === goodsId);
      this.localGoodsList.splice(index, 1);
      if (this.localGoodsList.length === 0) {
        this.clearShoppingCart();
      } else {
        this.calculate();
      }
    },

    calculate() {
      this.$emit('update:mealGoods', this.localGoodsList);
      this.timeStamp = new Date().getTime();
      const { timeStamp } = this;
      const goodsData = this.localGoodsList.filter(goods => goods.Fixed === 0).map(item => ({
        GoodsID: item.GoodsID,
        Amount: item.Amount,
      }));
      if (goodsData.length > 0) {
        this.$api['sell/sell/calculateShoppingCart']({
          GoodsData: goodsData,
          TimeStamp: timeStamp,
        }).then((res) => {
          this.discountDetailList = res.Data.filter(item => item.DiscountAmount > 0);
          if (timeStamp === this.timeStamp) {
            this.totalCharge = res.TotalCharge + this.fixedCharge;
            this.totalDiscount = res.TotalDiscount;
            this.actualCharge = res.ActualCharge + this.fixedCharge;
          }
        });
      } else {
        this.clearShoppingCart();
      }
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .meal-goods {
    width: 340px;
    height: 510px;
    // margin: 10px 20px;
    border-color: $border-color;
    border-width: 1px 1px 0;
    border-style: solid;
    // box-shadow: 0 10px 10px 0 transparentize($color-black, .8);

    &-header {
      height: 40px;
      padding-left: 10px;
      font-size: $font-size-special;
      line-height: 40px;
      background-color: transparentize($color-info, .5);
      color: $font-color-placeholder;
      overflow: hidden;

      div {
        text-align: left;
      }

      .p-center {
        text-align: center;
        // padding-left: 25px;
      }

      .p-last {
        text-align: right;
        padding-right: 10px;
      }
    }

    .menu-wraper {
      height: 340px;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: $color-white;
      border-bottom: 1px dashed $font-color-placeholder;

      .img-empty {
        position: absolute;
        bottom: 0;
        left: 80px;
        color: $color-black;
      }

      .p-amount {
        text-align: center;
      }

      .close-tips {
        padding: 10px;
      }
    }

    &-row {
      width: 330px;
      height: 50px;
      margin-left: 10px;
      background-color: $color-white;
      font-size: $font-size-primary;
      line-height: 50px;
      color: $font-color-primary;
      border-bottom: 1px solid $color-bg-table;
      overflow: hidden;
      $two-px: 2px;

      &-price {
        width: 90%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          font-size: $font-size-primary - $two-px;
        }

        span:first-child {
          font-size: $font-size-primary;
        }
      }

      /deep/ .el-input {
        width: 60px;
      }
    }

    .icon-close {
      font-size: $font-size-regular;
      color: $font-color-placeholder;
      cursor: pointer;
      &:hover {
        color: $color-danger;
      }
    }

    &-footer {
      width: 340px;
      height: 120px;
      // padding: 8px;
      background-color: $color-white;
      line-height: 24px;
      position: relative;
      $two-px: 2px;

      &-row {
        width: 300px;
        height: 40px;
        // padding: 0 10px;
        margin-left: 20px;
        color: $font-color-primary;
        line-height: 35px;
        overflow: hidden;
        text-align: right;

        &:first-child {
          line-height: 45px;
        }

        .footer-row-price {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: $font-size-primary + $two-px;
        }

        .icon-discount {
          font-size: $font-size-primary + $two-px;
          // stylelint-disable-next-line
          color: #F5A623;
          margin-right: 8px;
          line-height: 35px;
        }

        .p-special {
          text-align: left;
          padding-left: 10px;
          color: $font-color-placeholder;
        }

        .p-actual {
          font-size: $font-size-regular;
          color: $font-color-special;
        }
      }
    }
  }

  .wave-img {
    font-size: 0;
    img {
      width: 342px;
      height: 10px;
    }
  }
</style>

