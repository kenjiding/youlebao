<template>
  <el-dialog
    :visible="passWordDialogVisible"
    :close-on-click-modal="false"
    title="修改密码"
    class="setting-dialog"
    width="500px"
    @close="close">
    <el-form
      ref="pwdForm"
      :model="pwdForm"
      :rules="rules"
      label-position="right"
      label-width="108px">
      <el-form-item
        label="原密码："
        prop="OldPassWord">
        <el-input
          v-model="pwdForm.OldPassWord"
          type="password"
          placeholder="请输入原密码"/>
      </el-form-item>
      <el-form-item
        label="新密码："
        prop="NewPassword">
        <el-input
          v-model="pwdForm.NewPassword"
          type="password"
          placeholder="请输入新密码"/>
      </el-form-item>
      <el-form-item
        label="确认新密码："
        prop="confirmPwd">
        <el-input
          v-model="pwdForm.confirmPwd"
          type="password"
          placeholder="请确认新密码"/>
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

export default {
  name: 'CommonSetting',
  props: {
    passWordDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pwdForm: {
        OldPassWord: '',
        NewPassword: '',
        confirmPwd: '',
      },
      rules: {
        OldPassWord: [
          {
            required: true, message: '请输入原密码', trigger: 'blur',
          },
        ],
        NewPassword: [
          {
            validator: this.validatePass, trigger: 'blur', required: true,
          },
        ],
        confirmPwd: [
          {
            validator: this.validateConfirmPass, trigger: 'blur', required: true,
          },
        ],
      },
    };
  },
  computed: { },
  mounted() {},
  methods: {
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.pwdForm.confirmPwd !== '') {
          this.$refs.pwdForm.validateField('confirmPwd');
        }
        callback();
      }
    },
    validateConfirmPass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.NewPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },
    saveSetting() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          const encryptedNewPwd = window.btoa(this.pwdForm.NewPassword);
          const encryptedOldPwd = window.btoa(this.pwdForm.OldPassWord);
          this.$api['more/login/updatePwd']({
            NewPassword: encryptedNewPwd,
            OldPassword: encryptedOldPwd,
          }).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success',
            });
            this.$emit('update:passWordDialogVisible', false);
          });
        }
      });
    },
    close() {
      this.$emit('update:passWordDialogVisible', false);
      this.$refs.pwdForm.resetFields();
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
