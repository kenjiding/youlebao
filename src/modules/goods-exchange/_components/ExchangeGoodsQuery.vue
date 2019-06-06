<template>
  <div
    v-show="visible"
    class="exchange-goods-query">
    <div class="query-condition">
      <p>请选择兑换的{{ typeName.replace('兑换', '') }}区间</p>
      <el-input-number
        v-model="minPrice"
        :min="0"
        :controls="false"
        size="mini" />
      -
      <el-input-number
        v-model="maxPrice"
        :controls="false"
        size="mini" />
      <el-button
        plain
        size="mini"
        type="primary"
        @click="queryClick">筛选</el-button>
      <el-button
        plain
        size="mini"
        @click="closeClick">关闭</el-button>
    </div>
    <el-table
      ref="goodsList"
      :data="dataList"
      :height="tableHeigth"
      style="width: 340px"
      class="goods-list"
      @row-click="rowClick">
      <el-table-column
        align="left"
        header-align="center"
        label="商品"
        width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.GoodsName }}</p>
          <p class="goods-list-no">({{ scope.row.GoodsNO }})</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="Amount"
        label="库存"
        align="right"
        header-align="center"
        width="60">
        <template slot-scope="scope">
          <p :class="{'amount-red':(scope.row.IsReal && scope.row.Amount < 0)}">
            {{ amountFormatter(scope.row) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="ExchangePrice"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="兑换价"
        width="75"/>
      <el-table-column
        prop="DiscountPrice"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="折后价"
        width="75"/>
    </el-table>
    <el-pagination
      :total="listTotal"
      :current-page.sync="pageIndex"
      :page-size="20"
      small
      background
      layout="prev, pager, next"
      @current-change="handlePageChange"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ExchangeGoodsQuery',

  props: {
    typeName: {
      type: String,
      required: true,
    },
    typeValue: {
      type: Number,
      required: true,
    },
    maxValue: {
      type: Number,
      default: 999999,
    },
    leaguerLevel: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      minPrice: 0,
      maxPrice: undefined,
      dataList: [],
      listTotal: 0,
      pageIndex: 1,
    };
  },

  computed: {
    ...mapState({
      tableHeigth(state) {
        return state.client.pageHeight - 193;
      },
    }),
  },

  watch: {
    maxValue(val) {
      if (val) {
        this.maxPrice = val;
        return;
      }
      this.maxPrice = undefined;
    },
  },

  methods: {
    amountFormatter(row) {
      if (!row.IsReal) {
        return '-';
      }
      return row.Amount;
    },

    getGoodsName(row) {
      return `${row.GoodsName}\r\n(${row.GoodsNO})`;
    },

    handlePageChange(val) {
      this.pageIndex = val;
      this.queryClick();
    },

    reLoad() {
      this.pageIndex = 1;
      this.queryClick();
    },

    queryClick() {
      const pageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };
      this.$api['goods-exchange/exchange/getExchangeGoodsListByExchangeType']({
        LgLevelID: this.leaguerLevel,
        ExchangeType: this.typeValue,
        MinPrice: this.minPrice,
        MaxPrice: this.maxPrice,
        PageInfo: pageInfo,
      }).then((res) => {
        this.$refs.goodsList.bodyWrapper.scrollTop = 0;
        this.dataList = res.DataList;
        this.listTotal = res.Total;
      });
    },

    rowClick(val) {
      this.$emit('add', val);
    },

    closeClick() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';
@import '@/styles/mixins.scss';

.exchange-goods-query {
  position: absolute;
  top: -1px;
  left: 340px;
  width: 350px;
  background-color: $color-white;
  border-radius: $border-radius;
  border: 1px solid $border-color;
  overflow: hidden;
  z-index: 100;

  .query-condition {
    margin-top: 10px;
    margin-left: 10px;

    >p {
      line-height: 16px;
      margin-bottom: 10px;
      font-size: $font-size-primary;
      color: $font-color-primary;
    }

    /deep/ .el-input-number {
      width: 90px;
    }

    /deep/ .el-button {
      width: 60px;
      // background-color: $color-white;
      margin-left: 10px;
      // position: relative;
      // top: 1px;
    }
  }

  .goods-list {
    margin-left: 10px;

    .amount-red {
      color: $color-danger !important;
    }

    &-no {
      font-size: $font-size-special;
      color: $font-color-placeholder !important;
    }

    /deep/ .el-table__header th {
      color: $font-color-placeholder;
      background-color: $color-white;
      border-color: $font-color-placeholder;
    }

    /deep/ .el-table__row {
      height: 50px;

      p {
        line-height: 14px;
        color: $font-color-regular;
      }
    }
  }

  /deep/ .el-pagination {
    text-align: center;
  }
}
</style>

