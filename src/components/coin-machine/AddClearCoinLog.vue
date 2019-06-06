<template>
  <el-dialog
    :visible="logIndexVisible"
    :append-to-body="true"
    title="加币清币记录"
    width="890px"
    height="300"
    class="dialog"
    @close="$emit('update:logIndexVisible', false)">
    <div class="wrap">
      <div
        v-for="item in logData"
        :key="item.TerminalID"
        class="box">
        <p class="box-top">
          <span>{{ item.TerminalName }}</span>
          <span
            @click="logHandle(item)">详情</span>
        </p>
        <p class="box-middle">{{ item.TerminalTypeName }}</p>
        <p class="box-bottom">
          <span
            :class="{textColor: item.Amount < 1}"
          >{{ item.Amount }}</span>个余币
        </p>
        <div class="box-button">
          <el-button
            type="primary"
            plain
            @click="addCoin(item)">加币</el-button>
          <el-button
            type="primary"
            plain
            @click="clearCoin(item)">
            清币</el-button>
        </div>
      </div>
    </div>

    <logTable
      :log-table-visible.sync="logTableVisible"
      :item-log-data="itemLogData"/>
    <!-- <InventoryCoinDialog
      :inventorycion-visible.sync="inventoryCionVisible"
      :machine-data="machineData"/> -->
    <AddCoinDialog
      :addcion-visible.sync="addcionVisible"
      :machine-data="addMachineData"
      @success="getLogData"/>
  </el-dialog>
</template>

<script>
import logTable from './components/LogTable.vue';
import CoinInventory from './components/CoinInventory.vue';
import AddCoinDialog from './components/AddCoinDialog.vue';
import InventoryCoinDialog from './components/InventoryCoinDialog.vue';

export default {
  name: '',
  components: {
    logTable,
    AddCoinDialog,
    CoinInventory,
    InventoryCoinDialog,
  },

  props: {
    logIndexVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      logTableVisible: false,
      logData: [],
      inventoryCionVisible: false,
      addcionVisible: false,
      machineData: {},
      addMachineData: {},
      itemLogData: {},
    };
  },

  watch: {
    logIndexVisible(val) {
      if (!val) return;
      this.getLogData();
    },
  },
  created() {
    this.getLogData();
  },

  methods: {
    addCoin(item) {
      this.addcionVisible = true;
      this.addMachineData = item;
    },
    clearCoin(item) {
      const _this = this;
      this.inventoryCionVisible = true;
      this.$createInventoryCoinDialog({
        $props: {
          inventorycionVisible: 'inventoryCionVisible',
          machineData: item,
          clearButton: false,
        },
        $events: {
          success() {
            _this.getLogData();
          },
          closeDialog() {
            _this.inventoryCionVisible = false;
          },
        },
      });
    },

    getLogData() {
      this.$api['physicalCoin/getAllStockPhysicalCoinList']().then((res) => {
        this.logData = res.DataList;
      });
    },
    logHandle(item) {
      this.itemLogData = item;
      this.logTableVisible = true;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.textColor {
  color: $color-danger !important;
}

.dialog {
  /deep/ .el-dialog__body {
    height: 500px;
    overflow: auto;
  }
}

.wrap {
  display: flex;
  flex-wrap: wrap;
}

.box {
  width: 270px;
  height: 180px;
  margin: 0 10px 10px 0;
  border: 1px solid $border-color;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 -1px 15px 0 rgba(0, 0, 0, .1);
  }

  &-top {
    height: 30px;
    line-height: 30px;
    padding: 10px 10px 0;
    /* box-sizing: border-box; */

    span {
      display: inline-block;
      font-size: $font-size-regular;
      width: 80%;

      @include ellipsis(1);

      &:nth-child(2) {
        font-size: $font-size-primary;
        color: $color-primary;
        width: 20%;
        text-align: right
      }
    }
  }

  &-middle {
    padding: 0 10px;
    color: $font-color-placeholder;
    font-size: $font-size-primary;
    height: 20px;
    line-height: 20px;
  }

  &-bottom {
    padding: 5px 10px;
    color: $font-color-placeholder;
    height: 50px;
    line-height: 50px;

    span {
      font-size: $font-size-secondary;
      color: $font-color-regular;
    }
  }

  &-button {
    height: 58px;
    line-height: 58px;
    background-color: $color-bg-secondary;
    text-align: center;

    /deep/ .el-button {
      width: 100px;
    }
  }
}
</style>
