<template>
  <div>
    <el-dialog
      :visible="inventorycionVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      class="dialog-wrap"
      title="清币"
      width="500px"
      @close="closeDialog">
      <el-form
        :model="formLabelAlign"
        label-position="right"
        label-width="120px">
        <el-form-item label="设备名称:">
          <el-input
            v-model="coinTerName"
            disabled/>
        </el-form-item>
        <el-form-item label="库存币数:">
          <el-input
            v-model="surplusAmount"
            disabled/>
        </el-form-item>
        <el-form-item label="实际清点币数:">
          <el-input
            v-model.number="formLabelAlign.clearNum"
            type="number"
            placeholder="请输入内容">
            <template
              :slot="clearButton ? 'append' : ''">
              <el-button
                type="success"
                @click="inventoryCoin">设备清币</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="formLabelAlign.Remarks"/>
        </el-form-item>
      </el-form>
      <div class="tipsText">
        <p>1、请在【实际清点币数】中输入该设备实际清点出来的实物币数量</p>
        <p>2、请将清点好的实物币全部倒回原设备</p>
      </div>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          :loading="clearLoading"
          type="primary"
          @click="determine">确 定</el-button>
      </div>
    </el-dialog>
    <CoinInventory
      :animation-visible.sync="animationVisible"
      :out-coin-num="surplusAmount"
      @clear-complete="(val) => formLabelAlign.clearNum = val"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import CoinInventory from './CoinInventory.vue';

export default {
  name: 'InventoryCoinDialog',

  components: {
    CoinInventory,
  },

  props: {
    inventorycionVisible: {
      type: Boolean,
      default: false,
    },
    machineData: {
      type: Object,
      default: () => ({}),
    },
    clearButton: {
      type: Boolean,
      default: true,
    },
    setting: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      formLabelAlign: {
        Remarks: '',
        clearNum: null,
      },
      animationVisible: false,
      clearLoading: false,
    };
  },

  computed: {
    ...mapState({
      machineInfo: state => state.machine.machineInfo,
      machineID: state => state.machine.machineID,
    }),

    coinTerName() {
      return this.machineData.TerminalName ?
        this.machineData.TerminalName : this.machineInfo.CoinTerStateName;
    },

    surplusAmount() {
      if (this.machineData.Amount || this.machineData.Amount === 0) {
        return this.machineData.Amount;
      }
      return this.machineInfo.Amont;
    },
  },

  methods: {
    closeDialog() {
      // this.$emit('update:inventorycionVisible', false);
      this.$emit('closeDialog');

      this.formLabelAlign.clearNum = null;
      this.formLabelAlign.Remarks = '';
    },

    determine() {
      if (!this.formLabelAlign.clearNum && this.formLabelAlign.clearNum !== 0) {
        this.$message({
          showClose: true,
          message: '清币数不能为空',
          type: 'warning',
        });
        return;
      }

      this.clearLoading = true;

      let apiUrl = '';
      apiUrl = this.setting ? 'physicalCoin/physicalCoinStockClearCoinEx' : 'physicalCoin/physicalCoinStockClearCoin';

      this.$api[apiUrl]({
        TerminalID: this.machineData.TerminalID ?
          this.machineData.TerminalID : this.machineInfo.BindCoinTerID,
        Summary: this.formLabelAlign.Remarks,
        StockID: this.machineData.StockID ?
          this.machineData.StockID : this.machineInfo.StockID,
        StockAmount: this.formLabelAlign.clearNum,
      }).then(() => {
        this.clearLoading = false;

        this.$message({
          message: '清币成功',
          type: 'success',
        });
        // this.$emit('update:inventorycionVisible', false);
        this.$emit('closeDialog');
        this.$emit('success');

        // 更新售币机状态信息
        this.$store.dispatch('machine/getMachineInfo', this);
      }, () => { this.clearLoading = false; });
    },

    inventoryCoin() {
      console.log(this.surplusAmount, 2222);
      this.animationVisible = true;
    },
    handleClose() {},
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.tipsText {
  padding: 0 20px;
  line-height: 20px;
  color: $font-color-placeholder;
}
.dialog-wrap {
  /deep/ .el-dialog__body {
    padding: 30px 40px 30px 0;
  }

  /deep/ .el-input-group__append {
    color: $color-primary;
  }

  /deep/ .dialog-footer {
    text-align: center;

    .el-button--primary {
      width: 360px !important;
    }
  }
}
</style>
