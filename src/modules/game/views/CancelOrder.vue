<template>
  <ych-page>
    <cancel-order-content
      :is-dialog="false"/>
  </ych-page>
</template>

<script>
import CancelOrderContent from '../_components/CancelOrderContent.vue';

export default {
  name: 'CancelOrder',
  components: {
    CancelOrderContent,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style lang='scss' scoped>

</style>
