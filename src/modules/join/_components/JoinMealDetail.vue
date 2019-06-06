<template>
  <el-dialog
    :title="goodsInfo.Name"
    :visible="visible"
    width="400px"
    custom-class="join-meal-detail-dialog"
    @close="$emit('close')">
    <div class="join-meal-detail-main">
      <div class="join-meal-main-header">
        <div>
          <template v-for="(item,index) in goodsDetail.DataList">
            <p :key="index">{{ item.GoodsName }} * {{ item.Amount }}</p>
          </template>
        </div>
      </div>
      <div class="join-meal-main-baseinfo">
        <el-row>
          <el-col
            :span="5"
            class="baseinfo-title">单价:</el-col>
          <el-col
            :span="18"
            :offset="1">¥{{ $number(goodsInfo.Price).format('0.00') }}</el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            class="baseinfo-title">商品类型:</el-col>
          <el-col
            :span="18"
            :offset="1">入会套餐</el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            class="baseinfo-title">商品编号:</el-col>
          <el-col
            :span="18"
            :offset="1">{{ goodsInfo.SN }}</el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            class="baseinfo-title">票种:</el-col>
          <el-col
            :span="18"
            :offset="1">{{ goodsInfo.Tag }}</el-col>
        </el-row>
      </div>

      <!-- <el-button
        type="primary"
        class="add-button"
        @click="$emit('add')">
        添加到购物车
      </el-button> -->
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'JoinMealDetail',

  components: {
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    goodsInfo: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    goodsDetail: {},
  }),

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
      };
      this.$api[map[Number(this.goodsInfo.Type)]]({
        GoodsID: this.goodsInfo.ID,
      }).then((res) => {
        this.goodsDetail = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .join-meal-main{
    width: 360px;
    min-height: 300px;
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
      color: $font-color-primary;
      line-height: 30px;
      font-size: $font-size-primary + $two-px;
      background-color: $color-primary-light-9;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
    }

    &-baseinfo {
      height: 180px;
      margin-top: 20px;
      font-size: $font-size-primary;
      color: $font-color-primary;
      line-height: 40px;

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

<style lang="scss">
  .join-meal-detail-dialog {
    /deep/ .el-dialog__header {
      // stylelint-disable-next-line
      border-bottom: 1px #DDD solid;
    }

    /deep/ .el-dialog__body {
      padding: 0;
    }
  }
</style>
