<template>
  <div class="wrap">
    <div
      ref="searchItem"
      class="wrap-top">
      <div class="serach-item">
        <el-select
          v-model="formData.MachineID"
          placeholder="请选择闸机"
          @change="selectMachine">
          <el-option
            v-for="item in machineOptions"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>
        <el-input
          :disabled="!IsLeaguer"
          v-model="checkCount"
          class="check-input"
          placeholder="请输入过闸次数">
          <template slot="append">次</template>
        </el-input>
        <el-radio-group
          v-model="formData.IsOut"
          border
          @change="getAllByValueGates(true)">
          <el-radio :label="false">入闸</el-radio>
          <el-radio :label="true">出闸</el-radio>
        </el-radio-group>
        <el-radio-group
          v-model="IsLeaguer"
          class="is-member"
          border
          @change="resetSelect">
          <el-radio :label="true">会员验票</el-radio>
          <el-radio :label="false">散客验票</el-radio>
        </el-radio-group>
        <ych-read-card
          v-show="IsLeaguer"
          ref="CheckTicketReadCard"
          :auto-logout = "false"
          class="read-card"
          @change="readCardHandle"
          @logout="logoutHandle"/>
        <el-input
          v-show="!IsLeaguer"
          v-model="formData.TicketCode"
          :placeholder="fastTrack ? '请用扫码枪读取票码' : '请输入票码'"
          clearable
          class="code-input"
          @keyup.native.enter="getLgTicketsByMachine">
          <template
            v-if="!fastTrack"
            slot="append">
            <el-button
              type="primary"
              @click="getLgTicketsByMachine">搜索</el-button>
          </template>
        </el-input>
        <el-checkbox
          v-show="!IsLeaguer"
          v-model="fastTrack"
          class="fast-track">
          快速过闸
        </el-checkbox>
      </div>
    </div>
    <div class="wrap-main">
      <div class="main">
        <el-table
          ref="checkTable"
          :data="checkTableData"
          :height="isDialog ? 320 : tableHeight"
          :highlight-current-row = "true"
          style="width: 100%"
          border
          class="table-wrap"
          @row-click="selectRows">
          <el-table-column
            prop="SerialNumber"
            min-width="160"
            label="打印序号"/>
          <el-table-column
            prop="TicketName"
            min-width="180"
            label="套票"/>
          <el-table-column
            prop="ChargeModeType"
            label="类型"
            width="100"/>
          <el-table-column
            prop="BuyTime"
            label="购买时间"
            width="180"/>
          <el-table-column
            prop="PastDueTime"
            label="过期时间"
            width="180"/>
          <el-table-column
            prop="AllTimes"
            label="总次数"
            align="right"
            width="80"/>
          <el-table-column
            prop="UseTimes"
            label="已使用"
            align="right"
            width="80"/>
          <el-table-column
            prop="RemainTimesTxt"
            label="剩余次数"
            align="right"
            width="80"/>
          <el-table-column
            prop="LockRemainTimesTxt"
            label="冻结次数"
            align="right"
            width="80"/>
        </el-table>
        <div class="pagination-wrap">
          <p>无票时支持扣会员储值余额过闸</p>
          <div>
            <el-button
              :loading="activeLoading"
              :disabled="isCanActive"
              type="primary"
              @click="activeTicket">
              激活
            </el-button>
            <el-button
              :loading="checkLoading"
              type="primary"
              @click="isAutoCheckTicket">
              过闸
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'CheckTicketContent',
  components: {},
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        LeaguerID: '',
        MachineID: '',
        TicketCode: '',
        IsOut: false,
        IsLeaguer: false,
      },
      IsLeaguer: true,
      checkCount: 1,
      currentSelectRow: {},
      checkTableData: [],
      machineOptions: [],
      fastTrack: false,
      checkLoading: false,
      activeLoading: false,
      tableHeight: 0,
      xmlData: '',
    };
  },
  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
      checkInfo: state => state.game.checkInfo,
    }),
    isCanActive() {
      if (this.currentSelectRow && this.currentSelectRow.RemainID) {
        return false;
      }
      return true;
    },
  },
  watch: {
    pageHeight(val) {
      this.tableHeight = val - this.$refs.searchItem.clientHeight - 60;
    },
    pageWidth() {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 60;
    },
    IsLeaguer(val) {
      if (!val) this.checkCount = 1;
    },
  },
  activated() {
    this.getSaveTicketSet();
    this.$nextTick(() => {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 60;
    });
  },
  deactivated() {
    this.saveTicketSet();
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight - 60;
    });
    window.addEventListener('keyup', this.fastCheckTicket);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.fastCheckTicket);
  },
  methods: {
    ...mapMutations({
      setCheckMachineId: 'game/setCheckMachineId',
    }),
    selectMachine(val) {
      this.setCheckMachineId({ checkMachineId: val });
      this.getLgTicketsByMachine();
    },
    getSaveTicketSet() {
      this.formData.IsOut = this.checkInfo.IsOut;
      this.IsLeaguer = this.checkInfo.IsLeaguer;
      this.getAllByValueGates();
    },
    saveTicketSet() {
      const saveTicketInfo = {
        IsOut: this.formData.IsOut,
        IsLeaguer: this.IsLeaguer,
      };
      this.setCheckMachineId(saveTicketInfo);
    },
    autoRead() {
      this.$nextTick(() => {
        this.$refs.CheckTicketReadCard.onRead();
      });
    },
    fastCheckTicket(event) {
      if (!this.fastTrack || (this.$route.name !== 'check-ticket') || (event.keyCode !== 13) || this.IsLeaguer) return;
      const flag = this.getLgTicketsByMachine();
      flag && flag.then(() => {
        this.autoCheckTicket();
      });
    },
    logoutHandle() {
      this.formData.LeaguerID = '';
    },
    readCardHandle(data) {
      data && (this.formData.LeaguerID = data.ID || '');
      this.formData.LeaguerID && this.getLgTicketsByMachine();
    },
    resetSelect(val) {
      if (!val) {
        this.$refs.CheckTicketReadCard.logout();
      } else {
        this.formData.TicketCode = '';
      }
      this.checkTableData = [];
      this.currentSelectRow = {};
      this.getAllByValueGates(true);
    },
    // 根据项目获取可过闸套票
    getLgTicketsByMachine() {
      let message = '';
      if (this.IsLeaguer && !this.formData.LeaguerID) {
        message = '请读取会员!';
      } else if (!this.IsLeaguer && !this.formData.TicketCode) {
        message = '请输入票码!';
        this.formData.LeaguerID = '';
      } else if (!this.formData.MachineID) {
        message = '请选择闸机!';
      }
      if (message) {
        this.showMessageBox(message, 'warning');
        return false;
      }
      this.formData.IsLeaguer = this.IsLeaguer;
      return this.$api['game/machine/getLgTicketsByMachine'](this.formData).then((res) => {
        this.checkTableData = res.DataList;
        this.checkTableData.length > 0
        && this.$refs.checkTable.setCurrentRow(this.checkTableData[0]);
        [this.currentSelectRow = {}] = this.checkTableData;
        if (res.DataList.length === 0 && !this.IsLeaguer) {
          this.showMessageBox('无可用套票', 'warning');
        }
        return res.DataList;
      });
    },
    // 获取所有扣值闸机下拉
    getAllByValueGates(flag = false) {
      this.formData.MachineID = '';
      this.checkTableData = [];
      this.$api['game/machine/getAllByValueGates']({
        IsOut: this.formData.IsOut,
      }).then((res) => {
        this.machineOptions = res.DataList;
        const { checkMachineId } = this.checkInfo;
        const index = this.machineOptions.findIndex(item => item.Value === checkMachineId);
        this.formData.MachineID = index > -1 ? checkMachineId : '';
        if (flag) this.getLgTicketsByMachine();
      });
    },
    showMessageBox(info, boxType, time = 3000) {
      this.$message({
        message: info,
        type: boxType,
        duration: time,
      });
    },
    isAutoCheckTicket() {
      if (this.fastTrack && !this.IsLeaguer) {
        this.autoCheckTicket();
        return;
      }
      this.checkTicket();
    },
    checkTicket() {
      const postData = {
        CheckCount: this.checkCount,
        SaleLogID: this.currentSelectRow.SaleLogID || null,
      };
      if (!this.formData.MachineID) {
        this.showMessageBox('请选择闸机!', 'warning');
        return;
      }
      if (!this.IsLeaguer) {
        if (!this.formData.TicketCode) {
          this.showMessageBox('请输入票码!', 'warning');
          return;
        }
        const codeSubStr = this.formData.TicketCode.substring(this.formData.TicketCode.length - 3);
        const isPtTicket = ((this.formData.TicketCode.length > 36) && (codeSubStr === '_PT'));
        if (!this.currentSelectRow.RemainID && !isPtTicket) {
          this.showMessageBox('无可用套票!', 'warning');
          return;
        }
        if (isPtTicket) {
          postData.SaleLogID = null;
        }
        postData.CheckCount = 1;
      }
      if (this.IsLeaguer && !this.formData.LeaguerID) {
        this.showMessageBox('请读取会员卡!', 'warning');
        return;
      }
      if (this.IsLeaguer && !Number(this.checkCount)) {
        this.showMessageBox('请输入过闸次数!', 'warning');
        return;
      }
      this.formData.IsLeaguer = false;
      if (this.IsLeaguer && !this.checkTableData.length) {
        this.formData.IsLeaguer = true;
      }
      const formData = Object.assign({}, this.formData, postData);
      if (!this.checkTableData.length && this.IsLeaguer) {
        this.$confirm('没有套票将使用余额消费，是否消费', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.checkTicketFun(formData);
        }).catch(() => {});
        return;
      }
      this.checkTicketFun(formData);
    },
    checkTicketFun(formData) {
      this.checkLoading = true;
      this.$api['game/machine/checkTicket'](formData).then((res) => {
        this.checkLoading = false;
        if (!res.ConsumeSuccess) return;
        this.showMessageBox(`${res.Text1},${res.Text2}`, 'success', 5000);
        // this.getLgTicketsByMachine();
        if (this.IsLeaguer) {
          this.$refs.CheckTicketReadCard.logout();
        } else {
          this.formData.TicketCode = '';
        }
        this.checkTableData = [];
        this.currentSelectRow = {};
        res.PrintStyle && this.PrintStyle(res.PrintStyle);
      }, () => {
        this.checkLoading = false;
      });
    },
    PrintStyle(printInfo) {
      const printList = printInfo.split('\n') || [];
      printList.shift();
      printList.pop();
      this.xmlData = '';
      const PrintTemplateTop = `<?xml version="1.0" encoding="utf-8"?>
            <C w="413" f="N" h="300">
              `;
      let PrintTemplateBottom = '';
      if (printList.length > 0) {
        printList.forEach((item, index) => {
          if (index === 0) {
            PrintTemplateBottom += `<I x="80" y="15" w="100" h="22" r="0" n="店名" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${item}</I>`;
          } else {
            PrintTemplateBottom += ` <I x="12" y="${(index + 2) * 25}" w="100" h="22" r="0" n="支付方式" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${item}</I>
             `;
          }
        });
      }
      PrintTemplateBottom += '</C>';
      const self = this;
      this.xmlData = PrintTemplateTop + PrintTemplateBottom;
      this.$createPrintWebView({
        $props: {
          printType: 'receiptsPrint',
          XmlData: 'xmlData',
        },
        onComplete() {
          self.$message({
            message: '打印成功',
            type: 'success',
          });
        },
      });
    },
    activeTicket() {
      this.activeLoading = true;
      return this.$api['game/machine/activeTicket']({
        RemainID: this.currentSelectRow.RemainID,
      }).then(() => {
        this.activeLoading = false;
        this.showMessageBox('激活成功!', 'success');
        return this.getLgTicketsByMachine();
      }, () => {
        this.activeLoading = false;
      });
    },
    selectRows(row) {
      this.currentSelectRow = row;
      // this.autoCheckTicket();
    },
    autoCheckTicket() {
      if (this.currentSelectRow.RemainTimes) {
        this.checkTicket();
        return;
      }
      if (this.fastTrack && !this.formData.TicketCode && !this.IsLeaguer) {
        this.$message({
          message: '请读取票码',
          type: 'warning',
        });
        return;
      }
      if (!this.currentSelectRow.LockRemainTimes) return;
      const flag = this.activeTicket();
      flag && flag.then((res) => {
        res && this.checkTicket();
      });
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/styles/theme.scss";
.pagination-wrap {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: $color-white;
  border-top: solid 1px $border-color;
  box-sizing: border-box;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  button {
    width: 100px;
  }

  > p {
    font-size: $font-size-primary;
    color: $font-color-secondary;
  }
}

.wrap-main {
  width: 100%;
  overflow: hidden;
}

.wrap {
  width: 100%;
  background: $color-white;
  border-radius: $border-radius;
}
.wrap-top {
  display: flex;
  padding: 20px 20px 10px;
  .serach-item {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  /deep/ .el-radio-group {
    margin-right: 10px;
    flex: 0 0 180px;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-radio + .el-radio {
      margin-left: 15px;
    }
  }
  .is-member {
    flex: 0 0 200px;
  }
  .check-input {
    width: 180px;
    margin-right: 10px;
    /deep/ .el-input-group__append {
      color: $font-color-primary;
      padding: 0;
      width: 50px;
      &:hover {
        background-color: $color-bg-primary;
      }
    }
  }
  .code-input {
    width: 350px;
    margin-right: 10px;
    box-sizing: border-box;
    /deep/ .el-input__suffix {
      height: 40px;
    }
    /deep/ .el-input-group__append {
      background-color: $color-white;
      color: $color-primary;
      width: 98px;
      padding: 0;
      text-align: center;
      .el-button {
        width: 98px;
      }
      &:hover {
        background-color: $color-bg-table;
      }
    }
  }

  /deep/ .el-select {
    margin-right: 10px;
    margin-bottom: 10px;
    flex: 0 0 220px;
  }
  .fast-track {
    line-height: 40px;
    height: 40px;
    /deep/ .el-checkbox__label {
      color: $font-color-primary;
    }
  }
}

.read-card {
  flex: 0 0 200px;
  margin-right: 10px;
}
</style>
