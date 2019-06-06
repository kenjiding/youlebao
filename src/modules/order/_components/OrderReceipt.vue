<template>
  <div>
    <!-- <print-web-view
      ref="printControl"
      :xml-data="XMLData"/> -->
    <canvas
      id="order-barCodeImage"
      ref="barCodeImage"
      class="receipt-canvas"
      style="display:none"/>
  </div>
</template>

<script>
import jsbarcode from 'jsbarcode';
import { mapGetters } from 'vuex';
import PrintWebView from '@/modules/ticket/_components/PrintWebView.vue';

export default {
  name: 'OrderReceipt',

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
    yIndexPrimary() {
      return this.rowIndex * this.lineHeigh + this.extendTotalHeight;
    },
    receiptSizeXml() {
      return `<?xml version="1.0"?><C w="270" f="N" h="${this.yIndexPrimary + 10}">`;
    },
  },

  methods: {
    onPrint(isReprint) {
      if (!isReprint && !this.defaultPrint.TerminalCanPrint) {
        this.$emit('complete');
        return;
      }
      this.XMLData = '';
      this.localXml = '';
      this.currentPrintCount = 0;
      this.extendTotalHeight = 0;
      const apiName = isReprint ? 'getOrderRePrintInfo' : 'getOrderPrintInfo';
      this.$api[`order/order/${apiName}`]({
        OrderID: this.orderId,
      }).then((res) => {
        if (!res.OrderItems || !res.OrderItems.length) {
          if (isReprint) {
            this.$message({
              message: '订单所包含的商品都无需打印',
              type: 'warning',
            });
          } else {
            this.$emit('complete');
          }
          return;
        }
        if (this.defaultPrint.Logo) {
          this.getLogo(res);
        } else {
          this.startPrint(res, isReprint);
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

    startPrint(data, isReprint) {
      this.createReceiptJson(data);
      this.XMLData = this.localXml;
      this.currentPrintCount++;
      const that = this;

      this.$createPrintWebView({
        $props: {
          printType: 'receiptsPrint',
          XmlData: 'XMLData',
        },
        onComplete() {
          that.printLoop(isReprint);
        },
        onCancel() {
          !isReprint && that.$emit('cancel');
        },
      });
    },

    printLoop(isReprint) {
      if (this.defaultPrint.PrintCount === this.currentPrintCount) {
        !isReprint && this.$emit('complete');
        return;
      }
      this.currentPrintCount++;
      this.XMLData = '';
      this.$nextTick(() => {
        this.XMLData = this.localXml;
      });
    },

    createReceiptJson(orderInfo) {
      this.rowIndex = 0;
      jsbarcode('#order-barCodeImage', orderInfo.Order.OrderNum, {
        font: '微软雅黑',
        height: 30,
        fontOptions: '600',
      });
      const img = this.$refs.barCodeImage.toDataURL('image/png');

      if (this.defaultPrint.Logo) {
        this.addImg(this.defaultPrint.Logo, this.logoWidth, this.logoHeight);
      }
      if (this.defaultPrint.TicketHead) {
        this.addCenterRow(this.defaultPrint.TicketHead, 16);
      }
      this.addImg(img, 220, 50);
      if (orderInfo.Order.LeaguerCode) {
        this.addRow('会员:', `[${orderInfo.Order.LeaguerCode}]${orderInfo.Order.LeaguerName || ''}`);
      }
      if (orderInfo.Order.PrepaidValue) {
        this.addRow('余额:', this.$number(orderInfo.Order.PrepaidValue).format('0.00'));
      }
      this.addRow('时间:', orderInfo.Order.LogTime);
      if (orderInfo.Order.Summary) {
        this.addRow('备注:', orderInfo.Order.Summary);
      }
      this.addUnderLine();
      this.addGoodsListRow('商品', '单价', '数量', '小计', true);
      this.addUnderLine();
      orderInfo.OrderItems.forEach((item) => {
        const goodsNameArr = this.getMultipleline(item.GoodsName);
        goodsNameArr.forEach((name, index) => {
          if (index === 0) {
            this.addGoodsListRow(
              goodsNameArr[index],
              this.$number(item.Price).format('0.00'),
              item.Amount,
              this.$number(item.Price * item.Amount).format('0.00'),
            );
          } else {
            this.addGoodsMultipleRow(goodsNameArr[index]);
          }
        });
      });
      this.addUnderLine();
      this.addRow('合计:', this.$number(orderInfo.Order.TotleMoney).format('0.00'));
      this.addRow('优惠:', this.$number(orderInfo.Order.Discount).format('0.00'));
      this.addRow('应收:', this.$number(orderInfo.Order.PaidMoney).format('0.00'));
      this.addUnderLine('支付方式');
      orderInfo.PayInfos.forEach((item) => {
        this.addRow(`${item.PayTypeName}:`, this.$number(item.PayedMoney).format('0.00'));
        if (item.PayKind === 'Cash' && item.Summary && item.Summary.indexOf(':') > -1) {
          this.addRow(`${item.Summary.split(':')[0]}:`, item.Summary.split(':')[1]);
        }
      });
      this.addUnderLine();
      orderInfo.ExtraInfos.forEach((item) => {
        this.addRow('', item);
      });
      this.addUnderLine();
      this.addRow('收款人:', orderInfo.Order.OperateEmployeeName);
      this.addRow('终端:', orderInfo.Order.Terminal);
      this.addRow('门店:', orderInfo.Order.OpenBusinessName);
      if (this.defaultPrint.TicketTail) {
        this.addCenterRow(this.defaultPrint.TicketTail, 16, 12);
      }
      if (orderInfo.WLUrl) {
        this.addCenterRow('扫此二维码，实时查看账户余额', 12, 16);
        this.addQRCode(
          orderInfo.WLUrl,
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
        t="DynamicTextItem">----------------${title || '------'}------------------</I>`;
    },

    addGoodsListRow(goodsName, amount, price, total, isHeader) {
      this.rowIndex++;
      this.localXml += `<I 
        x="0" 
        y="${this.yIndexPrimary}" 
        w="120" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${goodsName}</I>`;
      this.localXml += `<I 
        x="120" 
        y="${this.yIndexPrimary}" 
        w="43" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${amount}</I>`;
      this.localXml += `<I 
        x="${isHeader ? 175 : 183}" 
        y="${this.yIndexPrimary}" 
        w="43" 
        h="40" 
        r="0" n="" f="微软雅黑" s="Regular" 
        si="${this.fontSize}" 
        t="TextItem">${price}</I>`;
      this.localXml += `<I 
        x="216" 
        y="${this.yIndexPrimary}" 
        w="43" 
        h="40" 
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
        if (bytesCount >= 14 || i === n - 1) {
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
        x="215" 
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

