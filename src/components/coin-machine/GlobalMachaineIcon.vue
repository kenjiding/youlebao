<template>
  <div
    v-show="machineOn"
    class="icon-button">
    <el-button
      @click.native="clickCoinIcon">
      <img
        v-show="imgOn"
        src="../../assets/coinOn.png">
      <img
        v-show="!imgOn"
        src="../../assets/coinOff.png">
      <span
        :class="{spanText: true, textColor: !imgOn}">
        {{ `${imgOn ? allMachineInfo.Amont + '币' : '未连接'}` }}
      </span>
    </el-button>
    <machineIndex
      :dialog-visible.sync="dialogVisible"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { IS_DEVELOP } from '@/config';
import CoinMachineHelper from '@/main-process/devices/coin-machine/CoinMachineHelper';
import machineIndex from './index.vue';

export default {
  name: '',

  components: {
    machineIndex,
  },

  data() {
    return {
      machineOn: true,
      imgOn: false,
      machineInstance: null,
      dialogVisible: false,
      clickMark: false,
    };
  },

  computed: {
    ...mapState({
      machineModuleOpen: state => state.gobalConfig.IsEnable,
      allMachineInfo: state => state.machine.machineInfo,
    }),
  },

  watch: {
    machineModuleOpen(val) {
      if (val) {
        this.machineOn = true;
        this.init();
        this.connectAgain();
      } else {
        this.machineOn = false;
      }
    },
  },

  methods: {
    clickCoinIcon() {
      this.clickMark = true;
      this.init((val) => {
        if (val) {
          this.dialogVisible = true;
        } else {
          // this.$message({
          //   message: '售币机尚未连接',
          //   type: 'warning',
          // });
        }
      });
    },
    async init(callback) {
      let machineId = null;
      let versions = null;

      this.$store.commit('machine/changeMachineIsLink', false);

      this.machineInstance = await CoinMachineHelper.defaultMachine;

      if (this.machineInstance) {
        machineId = await this.machineInstance.getIdAndVersion();
        versions = this.machineInstance.version;
        this.$store.commit('machine/setVersion', {
          v: versions,
          id: machineId,
        });

        const mark = await this.machineInstance.isMachineLink;
        if (mark) {
          this.$store.commit('machine/changeMachineIsLink', true);
          // 新设备直接拉取售币机信息
          this.$store.dispatch('machine/getMachineInfo', this).then(() => {
            this.imgOn = true;
            callback && callback(this.imgOn);
          });
        } else {
          this.imgOn = false;
        }
      } else {
        this.imgOn = false;
        // this.connectAgain();
        if (this.clickMark) {
          this.$message({
            message: '售币机尚未连接',
            type: 'warning',
          });
        }
      }
    },

    connectAgain() {
      !IS_DEVELOP && setInterval(async () => {
        const status = await CoinMachineHelper.defaultMachine;
        if (status) {
          const mark = await status.isMachineLink;
          if (mark) {
            this.imgOn = true;
          }
        }
      }, 300000);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.textColor {
  color: rgba(255, 255, 255, .5) !important;
}

.icon-button {
  -webkit-app-region: no-drag;
  width: 120px;

  /deep/ .el-button {
    padding: 5px;
    background-color: rgba(255, 255, 255, 0);
    border: none;

    span {
      display: block;
      height: 25px;
      position: relative;
      width: 80px;

      img {
        margin: 0 5px;
        width: 17px;
        height: 25px;
      }
    }

    .spanText {
      display: inline-block;
      width: auto;
      position: relative;
      bottom: 6px;
      color: $color-white;
      font-size: $font-size-special;

      &:hover {
        color: $color-white !important;
      }
    }
  }
}
</style>
