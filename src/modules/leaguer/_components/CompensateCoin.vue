<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="补币"
    top="15vh"
    width="500px"
    class="compensate-coin-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="compensateInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="90px"
      label-position="right">
      <div class="compensate-coin-form">
        <el-form-item
          label="会员卡号:"
          prop="leaguerCode">
          <el-input
            v-if="leaguerLock"
            v-model="compensateInfo.leaguerCode"
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
          label="补币类型:"
          prop="compensateType">
          <el-select
            v-model="compensateInfo.compensateType"
            placeholder="请选择">
            <el-option
              v-for="type in compensateTypes"
              :key="type.Value"
              :label="type.Text"
              :value="type.Value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="compensateInfo.leaguerId?'补代币数:':'补实物币数:'"
          prop="coinAmount">
          <el-input-number
            :controls="false"
            :min="0"
            v-model="compensateInfo.coinAmount"/>
        </el-form-item>
        <el-form-item
          v-show="compensateInfo.leaguerId"
          prop="goldCoinAmount"
          label="补金币数:">
          <el-input-number
            :controls="false"
            :min="0"
            v-model="compensateInfo.goldCoinAmount"/>
        </el-form-item>
        <el-form-item
          prop="summary"
          label="备注:">
          <el-input
            v-model="compensateInfo.summary"/>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :disabled="canSubmit"
        :loading="buttonLoading"
        type="primary"
        @click="submit">{{ compensateInfo.leaguerId?'存会员卡':'出实物币' }}</el-button>
    </div>
</el-dialog></template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'CompensateCoin',

  components: {
    ReadCard,
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
      compensateTypes: null,
      buttonLoading: false,

      compensateInfo: {
        leaguerId: '',
        leaguerCode: '',
        compensateType: '',
        coinAmount: null,
        goldCoinAmount: null,
        summary: '',
      },

      outCoinVisible: false,
      outCoinAmount: 0,
      logId: '',
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

    canSubmit() {
      return this.compensateInfo.coinAmount <= 0 && this.compensateInfo.goldCoinAmount <= 0;
    },

    rules() {
      const checkCoinAmount = (rule, value, callback) => {
        if (value === 0 || !value) {
          // this.$refs.form.validateField('goldCoinAmount');
          if (this.compensateInfo.goldCoinAmount <= 0 || !this.compensateInfo.goldCoinAmount) {
            callback(new Error('请输入补币数!'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

      const checkGoldCoinAmount = (rule, value, callback) => {
        if (value === 0 || !value) {
          // this.$refs.form.validateField('coinAmount');
          if (this.compensateInfo.coinAmount <= 0 || !this.compensateInfo.coinAmount) {
            callback(new Error('请输入补金币数!'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

      return {
        // leaguerCode: [
        //   { required: true, message: '请读取会员', trigger: 'blur' },
        // ],
        compensateType: [
          { required: true, message: '请选择补币类型', trigger: 'blur' },
        ],
        coinAmount: [
          { validator: checkCoinAmount, trigger: 'blur' },
        ],
        goldCoinAmount: [
          { validator: checkGoldCoinAmount, trigger: 'blur' },
        ],
        // summary: [
        //   { required: Boolean(this.compensateInfo.leaguerId),
        // message: '请输入补币备注', trigger: 'blur' },
        // ],
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
      this.loadCompensateType();
      if (this.leaguerLock) {
        this.compensateInfo.leaguerId = this.leaguer.ID;
        this.compensateInfo.leaguerCode = this.leaguer.LeaguerCode;
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
      this.compensateInfo.leaguerId = '';
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.compensateInfo.leaguerId = leaguer.ID || '';
        this.compensateInfo.leaguerCode = leaguer.LeaguerCode || '';
      }
    },

    handleReadCardLogout() {
      this.compensateInfo.leaguerId = '';
      this.$refs.form.resetFields();
    },

    loadCompensateType() {
      if (!this.compensateTypes) {
        this.$api['leaguer/coin/getFillCoinTypeList']({
        }).then((res) => {
          this.compensateTypes = res.DataList;
        });
      }
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        if (this.compensateInfo.leaguerId) {
          this.$confirm('确认补币到会员?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.compensateCoinAction();
          }).catch(() => {});
        } else {
          this.compensatePhysicalCoinAction();
        }
      });
    },

    compensateCoinAction() {
      this.buttonLoading = true;
      this.$api['leaguer/coin/saveFillCoinLog']({
        LeaguerID: this.compensateInfo.leaguerId,
        GoldCoin: this.compensateInfo.goldCoinAmount,
        Coin: this.compensateInfo.coinAmount,
        Summary: this.compensateInfo.summary,
        CoinType: this.compensateInfo.compensateType,
      }).then(() => {
        this.buttonLoading = false;
        this.$message({
          message: '会员补币成功',
          type: 'success',
        });
        this.$emit('complete');
        this.$emit('close');
        this.remove && this.remove();
      }, () => {
        this.buttonLoading = false;
      });
    },

    compensatePhysicalCoinAction() {
      this.buttonLoading = true;
      this.$api['leaguer/coin/outCoinBeforeSaveFillCoinLog']({
        OutCoins: this.compensateInfo.coinAmount,
        Summary: this.compensateInfo.summary,
        CoinType: this.compensateInfo.compensateType,
      }).then((res) => {
        this.logId = res.LogID;
        this.outCoinAmount = this.compensateInfo.coinAmount;
        // this.$message({
        //   message: '会员补币成功',
        //   type: 'success',
        // });
        this.buttonLoading = false;
        this.StartOutCoin();
      }, () => {
        this.buttonLoading = false;
      });
    },

    StartOutCoin() {
      const _this = this;
      this.outCoinVisible = true;
      this.$createOutCoin({
        $props: {
          animationVisible: 'outCoinVisible',
          outCoin: 'outCoinAmount',
          needTolog: false,
        },
        $events: {
          // 关闭dialog之后的回调
          closeDialog() {
            _this.outCoinVisible = false;
            _this.$emit('close');
            _this.remove && _this.remove();
          },
          // 完成之后的回调
          complete() {
            _this.$api['leaguer/coin/completedFillCoinLog']({
              LogID: _this.logId,
              OutCoins: _this.outCoinAmount,
            });
            _this.$emit('complete');
            _this.$emit('close');
            _this.remove && _this.remove();
          },
          // 错误回调
          error() {
            _this.$api['leaguer/coin/cancelFillCoinLog']({
              LogID: _this.logId,
              OutCoins: 0,
            });
            _this.$emit('complete');
            _this.$emit('close');
            _this.remove && _this.remove();
          },
        },
      });
    },

  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .compensate-coin {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input__inner {
        width: 320px;
      }

      /deep/ .el-input {
        width: 320px;
      }
    }
  }

  .compensate-coin-dialog {
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
      text-align: center;
      border-top: 1px $border-color solid;

      .el-button {
        width: 360px;
      }
    }
  }
</style>
