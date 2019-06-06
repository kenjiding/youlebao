<template>
  <el-dialog
    :visible="animationVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :show-close="buttonStatus === 'complete' || buttonStatus === 'action'"
    title="设备清币"
    width="500px"
    @close="closeDialog"
    @open="isOperationClear = false">
    <div class="wrap">
      <p>原库存：{{ outCoinNum }}</p>
      <div class="canvasCircle">
        <canvas
          ref="myCanvas"
          width="200px"
          height="200px"/>
        <span>{{ inventoryNum }}</span>
      </div>
      <p :style="{color: machineStatusColor}">{{ machineStatus }}</p>
    </div>
    <div
      slot="footer"
      class="dialog-footer">
      <div
        v-show="buttonStatus === 'complete'"
        class="completeStyle">
        <el-button
          @click="continueAndComplete">再次清币</el-button>
        <el-button
          type="primary"
          @click="clearComplete"
        >完成</el-button>
      </div>
      <div
        v-if="buttonStatus === 'continue'"
        class="completeStyle">
        <el-button
          :disabled="buttonDisabled"
          @click="continuePutCoin">继续清币</el-button>

        <el-button
          type="primary"
          @click="stopComplete">完成</el-button>
      </div>

      <div
        v-else-if="buttonStatus === 'stop'"
        class="completeStyle">
        <el-button
          :disabled="buttonDisabled"
          @click="stopPutCoin">暂停清币</el-button>

        <el-button
          type="primary"
          @click="stopComplete">完成</el-button>
      </div>

      <el-button
        v-else-if="buttonStatus === 'action'"
        :disabled="buttonDisabled"
        class="clearButton"
        type="primary"
        @click="actionHandle">开始清币</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import CoinMachineHelper from '@/main-process/devices/coin-machine/CoinMachineHelper';
import { sleep } from '@/utils/tools';

