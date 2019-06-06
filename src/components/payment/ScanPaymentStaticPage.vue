<template>
  <div class="scanpayment-static">
    <P class="scanpayment-static-title">您尚未开通【扫码收银】功能</p>
    <div class="scanpayment-static-main">
      <p class="scanpayment-static-main--title">扫码收银功能的优势：</p>
      <p>1.极速扫顾客收银码，不丢单不抹零；</p>
      <p>2.支持
        <span class="span-special">支付宝</span>、
        <span class="span-special">微信</span>，
        满足顾客多种支付方式；</p>
      <div class="support-show">
        <div>
          <img src="../../assets/alipay-logo.png">
          <p>支付宝支付</p>
        </div>
        <div>
          <img
            style="margin-top: 5px;"
            src="../../assets/wxpay-logo.png">
          <p>微信支付</p>
        </div>
      </div>
      <p>3.扫码交易率仅需<span class="span-special">0.45%</span>，同时享受微信支付宝奖励金等活动T+1到账。</p>
    </div>
    <P class="scanpayment-static-footer">立即开通，请联系客服电话：<span>400-9999-261</span></p>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.scanpayment-static{
  height: 563px;
  padding: 20px;

  &-title{
    margin-top: 20px;
    margin-left: 20px;
    line-height: 60px;
    font-size: $font-size-regular;
    color: $font-color-regular;
  }

  &-main{
    line-height: 30px;
    padding: 20px;
    background-color: $color-bg-regular;
    font-size: $font-size-primary;
    color: $font-color-secondary;

    &--title{
      margin-bottom: 10px;
      line-height: 20px;
      color: $font-color-regular;
    }

    .span-special {
      color: $color-primary;
    }

    .support-show {
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;

      div {
        width: 110px;
        text-align: center;
      }
    }
  }

  &-footer{
    margin-top: 47px;
    margin-left: 20px;
    line-height: 20px;
    font-size: $font-size-primary;
    color: $font-color-regular;

    span {
      font-size: $font-size-regular;
      color: $color-primary;
    }
  }

}
</style>
