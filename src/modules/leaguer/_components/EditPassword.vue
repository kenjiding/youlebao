<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="修改密码"
    top="15vh"
    width="500px"
    class="edit-password-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="formInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="edit-password-form">
        <el-form-item
          label="会员卡号:"
          prop="leaguerCode">
          <el-input
            v-if="leaguerLock"
            v-model="formInfo.leaguerCode"
            disabled/>
          <read-card
            v-else
            ref="cardReader"
            :value="cardKeyValue"
            :auto-logout="false"
            class="read-card"
            @change="handleReadLeaguer"
            @logout="handleReadCardLogout"/>
        </el-form-item>
        <el-form-item
          label="授权:"
          prop="needAuth">
          <el-radio-group
            v-model="formInfo.needAuth"
            class="checkbox-list">
            <el-radio
              :label="true"
              border>需要</el-radio >
            <el-radio
              :label="false"
              border>不需要</el-radio >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="旧密码:"
          prop="oldPassword">
          <el-input
            v-model="formInfo.oldPassword"
            :disabled="!formInfo.needAuth"
            type="password"/>
        </el-form-item>
        <el-form-item
          label="新密码:"
          prop="newPassword">
          <el-input
            v-model="formInfo.newPassword"
            type="password"/>
        </el-form-item>
        <el-form-item
          label="确认密码:"
          prop="confirmPassword">
          <el-input
            v-model="formInfo.confirmPassword"
            type="password"/>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        type="primary"
        @click="submit">确定</el-button>
    </div>
</el-dialog></template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'EditPassword',

  components: {
    ReadCard,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    leaguer: {
      type: Object,
      default: () => ({}),
    },
    isCreate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      localVisible: false,
      cardKeyValue: '',
      formInfo: {
        ID: '',
        leaguerCode: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        needAuth: false,
      },
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.localVisible;
      },

      set(val) {
        this.localVisible = val;
        this.$emit('update:visible', val);
      },
    },

    leaguerLock() {
      return Boolean(this.leaguer.ID);
    },

    rules() {
      const checkOldPassword = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (value.length < 6) {
            callback(new Error('密码必须大于6位!'));
          }
          callback();
        }
      };

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (value.length < 6) {
            callback(new Error('密码必须大于等于6位!'));
          }
          if (this.formInfo.oldPassword !== '' && this.formInfo.oldPassword === value) {
            callback(new Error('新密码不能与旧密码相同!'));
          }
          if (this.formInfo.newPassword !== '') {
            this.$refs.form.validateField('confirmPassword');
          }
          callback();
        }
      };

      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          if (this.formInfo.newPassword !== '') {
            callback(new Error('请再次确认密码!'));
          } else {
            callback();
          }
        } else if (value.length < 6) {
          callback(new Error('密码必须大于等于6位!'));
        } else if (value !== this.formInfo.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
        needAuth: [
          { required: false, message: '', trigger: 'blur' },
        ],
        oldPassword: [
          { required: this.formInfo.needAuth, message: '请输入旧密码', trigger: 'blur' },
          { validator: checkOldPassword, trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请再次确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      };
    },
  },

  watch: {
    visible(val) {
      this.localVisible = val;
    },
  },

  mounted() {
    this.isCreate && (this.localVisible = true);
  },

  methods: {
    onLoad() {
      if (this.leaguerLock) {
        this.formInfo.ID = this.leaguer.ID;
        this.formInfo.leaguerCode = this.leaguer.LeaguerCode;
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    handleClose() {
      this.$refs.form.resetFields();
      this.formInfo.ID = '';
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.formInfo.ID = leaguer.ID;
        this.formInfo.leaguerCode = leaguer.LeaguerCode;
      }
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        if (this.formInfo.needAuth) {
          const encryptedNewPwd = window.btoa(this.formInfo.newPassword);
          const encryptedOldPwd = window.btoa(this.formInfo.oldPassword);
          this.$api['leaguer/leaguer/updateLgPwd']({
            LeaguerID: this.formInfo.ID,
            PassWord: encryptedNewPwd,
            OldPassWord: encryptedOldPwd,
          }).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.$emit('close');
            this.remove && this.remove();
          });
        } else {
          const encryptedNewPwd = window.btoa(this.formInfo.newPassword);
          this.$api['leaguer/leaguer/updateLgPwdAuth']({
            LeaguerID: this.formInfo.ID,
            PassWord: encryptedNewPwd,
          }).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.$emit('close');
            this.remove && this.remove();
          });
        }
      });
    },

  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .edit-password {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input__inner {
        width: 320px;
      }
    }
  }

  .edit-password-dialog {
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
      // background-color: $color-bg-primary;
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
