<template>
  <div>
    <!-- <print-web-view
      ref="printControl"
      :xml-data="XMLData"/> -->
    <canvas
      id="exchange-barCodeImage"
      ref="barCodeImage"
      class="receipt-canvas"
      style="display:none"/>
  </div>
</template>

<script>
import jsbarcode from 'jsbarcode';
import { sumBy } from 'lodash';
import { mapGetters } from 'vuex';
import PrintWebView from '@/modules/ticket/_components/PrintWebView.vue';

export default {
  name: 'ExchangeReceipt',

  components: {
    PrintWebView,
  },

  props: {
    orderId: {
      type: String,
      default: '',
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
    onPrint(isReprint) {
      this.localXml = '';
      this.XMLData = '';
      this.extendTotalHeight = 0;
      const apiName = isReprint ? 'rePrintExchangeOrderTicket' : 'getExchangeOrderTicket';
      this.$api[`goods-exchange/exchange/${apiName}`]({
        ExchangeOrderID: this.orderId,
      }).then((res) => {
        if (res.ExchangeGoodsList.length <= 0) {
          return;
        }
        if (this.defaultPrint.Logo) {
          this.getLogo(res);
        } else {
          this.startPrint(res);
        }
      }, () => {});
    },

    getLogo(data) {
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
          this.startPrint(data);
        });
      };
    },

    startPrint(data) {
      this.createReceiptJson(data);
      this.XMLData = this.localXml;

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

    createReceiptJson(ExchangeInfo) {
      this.rowIndex = 0;
      jsbarcode('#exchange-barCodeImage', ExchangeInfo.ExchangeNum, {
        font: '微软雅黑',
        height: 30,
      });
      const img = this.$refs.barCodeImage.toDataURL('image/png');
      if (this.defaultPrint.Logo) {
        this.addImg(this.defaultPrint.Logo, this.logoWidth, this.logoHeight);
      }

      if (this.defaultPrint.TicketHead) {
        this.addCenterRow(this.defaultPrint.TicketHead, 16);
      }
      this.addImg(img, 220, 50);
      this.addRow('会员:', `[${ExchangeInfo.LeaguerCode}]${ExchangeInfo.LeaguerName || ''}`);
      this.addRow('时间:', ExchangeInfo.LogTime);
      this.addUnderLine();
      this.addGoodsListRow('商品', '兑换价', '数量', '小计');
      this.addUnderLine();
      ExchangeInfo.ExchangeGoodsList.forEach((item) => {
        const goodsNameArr = this.getMultipleline(item.GoodsName);
        goodsNameArr.forEach((name, index) => {
          if (index === 0) {
            this.addGoodsListRow(
              goodsNameArr[index],
              item.OriginalPrice,
              item.Amount,
              item.TotalPrice,
            );
          } else {
            this.addGoodsMultipleRow(goodsNameArr[index]);
          }
        });
      });
      this.addUnderLine();
      this.addRow('总兑换价:', ExchangeInfo.OriginalTotalPrice, 120);
      this.addRow('优惠:', sumBy(ExchangeInfo.ExchangeGoodsList, 'TotalDiscount'), 120 + this.fontSize * 2);
      this.addRow('实兑换价:', ExchangeInfo.TotalPrice, 120);
      this.addUnderLine();
      this.addRow(`消耗${ExchangeInfo.ExchangeValueType}:`, ExchangeInfo.TotalPrice, 120);
      this.addRow(`${ExchangeInfo.ExchangeValueType}余额:`, ExchangeInfo.AccountRemain, 120);

      this.addUnderLine();
      this.addRow('收款人:', ExchangeInfo.Operator);
      this.addRow('终端:', ExchangeInfo.Terminal, this.fontSize);
      this.addRow('门店:', ExchangeInfo.BusinessName, this.fontSize);
      if (this.defaultPrint.TicketTail) {
        this.addCenterRow(this.defaultPrint.TicketTail, 16, 12);
      }
      if (this.defaultPrint.TicketCode) {
        this.addCenterRow('扫此二维码，实时查看账户余额', this.fontSize, this.fontSize);
        this.addQRCode(
          this.defaultPrint.TicketCode,
          this.QRCodeWidth,
          this.QRCodeHeight,
        );
      }
      this.localXml = this.receiptSizeXml + this.localXml;
      this.localXml += '</C>';
    },

    addRow(title, value, marginLeft) {
      this.rowIndex++;
      const titleWidth = title.length * this.fontSize;
      if (title) {
        this.localXml += `<I 
        x="${marginLeft || 0}" 
        y="${this.yIndexPrimary}" 
        w="${titleWidth}" 
        h="22" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicTextItem">${title}</I>`;
      }
      this.localXml += `<I 
        x="${titleWidth + (marginLeft || 0)}" 
        y="${this.yIndexPrimary}" 
        w="${270 - titleWidth}" 
        h="22" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicTextItem">${value}</I>`;
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

    addUnderLine() {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="270" 
        h="10" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" si="${this.fontSize}" 
        t="DynamicTextItem">------------------------------------------</I>`;
    },

    addRowWithItems(items) {
      this.rowIndex++;
      const itemWidth = 270 / items.length;
      items.forEach((item, index) => {
        const titleWidth = item.title.length * this.fontSize;
        this.localXml += `<I 
        x="${(itemWidth * index).toFixed(0)}" 
        y="${this.yIndexPrimary}" 
        w="${titleWidth}" 
        h="22" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicTextItem">${item.title}</I>`;
        this.localXml += `<I 
        x="${((itemWidth * index) + titleWidth).toFixed(0)}" 
        y="${this.yIndexPrimary}" 
        w="${itemWidth - titleWidth}" 
        h="22" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicTextItem">${item.value}</I>`;
      });
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
        y="${this.yIndexPrimary - 10}" 
        w="${width}" 
        h="${height}" 
        r="0" 
        n="" 
        f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="DynamicQRCodeItem">${value}</I>`;
      this.extendTotalHeight += height;
    },

    addGoodsListRow(goodsName, discountPrice, amount, total) {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="120" 
        h="22" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${goodsName}</I>`;
      this.localXml += `<I 
        x="120" 
        y="${this.yIndexPrimary}" 
        w="43" 
        h="22" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${discountPrice}</I>`;
      this.localXml += `<I 
        x="166" 
        y="${this.yIndexPrimary}" 
        w="40" 
        h="22" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${amount}</I>`;
      this.localXml += `<I 
        x="206" 
        y="${this.yIndexPrimary}" 
        w="43" 
        h="22" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${total}</I>`;
    },

    addGoodsMultipleRow(goodsName) {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="120" 
        h="22" 
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
        if (bytesCount >= 14 || i === n - 1) {
          arr.push(s);
          // 重置
          s = '';
          bytesCount = 0;
        }
      }
      return arr;
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
