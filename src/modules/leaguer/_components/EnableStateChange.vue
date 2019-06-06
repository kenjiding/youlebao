<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员启用/禁用"
    top="15vh"
    width="500px"
    class="enable-change-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="leaguerInfo"
      label-width="85px"
      label-position="right">
      <div class="enable-change-form">
        <el-form-item
          label="会员卡号:">
          <el-input
            v-if="leaguerLock"
            v-model="leaguerInfo.LeaguerCode"
            disabled/>
          <read-card
            v-else
            ref="cardReader"
            :value="cardKeyValue"
            :auto-logout="false"
            :verify-state="false"
            :verify-date="false"
            :verify-card-state="false"
            class="read-card"
            @change="handleReadLeaguer"
            @logout="handleReadCardLogout"/>
        </el-form-item>
        <el-form-item
          label="姓名:"
          prop="RealName">
          <el-input
            v-model="leaguerInfo.RealName"
            disabled/>
        </el-form-item>
        <el-form-item
          label="状态:">
          <el-radio-group
            v-model="isEnable">
            <el-radio
              :label="true"
              border>启用</el-radio>
            <el-radio
              :label="false"
              border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :disabled="!leaguerInfo.ID"
        type="primary"
        @click="submit">确定</el-button>
    </div>
</el-dialog></template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'EnableStateChange',

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
      leaguerInfo: {},
      isEnable: false,
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
        this.leaguerInfo = this.leaguer;
        this.isEnable = this.leaguer.LeaguerStatus === 'Normal';
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    handleClose() {
      this.leaguerInfo = {};
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.leaguerInfo = leaguer;
        this.isEnable = leaguer.LeaguerStatus !== 'Disabled';
      }
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
      this.isEnable = false;
    },

    submit() {
      this.$api['leaguer/leaguer/setLeaguerEnable']({
        LeaguerID: this.leaguerInfo.ID,
        IsEnable: this.isEnable,
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
        });
        this.$emit('complete');
        this.$emit('close');
        this.remove && this.remove();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .enable-change {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      // /deep/ .el-input__inner {
      //   width: 320px;
      // }
    }
  }

  .enable-change-dialog {
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
