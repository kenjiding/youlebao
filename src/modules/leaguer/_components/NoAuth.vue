<template>
  <div class="no-auth">
    <img src="../../../assets/no-auth.png">
    <p class="no-auth-title">{{ title }}</p>
    <p class="no-auth-content">{{ content }}</p>
  </div>
</template>

<script>
export default {
  name: 'NoAuth',

  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/styles/theme.scss';

.no-auth {
  width: 800px;
  height: 570px;
  margin: 40px auto;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  background-color: $color-white;
  // box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .4);
  $two-px: 2px;

  >img {
    width: 300px;
    height: 260px;
    margin: 70px 0;
  }

  &-title{
    color: $font-color-primary;
    font-size: $font-size-secondary - $two-px;
  }

  &-content{
    width: 560px;
    margin-top: 40px;
    line-height: 30px;
    color: $font-color-primary;
    font-size: $font-size-primary + $two-px;
  }
}
</style>

