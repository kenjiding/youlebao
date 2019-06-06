<template>
  <div class="about">
    <el-row>
      <el-col :span="12">
        {{ 123123 | number('0.00') }}
      </el-col>
      <el-col :span="2">
        <ych-read-card
          v-model="card"/>
      </el-col>
    </el-row>

    <!--<el-input
      v-model="inputNumber"
      placeholder=""/>-->
    <el-button @click="onReaderCallClick">指纹检测</el-button>
    <el-button @click="onEnableApiCallClick">启用/禁用</el-button>
    <el-button @click="onLevelApiCallClick">级别变更</el-button>
    <el-button @click="onEditLeaguerApiCallClick">修改资料</el-button>
    <el-button @click="onEditPasswordApiCallClick">修改密码</el-button>
    <el-button @click="onRenewalApiCallClick">会员续期</el-button>
    <el-button @click="onLockAccountApiCallClick">锁定账户</el-button>
    <el-button @click="onTransferAccountApiCallClick">储值过户</el-button>
    <el-button @click="onCancelLeaguerApiCallClick">注销会员</el-button>
    <el-button @click="onCardChangeApiCallClick">补卡</el-button>
    <el-button @click="onStoreLotteryApiCallClick">存票</el-button>
    <el-button @click="onJoinInApiCallClick">入会</el-button>
    <!-- <el-button @click="onEnableApiCallClick">打开Api</el-button> -->
    <p>{{ message }}</p>
  </div>
</template>

<script>
// eslint-disable-next-line
import { ipcRenderer, remote } from 'electron';
import FingerHelper from '@/main-process/devices/finger/FingerHelper';


export default {
  data: () => ({
    card: '',
    inputNumber: 1,
    imgSrc: '',
    deviceInstance: null,
    message: '',
    editInfoVisible: false,
    compensateVisible: false,
    transferVisible: false,
    lockVisible: false,
    passwordVisible: false,
    enableVisible: false,
    renewalVisible: false,
    levelVisible: false,
    changeVisible: false,
    cancelVisible: false,
    // getCoinVisible: false,
    storeLotteryVisible: false,
    joinVisible: false,
    leaguerInfo: {
      ID: 'ssssss',
    },
  }),

  computed: {
  },

  created() {
    this.init();
  },

  methods: {

    async init() {
      this.isOperation = false;
      this.deviceInstance = await FingerHelper.defaultMachine;
      if (this.deviceInstance) {
        this.deviceInstance.onReading = this.handleOnReading;
        this.deviceInstance.onComplete = this.handleOnComplete;
        console.log(this.deviceInstance);
      }
    },

    handleOnReading() {
      this.message = this.deviceInstance.currentMessage;
    },

    handleOnComplete(val) {
      console.log(val);
      if (val) {
        this.$message({
          showClose: true,
          message: '获取指纹信息成功',
          type: 'success',
        });
      } else {
        this.$message({
          showClose: true,
          message: '获取指纹信息失败',
          type: 'fail',
        });
      }
    },

    onReaderCallClick() {
      console.log('onclick');
      this.deviceInstance.getRegData;
      // const value = ipcRenderer.sendSync('initFingerPrint');
      // this.$message({
      //   showClose: true,
      //   message: value,
      //   type: 'success',
      // });
    },

    onEnableApiCallClick() {
      const self = this;
      this.enableVisible = true;
      this.$createEnableStateChange({
        $props: {
          visible: 'enableVisible',
        },
        onClose() {
          console.log('close');
          self.enableVisible = false;
        },
        onComplete() {
          self.enableVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onLevelApiCallClick() {
      const self = this;
      this.levelVisible = true;
      this.$createLevelChange({
        $props: {
          visible: 'levelVisible',
        },
        onClose() {
          console.log('close');
          self.levelVisible = false;
        },
        onComplete() {
          self.levelVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onEditLeaguerApiCallClick() {
      const self = this;
      this.editInfoVisible = true;
      this.$createEditLeaguerInfo({
        $props: {
          visible: 'editInfoVisible',
        },
        onClose() {
          console.log('close');
          self.editInfoVisible = false;
        },
        onComplete() {
          self.editInfoVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onEditPasswordApiCallClick() {
      const self = this;
      this.passwordVisible = true;
      this.$createEditPassword({
        $props: {
          visible: 'passwordVisible',
        },
        onClose() {
          self.passwordVisible = false;
        },
        onComplete() {
          self.passwordVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onRenewalApiCallClick() {
      const self = this;
      this.renewalVisible = true;
      this.$createRenewal({
        $props: {
          visible: 'renewalVisible',
        },
        onClose() {
          self.renewalVisible = false;
        },
        onComplete() {
          self.renewalVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onLockAccountApiCallClick() {
      const self = this;
      this.lockVisible = true;
      this.$createLockAccount({
        $props: {
          visible: 'lockVisible',
        },
        onClose() {
          self.lockVisible = false;
        },
        onComplete() {
          self.lockVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onTransferAccountApiCallClick() {
      const self = this;
      this.transferVisible = true;
      this.$createTransferAccount({
        $props: {
          visible: 'transferVisible',
        },
        onClose() {
          self.transferVisible = false;
        },
        onComplete() {
          self.transferVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onCancelLeaguerApiCallClick() {
      const self = this;
      this.cancelVisible = true;
      this.$createCancelLeaguer({
        $props: {
          visible: 'cancelVisible',
        },
        onClose() {
          self.cancelVisible = false;
        },
        onComplete() {
          self.cancelVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onCardChangeApiCallClick() {
      const self = this;
      this.changeVisible = true;
      this.$createCardChange({
        $props: {
          visible: 'changeVisible',
        },
        onClose() {
          self.changeVisible = false;
        },
        onComplete() {
          self.changeVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onStoreLotteryApiCallClick() {
      const self = this;
      this.storeLotteryVisible = true;
      this.$createStoreLottery({
        $props: {
          visible: 'storeLotteryVisible',
        },
        onClose() {
          self.storeLotteryVisible = false;
        },
        onComplete() {
          self.storeLotteryVisible = false;
          // console.log('打印完成');
        },
      });
    },

    onJoinInApiCallClick() {
      const self = this;
      this.joinVisible = true;
      this.$createJoinMealDialog({
        $props: {
          visible: 'joinVisible',
        },
        onClose() {
          self.joinVisible = false;
        },
        onComplete() {
          self.joinVisible = false;
          // console.log('打印完成');
        },
      });
    },
  },
};
</script>

