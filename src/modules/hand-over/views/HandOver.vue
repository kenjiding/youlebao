<template>
  <ych-page
    bg
    class="body-wrap">
    <div class="wrap">
      <el-card
        v-loading="loading"
        :body-style="{height: totalHeight + 'px'}"
        class="box-card">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-position="top"
          label-width="80px">
          <div class="hand-info">
            <div class="left-info">
              <div>
                <span>收银员：</span>
                <span>{{ userInfo.RealName }}</span>
              </div>
              <div>
                <span>账期：</span>
                <span>{{ moneyInputInfo.PeriodName }}</span>
              </div>
            </div>
            <el-form-item
              v-if="allOrderClassList.length"
              label="选择班次"
              prop="OrderClass">
              <el-select
                v-model="ruleForm.OrderClass"
                placeholder="请选择"
                class="drop-wrap"
                @change="getEmpMoneyInput">
                <el-option
                  v-for="item in allOrderClassList"
                  :key="item.Value"
                  :label="item.Text"
                  :value="item.Value"/>
              </el-select>
            </el-form-item>
          </div>
          <div
            :style="{'max-height': formHeight + 'px'}"
            class="top">
            <el-form-item
              v-for="item in moneyInputInfo.PayList"
              :key="item.ID">
              <div
                slot="label"
                class="label-info">
                <span class="type-title">{{ item.PayTypeName }}</span>
                <span
                  v-if="moneyInputInfo.IsShowSys"
                  class="num-value">
                  应收：￥{{ item.SysMoney }}
                </span>
              </div>
              <el-input-number
                v-model="item.RealMoney"
                :precision="2"
                :controls="false"
                placeholder="请输入金额"
                class="left-input"/>
              <el-input
                v-model="item.Summary"
                placeholder="请输入备注"
                class="common-input"/>
            </el-form-item>
          </div>
        </el-form>
        <div class="bottom">
          <el-button
            :loading="enterLoading"
            :disabled="!isValid"
            class='primary'
            type="primary"
            @click="saveHandOver">
            保存
          </el-button>
        </div>
      </el-card>
    </div>
  </ych-page>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HandOver',
  components: { },

  data() {
    return {
      ruleForm: {
        OrderClass: '',
        ListDto: [],
      },
      enterLoading: false,
      allOrderClassList: [],
      rules: {
        OrderClass: [
          {
            required: true, message: '请选择', trigger: 'blur',
          },
        ],
      },
      moneyInputInfo: '',
      xmlData: '',
      loading: false,
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.info,
      client: state => state.client,
    }),
    isValid() {
      if (this.allOrderClassList.length) {
        return !!this.ruleForm.OrderClass;
      }
      return true;
    },
    formHeight() {
      return this.totalHeight - 229;
    },
    totalHeight() {
      const oraginHieght = 690;
      return this.client.pageHeight > oraginHieght ? oraginHieght : (this.client.pageHeight - 20);
    },
    PeriodName() {
      return this.userInfo.PeriodName;
    },
  },
  watch: {
    PeriodName(val, oldVal) {
      if (val === oldVal) return;
      this.init();
    },
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.ruleForm.resetFields();
      this.getAllDropDownList().then(() => {
        this.getEmpMoneyInput();
      });
    },
    saveHandOver() {
      this.enterLoading = true;
      this.ruleForm.ListDto = this.moneyInputInfo.PayList;
      if (!this.allOrderClassList.length) {
        this.ruleForm.OrderClass = '0';
      }
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.$api['hand-over/dTOProBusinessAccoutDoneList/input'](this.ruleForm).then(() => {
          this.enterLoading = false;
          this.$message({
            message: '交班成功',
            type: 'success',
          });
          this.printHandOverInfo().then(() => {
            this.$refs.ruleForm.resetFields();
            this.getEmpMoneyInput();
          });
        }, () => {
          this.enterLoading = false;
        });
      });
    },
    printHandOverInfo() {
      this.xmlData = '';
      const PrintTemplateTop = `<?xml version="1.0" encoding="utf-8"?>
            <C w="413" f="N" h="500">
              <I x="100" y="20" w="100" h="22" r="0" n="票头" f="微软雅黑" s="Regular" si="14" t="TextItem">收银交账回执</I>
              <I x="12" y="55" w="100" h="22" r="0" n="交账时间" f="微软雅黑" s="Regular" si="14" t="TextItem">交账时间:</I>
              <I x="85" y="55" w="100" h="22" r="0" n="交账时间" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.$date().format('YYYY-MM-DD HH:mm:ss')}</I>
              <I x="12" y="75" w="100" h="22" r="0" n="账期" f="微软雅黑" s="Regular" si="14" t="TextItem">账期:</I>
              <I x="85" y="75" w="100" h="22" r="0" n="账期" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.moneyInputInfo.PeriodName || ''}</I>
              <I x="12" y="95" w="100" h="22" r="0" n="交账人" f="微软雅黑" s="Regular" si="14" t="TextItem">交账人:</I>
              <I x="85" y="95" w="100" h="22" r="0" n="交账人" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.userInfo.RealName || ''}</I>
              <I x="12" y="115" w="100" h="22" r="0" n="终端" f="微软雅黑" s="Regular" si="14" t="TextItem">操作终端</I>
              <I x="85" y="115" w="100" h="22" r="0" n="终端" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${this.userInfo.Termina.TerminalName || ''}</I>
              <I x="12" y="135" w="100" h="22" r="0" n="终端" f="微软雅黑" s="Regular" si="14" t="TextItem">----------------------------------------------</I>
            `;
      let paymentType = '';
      let PrintTemplateBottom = '';
      if (this.moneyInputInfo.PayList.length > 0) {
        this.moneyInputInfo.PayList.forEach((item, index) => {
          paymentType += `${item.PayTypeName}:${item.RealMoney}元，`;
          PrintTemplateBottom += ` <I x="12" y="${165 + index * 70}" w="100" h="22" r="0" n="支付方式" f="微软雅黑" s="Regular" si="14" t="TextItem">支付方式</I>
              <I x="85" y="${165 + index * 70}" w="100" h="22" r="0" n="支付方式" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${item.PayTypeName || ''}</I>
              <I x="12" y="${185 + index * 70}" w="100" h="22" r="0" n="支付金额" f="微软雅黑" s="Regular" si="14" t="TextItem">支付金额</I>
              <I x="85" y="${185 + index * 70}" w="100" h="22" r="0" n="支付金额" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${item.RealMoney || 0}</I>
              <I x="12" y="${205 + index * 70}" w="100" h="22" r="0" n="备注" f="微软雅黑" s="Regular" si="14" t="TextItem">备注</I>
              <I x="85" y="${205 + index * 70}" w="100" h="22" r="0" n="备注" f="微软雅黑" s="Regular" si="14" t="DynamicTextItem">${item.Summary || ''}</I>`;
        });
      }
      PrintTemplateBottom += '</C>';
      const self = this;
      return this.$confirm(`<span>交账记录保存成功！(${paymentType})</span><div>请确认是否要打印交账回执单</div>`, '提示', {
        confirmButtonText: '打印交账回执',
        cancelButtonText: '无需打印',
        type: 'warning',
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
      }).then(() => {
        this.xmlData = PrintTemplateTop + PrintTemplateBottom;
        // 调用打印组件
        this.$createPrintWebView({
          $props: {
            printType: 'receiptsPrint',
            XmlData: 'xmlData',
          },
          onComplete() {
            self.$message({
              message: '打印交账回执单成功',
              type: 'success',
            });
          },
        });
      }).catch(() => {
        console.log('quxiao ');
      });
    },
    getAllDropDownList() {
      return this.$api['hand-over/dTOProBusinessAccoutDoneList/getOrderClass']({
        IsIn: false,
      }).then((res) => {
        this.allOrderClassList = res.DataList;
        return res.DataList;
      });
    },
    getEmpMoneyInput() {
      this.loading = true;
      this.$api['hand-over/dTOProBusinessAccoutDoneList/getEmpMoneyInput']({
        OrderClass: this.ruleForm.OrderClass || '-1',
      }).then((res) => {
        this.moneyInputInfo = res;
        this.loading = false;
        if (!this.ruleForm.OrderClass && !!this.allOrderClassList.length) {
          this.moneyInputInfo.PayList.forEach((item) => {
            item.RealMoney = 0;
          });
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.box-card {
  width: 760px;
  // height: 690px;
  background-color: $color-bg-primary;
  margin: 0 auto;
  box-sizing: border-box;

  /deep/ .el-card__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    // height: 690px;
    overflow: hidden;
    .top {
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 20px 50px 0;
    }
    .bottom {
      display: flex;
      height: 60px;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border-top: 1px solid $border-color;
    }
    .el-form-item__label {
      color: $font-color-regular;
      padding: 0;
    }
  }
  // /deep/ .el-form {
  //   padding: 0 30px;
  // }
}
.label-info {
  display: inline-block;
}
.common-input {
  width: 320px;
}
.left-input {
  width: 320px;
  margin-right: 10px;
  /deep/ input {
    text-align: left;
  }
}
.type-title {
  color: $font-color-regular;
  font-size: $font-size-regular;
  margin-right: 10px;
}
.num-value {
  color: $font-color-currency;
  font-size: $font-size-primary;
}
.hand-info {
  display: flex;
  padding: 40px 60px 18px;
  justify-content: space-between;
  border-bottom: 1px solid $border-color;
  box-sizing: border-box;
  align-items: center;
}
.left-info {
  width: calc(100% - 330px);
  > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  span {
    font-size: $font-size-primary;
    color: $font-color-primary;
    display: inline-block;
    &:first-child {
      width: 70px;
      text-align: right;
    }
    &:last-child{
      width: calc(100% - 70px);
      font-size: $font-size-regular;
      color: $font-color-regular;
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
.primary {
  width: 320px;
  height: 40px;
  border-radius: $border-radius-small;
  box-sizing: border-box;
}

</style>
