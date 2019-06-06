<template>
  <div class="value-change-logs">
    <el-radio-group
      v-if="condition.length > 0"
      v-model="changeType"
      size="small"
      @change="onLoad(1)">
      <el-radio-button
        v-for="item in condition"
        :key="item.value"
        :label="item.value">
        {{ item.name }}
      </el-radio-button>
    </el-radio-group>
    <el-table
      :data="valueChangeLogs"
      :height="localListHeight"
      highlight-current-row
      border>
      <el-table-column
        prop="LogTime"
        show-overflow-tooltip
        label="时间"
        width="180"/>
      <el-table-column
        prop="OrderType"
        show-overflow-tooltip
        label="变更原因"
        min-width="120"/>
      <el-table-column
        prop="ChangeValue"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="变更值"
        class-name="change-value-green"
        width="80">
        <template slot-scope="scope">
          <span :class="scope.row.ChangeValue >=0 ?'change-value-red':'change-value-green'">
            {{ scope.row.ChangeValue }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="TargetValue"
        show-overflow-tooltip
        align="right"
        header-align="center"
        label="变更后余额"
        width="100"/>
      <el-table-column
        prop="MallName"
        show-overflow-tooltip
        label="商城"
        min-width="80"/>
      <el-table-column
        prop="OperateEmployeeName"
        show-overflow-tooltip
        label="操作员"
        min-width="80"/>
      <el-table-column
        prop="OperateTerminal"
        show-overflow-tooltip
        label="终端"
        min-width="80"/>
      <el-table-column
        prop="Summary"
        show-overflow-tooltip
        label="备注"/>
    </el-table>
    <el-pagination
      :total="totalCount"
      class="table-pagination"
      background
      layout="total,prev, pager, next"
      @current-change="onLoad"
      @prev-click="onLoad"
      @next-click="onLoad"/>
  </div>
</template>

<script>
export default {
  name: 'ValueChangeLogs',

  props: {
    leaguerId: {
      type: String,
      default: '',
    },
    valueType: {
      type: Number,
      default: 1,
    },
    listHeight: {
      type: Number,
      default: 360,
    },
  },

  data() {
    return {
      changeType: '',
      valueChangeLogs: [],
      // pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
    };
  },

  computed: {
    condition() {
      if (this.valueType === 402 || this.valueType === 401) {
        const array = [
          {
            name: '全部',
            value: '',
          },
          {
            name: '充值',
            value: '2',
          },
          {
            name: '赠送',
            value: '3',
          },
          {
            name: '消费',
            value: '1',
          },
          {
            name: '补币',
            value: '4',
          },
        ];
        if (this.valueType === 402) {
          array.push({
            name: '存取币',
            value: '5',
          });
        }
        return array;
      }
      return [];
    },

    localListHeight() {
      if (this.valueType === 402 || this.valueType === 401) {
        return this.listHeight - 37;
      }
      return this.listHeight;
    },
  },

  // created() {
  //   this.onLoad(1);
  //   console.log('onload');
  // },

  methods: {
    activeShow() {
      if (this.valueChangeLogs.length === 0) {
        this.onLoad(1);
      }
    },

    clear() {
      this.valueChangeLogs = [];
      this.totalCount = 0;
    },

    onLoad(pageIndex) {
      if (this.leaguerId === '') {
        this.clear();
      } else {
        this.$api['leaguer/leaguer/getAccountChanged']({
          LeaguerID: this.leaguerId,
          Type: this.valueType,
          ChangeType: this.changeType,
          PageInfo: {
            PageIndex: pageIndex,
            PageSize: this.pageSize,
          },
        }).then((res) => {
          this.valueChangeLogs = res.DataList;
          this.totalCount = res.Total;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .value-change-logs {
    .table-pagination {
      text-align: right;
      margin-top: 8px;
    }
    .el-radio-group {
      margin-bottom: 5px;
    }
    .change-value-green {
      color: $color-success;
    }

    .change-value-red {
      color: $color-danger;
    }
  }

</style>

