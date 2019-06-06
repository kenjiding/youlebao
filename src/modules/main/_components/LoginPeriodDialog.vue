<template>
  <el-dialog
    :visible="loginPeriodVisible"
    :close-on-click-modal="false"
    title="警告"
    class="period-dialog"
    width="500px"
    @close="close">
    <div class="tips">
      <i class="el-icon-warning"/>
      <div>
        <div>当前账期 <span class="current-period">{{ currentPeriod }}</span></div>
        <div>与当前营业日期 <span class="current-date">{{ currentSysDate }}</span> 不一致</div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="changePeriod">修改登录账期</el-button>
      <el-button
        type="primary"
        @click="$emit('close-dialog');">
        仍然登录当前账期
      </el-button>
    </span>
  </el-dialog>
</template>

<script type="text/javascript">

export default {
  name: 'LoginPeriodDialog',
  props: {
    loginPeriodVisible: {
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
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    changePeriod() {
      this.$emit('changePeriod');
    },
    close() {
      this.$emit('close-dialog');
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';
.period-dialog {
  /deep/ .el-dialog__header {
    padding: 14px 20px 14px 30px;
    height: 50px;
    box-sizing: border-box;
  }
  /deep/ .el-form-item__label {
    color: $font-color-primary;
    font-size: $font-size-primary;
    padding: 0;
  }
  /deep/ .el-dialog__body {
    padding: 20px 25px;
  }
  /deep/ .el-dialog__footer {
    padding: 0;
  }
}
.tips {
  display: flex;
  align-items: center;
  color: $font-color-primary;
  line-height: 22px;
  i {
    font-size: $font-size-regular;
    color: $color-warning;
    margin-right: 10px;
  }
}
.current-period {
  color: $color-primary;
}
.current-date {
  color: $font-color-regular;
}
.dialog-footer {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>
