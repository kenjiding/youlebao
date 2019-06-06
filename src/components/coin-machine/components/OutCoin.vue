<template>
  <el-dialog
    :visible="animationVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    title="出币"
    width="500px"
    @close="closeDialog">
    <div class="wrap">
      <p>应出币数：{{ outCoinNUm }}</p>
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
      <el-button
        v-show="buttonStatus === 'complete'"
        @click="outComplete">完成</el-button>

        <!-- <el-button
        v-show="buttonStatus !== 'complete'"
        :disabled="disabledStatus"
        type="primary"
        @click="actionHandle">开始出币</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import CoinMachineHelper from '@/main-process/devices/coin-machine/CoinMachineHelper';

export default {
  name: 'OutCoin',

  props: {
    animationVisible: {
      type: Boolean,
      default: false,
    },
    outCoin: {
      type: [Number, String],
      default: '',
    },
    coinInfo: {
      type: Object,
      default: () => ({
        Amount: 0,
        ActualAmount: 0,
      }),
    },
    needTolog: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
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
      machineInstance: null,
      disabledStatus: false,
      isOperation: false,
      animation: null,
      closeShow: true,
    };
  },

  computed: {
    ...mapState({
      allMachineInfo: state => state.machine.machineInfo,
    }),
    outCoinNUm() {
      if (this.outCoin !== '' && this.outCoin >= 0) {
        return this.outCoin;
      }

      return this.coinInfo.Amount - this.coinInfo.ActualAmount;
    },
  },

  watch: {
    animationVisible: {
      handler(val) {
        if (!val) return;

        this.init();
        this.setCanvasStyle('init');
      },
      immediate: true,
    },
    networkError(val) {
      if (!val) return;
      // 网络或者接口发生错误时，改变波浪颜色，并且暂停
      this.gradientColorFrom = 'red';
      this.gradientColorTo = '#E54B5E';
    },
  },

  methods: {
    async checkSatuts() {
      const status = await this.machineInstance.isMachineLink;
      // 如果设备未连接，则终止下面操作
      if (!status) {
        this.errorMessage('设备未连接');
        this.machineStatus = '设备未连接';
        this.machineStatusColor = ' #E54B5E';
        this.disabledStatus = true;
        this.$emit('error');
        return;
      }

      // 先执行canvas动画，将画板颜色重置
      this.wave();

      if (this.allMachineInfo.Amont < this.outCoinNUm) {
        this.$message({
          message: '售币机总币数少于应出币数',
          type: 'warning',
        });
        return;
      }

      // const machineOutCoinStatus = await this.machineInstance.currentStatus;
      // if (machineOutCoinStatus === 'coinClearPause') {
      //   this.$confirm('请重启售币机开关，再进行出币操作', '提示', {
      //     confirmButtonText: '重启完成，继续出币',
      //     cancelButtonText: '取消',
      //     closeOnClickModal: false,
      //     closeOnPressEscape: false,
      //     type: 'warning',
      //   }).then(() => {
      //     this.machineOperation();
      //   }).catch(() => {
      //     // this.closeDialog();
      //     this.machineOperation();
      //   });
      // } else {
      //   this.machineOperation();
      // }
      this.machineOperation();
    },
    machineOperation() {
      this.disabledStatus = false;
      // const statusMark = this.machineInstance.currentStatus;
      // const obj = {
      //   // 当前售币机的状态是暂停出币
      //   coinOutPause: this.stopStatusHandle,
      //   // 正在出币中。。。。
      //   coinOuting: this.outtingHandle,
      //   timeOut: this.timeOutHandle,
      //   idle: this.actionHandle,
      // };
      // obj[statusMark] && obj[statusMark]();

      this.actionHandle();

      // 出币
      this.machineInstance.onOutCoin = this.onOutCoin;
      // 出币完成
      this.machineInstance.onOutCoinCompleted = this.onOutCoinCompleted;
      // 暂停出币
      // this.machineInstance.onPauseOuted = this.onStopOutCoin;
      this.machineInstance.onError = this.onError;
    },
    async init() {
      this.isOperation = false;
      this.machineInstance = await CoinMachineHelper.defaultMachine;
      if (this.machineInstance) {
        this.checkSatuts();
      } else {
        this.errorMessage('设备未连接');

        this.machineStatus = '设备未连接';
        this.machineStatusColor = ' #E54B5E';
        this.disabledStatus = true;
        this.$emit('error');
      }
    },
    outComplete() {
      this.closeDialog();
    },
    setCanvasStyle(type) {
      const statusObj = {
        stop: () => {
          this.machineStatus = '出币中...';
          this.buttonStatus = 'continue';
          this.gradientColorFrom = '#F5A623';
          this.gradientColorTo = '#E54B5E';
          this.machineStatusColor = '#AAA';
        },
        outting: () => {
          this.machineStatus = '出币中...';
          this.buttonStatus = 'action';
          this.gradientColorFrom = '#F5A623';
          this.gradientColorTo = '#E54B5E';
          this.machineStatusColor = '#AAA';
          this.disabledStatus = true;
          this.closeShow = false;
        },
        error: () => {
          this.gradientColorFrom = 'red';
          this.gradientColorTo = '#E54B5E';
          this.machineStatusColor = '#E54B5E';
        },
        completed: () => {
          this.disabledStatus = false;
          this.closeShow = false;

          this.buttonStatus = 'complete';
          this.machineStatus = '出币完成';
          this.gradientColorFrom = '#67C23A';
          this.gradientColorTo = '#67C23A';
          this.machineStatusColor = '#67C23A';
          // 出币完成后，更新售币机信息
          this.$store.dispatch('machine/getMachineInfo', this);
        },
        init: () => {
          this.gradientColorFrom = '#F5A623';
          this.gradientColorTo = '#E54B5E';
          this.networkError = false;
          this.inventoryNum = 0;
          this.progress = 0;
          this.progressStep = 0;
          this.machineStatus = '';
          this.buttonStatus = 'action';

          if (this.machineInstance) {
            this.machineInstance.onOutCoin = null;
            this.machineInstance.onOutCoinCompleted = null;
            this.machineInstance.onError = null;
          }
        },
        start: () => {
          this.machineStatus = '出币中...';
          this.buttonStatus = 'continue';
          this.gradientColorFrom = '#F5A623';
          this.gradientColorTo = '#E54B5E';
          this.machineStatusColor = '#AAA';
          this.inventoryNum = 0;
          this.progress = 0;
          this.progressStep = 0;
        },
      };

      statusObj[type] && statusObj[type]();
    },

    async timeOutHandle() {
      if (await this.machineInstance.reset()) {
        console.log('重置成功', this.machineInstance);
      }
    },

    stopStatusHandle() {
      this.computeCanvasStep();
      this.setCanvasStyle('stop');
    },

    continueOut() {
      this.machineInstance.continueOutCoin();
    },

    outtingHandle() {
      this.computeCanvasStep();
      this.setCanvasStyle('outting');
    },

    onError(val, status) {
      let timeOutMark = false;
      if (status === 'timeOut' || val === '重启售币机失败') {
        timeOutMark = true;
        if (!this.isOperation) {
          return;
        }
        this.machineStatus = val;
        this.closeShow = true;
        this.disabledStatus = false;
        this.computeCanvasStep();
      }
      this.$emit('error');
      this.computeCanvasStep();
      this.setCanvasStyle('error');

      this.errorMessage(val, timeOutMark);
    },

    errorMessage(val, timeOutMark) {
      this.$confirm(`${val}，请把实物币倒回售币机${timeOutMark ? '后，重启售币机' : ''}`, '提示', {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '跳转到出币异常记录',
        showCancelButton: this.needTolog,
      })
        .then(() => {
          this.$emit('closeDialog');
        })
        .catch((action) => {
          if (action === 'cancel') {
            this.$emit('closeDialog');
            this.$createOutCoinLog();
          }
        });
      this.setCanvasStyle('init');
    },

    computeCanvasStep(amount) {
      this.inventoryNum = amount || this.machineInstance.currentOutCoin;
      this.progressStep = 213 * this.inventoryNum / this.outCoinNUm;
    },

    async actionHandle() {
      this.isOperation = true;

      if (this.machineInstance) {
        this.machineInstance.outCoin(this.outCoinNUm);
        this.setCanvasStyle('start');
      }
    },
    onOutCoin(amount) {
      this.computeCanvasStep(amount);

      this.disabledStatus = true;
      this.closeShow = false;
      this.machineStatus = '出币中...';
    },

    onOutCoinCompleted(amount) {
      this.computeCanvasStep(amount);
      this.$emit('complete', this.inventoryNum);
      this.setCanvasStyle('completed');
    },

    closeDialog() {
      this.$emit('closeDialog');
      window.cancelAnimationFrame(this.animation);
      this.setCanvasStyle('init');
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
        } else if (_this.outCoinNUm > 30) {
          stepWidth = 1;
        } else if (_this.outCoinNUm > 20 && _this.outCoinNUm < 30) {
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

.dialog-footer {
  text-align: center;

  /deep/ .el-button {
    width: 200px;
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
