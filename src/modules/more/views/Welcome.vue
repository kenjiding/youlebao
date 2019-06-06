<template>
  <ych-page
    bg
    class="more-page">
    <div class="welcome-box">
      <img src="../../../assets/welcome.png">
      <div class="slogan">油菜花•游乐宝</div>
    </div>
  </ych-page>
</template>

<script type="text/javascript">

export default {
  name: 'More',
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';
.welcome-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 150px;
    margin-bottom: 20px;
  }
}
.slogan {
  font-size: $font-size-bigger;
  color: rgba($color-white, .6);
}
</style>
