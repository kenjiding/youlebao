<template>
  <div class="get-lottery">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="top">
      <el-row
        type="flex"
        justify="space-between">
        <el-col :span="11">
          <el-form-item
            label="存会员卡"
            prop="leaguerCode">
            <el-input
              v-if="leaguerLock"
              v-model="formData.leaguerId"
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
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="现有票数"
            prop="nowValue">
            <el-input-number
              :disabled="true"
              :controls="false"
              :min="0"
              :max="999999"
              v-model="formData.nowValue"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="space-between">
        <el-col :span="11">
          <el-form-item
            label="存票单号"
            prop="lotteryCode">
            <el-input
              ref="lotteryCode"
              v-model="formData.lotteryCode"
              class="code-query"
              placeholder="请输入存票单号/存票单二维码"
              @input="handlCodeInput"
              @keydown.enter.native="handleCodeClick">
              <el-button
                slot="append"
                :loading="querying"
                class="code-query__btn"
                @click="handleCodeClick"
              >查询</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="存入票数"
            prop="saveValue">
            <el-input-number
              :disabled="true"
              :controls="false"
              :min="0"
              :max="999999"
              v-model="formData.saveValue"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'GetLottery',

  components: {
    ReadCard,
  },

  props: {
    leaguer: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      cardKeyValue: '',
      formData: {
        leaguerId: '',
        leaguerCode: '',
        nowValue: 0,
        saveValue: '',
        lotteryCode: '',
      },
      querying: false,
    };
  },

  computed: {
    leaguerLock() {
      return Boolean(this.leaguer.ID);
    },

    rules() {
      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
        getValue: [
          { required: true, message: '请填写暂存票数', trigger: 'blur' },
        ],
        lotteryCode: [
          { required: true, message: '请填写存票单号', trigger: 'blur' },
        ],
      };
    },
  },

  methods: {
    onLoad() {
      if (this.formData.leaguerId) return;
      if (this.leaguerLock) {
        this.formData.leaguerId = this.leaguer.ID;
        this.formData.leaguerCode = this.leaguer.LeaguerCode;
        this.getLeaguerLottery();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.formData.leaguerId = leaguer.ID;
        this.formData.leaguerCode = leaguer.LeaguerCode;
        this.getLeaguerLottery();
        this.$refs.lotteryCode.focus();
      }
    },

    getLeaguerLottery() {
      this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
        LeaguerID: this.formData.leaguerId,
        ValueTypes: [403],
      }).then((res) => {
        if (res.DataList.length > 0) {
          this.formData.nowValue = res.DataList[0].Remain;
        }
      });
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
    },

    handlCodeInput(val) {
      const hasIndex = val.indexOf('saveLotteryID');
      if (hasIndex > -1) {
        this.formData.lotteryCode = val.substring(hasIndex, val.length).replace('saveLotteryID=', '');
      }
    },

    handleCodeClick() {
      if (!this.formData.lotteryCode) return;
      this.querying = true;
      this.$api['lottery/lottery/getLotTempTicket']({
        LeaguerID: this.formData.leaguerId,
        LotNumber: this.formData.lotteryCode,
      }).then((res) => {
        if (res.HasTaked) {
          this.formData.saveValue = 0;
          this.$alert(
            '该彩票编号中暂存的彩票已被取',
            '提示', {
              type: 'warning',
            },
          );
        } else {
          this.formData.saveValue = res.LotteryCount;
        }
        this.querying = false;
      }).catch(() => {
        this.querying = false;
      });
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$emit('complete');
          return;
        }

        this.$api['lottery/lottery/takeLotTempTicket']({
          LeaguerID: this.formData.leaguerId,
          LotNumber: this.formData.lotteryCode,
        }).then(() => {
          this.formData.lotteryCode = '';
          this.formData.saveValue = 0;
          this.getLeaguerLottery();
          this.$message({
            type: 'success',
            message: '取彩票成功',
          });
          this.$emit('complete');
        }).catch(() => {
          this.$emit('complete');
        });
      });
    },

    clear() {
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
    },
  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .get-lottery {
    padding: 0 10px;

    .code-query {
      // /deep/ .el-input {
      //   width: 300px;
      // }

      /deep/ .el-input__inner {
        width: 280px;
      }

      /deep/ .el-input-group__append {
        border: 0;
        padding: 0;
      }

      &__btn {
        font-size: $font-size-special !important;
        width: 60px!important;
        // height: 38px!important;
        margin: 0!important;
        padding: 0;
        border: 1px solid $border-color!important;
        border-left: 0!important;
        text-align: center;
        cursor: pointer;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        color: $color-primary!important;
        background-color: $color-bg-regular!important;
        &:hover {
          background-color: $color-primary!important;
          color: $color-white!important;
        }
      }
    }

    /deep/ .el-form-item__label {
      padding-bottom: 0;
    }

    /deep/ .el-input__inner {
      width: 320px;
      text-align: left;
    }
  }

</style>
