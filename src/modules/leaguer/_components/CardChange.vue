<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员补卡/换卡"
    top="15vh"
    width="500px"
    class="card-change-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="cardInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="card-change-form">
        <el-form-item
          label="会员卡号:"
          prop="leaguerCode">
          <el-input
            v-if="leaguerLock"
            v-model="cardInfo.leaguerCode"
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
          label="姓名:"
          prop="leaguerName">
          <el-input
            v-model="cardInfo.leaguerName"
            disabled/>
        </el-form-item>
        <el-form-item
          label="新卡号码:"
          prop="newCardCode">
          <el-input
            v-model="cardInfo.newCardCode"
            class="input-special"
            disabled>
            <el-button
              slot="append"
              class="append-button"
              @click="readCardClick">
              读卡
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          label="验证密码:"
          prop="needValidate">
          <el-radio-group
            v-model="cardInfo.needValidate">
            <el-radio
              :label="true">是</el-radio>
            <el-radio
              :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="会员密码:"
          prop="password">
          <el-input
            v-model="cardInfo.password"
            :disabled="!cardInfo.needValidate"
            type="password"/>
        </el-form-item>
        <el-form-item
          label="补卡费用:">
          <p>{{ fillCardGoods.Price | number("0.00") }}</p>
        </el-form-item>
        <el-form-item
          label="换卡费用:">
          <p> {{ changeCardGoods.Price | number("0.00") }}</p>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :disabled="fillCardDisable"
        type="primary"
        @click="submitFillCard">补卡</el-button>
      <el-button
        :disabled="changeCardDisable"
        type="primary"
        @click="submitChangeCard">换卡</el-button>
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

