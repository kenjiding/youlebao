<template>
  <ych-page
    class="body-wrap"
    bg>
    <swiping-card-content
      ref="SwipingCardContent"/>
      <!-- <printWebView
      ref="SwipingprintWebView"
      :xml-data="xmlData"/> -->
  </ych-page>
</template>

<script>
import SwipingCardContent from '../_components/SwipingCardContent.vue';

export default {
  name: 'SwipingCard',
  components: {
    SwipingCardContent,
  },

  data() {
    return { };
  },
  computed: {},
  activated() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.SwipingCardContent.autoRead();
      }, 500);
      this.$refs.SwipingCardContent.getMachineList();
    });
  },
  deactivated() {
    this.$refs.SwipingCardContent.clearRead();
  },
  methods: {},
};
</script>

<style lang='scss' scoped>

</style>
