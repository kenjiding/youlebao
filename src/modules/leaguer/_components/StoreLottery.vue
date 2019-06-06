<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="手动存票"
    width="500px"
    class="store-lottery-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="storeLotteryInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="store-lottery-form">
        <el-form-item
          label="会员卡号:"
          prop="leaguerCode">
          <el-input
            v-if="leaguerLock"
            v-model="storeLotteryInfo.leaguerCode"
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
          prop="lotteryAmount"
          label="现有票数:">
          <el-input-number
            :controls="false"
            v-model="storeLotteryInfo.lotteryAmount"
            disabled/>
        </el-form-item>
        <el-form-item
          prop="storeAmount"
          label="存入票数:">
          <el-input-number
            :controls="false"
            :min="0"
            v-model="storeLotteryInfo.storeAmount"/>
        </el-form-item>
        <el-form-item
          prop="summary"
          label="摘要:">
          <el-input
            v-model="storeLotteryInfo.summary"/>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        :loading="loading"
        :disabled="!storeLotteryInfo.leaguerId"
        type="primary"
        @click="submit">确定</el-button>
    </div>
</el-dialog></template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'StoreLottery',

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
      loading: false,
      localVisible: false,
      cardKeyValue: '',
      storeLotteryInfo: {
        leaguerId: '',
        leaguerCode: '',
        lotteryAmount: 0,
        storeAmount: null,
        summary: '',
      },
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
      const checkStoreAmount = (rule, value, callback) => {
        if (value === 0 || !value) {
          callback(new Error('请输入存入票数!'));
        } else {
          callback();
        }
      };

      const validateSummary = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (value.length > 128) {
          callback(new Error('摘要不能大于128个字符!'));
        } else {
          callback();
        }
      };

      return {
        leaguerCode: [
          { required: true, message: '请读取会员', trigger: 'blur' },
        ],
        storeAmount: [
          { validator: checkStoreAmount, trigger: 'blur' },
        ],
        summary: [
          { required: true, message: '请填写摘要', trigger: 'blur' },
          { validator: validateSummary, trigger: 'blur' },
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
        this.storeLotteryInfo.leaguerId = this.leaguer.ID;
        this.storeLotteryInfo.leaguerCode = this.leaguer.LeaguerCode;
        this.getLeaguerLotteryAmount();
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
      this.storeLotteryInfo.leaguerId = '';
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.storeLotteryInfo.leaguerId = leaguer.ID || '';
        this.storeLotteryInfo.leaguerCode = leaguer.LeaguerCode || '';
        this.getLeaguerLotteryAmount();
      }
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
    },

    getLeaguerLotteryAmount() {
      this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
        LeaguerID: this.storeLotteryInfo.leaguerId,
        ValueTypes: [403],
      }).then((res) => {
        this.storeLotteryInfo.lotteryAmount = res.DataList[0].Remain;
      });
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        this.loading = true;
        this.$api['leaguer/leaguer/storeLottery']({
          LeaguerID: this.storeLotteryInfo.leaguerId,
          Amount: this.storeLotteryInfo.storeAmount,
          Summary: this.storeLotteryInfo.summary,
        }).then(() => {
          this.$message({
            message: '会员存票成功',
            type: 'success',
          });
          this.loading = false;
          this.$emit('complete');
          this.$emit('close');
          this.remove && this.remove();
        }, () => {
          this.loading = false;
        });
      });
    },
  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .store-lottery {
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
        text-align: left;
      }

      /deep/ .el-input {
        width: 320px;
      }
    }
  }

  .store-lottery-dialog {
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
