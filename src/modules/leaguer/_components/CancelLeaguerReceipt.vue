<template>
  <div>
    <!-- <print-web-view
      ref="printControl"
      :xml-data="XMLData"/> -->
    <!-- <canvas
      id="order-barCodeImage"
      ref="barCodeImage"
      class="receipt-canvas"
      style="display:none"/> -->
  </div>
</template>

<script>
// import jsbarcode from 'jsbarcode';
import { mapGetters } from 'vuex';
import PrintWebView from '@/modules/ticket/_components/PrintWebView.vue';

export default {
  name: 'CancelLeaguerReceipt',

  components: {
    PrintWebView,
  },

  props: {
    printContent: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      XMLData: '',
      localXml: '',
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
    yIndexPrimary() {
      return this.rowIndex * this.lineHeigh + this.extendTotalHeight;
    },
    receiptSizeXml() {
      return `<?xml version="1.0"?><C w="270" f="N" h="${this.yIndexPrimary + 10}">`;
    },
  },

  methods: {
    onPrint() {
      this.XMLData = '';
      this.localXml = '';
      this.extendTotalHeight = 0;
      if (this.defaultPrint.Logo) {
        this.getLogo();
      } else {
        this.$nextTick(() => {
          this.startPrint();
        });
      }
    },

    getLogo() {
      const logoImage = new Image();
      logoImage.src = this.defaultPrint.Logo;
      logoImage.onload = () => {
        if (logoImage.naturalWidth > 270) {
          this.logoWidth = 270;
          this.logoHeight = 270 *
            logoImage.naturalHeight / logoImage.naturalWidth;
        } else {
          this.logoWidth = logoImage.naturalWidth;
          this.logoHeight = logoImage.naturalHeight;
        }
        this.$nextTick(() => {
          this.startPrint();
        });
      };
    },

    startPrint() {
      this.createReceiptJson();
      this.XMLData = this.localXml;
      // console.log(this.XMLData);
      this.$createPrintWebView({
        $props: {
          printType: 'receiptsPrint',
          XmlData: 'XMLData',
        },
        onComplete() {
          // console.log('打印完成');
        },
      });
    },

    createReceiptJson() {
      this.rowIndex = 0;
      // jsbarcode('#order-barCodeImage', this.printContent.Order.OrderNum, {
      //   font: '微软雅黑',
      //   height: 30,
      // });
      // const img = this.$refs.barCodeImage.toDataURL('image/png');

      if (this.defaultPrint.Logo) {
        this.addImg(this.defaultPrint.Logo, this.logoWidth, this.logoHeight);
      }
      if (this.defaultPrint.TicketHead) {
        this.addCenterRow(this.defaultPrint.TicketHead, 16);
      }
      // this.addImg(img, 220, 50);
      if (this.printContent.LeaguerCode) {
        this.addRow('会员卡号:', `${this.printContent.LeaguerCode}`);
      }
      this.addUnderLine();
      if (this.printContent.LgCancelValues && this.printContent.LgCancelValues.length > 0) {
        this.printContent.LgCancelValues.forEach((value) => {
          this.addRow('储值变更清单-', `${value.ValueName}`);
          this.addUnderLine();
          this.addLogListRow('日期', '变更', '备注');
          this.addUnderLine();
          value.Records.forEach((item) => {
            const summaryArr = this.getMultipleline(item.Summary);
            summaryArr.forEach((name, index) => {
              if (index === 0) {
                this.addLogListRow(
                  item.Date,
                  item.ChangeValue,
                  summaryArr[index],
                );
              } else {
                this.addGoodsMultipleRow(summaryArr[index]);
              }
            });
          });
          this.addUnderLine();
        });
      }

      this.addRow('合计退款:', this.$number(this.printContent.ReturnMoney).format('0.00'));
      this.addUnderLine();
      // this.addRow('操作人:', this.printContent.Order.OperateEmployeeName);
      // this.addRow('操作终端:', this.printContent.Order.Terminal);
      // this.addRow('门店:', this.printContent.Order.OpenBusinessName);
      if (this.defaultPrint.TicketTail) {
        this.addCenterRow(this.defaultPrint.TicketTail, 16, 12);
      }
      if (this.defaultPrint.TicketCode) {
        this.addCenterRow('扫此二维码，实时查看账户余额', 12, 16);
        this.addQRCode(
          this.defaultPrint.TicketCode,
          this.QRCodeWidth,
          this.QRCodeHeight,
        );
      }

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

    addImg(value, width, height) {
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
        t="DynamicImageItem">${value}</I>`;
      this.extendTotalHeight += height;
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

    addUnderLine(title) {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="270" 
        h="10" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" si="${this.fontSize}" 
        t="DynamicTextItem">------------------${title || '------'}------------------</I>`;
    },

    addLogListRow(date, changeValue, summary) {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="90" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${date}</I>`;
      this.localXml += `<I 
        x="90" 
        y="${this.yIndexPrimary}" 
        w="90" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${changeValue}</I>`;
      this.localXml += `<I 
        x="180" 
        y="${this.yIndexPrimary}" 
        w="90" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${summary}</I>`;
    },

    addGoodsMultipleRow(goodsName) {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="120" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${goodsName}</I>`;
    },

    getMultipleline(val) {
      const str = String(val);
      let bytesCount = 0;
      let s = '';
      const arr = [];
      for (let i = 0, n = str.length; i < n; i++) {
        const c = str.charCodeAt(i);
        // 统计字符串的字符长度
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          bytesCount += 1;
        } else {
          bytesCount += 2;
        }
        // 换行
        s += str.charAt(i);
        if (bytesCount >= 10 || i === n - 1) {
          arr.push(s);
          // 重置
          s = '';
          bytesCount = 0;
        }
      }
      return arr;
    },

    addPayListRow(payTypeName, payedMoney) {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="100" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${payTypeName}</I>`;
      this.localXml += `<I 
        x="206" 
        y="${this.yIndexPrimary}" 
        w="43" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${payedMoney}</I>`;
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

