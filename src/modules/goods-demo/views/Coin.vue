<template>
  <div>
    <coinMachine
      :dialog-visible.sync="dialogVisible"/>
    <OutCoin
      :animation-visible.sync="animationVisible"/>
    <el-button
      type="primary"
      @click="clickHandle">主要按钮</el-button>
    <el-button
      type="primary"
      @click="outHandle">出币</el-button>
    <el-button
      type="primary"
      @click="logHandle">清币出币记录</el-button>

    <el-button
      type="primary"
      @click="outCoinLog">出币异常记录</el-button>
    <GlobalMachaineIcon/>
    <AddClearCoinLog
      :log-index-visible.sync="logIndexVisible"/>
    <!-- <OutErrorLog
      :out-coin-visible.sync="outCoinVisible"/> -->
    <!-- <el-button
      type="primary"
      @click="tips">消息推送</el-button> -->
    <!-- <tips/> -->
    <PrintWebView
      :xml-data="xmlTemplate"/>
    <el-button @click="printTicket">555555</el-button>
  </div>
</template>

<script>
import coinMachine from '@/components/coin-machine/index.vue';
import AddClearCoinLog from '@/components/coin-machine/AddClearCoinLog.vue';
import tips from '@/components/tips/index.vue';
import PrintWebView from '@/modules/ticket/_components/PrintWebView.vue';

import GlobalMachaineIcon from '@/components/coin-machine/GlobalMachaineIcon.vue';

import OutCoin from '@/components/coin-machine/components/OutCoin.vue';
import OutErrorLog from '@/components/coin-machine/out-coin-log/OutErrorLog.vue';


export default {
  name: 'Coin',
  components: {
    coinMachine,
    OutCoin,
    GlobalMachaineIcon,
    AddClearCoinLog,
    OutErrorLog,
    tips,
    PrintWebView,
  },
  data() {
    return {
      dialogVisible: false,
      animationVisible: false,
      logIndexVisible: false,
      outCoinVisible: false,
      tipsVisible: false,
      rowId: '16516',
      xmlTemplate: '',
    };
  },
  created() {

  },

  methods: {
    printTicket() {
      this.$createGoodsCurrency();

      // this.$api['ticket/ticket/getTickerPrint']({
      //   PackageTicketLogID: this.rowId,
      // }).then((res) => {
      //   this.xmlTemplate = res.PrintTemplate;
      // });
    },
    tips() {
      this.tipsVisible = true;
    },
    outCoinLog() {
      this.$createOutCoinLog();
    },
    outCoinHandle() {
      this.outCoinVisible = true;
    },
    logHandle() {
      this.logIndexVisible = true;
    },
    outHandle() {
      // this.$createGoodsCurrency();
    },
    clickHandle() {
      this.dialogVisible = true;
    },
  },
};
</script>
