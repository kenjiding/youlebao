<template>
  <svg
    :style="{ height: height, width: width }"
    aria-hidden="true">
    <use :xlink:href="'#icon-'+iconName"/>
  </svg>
</template>

<script type="text/javascript">
import '../../styles/svg/iconfont';

export default {
  name: 'YchSvgIcon',
  props: {
    iconName: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '80px',
    },
    width: {
      type: String,
      default: '80px',
    },
  },
  data() {
    return {
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
