<template>
  <el-dialog
    :visible="dialogVisible"
    :append-to-body="true"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="设置售币机"
    width="600px"
    class="wrap"
    @close="closeDialogHandle">
    <div class="content">
      <div class="content-left">
        <img
          v-show="!buttonDisabled"
          src="../../assets/coinOn.png">
        <img
          v-show="buttonDisabled"
          src="../../assets/coinOff.png">
      </div>
      <div
        class="content-right">
        <div v-show="imgOn">
          <p class="pText">
            <span>{{ machineInfo.CoinTerStateName }}</span>
            <span :style="{color: machineTextColor}">{{ machineStatus }}</span>
          </p>
          <p>ID: {{ machineInfo.BindCoinTerID }}</p>
          <p>版本号：{{ machineInfo.Version }}</p>
        </div>

        <div
          v-show="!imgOn"
          class="content-right-off">
          <p>
            <span>售币机：</span>
            <span :style="{color: machineTextColor}">{{ machineStatus }}</span>
          </p>
          <el-select
            v-model="value"
            :disabled="buttonDisabled"
            placeholder="请选择"
            @change="machineChange">
            <el-option
              v-for="item in machineList"
              :key="item.TermID"
              :label="item.TermName"
              :value="item.TermID"/>
          </el-select>
        </div>

        <div
          class="content-botton">
          <span>{{ machineInfo.Amont }}</span>
          <span>个</span>
        </div>
      </div>
      <div :style="{clear: 'both',}"/>
      <!-- <div class="rect-shadow"/> -->
    </div>

    <div
      slot="footer"
      class="dialog-footer">
      <div v-show="imgOn">
        <el-checkbox
          v-model="checked"
          :disabled="buttonDisabled"
          @change="checkboxChange">出币时检测币杯</el-checkbox>
        <p>当售币机无币杯时暂停出币</p>
      </div>
      <div>
        <el-button
          :disabled="buttonDisabled"
          type="primary"
          @click="clickHandle('add')">加币</el-button>
        <el-button
          :disabled="buttonDisabled"
          type="primary"
          @click="clickHandle('clear')">清币</el-button>
      </div>
    </div>
    <!-- <div
      v-show="!imgOn"
      slot="footer"
      class="dialog-footer">
      <el-button
        :disabled="buttonDisabled"
        :loading="buttonLoading"
        class="list-button"
        type="primary"
        @click="selectChange">确认</el-button>
    </div> -->
    <AddCoinDialog
      :addcion-visible.sync="addcionVisible"
      :setting="true"
      @success="selectChange"/>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import CoinMachineHelper from '@/main-process/devices/coin-machine/CoinMachineHelper';
import InventoryCoinDialog from './components/InventoryCoinDialog.vue';
import AddCoinDialog from './components/AddCoinDialog.vue';

