<template>
  <ych-page>
    <check-ticket-content
      :is-dialog="false"/>
  </ych-page>
</template>

<script>
import CheckTicketContent from '../_components/CheckTicketContent.vue';

export default {
  name: 'CheckTicket',
  components: {
    CheckTicketContent,
  },
  data() {
    return {};
  },
  computed: { },
  created() {},
};
</script>

<style lang='scss' scoped>

</style>
