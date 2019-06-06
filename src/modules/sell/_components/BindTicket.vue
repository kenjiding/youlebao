<template>
  <div class="bind-ticket-form">
    <el-table
      ref="multipleTable"
      :data="localTicketlist"
      :max-height="305"
      :border="true"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="GoodsName"
        label="套票名称"/>
      <el-table-column
        :formatter="ticketStatusFormatter"
        align="center"
        prop="Status"
        label="状态"
        width="120"/>
      <el-table-column
        align="center"
        label="票码">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.BindTicketCode"
            :ref="'inputTicketNumber_' + (scope.$index + 1)"
            :name="'inputTicketNumber_' + (scope.$index + 1)"
            :maxlength="30"
            placeholder="请输入或扫描票码"
            @focus="rowFocus($event)"
            @blur="checkTicketNumber($event, scope.row)"
            @keydown.native="handleCodeInputKeydown($event, scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'BindTicket',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    ticketList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      localTicketlist: [],
      currentTargetIndex: 1,
      statusChs: {
        UnUsed: '未使用',
        InUse: '使用中',
        Complete: '已完成',
        Returned: '已退货',
        Overdue: '已过期',
        Cancel: '会员已注销',
      },
    };
  },

  computed: {
  },

  methods: {
    onLoad() {
      this.localTicketlist = [];
      for (let i = 0; i < this.ticketList.length; i++) {
        const currentTicket = this.ticketList[i];
        for (let j = 0; j < currentTicket.SellLogInfoList.length; j++) {
          if (currentTicket.SellLogInfoList[j].Status === 'UnUsed' ||
          currentTicket.SellLogInfoList[j].Status === 'InUse' ||
          currentTicket.SellLogInfoList[j].Status === 'Complete') {
            this.localTicketlist.push({
              SellLogID: currentTicket.SellLogInfoList[j].SellLogID,
              GoodsName: currentTicket.GoodsName,
              Status: currentTicket.SellLogInfoList[j].Status,
              BindTicketCode: currentTicket.SellLogInfoList[j].BindTicketCode || '',
            });
          }
        }
      }
      this.$nextTick(() => {
        if (this.$refs.inputTicketNumber_1.$el.childNodes[1]) {
          this.$refs.inputTicketNumber_1.$el.childNodes[1].focus();
        }
      });
    },

    ticketStatusFormatter(row) {
      return this.statusChs[row.Status];
    },

    rowFocus(e) {
      this.currentTargetIndex = Number(e.currentTarget.name.replace('inputTicketNumber_', ''));
      e.currentTarget.select();
    },

    handleCodeInputKeydown(e) {
      const key = e.keyCode;

      if (key === 13) {
        this.nextFocusInput();
      }
    },

    checkTicketNumber(e, ticket) {
      this.$nextTick(() => {
        if (!ticket.BindTicketCode) { return; }
        if (this.localTicketlist.find(item => item.BindTicketCode === ticket.BindTicketCode
        && item.SellLogID !== ticket.SellLogID)) {
          this.$alert('票码重复', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: () => {
              e.target.focus();
              ticket.BindTicketCode = '';
            },
          });
        }
      });
    },

    nextFocusInput() {
      const index = this.currentTargetIndex >= this.localTicketlist.length ?
        this.currentTargetIndex : this.currentTargetIndex + 1;
      if (this.currentTargetIndex >= this.localTicketlist.length) {
        if (this.$refs[`inputTicketNumber_${index}`].$el.childNodes[1]) {
          if (this.checkAllTicketNumber()) {
            this.$emit('submit-focus');
          } else {
            this.$refs[`inputTicketNumber_${index}`].$el.childNodes[1].blur();
          }
        }
      } else if (this.$refs[`inputTicketNumber_${index}`].$el.childNodes[1]) {
        this.$refs[`inputTicketNumber_${index}`].$el.childNodes[1].focus();
      }
    },

    checkAllTicketNumber() {
      for (let i = 0; i < this.localTicketlist.length; i++) {
        const ticket = this.localTicketlist[i];
        if (!ticket.BindTicketCode) { return false; }
        const currentTicketCode = this.localTicketlist.find(item =>
          item.BindTicketCode === ticket.BindTicketCode
          && item.SellLogID !== ticket.SellLogID);
        if (currentTicketCode) {
          return false;
        }
      }
      return true;
    },

    handleClose() {
      this.showDialogClose = false;
      this.$emit('update:visible', false);
    },

    submit() {
      if (this.loading) {
        // this.loading = false;
        return;
      }
      this.$emit('update:loading', true);
      const packageTicketData = [];
      this.localTicketlist.forEach((ticket) => {
        if (ticket.BindTicketCode) {
          packageTicketData.push({
            PackageTicketId: ticket.SellLogID,
            PackageTicketNumber: ticket.BindTicketCode,
          });
        }
      });

      if (packageTicketData.length <= 0) {
        this.$message({
          message: '没有可以绑定的套票',
          type: 'warning',
        });
        this.$emit('update:loading', false);
        return;
      }

      this.$api['sell/sell/bindPackageTicketNumber']({
        PackageTicketData: packageTicketData,
      }, {
        errorCodeIgnore: ['22002'],
      }).then(() => {
        this.$emit('update:loading', false);
        this.$message({
          message: '票码绑定成功',
          type: 'success',
        });
        this.$emit('complete');
        this.$emit('update:visible', false);
      }, (res) => {
        this.$emit('update:loading', false);
        if (res.ResponseStatus.ErrorCode === '22002') {
          this.$alert(`${res.ResponseStatus.Message}`, '提示', {
            confirmButtonText: '确认',
            type: 'warning',
          });
        }
        this.showDialogClose = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .bind-ticket {
    width: 620px;
    $two-px:2px;

    &-form {
      width: 620px;
      max-height: 365px;
      overflow-y: auto;

      /deep/ .el-input {
        width: 100%;
      }

      /deep/ .el-input__inner {
        border-color: $color-white;
        width: 100%;
      }

      /deep/ .el-input__inner:focus {
        border-color: $color-primary;
      }

    }
  }

  .bind-ticket-dialog {
    margin-bottom: 0;
    $two-px:2px;

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

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      text-align: center;
      border-top: 1px $border-color solid;

      .el-button {
        width: 360px;
      }
    }
  }
</style>
