<template>
  <div>
    <!-- <print-web-view
      ref="printControl"
      :xml-data="XMLData"/> -->
    <canvas
      id="lottery-barCodeImage"
      ref="barCodeImage"
      class="receipt-canvas"
      style="display:none"/>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PrintWebView from '@/modules/ticket/_components/PrintWebView.vue';

export default {
  name: 'OrderReceipt',

  components: {
    PrintWebView,
  },

  props: {
    printData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      XMLData: '',
      localXml: '',
      currentPrintCount: 0,
      rowIndex: 0,
      fontSize: 14,
      lineHeigh: 22,
      logoWidth: 0,
      logoHeight: 0,
      QRCodeWidth: 200,
      QRCodeHeight: 200,
      extendTotalHeight: 0,
    };
  },

  computed: {
    ...mapGetters({
      defaultPrint: 'gobalConfig/getReceiptPrintSetting',
    }),
    ...mapState({
      userInfo: state => state.user.info,
    }),
    yIndexPrimary() {
      return this.rowIndex * this.lineHeigh + this.extendTotalHeight;
    },
    receiptSizeXml() {
      return `<?xml version="1.0"?><C w="270" f="N" h="${this.yIndexPrimary + 10}">`;
    },
  },

  methods: {
    onPrint() {
      if (!this.defaultPrint.TerminalCanPrint) {
        this.$emit('complete');
        return;
      }
      this.XMLData = '';
      this.localXml = '';
      this.currentPrintCount = 0;
      this.extendTotalHeight = 0;
      this.$nextTick(() => {
        this.startPrint();
      });
    },

    startPrint() {
      this.createReceiptJson(this.printData);
      this.XMLData = this.localXml;
      this.currentPrintCount++;
      const that = this;

      this.$createPrintWebView({
        $props: {
          printType: 'receiptsPrint',
          XmlData: 'XMLData',
        },
        onComplete() {
          that.$emit('complete');
        },
        onCancel() {
          that.$emit('cancel');
        },
      });
    },

    createReceiptJson(data) {
      this.rowIndex = 0;
      this.addCenterRow('散客存票凭证', 20);
      this.addRow('存票地址:', `${this.userInfo.BusinessName}[${this.userInfo.Termina.TerminalName}]`);
      this.addRow('存票时间:', data.LogTime);
      this.addRow('存票单号:', data.TempNum);
      this.addCenterRow(`票数:${data.LotteryCount}`, 16);
      if (data.YKBUrl) {
        this.addQRCode(
          data.YKBUrl.replace('&', '').replace('&s', 's'),
          this.QRCodeWidth,
          this.QRCodeHeight,
        );
      }
      this.addCenterRow('热敏纸保存时间有限', 12);
      this.addCenterRow('请尽快存入会员卡, 或用微信扫码存入手机', 12);
      // this.addCenterRow('或用微信扫码存入手机', 16);


      this.localXml = this.receiptSizeXml + this.localXml;
      this.localXml += '</C>';
    },

    addCenterRow(value, fontSize, margin) {
      this.rowIndex++;
      const rowWidth = value.length * fontSize;
      const rowX = 135 - rowWidth / 2;
      this.localXml += `<I 
        x="${rowX.toFixed(0)}" 
        y="${this.yIndexPrimary + (margin || 0)}" 
        w="${270 - rowWidth}" 
        h="${fontSize + 8}" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${fontSize}" 
        t="DynamicTextItem">${value}</I>`;
      this.extendTotalHeight += 8 + fontSize - this.fontSize + (margin || 0);
    },

    addRow(title, value) {
      this.rowIndex++;
      let titleWidth = 0;
      if (title) {
        titleWidth = title.length * this.fontSize;
        this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="${titleWidth}" 
        h="20" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicTextItem">${title}</I>`;
      }
      this.localXml += `<I 
        x="${titleWidth}" 
        y="${this.yIndexPrimary}" 
        w="${270 - titleWidth}" 
        h="20" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicTextItem">${value}</I>`;
    },

    addQRCode(value, width, height) {
      this.rowIndex++;
      const rowX = width ? (135 - width / 2) : 0;
      this.localXml += `<I 
        x="${rowX}" 
        y="${this.yIndexPrimary}" 
        w="${width}" 
        h="${height}" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicQRCodeItem">${value}</I>`;
      this.extendTotalHeight += height;
    },


  },

};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.receipt-canvas{
  height: 50px;
}
</style>

