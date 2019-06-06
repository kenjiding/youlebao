<template>
  <el-table
    ref="multipleTable"
    :data="printTicketList"
    :max-height="305"
    :border="true"
    class="print-ticket-form"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      align="center"
      type="selection"
      width="40"/>
    <el-table-column
      align="center"
      label="序号"
      width="70">
      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="ticketName"
      label="套票名称"/>
    <el-table-column
      v-if="accompanyTotalMax"
      align="center"
      label="陪同票"
      width="140">
      <template slot-scope="scope">
        <el-input-number
          :disabled="scope.row.maxNumber === 0 "
          :controls="false"
          :max="scope.row.maxNumber"
          v-model="scope.row.accompanyAmount"
          size="small"
          @focus="rowFocus($event)"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { sumBy } from 'lodash';

export default {
  name: 'SelectPrintTicket',

  props: {
    printing: {
      type: Boolean,
      default: false,
    },
    ticketList: {
      type: Array,
      default: () => [],
    },
    isReprint: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      printTicketList: [],
      printInfoList: [],
      ticketSelection: [],
      XMLData: '',
      printIndex: 0,
      accIndex: -1,
      errorInfo: '',
      // printing: false,
    };
  },

  computed: {
    accompanyTotalMax() {
      const sum = sumBy(this.printTicketList, 'maxNumber');
      return sum;
    },
  },

  methods: {
    onLoad() {
      this.printTicketList = [];
      for (let i = 0; i < this.ticketList.length; i++) {
        const currentTicket = this.ticketList[i];
        for (let j = 0; j < currentTicket.SellLogInfoList.length; j++) {
          if (currentTicket.SellLogInfoList[j].Status === 'UnUsed' ||
            currentTicket.SellLogInfoList[j].Status === 'InUse' ||
            currentTicket.SellLogInfoList[j].Status === 'Complete') {
            this.printTicketList.push({
              sellLogID: currentTicket.SellLogInfoList[j].SellLogID,
              ticketName: currentTicket.GoodsName,
              accompanyAmount: currentTicket.SellLogInfoList[j].RemainAccompany > 0 ? 1 : 0,
              maxNumber: currentTicket.SellLogInfoList[j].RemainAccompany,
            });
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleAllSelection();
      });
    },

    rowFocus(e) {
      e.currentTarget.select();
    },

    handleSelectionChange(val) {
      this.ticketSelection = val;
    },

    printLoop() {
      this.XMLData = '';
      if (this.printIndex === this.ticketSelection.length) {
        // 清除
        if (this.errorInfo) {
          this.$alert(`${this.errorInfo.substring(0, this.errorInfo.length - 1)}打印内容异常，请检查套票打印样式`, {
            confirmButtonText: '确定',
            type: 'error',
          });
        }
        this.$emit('update:printing', false);
        this.$emit('complete');
        // this.printing = false;
        return;
      }

      const currentPrint = this.ticketSelection[this.printIndex];
      const currentPrintInfo = this.printInfoList.filter(ticket =>
        ticket.SaleLogID === currentPrint.sellLogID);
      if (currentPrintInfo.length <= 0) {
        this.printLoop();
      }

      if (this.accIndex < 0) {
        this.XMLData = currentPrintInfo[0].MainPrint;
        this.accIndex++;
      } else if (this.accIndex === currentPrint.accompanyAmount
        || currentPrint.accompanyAmount === 0) {
        this.accIndex = -1;
        this.printIndex++;
        this.$nextTick(() => {
          this.printLoop();
        });
      } else {
        this.$nextTick(() => {
          this.XMLData = currentPrintInfo[0].AccompanyPrint;
          this.accIndex++;
        });
      }
    },

    submit() {
      const _this = this;

      if (_this.ticketSelection.length <= 0) {
        this.$message({
          message: '请选择需要打印的套票',
          type: 'warning',
        });
        return;
      }

      const url = this.isReprint ? 'getTicketsPrints' : 'getTicketsPrintsPrintInfo';
      this.$api[`sell/ticket/${url}`]({
        PackageTicketLogIDs: _this.ticketSelection.map(ticket => ticket.sellLogID),
      }).then((res) => {
        this.printInfoList = res.PrintTemplates;
        // this.printing = true;
        this.$emit('update:printing', true);
        this.$createPrintWebView({
          $props: {
            XmlData: 'XMLData',
            printType: 'ticketPrint',
          },
          onComplete() {
            // console.log('打印完成');
            _this.handlePrintComplete();
          },
          onCancel(err) {
            if (err === 'ContentError') {
              _this.errorInfo += `[${_this.ticketSelection[_this.printIndex].ticketName}]、`;
              _this.printLoop();
            } else {
            // console.log('打印取消');
            // _this.printLoop();
              _this.$emit('update:printing', false);
            }
          },
        });
        // 清除
        this.errorInfo = '';
        this.accIndex = -1;
        this.printIndex = 0;
        this.printLoop();
      }, () => {});
    },

    handlePrintComplete() {
      if (this.accIndex > 0) {
        this.$api['ticket/ticket/printPTforSuccessed']({
          SaleLogId: this.ticketSelection[this.printIndex].sellLogID,
        });
      }
      this.printLoop();
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .print-ticket {
    width: 620px;
    $two-px:2px;

    &-form {
      width: 620px;

      /deep/ .el-input-number {
        width: 80px;
      }

      /deep/ .el-input__inner {
        width: 80px;
      }
    }
  }

  .print-ticket-dialog {
    margin-bottom: 0;
    $two-px:2px;

    /deep/ .el-dialog__header {
      height: 50px;
      padding: 0;
      border-bottom: 1px $border-color solid;
    }

    /deep/ .el-dialog__title {
      padding-left: 30px;
      line-height: 50px;
      font-size: $color-bg-primary + $two-px;
      color: $font-color-regular;
    }

    /deep/ .el-dialog__body {
      padding: 20px;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      text-align: center;
      border-top: 1px $border-color solid;

      .el-button {
        width: 360px;
      }
    }
  }
</style>
