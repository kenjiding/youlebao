<template>
  <div class="quick-search-main">
    <el-select
      ref="selectInput"
      :remote-method="handleSearchMethod"
      :loading="loading"
      v-model="searchKey"
      :placeholder="'请输入商品名称/编号/条码'+ (queryCoupon?'/优惠券':'')"
      name="selectInput"
      class="quick-search-input"
      filterable
      remote
      @keyup.enter.native="inputWithEnter"
      @change="handleSelectChange">
      <el-option
        v-for="item in searchResult"
        :key="item.ID"
        :label="item.Name"
        :value="item"/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'QuickSearch',

  components: {
  },

  props: {
    queryCoupon: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    searchKey: '',
    selectFirst: false,
    loading: false,
    searchResult: [],
    isCouponData: false,
  }),

  created() {

  },

  methods: {

    inputWithEnter() {
      this.selectFirst = true;
    },

    handleSearchMethod(query) {
      this.searchGoods(query);
    },

    searchGoods(query) {
      if (this.loading) { return; }
      this.loading = true;
      if (this.queryCoupon && query.indexOf('YHQ') !== -1) {
        this.isCouponData = true;
        this.$api['sell/sell/searchCouponByNumber']({
          SearchValue: query,
        }).then((res) => {
          this.searchResult = [...res.DataList];
          this.loading = false;
          this.$nextTick(() => {
            this.quickSelect();
          });
        }, () => {
          this.searchResult = [];
          this.loading = false;
        });
      } else {
        this.isCouponData = false;
        setTimeout(() => {
          this.loading = false;
          this.searchResult = this.$store.getters['sell/searchGoods'](query);
          this.$nextTick(() => {
            this.quickSelect();
          });
        }, 200);
      }
    },

    quickSelect() {
      if (this.selectFirst && this.searchResult.length > 0) {
        this.handleSelectChange(this.searchResult[0]);
        this.$refs.selectInput.blur();
        setTimeout(() => { this.$refs.selectInput.focus(); }, 200);
      }
    },

    handleSelectChange(selectItem) {
      this.searchKey = '';
      this.searchResult = [];
      this.selectFirst = false;
      this.$emit('selected', selectItem, this.isCouponData);
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .quick-search-main {
    width: 320px;
    height: 40px;
    padding: 10px;
  }

  .quick-search-input {
    width: 320px;

    /deep/ .el-input__inner {
      background-color: $color-bg-regular;
    }
  }
</style>
