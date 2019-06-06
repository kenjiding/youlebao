<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员续期"
    top="15vh"
    width="900px"
    class="renewal-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="renewalInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="renewal-form">
        <div>
          <el-form-item
            label="会员卡号:"
            prop="leaguerCode">
            <el-input
              v-if="leaguerLock"
              v-model="renewalInfo.leaguerCode"
              disabled/>
            <read-card
              v-else
              ref="cardReader"
              :value="cardKeyValue"
              :auto-logout="false"
              :verify-date="false"
              :verify-card-state="false"
              class="read-card"
              @change="handleReadLeaguer"
              @logout="handleReadCardLogout"/>
          </el-form-item>
          <el-form-item
            label="续期时长:"
            prop="renewalValue">
            <el-input-number
              :disabled="valueDisabled"
              :controls="false"
              :min="1"
              :max="9999"
              v-model="renewalInfo.renewalValue"/>
          </el-form-item>
          <el-form-item
            label="开始时间:">
            <el-input
              v-model="startVerifyTime"
              disabled/>
          </el-form-item>
          <el-form-item
            label="每月费用:">
            {{ $number(cost).format('0.00')+'元' }}
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="姓名:"
            prop="name">
            <el-input
              v-model="renewalInfo.name"
              disabled/>
          </el-form-item>
          <el-form-item
            label="续期单位:"
            prop="renewalUnit">
            <el-select
              v-model="renewalInfo.renewalUnit"
              placeholder="请选择">
              <el-option
                v-for="item in renewalUnits"
                :key="item.value"
                :label="item.text"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item
            label="结束时间:">
            <el-input
              v-model="renewalVerifyTime"
              disabled/>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :disabled="!renewalInfo.leaguerId"
        :loading="checkingOut"
        type="primary"
        @click="submit">确定</el-button>
    </div>

    <payment
      ref="Payment"
      :visible="paymentVisible"
      :actual-charge="actualCharge"
      :order-id="orderId"
      @close="handlePaymentClose"
      @cancel="handleOrderCancel"
      @complete="handleOrderComplete"/>

  </el-dialog>