export default {
  name: '',

  components: {
    InventoryCoinDialog,
    AddCoinDialog,
  },

  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      imgOn: true,
      machineStatus: '设备未连接',
      buttonDisabled: false,
      machineTextColor: '#E54B5E',
      checked: false,
      inventoryCionVisible: false,
      addcionVisible: false,
      value: '',
      version: null,
      machineId: null,
      machineInstance: null,
      machineList: [],
      CoinTerID: '',
      buttonLoading: false,
    };
  },

  computed: {
    ...mapState({
      machineInfo: state => state.machine.machineInfo,
      machineIsLink: state => state.machine.machineIsLink,
      machineID: state => state.machine.machineID,
    }),
  },

  watch: {
    dialogVisible(val) {
      if (!val) return;
      this.componentInit();
    },
  },

  methods: {
    clickHandle(item) {
      this.$authorization(206001601).then((res) => {
        if (!res) return;
        const operation = {
          add: () => {
            this.addcionVisible = true;
          },
          clear: this.clearCoinHandle,
        };

        operation[item] && operation[item]();
      });
    },
    machineChange(val) {
      this.CoinTerID = val;
      this.selectChange();
    },
    clearCoinHandle() {
      const _this = this;
      this.inventoryCionVisible = true;
      this.$createInventoryCoinDialog({
        $props: {
          inventorycionVisible: 'inventoryCionVisible',
          clearButton: true,
          setting: true,
        },
        $events: {
          closeDialog() {
            _this.inventoryCionVisible = false;
          },
        },
      });
    },
    selectChange() {
      this.buttonLoading = true;
      this.$api['physicalCoin/bindCoinTer']({
        CoinTerID: this.CoinTerID,
      }).then((res) => {
        this.$store.commit('machine/saveMachineInfo', res);
        // this.imgOn = true;
        this.buttonLoading = false;
      }, () => { this.buttonLoading = false; });
    },
    async componentInit() {
      this.machineInstance = await CoinMachineHelper.defaultMachine;

      // 判断售币机是新设备还是旧设备
      if (this.machineID) {
        const cupOpen = this.$electronStore.get('cupIsOpen');

        this.checked = cupOpen;
        this.imgOn = true;
        this.machineInstance.setCoinCupModel(cupOpen);
      } else {
        this.imgOn = false;
        this.getMachineList();
      }

      this.checkMachineIsLink();
    },
    checkMachineIsLink() {
      // 判断设备是否已经连上收银台
      if (this.machineIsLink) {
        this.machineStatus = '设备已连接';
        this.buttonDisabled = false;
        this.machineTextColor = '#67C23A';
      } else {
        this.buttonDisabled = true;
        this.machineTextColor = '#E54B5E';
        this.machineStatus = '设备未连接';
      }
    },
    getMachineList() {
      this.$api['physicalCoin/getPhysicalCoinTer']({
        IsNew: false,
      }).then((res) => {
        this.machineList = res.DataList;

        const hasID = this.machineList.find(item => item.TermID === this.machineInfo.BindCoinTerID);

        if (hasID) {
          this.value = this.machineInfo.BindCoinTerID;
          this.CoinTerID = this.machineInfo.BindCoinTerID;
        }
      });
    },
    getStatusMethods() {
      if (this.machineIsLink) {
        this.buttonDisabled = false;
        this.machineTextColor = '#67C23A';
        return '设备已连接';
      }
      this.buttonDisabled = true;
      this.machineTextColor = '#E54B5E';
      return '设备未连接';
    },
    checkboxChange(val) {
      this.machineInstance.setCoinCupModel(val);

      this.$electronStore.set('cupIsOpen', val);
    },
    closeDialogHandle() {
      this.$emit('update:dialogVisible', false);
    },
    handleClose(done) {
      done();
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";


.content-botton {
  height: 60px;
  line-height: 60px;
  text-align: left;
  position: relative;
  z-index: 2000;

  span {
    font-size: $font-size-bigger;
    // stylelint-disable-next-line
    color: #F5A623;

    &:nth-child(2) {
      font-size: $font-size-regular;
    }
  }
}

.list-button {
  width: 320px;
  margin: 0 auto;
  display: block;
}

.wrap {
  /deep/ .el-dialog__footer {
    border-top: 1px solid $border-color;
    padding: 20px;
    overflow: hidden;
  }

  /deep/ .el-dialog__header {
    border-bottom: 1px solid $border-color;
  }
}

.content-right-off {
  margin-top: 50px;

  p {
    width: 239px;
    span {
      display: inline-block;
      width: 50%;

      &:nth-child(2) {
        text-align: right;
      }
    }
  }
}


.dialog-footer {
  div {
    float: left;
    width: 50%;
    height: 40px;
    text-align: left;
    color: $font-color-placeholder;
    font-size: $font-size-primary;

    &:nth-child(2) {
      text-align: right;
      float: right;

      /deep/ .el-button {
        width: 110px;
      }
    }

    p {
      padding: 10px 0 0 22px;
    }
  }
}

.rect-shadow {
  width: 90%;
  height: 0;
  border-width: 0 30px 30px;
  border-style: solid;
  border-color: transparent transparent $color-bg-table;/*灰 透明 透明 */
  margin: auto;
  position: absolute;
  bottom: 20px;
  z-index: 2;
}

.content {
  width: 100%;
  height: 250px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    clear: both;
  }
}

.content-left {
  width: 40%;
  height: 90%;
  float: left;

  img {
    display: block;
    margin: 20px auto;
    position: relative;
    top: 0;
    z-index: 2000;
  }
}

.content-right {
  float: left;
  width: 60%;
  height: 80%;
  padding-left: 40px;
  box-sizing: border-box;

  p {
    line-height: 30px;
    text-align: left;

    &:nth-child(2) {
      margin-top: 20px;

      @include ellipsis(1);
    }
  }
}

.pText {
  vertical-align: middle;
  margin-top: 50px;

  span {
    &:nth-child(1) {
      display: inline-block;
      width: 200px;
      font-size: $font-size-regular;

      @include ellipsis(1);
    }

    &:nth-child(2) {
      color: $color-success;
      margin-left: 20px;
    }
  }
}

</style>
