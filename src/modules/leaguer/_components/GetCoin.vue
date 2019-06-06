<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="提币"
    top="15vh"
    width="500px"
    class="get-coin-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="leaguerInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="get-coin-form">
        <el-form-item
          label="会员卡号:"
          prop="leaguerCode">
          <el-input
            v-if="leaguerLock"
            v-model="leaguerInfo.leaguerCode"
            disabled/>
          <read-card
            v-else
            ref="cardReader"
            :value="cardKeyValue"
            :auto-logout="false"
            class="read-card"
            @logout="handleReadCardLogout"
            @change="handleReadLeaguer"/>
        </el-form-item>
        <el-form-item
          label="剩余币数:">
          <el-input
            v-model="leaguerInfo.coinAmount"
            disabled>
            <el-button
              v-show="leaguerInfo.coinAmount"
              slot="suffix"
              type="text"
              @click="leaguerInfo.getCoinAmount = leaguerInfo.coinAmount">全部提取</el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="getCoinAmount"
          label="提币数量:">
          <el-input-number
            :controls="false"
            :max="leaguerInfo.coinAmount"
            v-model="leaguerInfo.getCoinAmount"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            class="quick-input"
            @click="quickInput(10)">10</el-button>
          <el-button
            type="primary"
            plain
            class="quick-input"
            @click="quickInput(20)">20</el-button>
          <el-button
            type="primary"
            plain
            class="quick-input"
            @click="quickInput(50)">50</el-button>
          <el-button
            type="primary"
            plain
            class="quick-input"
            @click="quickInput(100)">100</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :loading="outCoining"
        :disabled="!leaguerInfo.leaguerId"
        type="primary"
        @click="submit">提币</el-button>
    </div>
</el-dialog></template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'GetCoin',

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
      leaguerInfo: {
        leaguerId: '',
        leaguerCode: '',
        coinAmount: 0,
        getCoinAmount: null,
      },
      outCoinLogId: '',
      outCoining: false,
      outCoinVisible: false,
      outCoinAmount: 0,
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
      const checkCoinAmount = (rule, value, callback) => {
        if (value === 0 || !value) {
          callback(new Error('请输入提币数!'));
        } else {
          callback();
        }
      };

      return {
        leaguerCode: [
          { required: true, message: '请读取会员', trigger: 'blur' },
        ],
        getCoinAmount: [
          { validator: checkCoinAmount, trigger: 'blur' },
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
        this.leaguerInfo.leaguerId = this.leaguer.ID;
        this.leaguerInfo.leaguerCode = this.leaguer.LeaguerCode;
        this.getLeaguerCoinAmount();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    getLeaguerCoinAmount() {
      this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
        LeaguerID: this.leaguerInfo.leaguerId,
        ValueTypes: [402],
      }).then((res) => {
        this.leaguerInfo.coinAmount = res.DataList[0].Remain;
      });
    },

    handleClose() {
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      } else {
        this.clearForm();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.leaguerInfo.leaguerId = leaguer.ID || '';
        this.leaguerInfo.leaguerCode = leaguer.LeaguerCode || '';
        this.getLeaguerCoinAmount();
      }
    },

    handleReadCardLogout() {
      this.clearForm();
    },

    clearForm() {
      this.$refs.form.resetFields();
      this.leaguerInfo.leaguerId = '';
      this.outCoinLogId = '';
      this.outCoining = false;
    },

    quickInput(val) {
      this.leaguerInfo.getCoinAmount = val;
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        if (this.$electronStore.get('commonForm').logoutSetting === 'Need') {
          this.$prompt(null, '请输入会员密码', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputType: 'password',
            showClose: false,
            closeOnClickModal: false,
            inputPattern: /^\d{6,}$/,
            inputErrorMessage: '会员密码格式不正确',
          }).then(({ value }) => {
            const encryptedPwd = window.btoa(value);
            this.$api['leaguer/leaguer/checkLgPwd']({
              LeaguerID: this.leaguerInfo.leaguerId,
              PassWord: encryptedPwd,
            }).then(() => {
              this.outCoinHandle();
            });
          }).catch(() => {});
        } else {
          this.outCoinHandle();
        }
      });
    },

    outCoinHandle() {
      this.outCoining = true;
      this.$api['leaguer/coin/outCoinBeforeSaveCoinLog']({
        LeaguerID: this.leaguerInfo.leaguerId,
        OutCoins: this.leaguerInfo.getCoinAmount,
      }).then((res) => {
        this.outCoinLogId = res.LogID;
        this.outCoinAmount = this.leaguerInfo.getCoinAmount;
        this.StartOutCoin();
      }, () => {
        this.outCoining = false;
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
            if (_this.$refs.cardReader) {
              _this.$refs.cardReader.logout();
            }
            _this.$emit('close');
            _this.remove && _this.remove();
          },
          // 完成之后的回调
          complete() {
            _this.handleOutCoinComplete(_this.leaguerInfo.getCoinAmount);
            _this.$emit('close');
            _this.remove && _this.remove();
          },
          // 错误回调
          error() {
            _this.$api['leaguer/coin/outCoinPausedUpdateCoinLog']({
              LogID: _this.outCoinLogId,
              OutCoins: 0,
            });
            _this.handleOutCoinComplete(0);
            _this.$emit('close');
            _this.remove && _this.remove();
          },
        },
      });
    },

    handleOutCoinComplete(outAmount) {
      this.$api['leaguer/coin/outCoinCompletedUpdateCoinLog']({
        LogID: this.outCoinLogId,
        OutCoins: outAmount,
      }).then(() => {
        this.outCoinAmount = 0;
        this.outCoining = false;
      }, () => {
        this.outCoinAmount = 0;
        this.outCoining = false;
      });
    },
  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .get-coin {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;

      .quick-input {
        width: 70px;
        border: 0;
      }

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input {
        width: 320px;
      }

      /deep/ .el-input-number {
        width: 320px;
      }

      /deep/ .el-input__inner {
        width: 320px;
        text-align: left;
      }
    }
  }

  .get-coin-dialog {
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