export default {
  name: '',

  // inject: ['CoinMachineHelper'],

  props: {
    animationVisible: {
      type: Boolean,
      default: false,
    },
    outCoinNum: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      isOperationClear: false,
      buttonDisabled: false,
      // 控制波浪开始
      startWave: true,
      inventoryNum: 0,
      gradientColorFrom: '#F5A623',
      gradientColorTo: '#E54B5E',
      networkError: false,
      // 波浪上升高度
      progress: 0,
      // 波浪上升的步宽
      progressStep: 0,
      buttonStatus: 'action',
      // 清币的状态
      machineStatus: '',
      // 清币的状态字体的颜色
      machineStatusColor: '#AAA',
      stopButton: '暂停清币',
      machineInstance: null,
      animation: null,
      isClickComplete: false,
      totalClearCoinNum: 0,
      isClearingStatus: false,
    };
  },

  computed: {
    ...mapState({
      machineInfo: state => state.machine.machineInfo,
      machineID: state => state.machine.machineID,
    }),
  },

  watch: {
    animationVisible(val) {
      if (!val) return;
      this.init();
      this.setCanvasStyle('dialogClose');
    },
    networkError(val) {
      if (!val) return;
      // 网络或者接口发生错误时，改变波浪颜色，并且暂停
      this.gradientColorFrom = 'red';
      this.gradientColorTo = '#E54B5E';
    },
  },
  created() {
  },

  methods: {
    async stopComplete() {
      const machineStatus = await this.machineInstance.currentStatus;

      if (machineStatus === 'coinClearing') {
        this.machineInstance.pauseClearCoin();
        await sleep(500);
      }

      console.log(123);
      this.machineInstance.handleCoinCleared();
      console.log(456);

      this.$emit('clear-complete', this.inventoryNum);
      this.closeDialog();
    },
    async checkSatuts() {
      const status = await this.machineInstance.isMachineLink;
      // 如果设备未连接，则终止下面操作
      if (!status) {
        this.machineStatus = '设备未连接';
        this.machineStatusColor = ' #E54B5E';
        this.buttonDisabled = true;
        return;
      }
      this.wave();

      // return this.machineInstance.currentStatus;
      this.buttonDisabled = false;
      const statusMark = await this.machineInstance.currentStatus;
      const obj = {
        // 当前售币机的状态是暂停清币
        coinClearPause: this.stopStatusHandle,
        // 正在清币中。。。。
        coinClearing: () => {
          this.setCanvasStyle('clearing');
        },
      };
      obj[statusMark] && obj[statusMark]();

      console.log(this.machineInstance, 9999);
      // 清币中
      this.machineInstance.onClearCoin = this.onClearCoin;
      // 暂停清币
      this.machineInstance.onClearPauseOuted = this.onPauseClearCoin;
      // 清币完成
      this.machineInstance.onClearCoinCompleted = this.onCoinComplete;
      this.machineInstance.onError = this.onError;
    },
    async init() {
      this.machineInstance = await CoinMachineHelper.defaultMachine;
      if (this.machineInstance) {
        this.checkSatuts();
      } else {
        this.machineStatus = '设备未连接';
        this.machineStatusColor = '#E54B5E';
        this.buttonDisabled = true;
      }
    },

    computeCanvasStep(amount) {
      this.inventoryNum = amount || this.machineInstance.currentOutCoin;
      this.progressStep = 213 * this.inventoryNum / this.outCoinNum;
    },

    stopStatusHandle() {
      if (!this.isOperationClear) return;
      this.computeCanvasStep();
      this.machineStatus = '清币暂停';
      this.buttonStatus = 'continue';
      this.setCanvasStyle('clearing');
    },

    onError(val, status) {
      let timeOutMark = false;

      // 当前状态不允许暂停清币 coinClearPause
      if (status === 'timeOut') {
        timeOutMark = true;
      }
      this.machineStatus = val;
      this.computeCanvasStep();
      this.setCanvasStyle('error');
      this.$emit('error');
      this.errorMessage(val, timeOutMark);
      console.log(val, status, 'error');
    },

    errorMessage(val, timeOutMark) {
      this.$confirm(`${val},请把实物币倒回售币机${timeOutMark ? '后，重启售币机' : ''}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
    },

    setCanvasStyle(type) {
      const statusObj = {
        clearing: () => {
          this.gradientColorFrom = '#F5A623';
          this.gradientColorTo = '#E54B5E';
          this.machineStatusColor = '#AAA';
        },
        complete: () => {
          this.buttonStatus = 'complete';
          this.machineStatus = '清币完成';
          this.gradientColorFrom = '#67C23A';
          this.gradientColorTo = '#67C23A';
          this.machineStatusColor = '#67C23A';
        },
        dialogClose: () => {
          this.gradientColorFrom = '#F5A623';
          this.gradientColorTo = '#E54B5E';
          this.networkError = false;
          this.inventoryNum = 0;
          this.progress = 0;
          this.progressStep = 0;
          this.machineStatus = '';
          this.buttonStatus = 'action';
          this.totalClearCoinNum = 0;
          this.isClickComplete = false;
          this.isClearingStatus = false;

          if (this.machineInstance) {
          // 清空事件监听
            this.machineInstance.onClearCoin = null;
            this.machineInstance.onClearPauseOuted = null;
            this.machineInstance.onClearCoinCompleted = null;
            this.machineInstance.onError = null;
          }
        },
        continueClearing: () => {
          this.buttonDisabled = false;
          this.buttonStatus = 'stop';
          this.stopButton = '暂停清币';
          this.machineStatus = '清币中...';
          this.gradientColorFrom = '#F5A623';
          this.gradientColorTo = '#E54B5E';
          this.machineStatusColor = '#AAA';
          this.inventoryNum = 0;
          this.progress = 0;
          this.progressStep = 0;
        },
        error: () => {
          this.buttonStatus = 'action';
          this.gradientColorFrom = 'red';
          this.gradientColorTo = '#E54B5E';
          this.machineStatusColor = '#E54B5E';
          this.buttonDisabled = true;
        },
      };

      statusObj[type] && statusObj[type]();
    },

    async actionHandle() {
      const machineStatus = await this.machineInstance.currentStatus;

      // 解决当手动调用清币完成事件后，再次进入清币界面出现"重启失败"的错误
      if (this.machineID) {
        if (machineStatus === 'idle') {
          this.machineInstance.clearCoin();
        } else {
          this.machineInstance.continueClearCoin();
          // this.machineInstance.clearCoin();
        }
      } else {
        this.machineInstance.clearCoin();
      }

      this.machineStatus = '清币中...';
      this.setCanvasStyle('clearing');
      this.isOperationClear = true;
    },
    clearComplete() {
      if (this.isClickComplete) {
        this.totalClearCoinNum += this.inventoryNum;
      } else {
        this.totalClearCoinNum = this.inventoryNum;
      }

      this.$emit('clear-complete', this.totalClearCoinNum);
      this.closeDialog();
    },
    closeDialog() {
      // 停止动效
      window.cancelAnimationFrame(this.animation);
      this.setCanvasStyle('dialogClose');
      this.$emit('update:animationVisible', false);
    },
    continuePutCoin() {
      this.buttonDisabled = true;
      this.machineInstance.continueClearCoin();
      console.log('继续清币');
    },
    async stopPutCoin() {
      this.buttonDisabled = true;
      const machineStatus = await this.machineInstance.currentStatus;

      // 如果当前转态不是 '清币中' ，则不允许暂停清币
      if (machineStatus !== 'coinClearing') {
        return;
      }

      this.machineInstance.pauseClearCoin();

      // const machineStatus = await this.machineInstance.currentStatus;
      // if (this.stopButton === '暂停清币') {
      //   // 如果当前转态不是 '清币中' ，则不允许暂停清币
      //   if (machineStatus !== 'coinClearing') {
      //     return;
      //   }
      //   this.machineInstance.pauseClearCoin();
      //   this.stopButton = '继续清币';
      // } else {
      //   this.machineInstance.continueClearCoin();
      //   this.stopButton = '暂停清币';
      // }

      await sleep(500);

      this.buttonStatus = 'continue';
      this.buttonDisabled = false;
    },
    initMachine() {

    },
    // 清币完成
    onCoinComplete() {
      this.isClearingStatus = false;
      // this.computeCanvasStep(amount);
      this.setCanvasStyle('complete');
    },
    // 暂停清币
    onPauseClearCoin(amount) {
      console.log('触发了暂停', this.isOperationClear, 888, this.machineStatus);
      this.buttonDisabled = false;

      this.isClearingStatus = false;

      if (!this.isOperationClear) return;
      this.machineStatus = '清币暂停';
      this.computeCanvasStep(amount);
      this.buttonStatus = 'continue';
    },
    // 清币中
    onClearCoin(amount) {
      this.computeCanvasStep(amount);
      this.buttonDisabled = false;

      this.isClearingStatus = true;

      this.machineStatus = '清币中...';
      this.buttonStatus = 'stop';
    },
    continueAndComplete() {
      this.setCanvasStyle('clearing');
      if (this.isClickComplete) {
        this.totalClearCoinNum += this.inventoryNum;
      } else {
        this.totalClearCoinNum = this.inventoryNum;
      }

      this.isClickComplete = true;

      this.machineInstance.clearCoin();
      // this.setCanvasStyle('continueClearing');
    },
    wave() {
      const _this = this;
      const waveWidth = 300;
      let offset = 0;
      // 控制波浪的高度
      const waveHeight = 10;
      // 控制波浪的个数
      const waveCount = 3;
      const startX = -100;
      const startY = 208;
      // progressStep * 0表示波浪静止不动。
      // progressStep * 1表示波浪正向上升的步宽。
      // progressStep * -1：波浪反向下降的步宽。
      const d2 = waveWidth / waveCount;
      const d = d2 / 2;
      const hd = d / 2;
      const c = this.$refs.myCanvas;
      const ctx = c.getContext('2d');
      let stepWidth = 0.5;

      function tick() {
        // 控制波浪的滚动速度
        offset -= 2;

        // 根据不同的出币数调整动画上升速度
        if (_this.progress >= _this.progressStep) {
          stepWidth = 0;
        } else if (_this.outCoinNum > 30) {
          stepWidth = 0.5;
        } else if (_this.outCoinNum > 20 && _this.outCoinNum < 30) {
          stepWidth = 2.5;
        } else {
          stepWidth = 3;
        }
        _this.progress += stepWidth;

        // _this.progress = _this.progressStep;
        if (-1 * offset === d2) offset = 0;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        const offsetY = startY - _this.progress;
        ctx.moveTo(startX - offset, offsetY);
        for (let i = 0; i < waveCount; i++) {
          const dx = i * d2;
          const offsetX = dx + startX - offset;
          ctx.quadraticCurveTo(offsetX + hd, offsetY + waveHeight, offsetX + d, offsetY);
          ctx.quadraticCurveTo(offsetX + hd + d, offsetY - waveHeight, offsetX + d2, offsetY);
        }
        // 设置渐变的填充颜色
        const grd = ctx.createLinearGradient(0, 0, 170, 0);
        grd.addColorStop(0, _this.gradientColorFrom);
        grd.addColorStop(1, _this.gradientColorTo);
        // grd.addColorStop(1, 'white');

        ctx.fillStyle = grd;

        ctx.lineTo(startX + waveWidth, 300);
        ctx.lineTo(startX, 300);
        ctx.fill();
        _this.animation = requestAnimationFrame(tick);
      }
      tick();
    },

  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.clearButton {
  width: 360px;
  display: block;
  margin: 0 auto !important;
}

.dialog-footer {
  overflow: hidden;
  width: 100%;

  .completeStyle {
    width: 100% !important;
    text-align: center !important;

    .el-button {
      width: 190px;
    }
  }
}

.wrap {
  width: 300px;
  margin: 0 auto;
  text-align: center;

  p {
    padding: 10px 0;
    font-size: $font-size-regular;
    color: $font-color-placeholder;

    &:last-of-type {
      margin-top: 20px;
      color: $font-color-placeholder;
    }
  }
}

.canvasCircle {
  margin: 0 auto;
  width: 200px;
  height: 200px;
  border-radius: $border-radius-circle;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 30px 1px $font-color-placeholder inset;
  /* border: 8px solid $color-success; */

  /* outline: $color-danger solid thick; */

  span {
    width: 90px;
    height: 90px;
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: $font-size-secondary;
    line-height: 90px;
    background-color: $color-white;
    border-radius: $border-radius-circle;
    box-shadow: 0 1px 5px 1px $font-color-placeholder;
    color: $color-warning;
  }
}
</style>
