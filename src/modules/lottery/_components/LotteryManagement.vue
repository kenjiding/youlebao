<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="彩票暂存"
    top="15vh"
    width="800px"
    class="lottery-management-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick">
      <el-tab-pane
        label="彩票暂存"
        name="saveLottery">
        <save-lottery
          ref="saveLottery"
          :leaguer="leaguer"
          @complete="handleFormComplete"
          @print="printReceipt"/>
      </el-tab-pane>
      <el-tab-pane
        label="取彩票"
        name="getLottery">
        <get-lottery
          ref="getLottery"
          :leaguer="leaguer"
          @complete="handleFormComplete"/>
      </el-tab-pane>
    </el-tabs>
    <div
      slot="footer">
      <el-button
        plain
        type="primary"
        class="log-query"
        @click="logsVisible = true">暂存记录</el-button>
      <div>
        <el-button
          :loading="checkingOut"
          type="primary"
          @click="submit">确定{{ activeName==='getLottery'?'取票':'' }}</el-button>
        <el-button
          @click="handleClose">关闭</el-button>
      </div>
    </div>

    <lottery-query
      :visible="logsVisible"
      @close="logsVisible = false"
      @print="printReceipt"/>

    <lottery-receipt
      ref="lotteryReceipt"
      :print-data="printData"
      @complete="handleReceiptComplete"
      @cancel="handleReceiptCancel"/>
  </el-dialog>
</template>

<script>
import SaveLottery from '../_components/SaveLottery.vue';
import GetLottery from '../_components/GetLottery.vue';
import LotteryQuery from '../_components/LotteryLogQuery.vue';
import LotteryReceipt from '../_components/LotteryReceipt.vue';

export default {
  name: 'LotteryManagement',

  components: {
    SaveLottery,
    GetLottery,
    LotteryReceipt,
    LotteryQuery,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    leaguer: {
      type: Object,
      default: () => ({}),
    },
    isCreate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      localVisible: false,
      activeName: 'saveLottery',
      cardKeyValue: '',
      saveInfo: {
        leaguerId: '',
        leaguerCode: '',
      },
      logsVisible: false,
      printData: {},
      printing: false,
      checkingOut: false,
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.localVisible;
      },

      set(val) {
        this.localVisible = val;
        this.$emit('update:visible', val);
      },
    },

    rules() {
      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
        saveValue: [
          { required: true, message: '请输入暂存票数', trigger: 'blur' },
        ],
        summary: [
          { required: true, message: '请填写备注', trigger: 'blur' },
        ],
      };
    },

    activeForm() {
      return this.$refs[this.activeName];
    },
  },

  watch: {
    visible(val) {
      this.localVisible = val;
    },
  },

  mounted() {
    this.isCreate && (this.localVisible = true);
  },


  methods: {
    onLoad() {
      this.$nextTick(() => {
        this.activeForm.onLoad();
      });
    },

    handleClose() {
      this.$refs.saveLottery.clear();
      this.$refs.getLottery.clear();
      this.$emit('close');
      this.remove && this.remove();
    },

    handleTabClick() {
      this.activeForm.onLoad();
    },

    submit() {
      this.checkingOut = true;
      this.activeForm.submit();
    },

    handleFormComplete() {
      this.checkingOut = false;
    },

    printReceipt(data) {
      if (this.printing) return;
      this.printing = true;
      this.printData = data;
      this.$nextTick(() => {
        this.$refs.lotteryReceipt.onPrint();
      });
    },

    handleReceiptComplete() {
      this.printing = false;
      this.checkingOut = false;
      this.printData = {};
    },

    handleReceiptCancel() {
      this.printing = false;
      this.checkingOut = false;
      this.printData = {};
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';


</style>

<style lang="scss">
  @import "@/styles/theme.scss";

  .lottery-management-dialog {
    margin-bottom: 0;
    $two-px:2px;

    .log-query {
      width: 100px !important;
      background-color: $color-white;
    }

    /deep/ .el-dialog__header {
      height: 50px;
      padding: 0;
      border-bottom: 1px $border-color solid;
    }

    /deep/ .el-dialog__title {
      padding-left: 30px;
      line-height: 50px;
      font-size: $color-bg-primary + $two-px;
      color: $font-color-regular;
    }

    /deep/ .el-dialog__body {
      padding: 20px;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      // text-align: center;
      border-top: 1px $border-color solid;

      >div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
      }

      .el-button {
        width: 80px;
        height: 40px;
        padding: 0;
        text-align: center;
      }
    }
  }
</style>
