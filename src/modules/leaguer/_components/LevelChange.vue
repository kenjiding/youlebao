<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员级别变更"
    top="15vh"
    width="500px"
    class="level-change-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="levelInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="level-change-form">
        <el-form-item
          label="会员卡号:"
          prop="leaguerCode">
          <el-input
            v-if="leaguerLock"
            v-model="levelInfo.leaguerCode"
            disabled/>
          <read-card
            v-else
            ref="cardReader"
            :value="cardKeyValue"
            :auto-logout="false"
            class="read-card"
            @change="handleReadLeaguer"
            @logout="handleReadCardLogout"/>
        </el-form-item>
        <el-form-item
          label="姓名:"
          prop="leaguerName">
          <el-input
            v-model="levelInfo.leaguerName"
            disabled/>
        </el-form-item>
        <el-form-item
          label="原级别:"
          prop="leaguerLevelName">
          <el-input
            v-model="levelInfo.leaguerLevelName"
            disabled/>
        </el-form-item>
        <el-form-item
          label="变更级别:"
          prop="selectLevelID">
          <el-select
            v-model="levelInfo.selectLevelID"
            placeholder="请选择"
            @change="handleLevelChange">
            <el-option
              v-for="item in leaguerLevels"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否换卡:"
          prop="isChangeCard">
          <el-radio-group
            v-model="levelInfo.isChangeCard">
            <el-radio
              :label="true">是</el-radio>
            <el-radio
              :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="levelInfo.isChangeCard"
          label="新卡号码:"
          prop="newCardCode">
          <el-input
            v-model="levelInfo.newCardCode"
            class="input-special">
            <el-button
              slot="append"
              class="append-button"
              @click="readCardClick">
              读卡
            </el-button>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :disabled="!levelInfo.leaguerId"
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

export default {
  name: 'LevelChange',

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
      levelInfo: {
        leaguerId: '',
        leaguerCode: '',
        leaguerName: '',
        leaguerLevelName: '',
        selectLevelID: '',
        isChangeCard: false,
        newCardCode: '',
        newCardID: '',
      },
      leaguerLevels: [],
      changeCardGoods: {
        goodsId: '',
        price: 0,
      },
      checkingOut: false,
      paymentVisible: false,
      orderId: '',
      actualCharge: 0,
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

    rules() {
      const checkNewCard = (rule, value, callback) => {
        if (this.levelInfo.isChangeCard && this.levelInfo.newCardCode === '') {
          callback(new Error('请读取新会员卡!'));
        } else {
          callback();
        }
      };

      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
        selectLevelID: [
          { required: true, message: '请选择变更的会员级别', trigger: 'blur' },
        ],
        newCardCode: [
          { validator: checkNewCard, trigger: 'blur' },
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
        this.levelInfo.leaguerId = this.leaguer.ID;
        this.levelInfo.leaguerName = this.leaguer.RealName;
        this.levelInfo.leaguerLevelName = this.leaguer.LeaguerLevelName;
        this.levelInfo.leaguerCode = this.leaguer.LeaguerCode;
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
      this.loadLeaguerLevels();
    },

    handleLevelChange(val) {
      this.$api['leaguer/leaguer/getGoodsByLgLevelID']({
        LgLevelID: val,
        GoodsType: 4,
      }).then((res) => {
        this.changeCardGoods.goodsId = res.GoodsID;
        this.changeCardGoods.price = res.Price;
      });
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
      console.log(leaguer);
      if (leaguer) {
        this.levelInfo.leaguerId = leaguer.ID;
        this.levelInfo.leaguerName = leaguer.RealName;
        this.levelInfo.leaguerLevelName = leaguer.LeaguerLevelName;
        this.levelInfo.leaguerCode = leaguer.LeaguerCode;
      }
      this.loadLeaguerLevels();
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
    },

    readCardClick() {
      const cardInfo = this.$device.readCard();
      this.levelInfo.newCardCode = cardInfo.cardNumber;
      this.levelInfo.newCardID = cardInfo.cardID;
    },

    loadLeaguerLevels() {
      if (this.leaguerLevels.length <= 0) {
        this.$api['leaguer/leaguer/getAllLgLevel']({
        }).then((res) => {
          this.leaguerLevels = res.DataList;
        });
      }
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.checkingOut = true;
          if (this.levelInfo.isChangeCard) {
            this.changeCardAction();
          } else {
            this.changeLgLevelAction();
          }
        }
      });
    },

    changeLgLevelAction() {
      this.$api['leaguer/leaguer/changeLgLevel']({
        LeaguerID: this.levelInfo.leaguerId,
        ChangeLevelID: this.levelInfo.selectLevelID,
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
        });
        this.checkingOut = false;
        this.$emit('complete');
        this.$emit('close');
        this.remove && this.remove();
      }, () => {
        this.checkingOut = false;
      });
    },

    changeCardAction() {
      const extendInfo = {
        LeaguerID: this.levelInfo.leaguerId,
        NewLgCode: this.levelInfo.newCardCode,
        NewCardID: this.levelInfo.newCardID,
        goodType: 4,
        mediaType: this.changeCardGoods.CardMedia,
        HasPermission: 200000804,
      };
      this.$api['sell/order/createOrder']({
        GoodsData: {
          GoodsID: this.changeCardGoods.goodsId,
          Amount: 1,
          NotAddFromNomalCar: true,
        },
        LeaguerID: this.levelInfo.leaguerId,
        ExtendInfo: JSON.stringify(extendInfo),
      }).then((res) => {
        this.orderId = res.OrderID;
        this.actualCharge = res.ActualCharge;
        this.paymentVisible = true;
      }, () => {
        this.checkingOut = false;
      });
    },

    handlePaymentClose() {
      this.checkingOut = false;
      this.paymentVisible = false;
    },

    handleOrderCancel() {
      this.$api['sell/order/cancelOrder']({
        OrderID: this.orderId,
      }).then(() => {
        this.checkingOut = false;
      }, () => {
        this.checkingOut = false;
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
        this.checkingOut = false;
        this.$emit('complete');
        this.$emit('close');
        this.remove && this.remove();
      }, () => {
        this.checkingOut = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .level-change {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;

      .input-special {
        width: 320px;
        // /deep/ .el-input {
        //   width: 274px;
        // }

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

  .level-change-dialog {
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
      // background-color: $color-bg-primary;
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
