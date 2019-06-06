<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    title="请选择登陆账期"
    class="period-dialog"
    width="500px"
    @close="close">
    <div
      v-loading="periodListLoading"
      class="wrap">
      <el-radio-group
        v-model="selectPeriodValue"
        class="period-group">
        <el-radio
          v-for="item in periodList"
          :key="item.Value"
          :label="item.Text">
          <span>{{ item.Text }}</span>
          <span
            v-if="currentSysDate === item.Text"
            class="period-txt">当前营业日期</span>
        </el-radio>
      </el-radio-group>
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        :loading="periodLoading"
        type="primary"
        @click="savePeriod">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script type="text/javascript">

export default {
  name: 'PeriodList',
  props: {
    periodList: {
      type: Array,
      default: () => [],
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    currentPeriod: {
      type: String,
      default: '',
    },
    currentSysDate: {
      type: String,
      default: '',
    },
    periodListLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      periodValue: '',
      periodLoading: false,
    };
  },
  computed: {
    selectPeriodValue: {
      get() {
        return this.periodValue || this.currentPeriod;
      },
      set(val) {
        this.periodValue = val;
      },
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.$emit('update:periodListLoading', true);
        this.$emit('getPeriod', true);
      }
    },
  },
  mounted() {},
  methods: {
    savePeriod() {
      this.periodLoading = true;
      const selectPeriodID = this.periodList.filter(item => item.Text === this.selectPeriodValue);
      if (selectPeriodID.length === 0) {
        this.$message({
          message: '请选择账期',
          type: 'error',
        });
        this.periodLoading = false;
        return;
      }
      this.$api['main/period/changeCurrentPeriod']({
        PeriodID: selectPeriodID[0].Value,
      }).then((res) => {
        this.periodLoading = false;
        this.$message({
          message: '保存成功',
          type: 'success',
        });
        delete res.MenuRoles;
        this.$store.commit('user/setInfo', res);
        this.$emit('update:currentPeriod', this.selectPeriodValue);
        this.$emit('closeLoginPeriod');
        this.close();
      }, () => {
        this.periodLoading = false;
      });
    },
    close() {
      this.periodValue = '';
      this.$emit('close-dialog');
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';
.period-dialog {
  /deep/ .el-dialog__header {
    border-bottom: 1px solid $border-color;
    padding: 14px 20px 14px 30px;
    height: 50px;
    box-sizing: border-box;
  }
  /deep/ .el-form-item__label {
    color: $font-color-primary;
    font-size: $font-size-primary;
    padding: 0;
  }
  .wrap {
    height: 330px;
    padding: 20px 25px;
    overflow-y: scroll;
  }
  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/ .el-dialog__footer {
    padding: 0;
  }
}
.period-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-radio {
    height: 40px;
    padding: 0 17px 0 27px;
    margin: 0;
    display: flex;
    align-items: center;
    &:nth-child(2n-1) {
      background-color: $color-bg-regular;
    }
  }
  /deep/ .el-radio__label {
    color: $font-color-primary;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  /deep/ .is-checked {
    .el-radio__label {
      color: $font-color-regular;
    }
  }
  .period-txt {
    font-size: $font-size-primary;
    color: $font-color-regular;
  }
}

.bottom {
  display: flex;
  > div {
    width: 320px;
    height: 50px;
    line-height: 50px;
    margin-right: 10px;
    text-align: center;
    font-size: $font-size-regular;
    color: $font-color-regular;
    border: 1px solid $border-color;
    border-radius: $border-radius-small;
  }
  .el-button--primary {
    width: 180px;
    height: 50px;
  }
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
