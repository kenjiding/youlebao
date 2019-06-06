<template>
  <el-dialog
    :visible="commonDialogVisible"
    :close-on-click-modal="false"
    title="通用设置"
    class="setting-dialog"
    width="500px"
    @close="close">
    <el-form
      ref="commonForm"
      :model="commonForm"
      label-position="right">
      <el-form-item
        label="注销/兑换/提币："
        prop="logoutSetting">
        <el-select
          v-model="commonForm.logoutSetting"
          placeholder="请选择"
          clearable
          class="drop-wrap">
          <el-option
            v-for="item in settingItems"
            :key="item.Value"
            :label="item.Name"
            :value="item.Value"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="储值过户："
        prop="transferSetting">
        <el-select
          v-model="commonForm.transferSetting"
          placeholder="请选择"
          clearable
          class="drop-wrap">
          <el-option
            v-for="item in settingItems"
            :key="item.Value"
            :label="item.Name"
            :value="item.Value"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        label="套票出票方式："
        prop="drawerWay">
        <el-select
          v-model="commonForm.drawerWay"
          placeholder="请选择"
          clearable
          class="drop-wrap">
          <el-option
            v-for="item in drawerWayList"
            :key="item.Value"
            :label="item.Name"
            :value="item.Value"/>
        </el-select>
      </el-form-item> -->
      <el-form-item
        label="机台警告设置："
        prop="machineWarning">
        <el-radio-group v-model="commonForm.machineWarning">
          <el-radio-button :label="true">开启</el-radio-button>
          <el-radio-button :label="false">关闭</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        type="primary"
        @click="saveSetting">
        确认
      </el-button>
    </span>
  </el-dialog>
</template>

<script type="text/javascript">

export default {
  name: 'CommonSetting',
  props: {
    commonDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      commonForm: {
        logoutSetting: 'Need',
        transferSetting: 'Need',
        // drawerWay: 'Print',
        machineWarning: true,
      },
      settingItems: [
        {
          Name: '需密码验证',
          Value: 'Need',
        },
        {
          Name: '无需密码验证',
          Value: 'NoNeed',
        },
      ],
    };
  },
  computed: { },
  watch: {
    commonDialogVisible(newValue) {
      if (newValue) {
        Object.assign(this.commonForm, this.$electronStore.get('commonForm') || {});
      }
    },
  },
  mounted() {},
  methods: {
    saveSetting() {
      this.$electronStore.set('commonForm', this.commonForm);
      this.$message({
        message: '保存成功',
        type: 'success',
      });
      this.$emit('update:commonDialogVisible', false);
    },
    close() {
      this.$emit('update:commonDialogVisible', false);
      this.$refs.commonForm.resetFields();
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
    width: 128px;
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
  width: 300px;
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
