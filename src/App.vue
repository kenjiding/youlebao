<template>
  <div id="app">
    <Main/>
  </div>
</template>

<script>
// eslint-disable-next-line
import { ipcRenderer, remote } from 'electron';
import { Main } from '@/modules/main';

export default {
  name: 'App',
  components: {
    Main,
  },

  created() {
    this.$store.dispatch('user/init', this);
  },
};
</script>

<style lang="scss">
@import '@/styles/theme.scss';

html,
body,
#app {
  width: 100%;
  height: 100%;
  background-color: $color-regular;
}
</style>
