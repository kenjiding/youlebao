<template>
  <!-- :class="platform === 'macintel' ? 'control-bar--mac' : 'control-bar--win'" -->
  <el-row
    class="control-bar">
    <el-col
      v-for="(icon, key) in icons"
      :key="key"
      :span="8"
      :class="'control-bar__item--' + key"
      class="control-bar__item"
      @click.native="handleClickEvent(key)">
      <i
        :class="icon"
        hover/>
    </el-col>
  </el-row>
</template>

<script type="text/javascript">
// eslint-disable-next-line
import { ipcRenderer } from 'electron';

export default {
  name: 'ControlBar',
  data() {
    return {
      icons: {
        zoomOut: 'ych-icon-small',
        resize: 'ych-icon-zoom',
        close: 'ych-icon-close',
      },
      platform: window.navigator.platform.toLowerCase(),
      size: 'min',
    };
  },
  mounted() {
    ipcRenderer.on('resizeContent', (event, arg) => {
      this.icons.resize = arg === 'max' ? 'ych-icon-border' : 'ych-icon-zoom';
    });
  },
  methods: {
    handleClickEvent(type) {
      const eventMap = {
        zoomOut: this.zoomOut,
        resize: this.resize,
        close: this.close,
      };
      const fn = eventMap[type];
      fn && fn();
    },

    zoomOut() {
      ipcRenderer.send('zoomOut');
    },

    resize() {
      ipcRenderer.send('resize');
    },

    close() {
      ipcRenderer.send('close');
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';

.control-bar {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 120px;
  padding: 0 10px;
  margin: 10px 0;
  height: 30px;
  border-left: 1px solid rgba($color-white, .2);
  position: fixed;
  top: 0;
  right: 0;
  -webkit-app-region: no-drag;

  // &--mac {
  //   right: 0;
  // }

  // &--win {
  //   left: 0;
  // }

  i {
    font-size: $font-size-regular;
    color: rgba($color-white, .5);
  }
}

.control-bar__item {
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: no-drag;

  &:hover {
    i{
      color: $color-white;
    }
  }
  i,
  i::before {
    cursor: pointer;
  }
  &--close i {
    &:hover {
      color: $color-danger;
    }
  }
}

</style>
