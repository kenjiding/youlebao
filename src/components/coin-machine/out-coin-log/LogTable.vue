<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      :height="tableHeigth"
      tooltip-effect="dark"
      style="width: 100%"
      class="table-wrap">
      <el-table-column
        prop="LogTime"
        label="日期"
        header-align="center"
        align="center"
        width="180px"/>
      <el-table-column
        prop="LeaguerCode"
        header-align="center"
        align="center"
        label="会员"/>
      <el-table-column
        prop="HandlingState"
        label="状态"
        header-align="center"
        align="center"
        show-overflow-tooltip/>
      <el-table-column
        prop="Amount"
        header-align="right"
        align="right"
        label="应出币"/>
      <el-table-column
        prop="ActualAmount"
        align="right"
        header-align="right"
        label="实出币"/>
      <el-table-column
        prop="Difference"
        header-align="right"
        align="right"
        label="差异"/>
      <el-table-column
        prop="OperateEmp"
        header-align="center"
        align="center"
        label="操作人"/>
      <el-table-column
        prop="OperateTerm"
        header-align="center"
        align="center"
        label="终端"/>
      <el-table-column
        prop="Summary"
        label="备注"
        header-align="center"
        align="center"
        width="150px"/>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button
            :disabled="tabsStatus === '2'"
            :loading="buttonLoading[scope.$index]"
            type="text"
            size="small"
            @click.native.prevent="beforeHandleClick(scope.row,scope.$index)">继续出币</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <OutCoin
      :animation-visible.sync="OutCoinVisible"
      :info="coinInfo"/> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import checkCoinMachineLink from '@/utils/checkCoinMachineLink';
import OutCoin from '../components/OutCoin.vue';

export default {
  name: '',

  components: {
    OutCoin,
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    tabsStatus: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      selectRow: [],
      OutCoinVisible: false,
      coinInfo: {},
      LogID: '',
      buttonLoading: [],
    };
  },


  computed: mapState({
    tableHeigth(state) {
      return state.client.pageHeight - 430;
    },
  }),

  watch: {
    tableData(val) {
      val.forEach((item, index) => {
        this.$set(this.buttonLoading, index, false);
        // this.buttonLoading.push(false);
      });
    },
  },

  methods: {
    beforeHandleClick(val, index) {
      this.$set(this.buttonLoading, index, true);
      checkCoinMachineLink().then(() => {
        this.handleClick(val);
        this.$set(this.buttonLoading, index, false);
      }, () => {
        this.$alert(
          '<p>无法售卖实物币，售币机未连接。</p><p>请尝试以下方法解决：</p><p>1.检查连接线是否正常</p><p>2.重启售币机</p>',
          '提示', {
            dangerouslyUseHTMLString: true,
            type: 'error',
          },
        );
        this.$set(this.buttonLoading, index, false);
      });
    },
    handleClick(val) {
      let infoText = '';
      let outCoinNumber = 0;
      if (val.OperateTermType === 1) {
        infoText = `请把已出的实物币倒回售币机，重新出币。应出币数：${val.Amount}`;
        outCoinNumber = val.Amount;
      } else {
        infoText = `继续出币：${val.Difference}`;
        outCoinNumber = val.Difference;
      }

      this.$alert(infoText, '提醒', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action === 'confirm') {
            this.outCoinHandle(val, outCoinNumber);
          }
        },
      });
    },
    outCoinHandle(val, coinNum) {
      const _this = this;
      this.LogID = val.LogID;
      this.OutCoinVisible = true;
      this.$createOutCoin({
        $props: {
          animationVisible: 'OutCoinVisible',
          outCoin: coinNum,
          needTolog: false,
        },
        $events: {
          error() {
          },
          closeDialog() {
            _this.OutCoinVisible = false;
          },
          complete(num) {
            _this.undateLog(num);
          },
        },
      });
    },
    undateLog(num) {
      this.$api['physicalCoin/updateGamePhysicalCoinSetMealLog']({
        LogID: this.LogID,
        OutCoins: num,
      }).then(() => {
        this.$emit('update-table');
        this.$store.dispatch('machine/getMachineInfo', this);
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.table-wrap {
  width: 100%;
  /deep/ .has-gutter {
    th {
      text-align: center;
    }
  }

  /deep/ .el-table__header {
    background-color: $color-bg-secondary;
  }

  .el-table__body {
    tr {
      text-align: center;
    }
  }
}
</style>
