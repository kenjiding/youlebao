<template>
  <el-row class="search-item">
    <el-radio-group
      v-model="dateSelect"
      @change="search">
      <el-radio-button
        label="today">今日</el-radio-button>
      <el-radio-button
        label="yesterday">昨日</el-radio-button>
    </el-radio-group>
    <div class="search-item-2">
      <el-select
        v-model="formData.ChannelID"
        placeholder="请选择渠道"
        clearable
        class="drop-wrap"
        @change="$emit('search-data', formData)">
        <el-option
          v-for="(item, index) in channelList"
          :key="index"
          :label="item.Text"
          :value="item.Value"/>
      </el-select>
    </div>
    <!-- <div class="search-item-2">
      <el-select
        v-model="formData.GoodsType"
        placeholder="请选择商品类型"
        clearable
        class="drop-wrap"
        @change="$emit('search-data', formData)">
        <el-option
          v-for="(item, index) in goodsTypeList"
          :key="index"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </div> -->
    <div class="search-item-3">
      <el-input
        v-model="formData.Keyword"
        placeholder="请输入订单号/验证码/姓名/手机号"
        @keyup.native.enter="buttonSearch">
        <template
          slot="append">
          <el-button
            type="primary"
            @click="buttonSearch">搜索</el-button>
        </template>
      </el-input>
    </div>
  </el-row>
</template>

<script>

export default {
  name: '',
  props: {
    channelList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      formData: {
        StartDate: this.$date().format('YYYY-MM-DD'),
        EndDate: this.$date().format('YYYY-MM-DD'),
        ChannelID: '',
        GoodsType: '',
        Keyword: '',
      },
      goodsTypeList: [],
      dateSelect: '',
    };
  },

  created() {
    this.getdropDownData();
    console.log(this.$store);
  },

  methods: {
    buttonSearch() {
      if (!this.formData.Keyword) {
        this.$message({
          message: '请输入筛选条件',
          type: 'warning',
        });
        return;
      }
      this.search();
    },
    getdropDownData() {
      this.goodsTypeList = this.$const['GOODS/BASE/GOODS_TYPE'];
    },
    search() {
      const date = `${this.$date().year()}-${this.$date().month() + 1}-`;
      if (this.dateSelect === 'today') {
        this.formData.StartDate = date + this.$date().date();
        this.formData.EndDate = this.formData.StartDate;
      } else {
        this.formData.StartDate = date + (this.$date().date() - 1);
        this.formData.EndDate = this.formData.StartDate;
      }
      this.$emit('search-data', this.formData);
    },
    selecte(val, type) {
      console.log(val, 789);
      if (type === 'channel') {
        this.formData.ChannelID = val;
        this.$emit('search-data', this.formData);
      } else {
        this.formData.GoodsType = val;
        this.$emit('search-data', this.formData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.drop-wrap {
  width: 100%;
  margin: 0 !important;

  /deep/ .el-select {
    margin: 0;
  }
}

.searchSpan {
  width: 98px;
  height: 100%;
  display: inline-block;
  text-align: center;
  line-height: 38px;
}

.search-item {
  width: 100%;
  background-color: $color-white;
  padding: 10px 20px 0;
  div {
    float: left;
    height: 40px;
    background: $color-white;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .search-item-2 {
    width: 200px;
  }

  .search-item-3 {
    width: 350px;
  }
}
</style>

