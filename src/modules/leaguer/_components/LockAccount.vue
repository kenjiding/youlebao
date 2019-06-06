<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员账户锁定/解锁"
    top="15vh"
    width="500px"
    class="lock-account-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="accountInfo"
      label-width="85px"
      label-position="right">
      <div class="lock-account-form">
        <el-form-item
          label="会员卡号:"
          prop="leaguerCode">
          <el-input
            v-if="leaguerLock"
            v-model="accountInfo.LeaguerCode"
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
          v-show="leaguerAnyValue"
          label="锁定储值:">
          <el-checkbox-group
            v-model="lockValues"
            class="checkbox-list">
            <el-checkbox
              v-for="item in valueTypes"
              :key="item.ValueTypeID"
              :label="item.ValueType">{{ '锁定' + item.ValueName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div
          v-show="this.accountInfo.ID && this.valueTypes.length === 0"
          class="no-value-tips">
          <p>该会员暂无储值数据</p>
        </div>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :loading="loading"
        type="primary"
        @click="submit">确定</el-button>
    </div>
</el-dialog></template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'LockAccount',

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
      accountInfo: {},
      lockValues: [], // 选中锁定数组
      valueTypes: [], // 储值列表
      loading: false,
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

    leaguerAnyValue() {
      return this.accountInfo.ID && this.valueTypes.length;
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
        this.accountInfo = this.leaguer;
        this.loadValueTypes();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    handleClose() {
      this.accountInfo = {};
      this.lockValues = [];
      this.valueTypes = [];
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.accountInfo = leaguer;
        this.loadValueTypes();
      }
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
      this.accountInfo = {};
      this.lockValues = [];
      this.valueTypes = [];
    },

    loadValueTypes() {
      this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
        LeaguerID: this.accountInfo.ID,
        ValueTypes: [],
        IgnoreNullValue: true,
      }).then((res) => {
        this.valueTypes = res.DataList;
        this.lockValues = this.valueTypes.filter(item => item.Status === 'Locked').map(item => item.ValueType);
      });
    },

    submit() {
      this.loading = true;
      const lgValueTypeList = [];
      this.valueTypes.forEach((val) => {
        lgValueTypeList.push({
          ValueTypeID: val.ValueTypeID,
          IsLock: Boolean(this.lockValues.indexOf(val.ValueType) >= 0),
        });
      });

      this.$api['leaguer/leaguer/lockLgAccount']({
        LeaguerID: this.accountInfo.ID,
        LgValueTypeList: lgValueTypeList,
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
        });
        this.$emit('complete');
        this.$emit('close');
        this.loading = false;
        this.remove && this.remove();
      }, () => {
        this.loading = false;
      });
    },
  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .lock-account {
    $two-px:2px;

    &-form {
      min-height: 180px;
      padding: 0 20px;

      .checkbox-list {
        width: 100px;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
      }

      .no-value-tips {
        color: $font-color-placeholder;
        text-align: center;
        line-height: 140px;
      }

      /deep/ .el-checkbox {
        height: 30px;
        margin: 0;
      }

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input__inner {
        width: 320px;
      }
    }
  }

  .lock-account-dialog {
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
