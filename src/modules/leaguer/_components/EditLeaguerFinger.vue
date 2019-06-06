<template>
  <el-dialog
    :visible="visible"
    title="指纹录入"
    width="700px"
    append-to-body
    class="edit-finger-dialog"
    @close="handleClose"
    @open="onLoad">
    <div class="edit-finger">
      <template v-for="(finger,index) in leaguerFingerList">
        <div
          :key="index"
          class="finger-card">
          <p>{{ `${finger.type === 'vein'?'指静脉':'指纹'}${index+1}:` }}</p>
          <div
            v-if="finger.scaning"
            class="finger-card-scaning">
            <i class="ych-icon-finger"/>
            <span>{{ finger.scaningMsg }}</span>
          </div>
          <div
            v-else
            class="finger-card-inner">
            <div>
              <i class="ych-icon-finger"/>
              <div class="button-group">
                <el-button
                  type="text"
                  @click="getFinger(index)">
                  {{ finger.fingerData ? '重新录入':'重试' }}
                </el-button>
                <el-button
                  class="button-clear"
                  type="text"
                  @click="deleteFinger(index)">清除
                </el-button>
              </div>
            </div>
            <el-input
              v-model="finger.summary"
              placeholder="请输入备注"/>
          </div>
        </div>
      </template>
      <div
        v-show="canAddFinger && !gettingFingerData"
        class="finger-card">
        <p>{{ `${currentFingerType === 'vein'?'指静脉':'指纹'}${leaguerFingerList.length+1}:` }}</p>
        <div class="finger-card-inner">
          <el-button
            class="button-center"
            type="text"
            @click="addFinger">添加指纹
          </el-button>
        </div>
      </div>
    </div>
    <div
      slot="footer">
      <el-button
        :disabled="!canSaveData"
        type="primary"
        @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FingerHelper from '@/main-process/devices/finger/FingerHelper';

