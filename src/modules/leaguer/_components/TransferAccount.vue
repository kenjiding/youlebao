<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="储值过户"
    top="15vh"
    width="940px"
    class="transfer-account-dialog"
    @close="handleClose"
    @open="onLoad">
    <div class="transfer-account-form">
      <div>
        <p>过户会员</p>
        <el-input
          v-if="leaguerLock"
          v-model="leaguerInfo.LeaguerCode"
          disabled/>
        <read-card
          v-else
          ref="cardReader"
          :value="cardKeyValue"
          :auto-logout="false"
          class="read-card"
          @change="handleReadLeaguer"
          @logout="handleLogoutLeaguer"/>
        <div class="transfer-account-form-value">
          <div
            v-for="item in lgValues"
            :key="item.ValueType"
            class="value-item">
            <el-row :gutter="5">
              <el-col
                :span="8"
                class="value-item-label">
                <span>{{ item.ValueName }}:</span>
              </el-col>
              <el-col
                :span="16"
                class="value-item-amount">
                <span v-if="item.ValueType===1">
                  {{ ((item.Remain - Number(tranferValues[item.ValueType]))
                    || 0)
                    | number('0.00')
                  }}
                </span>
                <span v-else>
                  {{
                    (item.Remain - Number(tranferValues[item.ValueType])) || 0
                  }}
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="transfer-account-form-middle">
        <el-button
          v-show="transferUsable"
          type="text"
          style="margin-left: 40px"
          @click="transferAllClick">全部过户</el-button>
        <div
          v-for="item in lgValues"
          v-show="transferUsable"
          :key="item.ValueType"
          class="value-change-amount">
          <div class="right-triangle"/>
          <el-input-number
            :controls="false"
            :max="item.Remain"
            :precision="item.ValueType===1?2:0"
            :step="item.ValueType===1?0.01:1"
            v-model="tranferValues[item.ValueType]"
            placeholder="请输入过户数量"/>
          <div class="right-triangle"/>
        </div>
      </div>
      <div>
        <p>目标会员</p>
        <read-card
          ref="cardReaderTarget"
          :value="targetKeyValue"
          :auto-logout="false"
          class="read-card"
          @change="handleReadTargetLeaguer"
          @logout="handleLogoutTargetLeaguer"/>
        <div class="transfer-account-form-value">
          <div
            v-for="item in targetLgValues"
            :key="item.ValueType"
            class="value-item">
            <el-row>
              <el-col
                :span="8"
                class="value-item-label">
                <span>{{ item.ValueName }}:</span>
              </el-col>
              <el-col
                :span="16"
                class="value-item-amount">
                <span v-if="item.ValueType===1">
                  {{ ((item.Remain + Number(tranferValues[item.ValueType]))
                    || item.Remain)
                    | number('0.00')
                  }}
                </span>
                <span v-else>
                  {{
                    (item.Remain + Number(tranferValues[item.ValueType])) || item.Remain
                  }}
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div
      slot="footer">
      <el-button
        :disabled="!transferUsable"
        :loading="submitLoading"
        type="primary"
        @click="submit">过户</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'TransferAccount',

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
      targetKeyValue: '',
      lgValues: [],
      targetLgValues: [],
      tranferValues: {},
      leaguerInfo: {},
      targetLeaguerInfo: {},
      submitLoading: false,
      emptyValues: [
        {
          ValueName: '预存款',
          ValueType: '1',
          Remain: 0,
        },
        {
          ValueName: '积分',
          ValueType: '3',
          Remain: 0,
        },
        {
          ValueName: '金币',
          ValueType: '401',
          Remain: 0,
        },
        {
          ValueName: '代币',
          ValueType: '402',
          Remain: 0,
        },
        {
          ValueName: '彩票',
          ValueType: '403',
          Remain: 0,
        },
      ],
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

    transferUsable() {
      return this.leaguerInfo.ID && this.targetLeaguerInfo.ID;
    },

    hasTarnsferValues() {
      return Object.values(this.tranferValues).some(val => val > 0);
    },
  },

  watch: {
    visible(val) {
      this.localVisible = val;
    },
  },

  created() {
    this.lgValues = this.emptyValues;
    this.targetLgValues = this.emptyValues;
  },

  mounted() {
    this.isCreate && (this.localVisible = true);
    this.checkTransferSetting();
  },

  methods: {
    onLoad() {
      if (this.leaguerLock) {
        this.leaguerInfo = this.leaguer;
        this.getLeaguerAccount();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    checkTransferSetting() {
      const setting = {};
      Object.assign(setting, this.$electronStore.get('commonForm') || {});
      if (!setting.transferSetting) {
        Object.assign(setting, { transferSetting: 'Need' });
        this.$electronStore.set('commonForm', setting);
        console.log(setting, 'Notfound');
      }
    },

    handleClose() {
      this.lgValues = [];
      this.targetLgValues = [];
      this.tranferValues = {};
      this.leaguerInfo = {};
      this.targetLeaguerInfo = {};
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      if (this.$refs.cardReaderTarget) {
        this.$refs.cardReaderTarget.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.leaguerInfo = leaguer;
        this.getLeaguerAccount();
      } else {
        this.lgValues = null;
      }
    },

    getLeaguerAccount() {
      this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
        LeaguerID: this.leaguerInfo.ID,
        ValueTypes: [1, 3, 401, 402, 403],
      }).then((res) => {
        this.lgValues = res.DataList.length <= 0 ? this.emptyValues : res.DataList;
        if (this.lgValues) {
          this.tranferValues = {};
          this.lgValues.forEach((value) => {
            this.$set(this.tranferValues, value.ValueType, 0);
          });
        } else {
          this.tranferValues = null;
        }
      });
    },

    handleLogoutLeaguer() {
      this.leaguerInfo = {};
      this.lgValues = this.emptyValues;
    },

    handleReadTargetLeaguer(leaguer) {
      if (leaguer) {
        this.targetLeaguerInfo = leaguer;
        this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
          LeaguerID: this.targetLeaguerInfo.ID,
          ValueTypes: [1, 3, 401, 402, 403],
        }).then((res) => {
          this.targetLgValues = res.DataList.length <= 0 ? this.emptyValues : res.DataList;
        });
      } else {
        this.targetLgValues = null;
      }
    },

    handleLogoutTargetLeaguer() {
      this.targetLeaguerInfo = {};
      this.targetLgValues = this.emptyValues;
    },

    transferAllClick() {
      this.lgValues.forEach((value) => {
        this.tranferValues[value.ValueType] = value.Remain;
      });
    },

    submit() {
      this.submitLoading = true;
      if (!this.hasTarnsferValues) {
        this.$message({
          message: '请输入过户的储值数量',
          type: 'warning',
        });
        this.submitLoading = false;
        return;
      }
      if (this.$electronStore.get('commonForm').transferSetting === 'Need') {
        this.$prompt('', '请输入过户会员密码', {
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
            LeaguerID: this.leaguerInfo.ID,
            PassWord: encryptedPwd,
          }).then(() => {
            this.tranferAction();
          }, () => {
            this.submitLoading = false;
          });
        }).catch(() => {
          this.submitLoading = false;
        });
      } else {
        this.tranferAction();
      }
    },

    tranferAction() {
      const keys = Object.keys(this.tranferValues);
      const lgValueList = [];
      keys.forEach((key) => {
        if (this.tranferValues[key]) {
          lgValueList.push({
            ValueCode: key,
            Amount: this.tranferValues[key],
          });
        }
      });

      this.$api['leaguer/leaguer/lgUseTransferValue']({
        SourceLeaguerID: this.leaguerInfo.ID,
        TargetLeaguerID: this.targetLeaguerInfo.ID,
        LgValueList: lgValueList,
      }).then(() => {
        this.$message({
          message: '会员过户成功',
          type: 'success',
        });
        this.$emit('complete');
        this.$emit('close');
        this.submitLoading = false;
        this.remove && this.remove();
      }, () => {
        this.submitLoading = false;
      });
    },
  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .transfer-account {
    overflow-y: auto;
    $two-px:2px;

    &-form {
      height: 410px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;

      > div {
        width: 330px;
        height: 350px;

        > p {
          margin-bottom: 6px;
          color: $font-color-placeholder;
        }
      }

      &-middle {
        width: 220px !important;
        height: 280px !important;
        margin-top: 30px;

        .value-change-amount {
          height: 60px;
          padding: 0 18px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: center;

          /deep/ .el-input {
            width: 140px;
            margin: 0 14px;
          }

          /deep/ .el-input__inner {
            width: 140px;
          }
        }

        .right-triangle {
          border-color: transparent transparent transparent $border-color;
          border-style: solid;
          border-width: 8px 0 8px 8px;
          height: 0;
          width: 0;
        }
      }

      &-value {
        margin-top: 10px;
        border: 1px $border-color solid;
      }

      .value-item {
        height: 60px;
        line-height: 60px;
        text-align: center;
        $two-px: 2px;

        &-label {
          text-align: right;
          font-size: $font-size-primary;
          color: $font-color-primary;
        }

        &-amount {
          font-size: $font-size-primary + $two-px;
          color: $font-color-currency;
        }
      }

      .value-item:nth-child(odd) {
        background: $color-white;
      }

      .value-item:nth-child(even) {
        background: $color-bg-regular;
      }
    }
  }

  .transfer-account-dialog {
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
      border-top: 1px $border-color solid;

      /deep/ .el-button {
        width: 180px;
      }
    }
  }
</style>
