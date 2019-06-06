<template>
  <ych-page>
    <div class="home">
      <router-view/>
    </div>
  </ych-page>
</template>

<script>
export default {
  name: 'Home',

  mounted() {
    // console.log(this.$api);
    // this.api['goods/goods/info']({ ID: 1 }).then(data => console.log(data));
  },
};
</script>
