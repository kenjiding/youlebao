<template>
  <el-dialog
    :visible="cashTicketVisible"
    :close-on-click-modal="false"
    title="退补现金计时票"
    top="15vh"
    width="500px"
    class="cash-ticket-dialog"
    @close="handleClose">
    <el-radio-group
      v-model="isReturn"
      class="change-type">
      <el-radio-button :label="true">套票退款</el-radio-button>
      <el-radio-button :label="false">套票补票</el-radio-button>
    </el-radio-group>
    <template v-if="isReturn">
      <div class="info-item first">
        <div class="label">票码：</div>
        <el-input
          v-model="ReturnTicketInfo.TicketCode"
          placeholder="请输入票码"
          class="code-input"
          @keyup.native.enter="getTicketInfo">
          <template
            slot="append">
            <el-button
              type="primary"
              @click="getTicketInfo">查询</el-button>
          </template>
        </el-input>
      </div>
      <div class="info-item">
        <div class="label">套票：</div>
        <div>{{ ReturnTicketInfo.TicketName }}</div>
      </div>
      <div class="info-item">
        <div class="label">游玩时间：</div>
        <div>{{ ReturnTicketInfo.PlayMinutes }}分钟</div>
      </div>
      <div
        class="info-item">
        <div class="label">剩余金额：</div>
        <div>￥{{ ReturnTicketInfo.RemainMoney }}</div>
      </div>
      <div class="info-item">
        <div class="label">共消费：</div>
        <div>￥{{ ReturnTicketInfo.PayMoney }}</div>
      </div>
      <div class="info-item">
        <div class="label">退款：</div>
        <div class="money">￥{{ ReturnTicketInfo.ReturnMoney }}</div>
      </div>
      <div class="info-item">
        <div class="label">扣费信息：</div>
        <div>{{ ReturnTicketInfo.Summary }}</div>
      </div>
    </template>
    <template v-else>
      <div class="info-item first">
        <div class="label">票码：</div>
        <el-input
          v-model="FillTicketInfo.TicketCode"
          placeholder="请输入票码"
          class="code-input"
          @keyup.native.enter="getTicketInfo">
          <template
            slot="append">
            <el-button
              type="primary"
              @click="getTicketInfo">查询</el-button>
          </template>
        </el-input>
      </div>
      <div
        class="info-item">
        <div class="label">补票金额：</div>
        <el-input-number
          v-model="FillTicketInfo.Money"
          :controls="false"
          :precision="2"
          :min="0"
          class="money-inp"
          placeholder="请输入金额"/>
        <span class="unit">元</span>
      </div>
      <div class="info-item">
        <div class="label">套票：</div>
        <div>{{ FillTicketInfo.TicketName }}</div>
      </div>
      <div class="info-item">
        <div class="label">游玩时间：</div>
        <div>{{ FillTicketInfo.PlayMinutes }}分钟</div>
      </div>
      <div class="info-item">
        <div class="label">共消费：</div>
        <div>￥{{ FillTicketInfo.PayMoney }}</div>
      </div>
      <div class="info-item">
        <div class="label">{{ Number(FillTicketInfo.FillMoney) >= 0 ? '应补：' : '剩余金额：' }}</div>
        <div
          :class="{'money': Number(FillTicketInfo.FillMoney) >= 0}">
          ￥{{
            FillTicketInfo.FillMoney === ''
              ? FillTicketInfo.FillMoney : Math.abs(FillTicketInfo.FillMoney)
          }}
        </div>
      </div>
      <!-- <div class="info-item">
        <div class="label">说明：</div>
        <div>{{ FillTicketInfo.Summary }}</div>
      </div> -->
    </template>
    <div
      slot="footer"
      class="dialog-footer">
      <el-button
        :loading="loading"
        type="primary"
        @click="returnOrFill">{{ isReturn ? '退款' : '补票' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'CashTimeTicketDialog',

  components: {},
  data() {
    return {
      cashTicketVisible: false,
      isReturn: true,
      ReturnTicketInfo: {
        TicketCode: '',
        TicketName: '',
        RemainMoney: '',
        PlayMinutes: '',
        PayMoney: '',
        ReturnMoney: '',
        Summary: '',
      },
      FillTicketInfo: {
        TicketCode: '',
        Money: '',
        TicketName: '',
        RemainMoney: '',
        PlayMinutes: '',
        PayMoney: '',
        Summary: '',
        FillMoney: '',
      },
      loading: false,
    };
  },
  mounted() {
    this.cashTicketVisible = true;
  },
  methods: {
    handleClose() {
      this.$emit('close');
      Object.keys(this.ReturnTicketInfo).forEach((key) => {
        this.ReturnTicketInfo[key] = '';
      });
      Object.keys(this.FillTicketInfo).forEach((key) => {
        this.FillTicketInfo[key] = '';
      });
      this.remove();
    },

    returnOrFill() {
      let postData = {
        TicketCode: this.ReturnTicketInfo.TicketCode,
      };
      let tips = '';
      if (this.ReturnTicketInfo.TicketName
        && this.isReturn
        && Number(this.ReturnTicketInfo.ReturnMoney) <= 0) {
        this.$alert('退款金额为0元,无需退款', '提示', {
          confirmButtonText: '确定',
        });
        return;
      }
      if (!this.isReturn && !this.FillTicketInfo.Money) {
        tips = '请输入金额';
      }
      if ((this.isReturn && !this.ReturnTicketInfo.TicketName)
        || (!this.isReturn && !this.FillTicketInfo.TicketName)) {
        tips = '请先查询票码';
      }
      if ((this.isReturn && !this.ReturnTicketInfo.TicketCode)
        || (!this.isReturn && !this.FillTicketInfo.TicketCode)) {
        tips = '请输入票码';
      }

      if (!this.isReturn) {
        postData = {
          TicketCode: this.FillTicketInfo.TicketCode,
          Money: this.FillTicketInfo.Money,
        };
      }
      if (tips) {
        this.$message({
          message: tips,
          type: 'warning',
        });
        return;
      }
      const url = this.isReturn ? 'game/machine/returnCashTicketTime' : 'game/machine/fillCashTicketTime';
      this.loading = true;
      this.$api[url](postData).then(() => {
        this.$message({
          message: this.isReturn ? '退款成功' : '补票成功',
          type: 'success',
        });
        this.loading = false;
        this.handleClose();
      }, () => {
        this.loading = false;
      });
    },
    getTicketInfo() {
      if ((this.isReturn && !this.ReturnTicketInfo.TicketCode)
       || (!this.isReturn && !this.FillTicketInfo.TicketCode)) {
        this.$message({
          message: '请输入票码',
          type: 'warning',
        });
        return;
      }
      const url = this.isReturn ? 'game/machine/getOutGateReturnTicketInfo' : 'game/machine/getOutGateFillTicketInfo';
      const ticketCode =
      this.isReturn ? this.ReturnTicketInfo.TicketCode : this.FillTicketInfo.TicketCode;
      this.$api[url]({
        TicketCode: ticketCode,
      }).then((res) => {
        if (this.isReturn) {
          Object.assign(this.ReturnTicketInfo, res);
        } else {
          Object.assign(this.FillTicketInfo, res);
          if (res.FillMoney > 0) this.FillTicketInfo.Money = Math.abs(res.FillMoney);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .cash-ticket-dialog {
    border-radius: $border-radius;
    $two-px:2px;
    /deep/ .el-dialog {
      border-radius: $border-radius;
      .el-dialog__header {
        border-bottom: 1px solid $border-color;
        padding: 14px 20px 14px 30px;
        height: 50px;
        box-sizing: border-box;
      }
      .el-dialog__headerbtn {
        top: 9px;
        font-size: $font-size-regular + $two-px;
      }
      .el-dialog__body {
        height: 410px;
        padding: 20px 60px 0 30px;
        box-sizing: border-box;
      }
      .el-dialog__footer {
        height: 60px;
        padding: 0 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border-top: 1px solid $border-color;
        .dialog-footer {
          width: 100%;
        }
        .el-button {
          width: 100%;
          height: 40px;
        }
      }
    }
  }
  /deep/ .change-type {
    margin-bottom: 20px;
    .el-radio-button__orig-radio:checked + .el-radio-button__inner,
    .el-radio-button__inner:hover,
    .el-radio-button__inner:focus {
      //stylelint-disable-next-line
      color: #409EFF;
      //stylelint-disable-next-line
      border-color: #C6E2FF;
      //stylelint-disable-next-line
      background-color: #ECF5FF;
      box-shadow: none;
    }
    .el-radio-button__inner {
      padding: 0;
      height: 40px;
      line-height: 40px;
      width: 120px;
    }
  }
  .info-item {
    display: flex;
    align-items: center;
    height: 40px;
    width: 100%;
    font-size: $font-size-primary;
    color: $font-color-primary;
    > div:nth-child(2) {
      width: 320px;
      .el-input-number {
        width: 100%;
      }
    }
    .label {
      width: 90px;
      text-align: right;
    }
    .money {
      color: $color-danger;
    }
    .money-inp {
      width: 280px!important;
    }
    .unit {
      width: 40px;
      text-align: center;
    }
  }
  .first {
    margin-bottom: 10px;
  }
</style>
