<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    title="商品详情"
    width="400px"
    class="goods-detail-dialog"
    @close="$emit('close')"
    @opened="onLoad">
    <div class="goods-detail-main">
      <div class="goods-detail-main-header">
        <div class="goods-name">商品名称: {{ goodsInfo.Name }}</div>
        <div v-if="goodsInfo.Type === '101'">
          <p v-if="goodsDetail.CoinAmount > 0">
            <span>代币数: {{ goodsDetail.CoinAmount }} </span>
            <span
              v-if="coinTerm"
              class="span-term">{{ coinTerm }}</span>
          </p>
          <p v-if="goodsDetail.GoldCoinAmount > 0">
            <span>金币数: {{ goodsDetail.GoldCoinAmount }} </span>
            <span
              v-if="goldCoinTerm"
              class="span-term">{{ goldCoinTerm }}</span>
          </p>
        </div>
        <div v-else-if="goodsInfo.Type === '2'">
          <p>预存款: {{ goodsDetail.PreDeposit }}</p>
        </div>
        <div v-else-if="goodsInfo.Type === '102'">
          <p>{{ ticketEndTerm }}</p>
          <p>{{ goodsDetail.StartTerm }}</p>
          <template
            v-for="(item,index) in goodsDetail.UseLimits"
            v-show="goodsDetail.UseLimits.length > 0">
            <p :key="index">{{ item }}</p>
          </template>
        </div>
        <div v-else-if="goodsInfo.Type === '6'|| goodsInfo.Type === '1'">
          <template v-for="(item,index) in goodsDetail.DataList">
            <p :key="index">{{ item.GoodsName }} * {{ item.Amount }}</p>
          </template>
        </div>
        <div v-else-if="goodsInfo.Type === '0'">
          <p>库存: {{ goodsDetail.Stock }}</p>
        </div>
      </div>
      <div class="goods-detail-main-baseinfo">
        <el-row>
          <el-col
            :span="5"
            class="baseinfo-title">商品类型:</el-col>
          <el-col
            :span="18"
            :offset="1">{{ getGoodsTypeChs(goodsInfo.Type) }}</el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            class="baseinfo-title">商品编号:</el-col>
          <el-col
            :span="18"
            :offset="1">{{ goodsInfo.SN }}</el-col>
        </el-row>
        <el-row v-if="goodsInfo.Type === '102'">
          <el-col
            :span="5"
            class="baseinfo-title">票种:</el-col>
          <el-col
            :span="18"
            :offset="1">{{ goodsInfo.Tag }}</el-col>
        </el-row>
        <el-row v-else-if="goodsInfo.Type === '101'">
          <el-col
            :span="5"
            class="baseinfo-title">币类型:</el-col>
          <el-col
            :span="18"
            :offset="1">{{ goodsInfo.Tag }}</el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            class="baseinfo-title">单价:</el-col>
          <el-col
            :span="18"
            :offset="1">¥{{ $number(goodsInfo.Price).format('0.00') }}</el-col>
        </el-row>
      </div>
      <!-- <div> -->
      <goods-detail-ticket
        v-if="goodsInfo.Type === '102'"
        :data="goodsDetail.DataList"
        :timing-rules="goodsDetail.TimingRules"
        class="goods-detail-ticket"/>
      <!-- </div> -->

      <el-button
        v-if="canAdd"
        type="primary"
        class="add-button"
        @click="$emit('add')">添加到购物车</el-button>
    </div>
  </el-dialog>
</template>

<script>
import GoodsDetailTicket from '@/modules/sell/_components/GoodsDetailTicket.vue';

export default {
  name: 'GoodsDetial',

  components: {
    GoodsDetailTicket,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    goodsId: {
      type: String,
      default: '',
    },
    canAdd: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    goodsInfo: {},
    goodsDetail: {},
  }),

  computed: {
    coinTerm() {
      if (this.goodsDetail.CoinStartTerm && this.goodsDetail.CoinEndTerm) {
        return `${this.goodsDetail.CoinStartTerm}-${this.goodsDetail.CoinEndTerm}`;
      }
      return '';
    },

    goldCoinTerm() {
      if (this.goodsDetail.GoldCoinStartTerm && this.goodsDetail.GoldCoinEndTerm) {
        return `${this.goodsDetail.GoldCoinStartTerm}-${this.goodsDetail.GoldCoinEndTerm}`;
      }
      return '';
    },

    ticketEndTerm() {
      if (this.goodsDetail.EndTerm) {
        return `${this.goodsDetail.EndTerm}`;
      }
      return '';
    },
  },

  methods: {
    getGoodsTypeChs(type) {
      switch (type) {
        case '0':
          return '零售商品';
        case '1':
          return '会员入会';
        case '2':
          return '预存充值';
        case '3':
          return '会员补卡';
        case '4':
          return '会员换卡';
        case '5':
          return '会员续期';
        case '6':
          return '组合商品';
        case '7':
          return '多乐园套票';
        case '8':
          return '代销商品';
        case '99':
          return '卡押金';
        case '101':
          return '游戏币';
        case '102':
          return '套票商品';
        case '201':
          return '门票';
        default:
          return '';
      }
    },

    onLoad() {
      const map = {
        101: 'sell/sell/getCoinMealDetail',
        2: 'sell/sell/getPreDepositDetail',
        102: 'sell/sell/getPackageTicketDetail',
        0: 'sell/sell/getCommonGoodsDetail',
        6: 'sell/sell/getCombinationDetail',
        1: 'sell/sell/getCombinationDetail',
      };
      this.$api['sell/sell/getGoodsBaseInfo']({
        GoodsID: this.goodsId,
      }).then((res) => {
        this.goodsInfo = res;
        this.$api[map[Number(res.Type)]]({
          GoodsID: this.goodsId,
        }).then((detail) => {
          this.goodsDetail = detail;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  @import "@/styles/mixins.scss";

  .goods-detail-dialog {
    /deep/ .el-dialog__header {
      height: 50px;
      line-height: 50px;
      padding: 0;
      border-bottom: 1px $border-color solid;
    }

    /deep/ .el-dialog__title {
      width: 85%;
      padding-left: 30px;
      line-height: 50px;
      // font-size: $color-bg-primary + $two-px;
      color: $font-color-regular;

      @include ellipsis(1)
    }

    /deep/ .el-dialog__body {
      padding: 0;
    }
  }
  .goods-detail-main{
    width: 360px;
    min-height: 280px;
    padding: 20px;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    // position: relative;
    $two-px:2px;

    .p-danger {
      color: $color-danger;
    }

    &-header {
      width: 330px;
      min-height: 50px;
      padding: 15px;
      color: $font-color-regular;
      line-height: 30px;
      font-size: $font-size-primary + $two-px;
      background-color: $color-primary-light-9;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: flex-start;

      .span-term {
        margin-left: 10px;
        font-size: $font-size-primary;
      }

      .goods-name {
        color: $font-color-regular;
      }
    }

    &-baseinfo {
      height: 152px;
      margin-top: 20px;
      font-size: $font-size-primary;
      color: $font-color-primary;
      line-height: 32px;

      .baseinfo-title {
        text-align: right;
        color: $font-color-secondary;
      }
    }

    .add-button {
      width: 360px;
      // position: absolute;
      // bottom: 20px;
    }

  }

</style>
