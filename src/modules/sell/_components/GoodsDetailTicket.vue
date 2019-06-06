<template>
  <div
    class="goods-detail-ticket">
    <div v-if="timingRules.length === 0">
      <p>包含项目:</p>
      <div class="menu-wraper">
        <!-- <ych-scroll> -->
        <div class="goods-detail-grid">
          <div>游乐项目</div>
          <div>次数</div>
          <template v-for="(item,index) in data" >
            <div :key="'name'+index">{{ item.MachineName }}</div>
            <div :key="index">{{ item.Times }}</div>
          </template>
        </div>
        <!-- </ych-scroll> -->
      </div>
    </div>
    <div
      v-else
      class="goods-detail-rules">
      <el-row>
        <el-col
          :span="5"
          class="rules-title">包含项目:</el-col>
        <el-col
          :span="18"
          :offset="1">{{ machineDataStr }}</el-col>
      </el-row>
      <el-row v-show="timingRules.length > 0">
        <el-col
          :span="5"
          class="rules-title">计时规则:</el-col>
        <el-col
          :span="18"
          :offset="1">
          <template v-for="(item,index) in timingRules">
            <p :key="index">{{ item }}</p>
          </template>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsDetialTicket',

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    timingRules: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    machineDataStr() {
      let str = '';
      if (this.data !== undefined) {
        this.data.forEach((item) => {
          str += `${item.MachineName}，`;
        });
      }
      return str.substring(0, str.length - 1);
    },
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  @import "@/styles/mixins.scss";

  .goods-detail-ticket {
    margin: 20px 0;
    color: $font-color-primary;
    font-size: $font-size-primary;

    p {
      line-height: 40px;
    }

    .menu-wraper {
      height: 160px;
      overflow-x: hidden;
    }

    .goods-detail-grid {
      width: 360px;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;

      div {
        width: 180px;
        background-color: $color-bg-regular;
        border-bottom: 1px $border-color solid;
        text-align: center;
        line-height: 40px;
        @include ellipsis(1)
      }
    }

    .goods-detail-rules {
      line-height: 40px;

      .rules-title {
        text-align: right;
        color: $font-color-secondary;
      }
    }
  }
</style>