export default {
  name: 'CardChange',

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
      cardInfo: {
        leaguerId: '',
        leaguerCode: '',
        leaguerName: '',
        leaguerLevelId: '',
        newCardCode: '',
        newCardID: '',
        needValidate: false,
        password: '',
      },
      fillCardGoods: {},
      changeCardGoods: {},
      paymentVisible: false,
      orderId: '',
      actualCharge: 0,
      newCardUseble: false,
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

    leaguerLock() {
      return Boolean(this.leaguer.ID);
    },

    fillCardDisable() {
      return (!this.cardInfo.leaguerId || !this.fillCardGoods.GoodsID || !this.newCardUseble);
    },

    changeCardDisable() {
      return (!this.cardInfo.leaguerId || !this.changeCardGoods.GoodsID || !this.newCardUseble);
    },

    rules() {
      const checkInputPassword = (rule, value, callback) => {
        if (this.cardInfo.needValidate && this.cardInfo.password.length < 6) {
          callback(new Error('请输入不小于6位的会员密码!'));
        } else {
          callback();
        }
      };

      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
        newCardCode: [
          { required: true, message: '请读新会员卡', trigger: 'blur' },
        ],
        password: [
          { validator: checkInputPassword, trigger: 'blur' },
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
      if (this.leaguerLock) {
        this.cardInfo.leaguerId = this.leaguer.ID;
        this.cardInfo.leaguerName = this.leaguer.RealName;
        this.cardInfo.leaguerLevelId = this.leaguer.LeaguerLevelID;
        this.cardInfo.leaguerCode = this.leaguer.LeaguerCode;
        this.loadChangeCardGoods();
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
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.cardInfo.leaguerId = leaguer.ID;
        this.cardInfo.leaguerName = leaguer.RealName;
        this.cardInfo.leaguerLevelId = leaguer.LeaguerLevelID;
        this.cardInfo.leaguerCode = leaguer.LeaguerCode;
        this.checkNewCardUseble();
        this.loadChangeCardGoods();
        this.$refs.form.validate();
      }
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
    },

    readCardClick() {
      const cardInfo = this.$device.readCard();
      this.cardInfo.newCardCode = cardInfo.cardNumber;
      this.cardInfo.newCardID = cardInfo.cardID;
      this.checkNewCardUseble();
    },

    checkNewCardUseble() {
      if (this.cardInfo.newCardID && this.cardInfo.newCardCode && this.cardInfo.leaguerId) {
        this.$api['leaguer/leaguer/checkLgICCard']({
          ICCard: this.cardInfo.newCardID,
          CardNumber: this.cardInfo.newCardCode,
          LeaguerID: this.cardInfo.leaguerId,
        }).then(() => {
          this.newCardUseble = true;
        }, () => {
          this.newCardUseble = false;
          this.cardInfo.newCardCode = '';
          this.cardInfo.newCardID = '';
        });
      }
    },

    loadChangeCardGoods() {
      this.fillCardGoods = {};
      this.changeCardGoods = {};
      this.$api['leaguer/leaguer/getGoodsByLgLevelID']({
        LgLevelID: this.cardInfo.leaguerLevelId,
        GoodsType: 3,
      }).then((res) => {
        this.fillCardGoods = res;
      });
      this.$api['leaguer/leaguer/getGoodsByLgLevelID']({
        LgLevelID: this.cardInfo.leaguerLevelId,
        GoodsType: 4,
      }).then((res) => {
        this.changeCardGoods = res;
      });
    },

    submitFillCard() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }

        this.$confirm('确认补卡？')
          .then(() => {
            if (this.cardInfo.needValidate) {
              const encryptedPwd = window.btoa(this.cardInfo.password);
              this.$api['leaguer/leaguer/checkLgPwd']({
                LeaguerID: this.cardInfo.leaguerId,
                PassWord: encryptedPwd,
              }).then(() => {
                this.changeCardAction(3);
              }, () => {
              });
            } else {
              this.changeCardAction(3);
            }
          })
          .catch(() => {});
      });
    },

    submitChangeCard() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }

        this.$confirm('确认换卡？')
          .then(() => {
            if (this.cardInfo.needValidate) {
              const encryptedPwd = window.btoa(this.cardInfo.password);
              this.$api['leaguer/leaguer/checkLgPwd']({
                LeaguerID: this.cardInfo.leaguerId,
                PassWord: encryptedPwd,
              }).then(() => {
                this.changeCardAction(4);
              }, () => {
              });
            } else {
              this.changeCardAction(4);
            }
          })
          .catch(() => {});
      });
    },

    changeCardAction(type) {
      let hasPermission = 0;
      if (this.cardInfo.needValidate) {
        hasPermission = (type === 3 ? 200000801 : 200000802);
      } else {
        hasPermission = (type === 3 ? 200000803 : 200000804);
      }

      const extendInfo = {
        LeaguerID: this.cardInfo.leaguerId,
        NewLgCode: this.cardInfo.newCardCode,
        NewCardID: this.cardInfo.newCardID,
        goodType: type,
        mediaType: type === 3 ? this.fillCardGoods.CardMedia : this.changeCardGoods.CardMedia,
        HasPermission: hasPermission,
      };

      this.$api['leaguer/leaguer/createLgChangeCardOrder']({
        GoodsData: {
          GoodsID: type === 3 ? this.fillCardGoods.GoodsID : this.changeCardGoods.GoodsID,
          Amount: 1,
        },
        LeaguerID: this.cardInfo.leaguerId,
        ExtendInfo: JSON.stringify(extendInfo),
      }).then((res) => {
        this.orderId = res.OrderID;
        this.actualCharge = res.ActualCharge;
        this.paymentVisible = true;
      });
    },

    handlePaymentClose() {
      this.paymentVisible = false;
    },

    handleOrderCancel() {
      this.$api['sell/order/cancelOrder']({
        OrderID: this.orderId,
      });
    },

    handleOrderComplete() {
      this.paymentVisible = false;

      this.$api['sell/order/orderPaymentCompleted']({
        OrderID: this.orderId,
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
        });
        this.$emit('complete');
        this.$emit('close');
        this.remove && this.remove();
      }, () => {
      });
    },

  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .card-change {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;

      .input-special {
        width: 320px;

        /deep/ .el-input__inner {
          width: 274px;
        }

        .append-button {
          width: 46px;
          padding: 0;
          color: $font-color-secondary;
        }
      }

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input__inner {
        width: 320px;
      }
    }
  }

  .card-change-dialog {
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
      border-top: 1px $border-color solid;

      .el-button {
        width: 120px;
      }
    }
  }
</style>
