<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    show-close
    title="选择出票方式"
    width="660px"
    append-to-body
    class="out-ticket-dialog"
    @close="handleClose"
    @closed="$emit('closed')"
    @open="onLoad">
    <div
      v-if="needTips && leaguer.ID"
      class="out-ticket-tips">
      本次所购买套票已存入会员账户：{{ leaguerInfo }}
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick">
      <el-tab-pane
        :disabled="loading"
        label="打印套票"
        name="print">
        <select-print-ticket
          ref="print"
          :ticket-list="ticketList"
          :printing.sync="loading"
          :is-reprint="isReprint"
          @complete="handleClose"/>
      </el-tab-pane>
      <el-tab-pane
        :disabled="loading"
        label="绑定票码"
        name="bind">
        <bind-ticket
          ref="bind"
          :ticket-list="ticketList"
          :loading.sync="loading"
          @submit-focus="handleSubmitFocus"
          @complete="handleClose"/>
      </el-tab-pane>
    </el-tabs>
    <div
      slot="footer">
      <el-button
        @click="handleClose">
        关闭
      </el-button>
      <el-button
        ref="submitButton"
        :loading="loading"
        type="primary"
        @click="submit">
        {{ activeName === 'print' ? '打印': '绑定' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import BindTicket from './BindTicket.vue';
import SelectPrintTicket from './SelectPrintTicket.vue';

export default {
  name: 'OutTicket',

  components: {
    BindTicket,
    SelectPrintTicket,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    leaguer: {
      type: Object,
      default: () => {},
    },
    needTips: {
      type: Boolean,
      default: false,
    },
    ticketList: {
      type: Array,
      default: () => [],
    },
    defaultTab: {
      type: String,
      default: 'print',
    },
    isReprint: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      activeName: 'print',
      loading: false,
      tabLoaded: {
        print: false,
        bind: false,
      },
    };
  },

  computed: {
    leaguerInfo() {
      if (this.leaguer.ID) {
        return `${this.leaguer.RealName}（卡号：${this.leaguer.LeaguerCode}）`;
      }
      return '';
    },
  },

  methods: {
    onLoad() {
      this.activeName = this.defaultTab;
      this.tabLoaded = {
        print: false,
        bind: false,
      };
      this.$nextTick(() => {
        this.$refs[this.activeName].onLoad();
        this.tabLoaded[this.activeName] = true;
        this.$refs.submitButton.$el.focus();
      });
    },

    handleTabClick(tab) {
      if (!this.tabLoaded[tab.name]) {
        this.$refs[tab.name].onLoad();
        this.tabLoaded[tab.name] = true;
      }
    },

    handleClose() {
      this.$emit('update:visible', false);
    },

    submit() {
      this.$refs[this.activeName] && this.$refs[this.activeName].submit();
    },

    handleSubmitFocus() {
      this.$refs.submitButton.$el.focus();
    },
  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .out-ticket {

    &-tips {
      width: 620px;
      height: 40px;
      line-height: 40px;
      background-color: $color-bg-table;
      color: $color-warning;
      text-align: center;
      position: relative;
      top: -10px;
    }
  }

  .out-ticket-dialog {
    margin-bottom: 0;
    $two-px:2px;

    /deep/ .el-dialog__header {
      height: 50px;
      padding: 0;
      border-bottom: 1px $border-color solid;
    }

    /deep/ .el-dialog__body {
      padding: 20px;
    }

    /deep/ .el-dialog__title {
      padding-left: 30px;
      line-height: 50px;
      font-size: $color-bg-primary + $two-px;
      color: $font-color-regular;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      text-align: right;
      border-top: 1px $border-color solid;

      // .el-button {
      //   width: 360px;
      // }
    }
  }
</style>
