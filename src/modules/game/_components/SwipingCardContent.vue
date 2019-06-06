<template>
  <div class="wrap">
    <el-card
      class="box-card">
      <div class="info-img">
        <img src="../../../assets/card.png">
      </div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        label-width="80px">
        <el-form-item
          label="选择扣费项目"
          prop="MachineID">
          <el-select
            v-model="ruleForm.MachineID"
            placeholder="选择扣费项目"
            clearable
            filterable
            class="drop-wrap"
            @change="selectMachine">
            <el-option
              v-for="item in machineList"
              :key="item.ID"
              :label="item.MachineName"
              :value="item.ID"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择扣费数量"
          prop="Button">
          <div
            v-if="!ruleForm.MachineID"
            class="empty-value">—</div>
          <template v-else>
            <div
              v-if="payByCardInfo.IsTicket"
              class="ticket-times">
              <span>1</span>
              <span>&nbsp;&nbsp;次</span>
            </div>
            <el-radio-group
              v-else
              v-model="ruleForm.Button"
              class="fee-button">
              <el-radio-button
                label="1">
                <div class="number">{{ feePrecept.ValueInPerTime }}</div>
                <div class="unit">{{ feePrecept.ValueType }}</div>
              </el-radio-button>
              <el-radio-button
                v-if="feePrecept.ValueInPerTime2"
                label="2">
                <div class="number">{{ feePrecept.ValueInPerTime2 }}</div>
                <div class="unit">{{ feePrecept.ValueType }}</div>
              </el-radio-button>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item
          key="LeaguerID"
          label="会员"
          class="read-card"
          prop="LeaguerID">
          <ych-read-card
            ref="MachineReadCard"
            :auto-logout = "false"
            @change="handleReadLeaguer"
            @logout="clearData"/>
        </el-form-item>
        <div
          v-if="!isPayByCardInfo"
          class="empty-info">—</div>
        <div
          v-else
          class="leaguer-info-main">
          <div
            v-if="payByCardInfo.IsTicket"
            class="info-content">
            <div class="leaguer-name">
              {{ payByCardInfo.TicketName }}
            </div>
            <div>
              <span>{{ payByCardInfo.TicketRaminText }} </span>
            </div>
            <div>
              <span>有效日期:&nbsp;&nbsp; </span>
              <span>{{ payByCardInfo.EffectiveTime }}</span>
            </div>
          </div>
          <div
            v-else
            class="lg-values">
            <span> {{ payByCardInfo.ReaminText }} </span>
          </div>
        </div>
        <el-button
          :loading="enterLoading"
          :disabled="!isPayByCardInfo"
          class='primary'
          type="primary"
          @click="swipingCard">
          刷卡扣费
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'SwipingCardContent',
  components: {
  },

  data() {
    return {
      ruleForm: {
        MachineID: '',
        LeaguerID: '',
        Button: '1',
      },
      enterLoading: false,
      machineList: [],
      rules: {
        MachineID: [
          {
            required: true, message: '请选择扣费项目', trigger: 'blur',
          },
        ],
        LeaguerID: [
          { required: true, message: '请读卡' },
        ],
      },
      feePrecept: {
        ValueInPerTime: 0,
        ValueInPerTime2: 10,
        ValueType: '',
      },
      payByCardInfo: {
        EffectiveTime: '',
        IsTicket: false,
        ReaminText: '',
        TicketName: '',
        TicketRaminText: '',
        LgLevelName: '',
      },
      xmlData: '',
      leaguerInformation: {},
      ticketPrintInfo: {},
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.info,
      machineId: state => state.game.swipingCardMachineId,
    }),
    isPayByCardInfo() {
      return !!((this.ruleForm.LeaguerID && this.ruleForm.MachineID));
    },
    deductionType() {
      return this.ruleForm.Button === '1' ? this.feePrecept.ValueInPerTime : this.feePrecept.ValueInPerTime2;
    },
  },

  created() {
    this.getMachineList();
    this.getTicketPrintInfo();
  },

  methods: {
    ...mapMutations({
      setswipingCardMachineId: 'game/setswipingCardMachineId',
    }),
    selectMachine(value) {
      this.setswipingCardMachineId(value);
      this.getMachineUseValues(value);
    },
    getMachineUseValues(value) {
      this.$api['game/machine/getMachineUseValues']({
        MachineID: value,
      }).then((res) => {
        this.feePrecept = res;
        this.getPayByCardInfo();
      });
    },
    autoRead() {
      this.$nextTick(() => {
        this.$refs.MachineReadCard.onRead();
      });
    },
    clearRead() {
      this.$refs.MachineReadCard.logout();
    },
    searchMachineLabel() {
      return this.machineList.find(value => value.ID === this.ruleForm.MachineID);
    },
    getTicketPrintInfo() {
      this.$api['game/dTOProBusinessAccoutDoneList/getTicketPrintInfo']().then((res) => {
        this.ticketPrintInfo = res;
      });
    },
    swipingCard() {
      if (!this.feePrecept.ValueInPerTime) {
        this.$message({
          message: '刷卡失败：每局消费值为0，不能刷卡！',
          type: 'warning',
        });
        return;
      }
      this.enterLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.$api['game/machine/payByCard'](this.ruleForm).then((res) => {
          this.enterLoading = false;
          if (!res.ConsumeSuccess) return;
          this.xmlData = '';
          let PrintTemplateTop = `<?xml version="1.0" encoding="utf-8"?>
            <C w="413" f="N" h="300">
              <I x="100" y="17" w="100" h="22" r="0" n="票头" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.ticketPrintInfo.TicketHead}</I>
              <I x="12" y="50" w="100" h="22" r="0" n="会员" f="微软雅黑" s="Regular" si="14" t="TextItem">会员:</I>
              <I x="85" y="50" w="100" h="22" r="0" n="会员" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.leaguerInformation.RealName || ''}</I>
              <I x="11" y="75" w="100" h="22" r="0" n="时间" f="微软雅黑" s="Regular" si="14" t="TextItem">时间:</I>
              <I x="85" y="75" w="100" h="22" r="0" n="时间" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.$date().format('YYYY-MM-DD HH:mm:ss')}</I>
              <I x="13" y="100" w="100" h="22" r="0" n="项目" f="微软雅黑" s="Regular" si="14" t="TextItem">项目:</I>
              <I x="85" y="100" w="100" h="22" r="0" n="项目" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.searchMachineLabel().MachineName}</I>
              `;
          const PrintTemplateBottom = `<I x="12" y="175" w="100" h="22" r="0" n="操作人" f="微软雅黑" s="Regular" si="14" t="TextItem">操作人:</I>
              <I x="85" y="175" w="100" h="22" r="0" n="会员" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.userInfo.RealName}</I>
              <I x="11" y="200" w="100" h="22" r="0" n="操作终端" f="微软雅黑" s="Regular" si="14" t="TextItem">操作终端:</I>
              <I x="85" y="200" w="100" h="22" r="0" n="时间" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.userInfo.Termina.TerminalName}</I>
              <I x="11" y="225" w="100" h="22" r="0" n="项目" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.userInfo.MallName}</I>
              <I x="35" y="245" w="100" h="22" r="0" n="票尾" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.ticketPrintInfo.TicketTail}</I>
              </C>`;
          let valueType = '';
          let reaminText = '';
          if (res.IsTicket) {
            valueType = res.TicketName;
            reaminText = res.TicketRaminText;
            PrintTemplateTop += `<I x="13" y="125" w="100" h="22" r="0" n="票名" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${res.TicketName}</I>
              <I x="13" y="150" w="100" h="22" r="0" n="剩余次数" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${res.TicketRaminText}</I>`;
          } else {
            valueType = res.ConsumeText;
            reaminText = res.ReaminText;
            PrintTemplateTop += `<I x="13" y="125" w="100" h="22" r="0" n="票名" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${res.ConsumeText}</I>
              <I x="13" y="150" w="100" h="22" r="0" n="剩余次数" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${res.ReaminText}</I>`;
          }
          this.$alert(`<div>${valueType}</div><div>${reaminText}</div>`, '提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            callback: () => {
              this.xmlData = PrintTemplateTop + PrintTemplateBottom;
              // 调用打印组件
              this.$createPrintWebView({
                $props: {
                  printType: 'receiptsPrint',
                  XmlData: 'xmlData',
                },
                onComplete() {
                  console.log('打印完成');
                },
              });
              this.$message({
                message: '刷卡扣费成功',
                type: 'success',
              });
            },
          });

          this.$refs.MachineReadCard.logout();
          // this.$refs.ruleForm.resetFields();
          this.payByCardInfo.IsTicket = false;
        }, () => {
          this.enterLoading = false;
        });
      });
    },
    handleReadLeaguer(leaguer) {
      this.leaguerInformation = leaguer || {};
      this.ruleForm.LeaguerID = this.leaguerInformation.ID || '';
      this.getPayByCardInfo();
    },
    getPayByCardInfo() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.$api['game/machine/getPayByCardInfo']({
          MachineID: this.ruleForm.MachineID,
          LeaguerID: this.ruleForm.LeaguerID,
        }).then((res) => {
          this.payByCardInfo = res;
        });
      });
    },
    getMachineList() {
      this.$api['game/machine/getMachineHasProtList']().then((res) => {
        this.machineList = res.DataList;
        this.ruleForm.MachineID = this.machineId || '';
        if (this.ruleForm.MachineID) this.getMachineUseValues(this.ruleForm.MachineID);
      });
    },
    clearData() {
      this.ruleForm.LeaguerID = '';
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.box-card {
  width: 800px;
  height: 580px;
  background-color: $color-bg-primary;
  margin: 0 auto;
  box-sizing: border-box;

  /deep/ .el-card__body {
    height: 100%;
    padding: 30px 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .el-input__suffix {
      margin-right: 10px;
      cursor: pointer;
    }

    .el-form-item__label {
      color: $font-color-regular;
      padding: 0;
      line-height: $font-size-regular;
    }
  }
}
.wrap {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}
.drop-wrap {
  width: 320px;
}
.read-card {
  width: 320px;
}
.empty-value {
  width: 320px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-table;
  color: $font-color-regular;
  border: 1px solid $border-color;
  box-sizing: border-box;
}
.empty-info {
  width: 320px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-table;
  color: $font-color-regular;
  border: 1px solid $border-color;
  box-sizing: border-box;
}
.primary {
  display: block;
  width: 320px;
  height: 40px;
  margin-top: 20px;
  border-radius: $border-radius-small;
  box-sizing: border-box;
}
.info-img {
  width: 200px;
  height: 200px;
  margin-left: 65px;
  img {
    width: 200px;
    height: 200px;
  }
}
.ticket-times {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  width: 320px;
  border: 1px solid $border-color;
  border-radius: $border-radius-small;
  span {
    color: $color-primary;
    font-size: $font-size-secondary;
    &:last-child {
      color: $font-color-placeholder;
      font-size: $font-size-primary;
    }
  }
}
.fee-button {
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  /deep/ .el-radio-button {
    &__inner {
      display: flex;
      flex-flow: column;
      justify-content: center;
      width: 150px;
      height: 120px;
      padding: 12px 14px 22px;
      border-radius: $border-radius-small;
      background-color: $color-white;
      color: $font-color-placeholder;
      border-left: 1px solid $border-color;
      .number {
        font-size: $font-size-secondary;
        color: $font-color-regular;
        margin-bottom: 10px;
        @include ellipsis(1)
      }
      .unit {
        font-size: $font-size-primary;
      }
    }
  }
  /deep/ .is-active {
    .el-radio-button__inner {
      border-left: 1px solid $color-primary!important;
      box-shadow: none;
      .number {
        color: $color-primary;
      }
    }
  }
}
.leaguer-info {
  &-main {
    width: 320px;
    height: 140px;
    padding: 20px 0 20px 20px;
    border: 1px solid $border-color;
    background-color: $color-white;
    box-sizing: border-box;
    display: flex;
    flex: row nowrap;
    overflow: hidden;
    .lg-values {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      span {
        color: $font-color-primary;
        font-size: $font-size-primary;
      }
    }
    .info-content {
      display: flex;
      flex-flow: column wrap;
      justify-content: space-around;
      overflow: hidden;
      > div {
        font-size: $font-size-regular;
        color: $font-color-primary;
        display: flex;
        span {
          font-size: $font-size-primary;
        }
        .times {
          color: $color-warning!important;
        }
      }
    }
  }
}

</style>
