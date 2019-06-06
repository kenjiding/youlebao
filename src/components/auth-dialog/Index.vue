<template>
  <el-dialog
    :visible.sync="localVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    width="500px"
    title="授权"
    class="auth-dialog"
    @closed="remove()">
    <el-form
      v-loading="formLoading"
      ref="form"
      :rules="rules"
      :model="formData"
      label-width="7em"
      label-position="right"
      @keyup.enter.native="authorize">
      <el-form-item
        prop="action"
        class="small-bottom"
        label="所在功能：">
        {{ renderUiName }}
      </el-form-item>
      <el-form-item
        prop="operate"
        class="small-bottom"
        label="授权操作：">
        {{ renderActionName }}
      </el-form-item>
      <el-form-item
        prop="Username"
        label="授权用户：">
        <el-input
          ref="userNameInput"
          v-model="formData.Username"
          placeholder="请输入授权用户名"
          clearable
          class="name-input">
          <template slot="append">
            <el-button
              type="primary"
              @click="authReadCard">读取员工卡</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="Password"
        label="用户密码：">
        <el-input
          v-model="formData.Password"
          placeholder="请输入密码"
          clearable
          type="password"/>
      </el-form-item>
    </el-form>
    <div
      slot="footer">
      <el-button
        :loading="loading"
        type="primary"
        @click="authorize">授 权</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import { sourceData as initialData } from '@/config/datas/menu-permissions-map';

export default {
  name: 'AuthDialog',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    permission: {
      type: Number,
      default: 0,
    },
    uiName: {
      type: String,
      default: '',
    },
    actionName: {
      type: String,
      default: '',
    },
    isPortAuth: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      localVisible: false,
      formData: {
        Username: null,
        Password: null,
      },
      loading: false,

      rules: {
        Username: [
          { required: true, message: '请输入授权用户名', trigger: 'blur' },
        ],
        Password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      formLoading: false,
    };
  },
  computed: {
    renderActionName() {
      return this.isPortAuth ? this.actionName : initialData[this.permission].name;
    },
    renderUiName() {
      return this.isPortAuth ? this.uiName : initialData[this.permission].name;
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.localVisible = val;
        if (val) {
          this.$nextTick(() => {
            this.autofocus();
          });
        }
      },
    },
  },

  methods: {
    autofocus() {
      this.$nextTick(() => {
        this.$refs.userNameInput.focus();
      });
    },
    authorize() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$api['global/dTOAuth']({
          Permission: this.permission,
          ...this.formData,
        }).then(() => {
          this.resetResult();
        }, () => {
          this.loading = false;
        });
      });
    },

    resetResult() {
      this.localVisible = false;
      this.$emit('result', true);
      this.loading = false;
    },

    handleClose(done) {
      this.$emit('result', false);
      this.$message.error('取消授权');
      done();
    },

    authReadCard() {
      const cardInfo = this.$device.readEmpCard(true);
      if (cardInfo.errorCode !== 0 || !cardInfo.cardID) {
        this.$message.error('读卡异常/非员工卡');
        this.$nextTick(() => {
          this.$refs.userNameInput.focus();
        });
        return;
      }
      this.formLoading = true;
      this.$api['global/authByCard']({
        Permission: this.permission,
        CardNum: cardInfo.cardID,
      }).then(() => {
        this.formLoading = false;
        this.resetResult();
      }, () => {
        this.loading = false;
        this.formLoading = false;
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';

.auth-dialog {
  .small-bottom {
    margin-bottom: 10px;
  }
  .name-input {
    /deep/ .el-input-group__append {
      width: 100px;
      padding: 0;
      box-sizing: border-box;
    }
  }
  /deep/ .el-dialog__body{
    padding: 10px 50px;
    border-top: 1px solid $color-bg-table;
  }

  /deep/ .el-dialog__footer {
    padding: 10px 70px;
    border-top: 1px solid $color-bg-table;
    .el-button--primary {
      width: 100%;
    }
  }
}
</style>
