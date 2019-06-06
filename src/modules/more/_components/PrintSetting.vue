<template>
  <el-dialog
    :visible="printDialogVisible"
    :close-on-click-modal="false"
    title="打印设置"
    class="setting-dialog"
    width="500px"
    @close="close">
    <el-form
      ref="printForm"
      :model="printForm"
      label-position="right"
      label-width="108px">
      <el-form-item
        label="小票打印机："
        prop="receiptsPrint">
        <el-select
          key="receiptsPrint"
          v-model="printForm.receiptsPrint"
          placeholder="请选择"
          clearable
          class="drop-wrap">
          <el-option
            v-for="item in printList"
            :key="item.name"
            :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="小票打印比例："
        prop="receiptsScale">
        <el-input-number
          v-model="printForm.receiptsScale"
          :precision="2"
          :controls="false"
          placeholder="请输入打印比例"
          class="scale-input"/>
        <span class="percent">%</span>
      </el-form-item>
      <el-form-item
        label="套票打印机："
        prop="ticketPrint">
        <el-select
          key="ticketPrint"
          v-model="printForm.ticketPrint"
          placeholder="请选择"
          clearable
          class="drop-wrap">
          <el-option
            v-for="item in printList"
            :key="item.name"
            :label="item.name"
            :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="腕带打印机："
        prop="rfidPrint">
        <el-select
          key="rfidPrint"
          v-model="printForm.rfidPrint"
          placeholder="请选择"
          clearable
          class="drop-wrap">
          <el-option
            v-for="item in printList"
            :key="item.name"
            :label="item.name"
            :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="会员卡打印机："
        prop="memberPrint">
        <el-select
          key="memberPrint"
          v-model="printForm.memberPrint"
          placeholder="请选择"
          clearable
          class="drop-wrap">
          <el-option
            v-for="item in printList"
            :key="item.name"
            :label="item.name"
            :value="item.name"/>
        </el-select>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        type="primary"
        @click="saveSetting">
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script type="text/javascript">
// eslint-disable-next-line
import { ipcRenderer } from 'electron';

export default {
  name: 'PrintSetting',
  props: {
    printDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      printForm: {
        receiptsPrint: '',
        receiptsScale: 0,
        ticketPrint: '',
        rfidPrint: '',
        memberPrint: '',
      },
      printList: [],
    };
  },
  computed: { },
  watch: {
    printDialogVisible(newValue) {
      if (newValue) {
        ipcRenderer.send('getPrinterList');
        ipcRenderer.once('getPrinterList', (event, data) => {
          this.printList = data;
        });
        // this.printList = this.$webContents.getPrinters();
        Object.assign(this.printForm, this.$electronStore.get('printForm') || {});
      }
    },
  },
  mounted() {},
  methods: {
    saveSetting() {
      this.$electronStore.set('printForm', this.printForm);
      this.$message({
        message: '保存成功',
        type: 'success',
      });
      this.$emit('update:printDialogVisible', false);
    },
    close() {
      this.$emit('update:printDialogVisible', false);
      this.$refs.printForm.resetFields();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';
.setting-dialog {
  $two-font: 2px;
  /deep/ .el-dialog {
    border-radius: $border-radius;
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid $border-color;
    padding: 14px 20px 14px 30px;
    height: 50px;
    box-sizing: border-box;
  }
  /deep/ .el-dialog__headerbtn {
    top: 9px;
    font-size: $font-size-regular + $two-font;
  }
  /deep/ .el-form-item__label {
    color: $font-color-primary;
    font-size: $font-size-primary;
    padding: 0;
  }
  /deep/ .el-dialog__body {
    padding: 20px 43px 20px 23px;
    height: 330px;
  }
  /deep/ .el-dialog__footer {
    padding: 0;
  }
}
.scale-input {
  width: 280px;
}
.percent {
  width: 40px;
  display: inline-block;
  text-align: center;
  color: $font-color-regular;
  font-size: $font-size-primary;
}
.drop-wrap {
  width: 320px;
}
.dialog-footer {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-top: 1px solid $border-color;
  /deep/ .el-button--primary {
    width: 320px;
    height: 40px;
    border-radius: $border-radius-small;
    box-sizing: border-box;
  }
}
</style>
