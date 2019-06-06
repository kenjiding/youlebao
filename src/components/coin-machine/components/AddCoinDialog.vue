<template>
  <div>
    <el-dialog
      :visible="addcionVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      :close-on-press-escape="false"
      class="dialog-wrap"
      title="加币"
      width="500px"
      @close="closeDialog">
      <el-form
        label-position="right"
        label-width="120px">
        <el-form-item label="设备名称:">
          <el-input
            :value="machineData.TerminalName ?
            machineData.TerminalName :machineInfo.CoinTerStateName"
            disabled/>
        </el-form-item>
        <el-form-item label="加币数量:">
          <el-input v-model="Num"/>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="Remarks"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          :loading="addLoading"
          type="primary"
          @click="addMethods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: '',

  props: {
    addcionVisible: {
      type: Boolean,
      default: false,
    },
    machineData: {
      type: Object,
      default: () => ({}),
    },
    setting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Remarks: '',
      Num: '',
      addLoading: false,
    };
  },

  computed: {
    ...mapState({
      machineInfo: state => state.machine.machineInfo,
      machineID: state => state.machine.machineID,
    }),
  },

  created() {},

  methods: {
    closeDialog() {
      this.$emit('update:addcionVisible', false);
      this.Num = '';
      this.Remarks = '';
    },
    addMethods() {
      if (!this.Num) {
        this.$message({
          showClose: true,
          message: '添加的币数不能为空或者0',
          type: 'warning',
        });
        return;
      }

      this.addLoading = true;

      let apiUrl = '';
      apiUrl = this.setting ? 'physicalCoin/physicalCoinStockAddCoinEx' : 'physicalCoin/physicalCoinStockAddCoin';

      this.$api[apiUrl]({
        TerminalID: this.machineData.TerminalID ?
          this.machineData.TerminalID : this.machineInfo.BindCoinTerID,
        Summary: this.Remarks,
        StockID: this.machineData.StockID ?
          this.machineData.StockID : this.machineInfo.StockID,
        Amount: this.Num,
      }).then(() => {
        this.$store.commit('machine/changeOutCoinNum', this.Num);
        this.$message({
          message: '加币成功',
          type: 'success',
        });
        this.addLoading = false;
        this.$emit('update:addcionVisible', false);

        if (this.machineID) {
          // 如果是新设备，更新售币机状态信息
          this.$store.dispatch('machine/getMachineInfo', this);
        } else {
          this.$emit('success');
        }
      }, () => { this.addLoading = false; });
    },
    handleClose() {},
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

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
