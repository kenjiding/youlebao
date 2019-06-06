<template>
  <div class="about">
    <el-input v-model="value"/>
    <el-button
      type="danger"
      @click="error">
      出币
    </el-button>
    <el-button
      type="primary"
      @click="continueOutCoin">
      继续出币
    </el-button>
    <el-button
      type="primary"
      @click="pauseOutCoin">
      暂停出币
    </el-button>
    <h1>已出数量：{{ outedAmount }}</h1>

    <br>
    <el-button
      type="primary"
      @click="clearCoin">
      清币
    </el-button>

    <el-button
      type="primary"
      @click="pauseClearCoin">
      暂停清币
    </el-button>

    <el-button
      type="primary"
      @click="continueClearCoin">
      继续清币
    </el-button>
    <h1>清币状态：{{ clearStatus }}</h1>
    <h1>清币数量：{{ clearAmount }}</h1>
    <h1>币杯模式</h1>
    <el-switch
      v-model="cupStatus"
      active-text="开"
      inactive-text="关"
      @change="cupStatusChange"/>
    <el-button
      type="primary"
      @click="getMachineID">
      查询ID
    </el-button>
    <h1>ID：{{ id }}</h1>
    <h1>Version：{{ version }}</h1>
  </div>
</template>

<script>
// import SerialPort from 'serialport';
// eslint-disable-next-line
import { ipcRenderer } from 'electron';
import CoinMachineHelper from '@/main-process/devices/coin-machine/CoinMachineHelper';

export default {
  data() {
    return {
      value: 10,
      machine: null,
      outedStatus: null,
      outedAmount: 0,
      clearAmount: 0,
      clearStatus: null,
      cupStatus: false,
      id: null,
      version: null,
    };
  },

  mounted() {
    this.initMachine();
  },

  beforeDestroy() {
    this.machine && this.machine.close();
  },
  methods: {
    async initMachine() {
      this.machine = await CoinMachineHelper.defaultMachine;

      if (this.machine) {
        this.machine.onOutCoin = this.onOutCoinCompleted;
        this.machine.onOutCoinCompleted = this.onOutCoinCompleted;
        this.machine.onPauseOuted = this.onOutCoinCompleted;


        this.machine.onClearCoin = this.onClearCoin;
        this.machine.onPauseClearCoin = this.onPauseClearCoin;
        this.machine.onContinueCoin = this.onContinueCoin;
      }
    },

    async error() {
      if (this.machine) {
        // this.machine.outCoin(100);
        const is = await this.machine.outCoin(this.value);
        console.log(is);
      }
      // ipcRenderer.send('coinMachine', this.inputNumber);
      // eslint-disable-next-line
    },

    onClearCoin(amount) {
      this.clearAmount = amount;
      this.clearStatus = '清币中';
    },

    onPauseClearCoin(amount) {
      this.clearAmount = amount;
      this.clearStatus = '暂停清币';
    },

    onContinueCoin(amount) {
      this.clearAmount = amount;
      this.clearStatus = '清币完成';
    },

    continueOutCoin() {
      this.machine.continueOutCoin();
    },

    pauseOutCoin() {
      this.machine.pauseOutCoin();
    },

    onOutCoinCompleted(amount) {
      this.outedAmount = amount;
    },

    clearCoin() {
      this.machine.clearCoin();
    },

    pauseClearCoin() {
      this.machine.pauseClearCoin();
    },

    continueClearCoin() {
      this.machine.continueClearCoin();
    },

    cupStatusChange(val) {
      console.log(val);
      this.machine.setCoinCupModel(val);
    },

    async getMachineID() {
      this.id = await this.machine.getIdAndVersion();
      this.version = this.machine.version;
      // console.log(id);
    },
  },
};
</script>

