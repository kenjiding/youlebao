<template>
  <div class="content">
    <div class="top">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-position="right"
        label-width="95px">
        <el-form-item
          label="支出分类："
          prop="OtherInOutMoney">
          <el-select
            v-model="ruleForm.OtherInOutMoney"
            placeholder="请选择分类"
            clearable
            class="drop-wrap"
            @change="checkValid">
            <el-option
              v-for="item in allOtherInOutMoneyList"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="单据号："
          prop="Number">
          <el-input
            v-model="ruleForm.Number"
            placeholder="请输入单据号"
            @input="checkValid"/>
        </el-form-item>
        <el-form-item
          label="支出金额："
          prop="Amount">
          <el-input
            v-model="ruleForm.Amount"
            placeholder="请输入金额"
            class="money-input"
            @input="checkValid"/>
        </el-form-item>
        <el-form-item
          label="支付方式："
          prop="PayTypeID">
          <el-select
            v-model="ruleForm.PayTypeID"
            placeholder="请选择"
            clearable
            class="drop-wrap"
            @change="checkValid">
            <el-option
              v-for="item in payTypeDropList"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="Summary">
          <el-input
            v-model="ruleForm.Summary "
            maxlength="128"
            placeholder="请输入"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom">
      <el-button
        :loading="enterLoading"
        :disabled="!isValid"
        class='primary'
        type="primary"
        @click="saveExpenses">
        保存
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'OtherExpensesContent',
  components: { },

  data() {
    return {
      ruleForm: {
        OtherInOutMoney: '',
        Number: this.$date().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 900 + 100),
        Amount: '',
        Summary: '',
        PayTypeID: '',
      },
      enterLoading: false,
      allOtherInOutMoneyList: [],
      payTypeDropList: [],
      rules: {
        OtherInOutMoney: [
          {
            required: true, message: '请选择支出方式', trigger: 'blur',
          },
        ],
        Number: [
          { required: true, message: '请输入单据号' },
        ],
        Amount: [
          {
            validator: this.CheckPrice, trigger: 'change',
          },
        ],
        PayTypeID: [
          {
            required: true, message: '请选择支付方式', trigger: 'blur',
          },
        ],
      },
      isValid: false,
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.info,
    }),
  },
  created() {
    this.getAllDropDownList();
  },
  activated() {
    this.resetForm();
  },
  methods: {
    CheckPrice(rule, value, callback) {
      const msg = '请输入大于0的数字(包含两位小数)';
      if (value === '') {
        return callback(new Error('请输入金额'));
      }
      const dot = value.toString().indexOf('.');
      if (dot !== -1) {
        const dotCnt = value.toString().substring(dot + 1, value.toString().length);
        if (dotCnt.length > 2) {
          return callback(new Error(msg));
        }
      }
      if (/^\d+(\.\d+)?$/i.test(value)) {
        if (value <= 0) return callback(new Error(msg));
      } else {
        return callback(new Error(msg));
      }
      return callback();
    },
    saveExpenses() {
      this.enterLoading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.$api['hand-over/dTOProBusinessAccoutDoneList/otherOutMoneyLogPost'](this.ruleForm).then(() => {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
          this.resetForm();
        }, () => {
          this.enterLoading = false;
        });
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.Number = this.$date().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 900 + 100);
      this.enterLoading = false;
      this.isValid = false;
    },
    checkValid() {
      this.$refs.ruleForm.validate((valid) => {
        this.isValid = valid;
      });
    },
    getAllDropDownList() {
      this.$api['hand-over/dTOProBusinessAccoutDoneList/getAllOtherInOutMoney']({
        IsIn: false,
      }).then((res) => {
        this.allOtherInOutMoneyList = res.DataList;
      });
      this.$api['hand-over/dTOProBusinessAccoutDoneList/getPayTypeDropWithExclude']({
        ExcludePayKind: '2,9,10',
        IsShowInClient: true,
        TerminalID: this.userInfo.Termina.TerminalId,
      }).then((res) => {
        this.payTypeDropList = res.DataList;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  height: 440px;
  overflow: hidden;
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
.money-input {
  width: 320px;
  /deep/ input {
    text-align: left;
  }
}
.top {
  padding: 40px 40px 0 45px;
}
.bottom {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
  border-top: 1px solid $border-color;
}
.el-form-item__label {
  color: $font-color-regular;
  padding: 0;
}
</style>
