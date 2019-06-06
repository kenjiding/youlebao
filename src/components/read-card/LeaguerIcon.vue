<template>
  <div class="leaguer-icon">
    <div>
      <div/>
      <div/>
      <ych-svg-icon
        icon-name="head"
        width="34px"
        height="34px"
        class="icon-head"
      />
    </div>
    <ych-svg-icon
      icon-name="body"
      width="32px"
      height="32px"
      class="icon-body"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.leaguer-icon {
  width: 40px;
  height: 35px;
  padding-top: 2px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: $color-white;

  >div {
    width: 35px;
    height: 54px;
    animation: shake 5s;
    animation-iteration-count: infinite;
    position: relative;
    top: -2px;
    z-index: 30;

    >div {
      width: 2px;
      height: 4px;
      border-radius: $border-radius;
      background-color: $font-color-regular;
      position: absolute;
    }

    div:first-child {
      top: 13px;
      left: 12px;
      animation: wink 4s;
      animation-iteration-count: infinite;
      z-index: 100;
    }

    div:nth-child(2) {
      top: 13px;
      right: 13px;
      animation: wink 4s;
      animation-iteration-count: infinite;
      z-index: 100;
    }

    @keyframes wink {
      45% {
        height: 4px;
        top: 13px
      }
      50% {
        height: 1px;
        top: 15px
      }
      54% {
        height: 4px;
        top: 13px
      }
      58% {
        height: 4px;
        top: 13px
      }
      62% {
        height: 1px;
        top: 15px
      }
      66% {
        height: 4px;
        top: 13px
      }
      100% {
        height: 4px;
        top: 13px
      }
    }

    img {
      width: 26px;
      color: $color-danger;
    }
  }


  @keyframes shake {
    25% {transform: rotate(6deg);}
    // 50% {transform: rotate(0deg);}
    75% {transform: rotate(-6deg);}
    100% {transform: rotate(0deg);}
  }

  .icon-head{
    z-index: 50;
  }

  .icon-body{
    position: absolute;
    top: 14px;
    left: 3px;
    z-index: 20;
  }
}
</style>

