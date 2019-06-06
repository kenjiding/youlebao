<template>
  <ych-page>
    <join-meal-select/>
  </ych-page>
</template>

<script>
import JoinMealSelect from '@/modules/join/_components/JoinMealSelect.vue';

export default {
  name: 'JoinIndex',

  components: {
    JoinMealSelect,
  },

};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";


</style>