</template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';
import Payment from '@/components/payment/Payment.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Renewal',

  components: {
    ReadCard,
    Payment,
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
      cardKeyValue: '',
      renewalInfo: {
        leaguerId: '',
        leaguerCode: '',
        name: '',
        renewalValue: 1,
        renewalUnit: '',
        verifyTime: '',
        verifyTimeUnit: '',
        goodsId: '',
      },
      cost: 0.00,
      checkingOut: false,
      paymentVisible: false,
      orderId: '',
      actualCharge: 0,
    };
  },

  computed: {
    ...mapGetters({
      rejoinSetting: 'leaguer/getRejoinSetting',
    }),

    dialogVisible: {
      get() {
        return this.localVisible;
      },

      set(val) {
        this.localVisible = val;
        this.$emit('update:visible', val);
      },
    },

    leaguerLock() {
      return Boolean(this.leaguer.ID);
    },

    leaguerVerifyTimeUnit() {
      const verifyTimeUnitEnum = {
        Day: 1,
        Month: 2,
        Year: 3,
        Forever: 4,
      };
      return verifyTimeUnitEnum[this.renewalInfo.verifyTimeUnit];
    },

    renewalUnits() {
      const renewalUnitsEnum = [
        {
          sort: 1,
          value: 'Day',
          text: '日',
        },
        {
          sort: 2,
          value: 'Month',
          text: '月',
        },
        {
          sort: 3,
          value: 'Year',
          text: '年',
        },
      ];
      if (this.leaguerVerifyTimeUnit === 4) {
        return [{
          sort: 4,
          value: 'Forever',
          text: '永久',
        },
        ];
      }
      return renewalUnitsEnum.filter(item => item.sort >= this.leaguerVerifyTimeUnit);
    },

    valueDisabled() {
      return this.renewalInfo.verifyTimeUnit === 'Forever';
    },

    startVerifyTime() {
      if (this.rejoinSetting && this.rejoinSetting.IsNow) {
        const startDate = new Date(new Date(new Date().toLocaleDateString()).getTime());
        return this.$date(startDate).format('YYYY-MM-DD');
      }
      return this.renewalInfo.verifyTime;
    },

    renewalVerifyTime() {
      if (this.renewalInfo.verifyTimeUnit === 'Forever') {
        return '永久';
      }
      if (this.renewalInfo.verifyTime && this.renewalInfo.renewalValue > 0) {
        let startTime = null;
        if (this.rejoinSetting && this.rejoinSetting.IsNow) {
          startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
        } else {
          startTime = new Date(this.renewalInfo.verifyTime.replace(/-/g, '/'));
        }
        if (this.renewalInfo.renewalUnit === 'Day') {
          const endTime = startTime.setDate(startTime.getDate() + this.renewalInfo.renewalValue);
          return this.$date(endTime).format('YYYY-MM-DD');
        } else if (this.renewalInfo.renewalUnit === 'Month') {
          const endTime = startTime.setMonth(startTime.getMonth() + this.renewalInfo.renewalValue);
          return this.$date(endTime).format('YYYY-MM-DD');
        } else if (this.renewalInfo.renewalUnit === 'Year') {
          const endTime =
          startTime.setFullYear(startTime.getFullYear() + this.renewalInfo.renewalValue);
          return this.$date(endTime).format('YYYY-MM-DD');
        }
      }
      return '';
    },

    actualAmount() {
      if (this.renewalInfo.verifyTimeUnit === 'Forever') {
        return 1;
      }
      if (this.renewalInfo.verifyTime) {
        let startTime = null;
        let verifyTime = null;
        if (this.rejoinSetting && this.rejoinSetting.IsNow) {
          startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
          verifyTime = new Date(startTime);
        } else {
          startTime = new Date(this.renewalInfo.verifyTime.replace(/-/g, '/'));
          verifyTime = new Date(this.renewalInfo.verifyTime.replace(/-/g, '/'));
        }

        if (this.renewalInfo.renewalValue > 0 && this.renewalInfo.renewalUnit === 'Month') {
          if (this.renewalInfo.verifyTimeUnit === 'Day') {
            const endTime = startTime.setMonth(startTime.getMonth()
              + this.renewalInfo.renewalValue);
            const days = endTime - verifyTime;
            // eslint-disable-next-line
            const time = parseInt(days / (1000 * 60 * 60 * 24));
            return time;
          } else if (this.renewalInfo.verifyTimeUnit === 'Month') {
            return this.renewalInfo.renewalValue;
          }
        } else if (this.renewalInfo.renewalValue > 0 && this.renewalInfo.renewalUnit === 'Year') {
          if (this.renewalInfo.verifyTimeUnit === 'Day') {
            const endTime = startTime.setFullYear(startTime.getFullYear()
              + this.renewalInfo.renewalValue);
            const days = endTime - verifyTime;
            // eslint-disable-next-line
            const time = parseInt(days / (1000 * 60 * 60 * 24));
            return time;
          } else if (this.renewalInfo.verifyTimeUnit === 'Month') {
            return this.renewalInfo.renewalValue * 12;
          }
          return this.renewalInfo.renewalValue;
        } else {
          return this.renewalInfo.renewalValue;
        }
      }
      return 1;
    },

    rules() {
      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
        renewalValue: [
          { required: true, message: '请输入续期时长', trigger: 'blur' },
        ],
        renewalUnit: [
          { required: true, message: '请选择续期单位', trigger: 'blur' },
        ],
      };
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
      if (this.rejoinSetting.IsNow === undefined) {
        this.$store.dispatch('leaguer/asyncRejoinSetting', this);
      }
      if (this.leaguerLock) {
        this.renewalInfo.leaguerId = this.leaguer.ID;
        this.renewalInfo.leaguerLevelID = this.leaguer.LeaguerLevelID;
        this.renewalInfo.name = this.leaguer.RealName;
        this.renewalInfo.leaguerCode = this.leaguer.LeaguerCode;
        this.renewalInfo.verifyTime = this.leaguer.VerifyTime;
        this.renewalInfo.verifyTimeUnit = this.leaguer.VerifyTimeUnit;
        this.getRenewalGoods();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    handleClose() {
      this.$refs.form.resetFields();
      this.renewalInfo.leaguerId = '';
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.renewalInfo.leaguerId = leaguer.ID;
        this.renewalInfo.leaguerLevelID = leaguer.LeaguerLevelID;
        this.renewalInfo.name = leaguer.RealName;
        this.renewalInfo.leaguerCode = leaguer.LeaguerCode;
        this.renewalInfo.verifyTime = leaguer.VerifyTime;
        this.renewalInfo.verifyTimeUnit = leaguer.VerifyTimeUnit;
        this.getRenewalGoods();
        this.$refs.form.validate();
      }
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
      this.cost = 0;
    },

    getRenewalGoods() {
      this.$api['leaguer/leaguer/getGoodsByLgLevelID']({
        LgLevelID: this.renewalInfo.leaguerLevelID,
        GoodsType: 5,
      }).then((res) => {
        this.renewalInfo.goodsId = res.GoodsID;
        this.cost = res.Price;
      });
    },

    submit() {
      const extendInfo = {
        LeaguerID: this.renewalInfo.leaguerId,
        goodType: 5,
        VerifyTime: this.renewalInfo.verifyTimeUnit === 'Forever' ? '9999-12-31' : this.renewalVerifyTime,
      };
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }

        this.checkingOut = true;
        this.$api['leaguer/leaguer/createLgReJoinOrder']({
          GoodsData: {
            GoodsID: this.renewalInfo.goodsId,
            Amount: this.actualAmount,
          },
          LeaguerID: this.renewalInfo.leaguerId,
          ExtendInfo: JSON.stringify(extendInfo),
        }).then((res) => {
          this.orderId = res.OrderID;
          this.actualCharge = res.ActualCharge;
          this.paymentVisible = true;
        }, () => {
          this.checkingOut = false;
        });
      });
    },

    handlePaymentClose() {
      this.checkingOut = false;
      this.paymentVisible = false;
    },

    handleOrderCancel() {
      this.$api['sell/order/cancelOrder']({
        OrderID: this.orderId,
      });
    },

    handleOrderComplete() {
      this.checkingOut = false;
      this.paymentVisible = false;

      this.$api['sell/order/orderPaymentCompleted']({
        OrderID: this.orderId,
      }).then(() => {
        this.$message({
          message: '会员续期成功',
          type: 'success',
        });
        this.$emit('complete');
        this.$emit('close');
        this.remove && this.remove();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .renewal {
    width: 900px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;

      > div {
        width: 410px;
      }

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input__inner {
        width: 320px;
        text-align: left;
      }
    }
  }

</style>

<style lang="scss">
  @import "@/styles/theme.scss";

  .renewal-dialog {
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

    /deep/ .el-dialog__body {
      padding: 20px;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      // text-align: center;
      border-top: 1px $border-color solid;

      .el-button {
        width: 180px;
      }
    }
  }
</style>
v
