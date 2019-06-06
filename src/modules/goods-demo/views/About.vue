<template>
  <div class="about">
    <a
      href="https://www.sdsh.com">测试</a>
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
    <el-button @click="onReaderCallClick">读卡器检测</el-button>
    <el-button @click="onGetLeaguerClick">读取会员卡</el-button>
    <el-button @click="onIDReaderCallClick">身份证检测</el-button>
    <el-button @click="autoUpdate">更新</el-button>
    <el-progress
      :text-inside="true"
      :stroke-width="18"
      :percentage="percentage"/>
    <h1
      v-for="n in 50"
      :key="n"
      :class="`h1-${n}`"
      class="color-background">
      This is an about page
    </h1>
  </div>
</template>

<script>
// eslint-disable-next-line
import { ipcRenderer, remote } from 'electron';

export default {
  data: () => ({
    card: '',
    inputNumber: 1,
    imgSrc: '',
    percentage: 0,
  }),

  created() {
    // this.$api['leaguer/getLeaguerListByCard']({
    //   DeviceLgID: 123,
    //   DeviceType: 123,
    // });
    // this.$localLog.warn('render log');
  },

  mounted() {
    this.onMessage();
    window.jiaxinCallback.on('departSession', (result) => {
      console.log(result);
      console.log('结束');
    });
  },

  methods: {
    showJiaXinService() {
      window.jiaxinTogglerDiv();
    },
    onReaderCallClick() {
      const value = ipcRenderer.sendSync('readerCall');
      this.$message({
        showClose: true,
        message: value,
        type: 'success',
      });
    },
    onGetLeaguerClick() {
      const value = ipcRenderer.sendSync('readEmpCard');
      if (value.errorCode === 0) {
        this.$message({
          showClose: true,
          message: value,
          type: 'success',
        });
      } else {
        this.$message({
          showClose: true,
          message: value,
          type: 'warning',
        });
      }
    },

    onIDReaderCallClick() {
      const value = ipcRenderer.sendSync('readIDCard');
      if (value.errorCode === 0) {
        this.imgSrc = value.imgSrc;
        this.$message({
          showClose: true,
          message: value,
          type: 'success',
        });
      } else {
        this.$message({
          showClose: true,
          message: value,
          type: 'warning',
        });
      }
    },

    onMessage() {
      ipcRenderer.on('message', (event, { message, data }) => {
        // this.$message(message);
        console.log(message);
        console.log(data);
        if (message === 'isUpdateNow') {
          this.$confirm('是否更新', '提示', {
            confirmButtonText: '更新',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            ipcRenderer.send('updateNow');
          }).catch();
        }
      });
    },

    autoUpdate() {
      ipcRenderer.send('autoUpdate');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.color-background {
  height: 100px;
}

.h1-1 {
  background-color: $color-regular-light-0;
}
.h1-2 {
  background-color: $color-regular-light-1;
}
.h1-3 {
  background-color: $color-regular-light-2;
}
.h1-4 {
  background-color: $color-regular-light-3;
}
.h1-5 {
  background-color: $color-regular-light-4;
}
.h1-6 {
  background-color: $color-regular-light-5;
}
.h1-7 {
  background-color: $color-regular-light-6;
}
.h1-8 {
  background-color: $color-regular-light-7;
}
.h1-9 {
  background-color: $color-regular-light-7;
}
.h1-10 {
  background-color: $color-regular-light-9;
}


</style>