export default {
  name: 'EditLeaguerFinger',

  components: {
    FingerHelper,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    leaguerId: {
      type: String,
      default: '',
    },
    leaguerFinger: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      deviceInstance: null,
      leaguerFingerList: [],
      currentIndex: 0,
      hasDevice: false,
      maxNumber: 0,
    };
  },

  computed: {
    // 当前可读类型
    currentFingerType() {
      if (this.deviceInstance) {
        return this.deviceInstance.deviceType;
      }
      return '';
    },
    // 当前类型指纹信息
    currentTypeFingerData() {
      const data = this.leaguerFingerList.filter(item =>
        item.type === this.currentFingerType &&
            item.fingerData !== '');
      if (data.length) {
        return data.map(item => ({
          No: item.No,
          Finger: item.fingerData,
        }));
      }
      return [];
    },
    canAddFinger() {
      return this.hasDevice && this.leaguerFingerList.length < 6;
    },
    gettingFingerData() {
      return this.leaguerFingerList.some(item => item.scaning);
    },
    canSaveData() {
      return this.leaguerFingerList.some(item => item.fingerData);
    },
  },

  methods: {
    async onLoad() {
      this.deviceInstance = await FingerHelper.defaultMachine;
      if (this.deviceInstance) {
        this.deviceInstance.onReading = this.handleOnReading;
        this.deviceInstance.onComplete = this.handleOnComplete;
        this.hasDevice = true;
        // console.log(this.deviceInstance);
      } else {
        this.hasDevice = false;
        this.$message.error('未连接指纹设备');
      }

      if (this.leaguerFinger && this.leaguerFinger.length) {
        this.maxNumber = this.leaguerFinger.length;
        this.leaguerFingerList = this.leaguerFinger.map(item => ({
          No: item.No,
          fingerType: item.FingerType,
          fingerData: item.Finger,
          summary: item.Summary,
          scaning: false,
          scaningMsg: '',
        }));
      }
    },

    addFinger() {
      if (this.leaguerFingerList.length < 6) {
        this.leaguerFingerList.push({
          No: this.maxNumber + 1,
          fingerType: this.currentFingerType,
          fingerData: '',
          summary: '',
          scaning: false,
          scaningMsg: '',
        });
        this.$nextTick(() => {
          this.getFinger(this.leaguerFingerList.length - 1);
        });
      }
    },

    getFinger(index) {
      if (this.gettingFingerData) { return; }
      this.currentIndex = index;
      this.leaguerFingerList[this.currentIndex].scaning = true;
      // console.log(this.deviceInstance);
      this.deviceInstance.getRegData;
    },

    deleteFinger(index) {
      if (!this.gettingFingerData) {
        this.leaguerFingerList.splice(index, 1);
      }
    },

    handleOnReading() {
      if (this.leaguerFingerList[this.currentIndex]) {
        this.leaguerFingerList[this.currentIndex].scaningMsg = this.deviceInstance.currentMessage;
      }
    },

    handleOnComplete(val) {
      // console.log(val);
      this.leaguerFingerList[this.currentIndex].scaning = false;
      this.leaguerFingerList[this.currentIndex].scaningMsg = '';
      if (val) {
        this.$api['leaguer/leaguer/checkFingerWrite']({
          FingerData: val,
          LeaguerID: this.leaguerId,
          FingerType: this.currentFingerType,
          FingerSort: this.currentIndex,
          FingerList: this.currentTypeFingerData,
        }).then(() => {
          this.leaguerFingerList[this.currentIndex].fingerData = val;
          this.$message({
            showClose: true,
            message: '获取指纹信息成功',
            type: 'success',
          });
        }, () => {
          // this.$message({
          //   showClose: true,
          //   message: '指纹信息重复，请重试',
          //   type: 'fail',
          // });
        });
      } else {
        this.$message({
          showClose: true,
          message: '获取指纹信息失败',
          type: 'warning',
        });
      }
    },

    handleClose() {
      if (this.deviceInstance) {
        setTimeout(() => {
          this.deviceInstance.cancelRegister;
        }, 2000);
      }
      this.leaguerFingerList = [];
      this.$emit('update:visible', false);
    },

    submit() {
      const fingerList = this.leaguerFingerList.filter(item => item.fingerData)
        .map(item => ({
          Finger: item.fingerData,
          Summary: item.summary,
          No: item.No,
          FingerType: item.fingerType,
        }));
      this.$api['leaguer/leaguer/saveLeaguerFinger']({
        LeaguerID: this.leaguerId,
        FingerList: fingerList,
      }).then(() => {
        this.$message({
          showClose: true,
          message: '保存指纹信息成功',
          type: 'success',
        });
        this.$emit('complete');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.edit-finger {
  height: 430px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  padding: 20px 0;
  margin-left: 30px;

  .finger-card {
    p{
      width: 200px;
      font-size: $font-size-primary;
      line-height: 30px;
    }

    &-inner {
      width: 200px;
      height: 160px;
      border: 1px $border-color solid;
      box-sizing: border-box;
      border-radius: $border-radius;
      padding: 20px 10px;
      margin-right: 20px;

      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;

      i {
        // stylelint-disable-next-line
        font-size: 60px;
        color: $font-color-secondary;
      }

      > div {
        display: flex;
        flex-flow: row nowrap;
      }

      .button-group {
        width: 110px;
        display: flex;
        flex-flow: column nowrap;

        .button-clear {
          color: $color-danger;
        }

        /deep/ .el-button {
          margin: 0;
          padding: 5px;
        }
      }

      .button-center {
        margin-top: 40px;
      }

      /deep/ .el-input {
        bottom: 0;
        width: 180px;
      }
    }

    &-scaning{
      width: 200px;
      height: 160px;
      border: 1px $border-color solid;
      box-sizing: border-box;
      border-radius: $border-radius;
      padding: 20px 10px;
      margin-right: 20px;

      display: flex;
      flex-flow: column wrap;
      justify-content: space-around;
      align-items: center;

      i {
        // stylelint-disable-next-line
        font-size: 60px;
        color: $font-color-secondary;
        animation: myfirst 1s;
        animation-iteration-count: infinite;
        animation-direction: alternate;

        @keyframes myfirst
        {
          from {color: $font-color-secondary;}
          to {color: $color-primary;}
        }
      }

      span {
        font-size: $font-size-primary;
        color: $font-color-placeholder;
      }
    }
  }

  .finger-card:nth-child(3n) {
    .finger-card-inner {
      margin-right: 0;
    }
  }
}

.edit-finger-dialog {
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
    padding: 0;
  }

  /deep/ .el-dialog__footer {
    height: 60px;
    padding: 10px 30px;
    border-top: 1px $border-color solid;

    .el-button {
      width: 180px;
    }
  }
}

</style>

