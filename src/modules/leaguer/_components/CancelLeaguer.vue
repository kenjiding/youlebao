<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员注销"
    top="15vh"
    width="500px"
    class="cancel-leaguer-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-form
      v-loading="formLoading"
      ref="form"
      :model="leaguerInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="cancel-leaguer-form">
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
            :verify-state="false"
            :verify-date="false"
            :verify-card-state="false"
            class="read-card"
            @change="handleReadLeaguer"
            @logout="handleReadCardLogout"/>
        </el-form-item>
        <el-form-item
          label="退卡备注:">
          <el-input
            v-model="summary"
            :maxlength="128"
            :disabled="!refundCard"
            placeholder="请输入退卡备注"/>
        </el-form-item>
        <el-form-item
          label="退卡备注:">
          <el-tabs
            v-model="activeTab"
            type="card"
            class="cancel-leaguer-pannel">
            <el-tab-pane
              label="退卡"
              name="refundCard">
              <div
                class="select-card">
                <div class="select-card-row">
                  <p class="select-card-label">卡押金</p>
                  <p class="select-card-price">¥ {{ cardPledge | number('0.00') }}</p>
                </div>
                <div class="select-card-row">
                  <div>
                    <p class="select-card-label">预存款退款</p>
                    <p class="select-card-placeholder">
                      ¥{{ prepaidRemain | number('0.00') }} x {{ ratio }}
                    </p>
                  </div>
                  <p class="select-card-price price-special">
                    ¥ {{ refundPrepaid | number('0.00') }}
                  </p>
                </div>
                <div class="select-card-total">
                  <p class="select-card-label">合计退还:</p>
                  <p class="select-card-price">¥ {{ actualRefundCardCharge | number('0.00') }}</p>
                  <el-button
                    v-show="leaguerInfo.leaguerId"
                    type="text"
                    @click="editChargeClick">修改</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="退预存款"
              name="refundPrepaid">
              <div
                class="select-card">
                <div class="select-card-row">
                  <div>
                    <p class="select-card-label">预存款退款</p>
                    <p class="select-card-placeholder">
                      {{ prepaidRemain | number('0.00') }} x {{ ratio }}
                    </p>
                  </div>
                  <p class="select-card-price price-special">
                    ¥ {{ refundPrepaid | number('0.00') }}
                  </p>
                </div>
                <div class="select-card-total">
                  <p class="select-card-label">合计退还:</p>
                  <p class="select-card-price">¥ {{ actualRefundPrepaid | number('0.00') }}</p>
                  <el-button
                    v-show="leaguerInfo.leaguerId"
                    type="text"
                    @click="editChargeClick">修改</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-checkbox v-model="isPrint">打印储值变更清单</el-checkbox>
      <el-button
        :disabled="disableCancel"
        :loading="canceling"
        type="primary"
        @click="submit">
        {{ refundCard?'退卡':'仅退款不退卡' }}</el-button>
    </div>
    <cancel-leaguer-receipt
      ref="cancelLeaguerReceipt"
      :print-content="printContent"
    />

  </el-dialog>
</template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';
import CancelLeaguerReceipt from '@/modules/leaguer/_components/CancelLeaguerReceipt.vue';

export default {
  name: 'CancelLeaguer',

  components: {
    ReadCard,
    CancelLeaguerReceipt,
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
      formLoading: false,
      activeTab: 'refundCard',
      localVisible: false,
      cardKeyValue: '',
      leaguerInfo: {
        leaguerId: '',
        leaguerCode: '',
      },
      disableCancel: false, // 会员状态
      frozenPrepaid: 0, // 冻结数量
      canceling: false,
      prepaidRemain: 0,
      cardPledge: 0,
      ratio: 0,
      summary: '',
      isPrint: false,
      printContent: {},
      actualRefundCardCharge: 0,
      actualRefundPrepaid: 0,
      isRoamOut: false,
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
      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
      };
    },

    refundCard() {
      return this.activeTab === 'refundCard';
    },

    refundPrepaid() {
      return this.prepaidRemain * this.ratio;
    },

    refundCardCharge() {
      return this.refundPrepaid + this.cardPledge;
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
        this.getCannelSetting();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    handleClose() {
      this.clearForm();
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    editChargeClick() {
      this.$api['leaguer/leaguer/leaguerCannelChangePrice']().then(() => {
        this.$prompt('', '请输入退款金额', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(([0]|[1-9][0-9]{0,8})|(([0]\.\d{1,2}|[1-9][0-9]{0,8}\.\d{1,2})))$/,
          inputErrorMessage: '退款金额必须为两位小数内的数字',
        }).then(({ value }) => {
          if (this.refundCard) {
            this.actualRefundCardCharge = value;
          } else {
            this.actualRefundPrepaid = value;
          }
        }).catch(() => {
        });
      });
    },

    clearForm() {
      this.$refs.form.resetFields();
      this.leaguerInfo.leaguerId = '';
      this.prepaidRemain = 0;
      this.cardPledge = 0;
      this.ratio = 0;
      this.summary = '';
      this.isPrint = false;
      this.disableCancel = false;
      this.frozenPrepaid = 0;
      this.actualRefundCardCharge = 0;
      this.actualRefundPrepaid = 0;
      this.isRoamOut = false;
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.leaguerInfo.leaguerId = leaguer.ID;
        this.leaguerInfo.leaguerLevelID = leaguer.LeaguerLevelID;
        this.leaguerInfo.name = leaguer.RealName;
        this.leaguerInfo.leaguerCode = leaguer.LeaguerCode;
        this.leaguerInfo.verifyTime = leaguer.VerifyTime;
        this.getCannelSetting();
        this.$refs.form.validate();
      }
    },

    handleReadCardLogout() {
      this.clearForm();
    },

    getCannelSetting() {
      this.$api['leaguer/leaguer/getChargeJoinLForCannel']({
        LeaguerID: this.leaguerInfo.leaguerId,
      }).then((res) => {
        this.cardPledge = res.CardPledge;
        this.ratio = res.UnJoinRate;
        this.isRoamOut = res.IsRoamOut;
        if (!res.IsEnable || !res.IsMayUnjoin) {
          this.$message({
            message: `会员${!res.IsEnable ? '被禁用不能注销' : '不能注销'}`,
            type: 'warning',
          });
          this.disableCancel = true;
        } else if (!res.IsLocalLeaguer) {
          this.$message({
            message: '不是本地会员不能注销',
            type: 'warning',
          });
          this.disableCancel = true;
        } else if (this.isRoamOut) {
          this.disableCancel = true;
          this.$confirm('该会员在其他门店可能有储值，是否漫回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showClose: false,
            closeOnClickModal: false,
          }).then(() => {
            this.roamBack();
          }).catch(() => {
            this.disableCancel = false;
            this.checkLeaguerPrepaid();
          });
        } else {
          this.disableCancel = false;
          this.checkLeaguerPrepaid();
        }
      });
    },

    checkLeaguerPrepaid() {
      this.$api['leaguer/leaguer/getCurBusinessPrepaid']({
        LeaguerID: this.leaguerInfo.leaguerId,
      }).then((res) => {
        this.frozenPrepaid = res.FrozenPrepaid;
        this.prepaidRemain = res.Prepaid;
        this.actualRefundCardCharge = this.refundCardCharge;
        this.actualRefundPrepaid = this.refundPrepaid;
        if (res.FrozenPrepaid > 0 && res.UnJoinRate > 0) {
          this.$message({
            message: '会员预存款被冻结',
            type: 'warning',
          });
        }
      });
    },

    // 漫游储值回来本店
    roamBack() {
      this.formLoading = true;
      this.$api['leaguer/leaguer/lgValueRoamReturn']({
        LeaguerBaseID: this.leaguerInfo.leaguerId,
      }).then(() => {
        this.$message({
          message: '会员储值漫回成功',
          type: 'success',
        });
        this.disableCancel = false;
        this.formLoading = false;
        this.checkLeaguerPrepaid();
      }, () => {
        this.formLoading = false;
        // 强提示
        if (!this.dialogVisible) { return; }
        this.$confirm('会员储值漫游到本店失败,是否重试？', '提示', {
          confirmButtonText: '重试',
          cancelButtonText: '取消',
          showClose: false,
          closeOnClickModal: false,
        }).then(() => {
          this.roamBack();
        }).catch(() => {
          this.disableCancel = false;
        });
      });
    },

    // 1.验证密码
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.canceling = true;
          if (this.$electronStore.get('commonForm').logoutSetting === 'Need') {
            this.$prompt('', '请输入会员密码', {
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
                this.removeFreeze();
              }, () => {
                this.canceling = false;
              });
            }).catch(() => {
              this.canceling = false;
            });
          } else {
            this.removeFreeze();
          }
        }
      });
    },

    // 2.是否解冻储值
    removeFreeze() {
      if (this.frozenPrepaid) {
        this.$confirm(`该会员预存款冻结数量为:${this.frozenPrepaid},是否解冻？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          closeOnClickModal: false,
        }).then(() => {
          this.$api['leaguer/leaguer/unFrozenLeaguerPrepaid']({
            LeaguerId: this.leaguerInfo.leaguerId,
            ValueCode: 1,
          }).then(() => {
            // this.cancelAction();
            this.canceling = false;
            this.checkLeaguerPrepaid();
          }, () => {
            this.canceling = false;
          });
        }).catch(() => {
          this.cancelAction();
        });
      } else {
        this.cancelAction();
      }
    },

    // 4.注销
    cancelAction() {
      if (this.refundCard) {
        this.$api['leaguer/leaguer/leaguerCancel']({
          LeaguerID: this.leaguerInfo.leaguerId,
          ReturnMoney: Number(this.actualRefundCardCharge),
          IsPrintDetail: this.isPrint,
          Remark: this.summary,
        }).then((res) => {
          this.canceling = false;
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          if (this.isPrint) {
            this.printContent = res;
          }
          this.$nextTick(() => {
            this.isPrint && this.$refs.cancelLeaguerReceipt.onPrint();
            this.$emit('complete');
            this.$emit('close');
            this.remove && this.remove();
          });
        }, () => {
          this.canceling = false;
        });
      } else {
        this.$api['leaguer/leaguer/returnTempletLeaguerPrepaid']({
          LeaguerId: this.leaguerInfo.leaguerId,
          RefundPrice: Number(this.actualRefundPrepaid),
          PrepaidAmount: this.prepaidRemain,
          IsPrintDetail: this.isPrint,
        }).then((res) => {
          this.canceling = false;
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          if (this.isPrint) {
            this.printContent = res;
          }
          this.$nextTick(() => {
            this.isPrint && this.$refs.cancelLeaguerReceipt.onPrint();
            this.$emit('complete');
            this.$emit('close');
            this.remove && this.remove();
          });
        }, () => {
          this.canceling = false;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .cancel-leaguer {
    width: 500px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 10px;

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-form-item:last-child {
        margin-bottom: 0;
      }

      /deep/ .el-input {
        width: 320px;
        text-align: left;
      }
    }

    &-pannel {
      width: 320px;

      .select-card {
        width: 320px;
        height: 220px;
        position: relative;
        padding-top: 20px;
        display: flex;
        flex-flow: column wrap;
        justify-content: space-between;

        &-row {
          width: 280px;
          height: 40px;
          padding: 0 20px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          line-height: 40px;
        }

        &-label {
          // line-height: 20px;
          font-size: $font-size-primary;
          color: $font-color-primary;
        }

        &-placeholder {
          position: relative;
          top: -10px;
          line-height: 17px;
          font-size: $font-size-primary;
          color: $font-color-placeholder;
        }

        &-price {
          font-size: $font-size-primary+ $two-px;
          color: $font-color-primary;
        }

        &-total {
          width: 280px;
          height: 50px;
          margin: 20px 10px 0;
          padding: 10px;
          border-top: 1px $color-bg-table solid;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          line-height: 40px;

          .select-card-price {
            font-size: $font-size-regular;
            color: $font-color-currency;
          }

          /deep/ .el-button {
            position: absolute;
            bottom: 0;
            right: 20px;
          }
        }

        .price-special {
          margin-top: 12px;
          line-height: 36px;
        }

        &-line {
          width: 300px;
          margin: 20px 10px 15px;
          border-top: 1px $color-bg-table solid;
        }
      }

      /deep/ .el-tabs__header {
        margin: 0;
        border: 0;

        .el-tabs__nav {
          width: 100%;
          border-radius: 0;
          border: 0;
        }

        .el-tabs__item {
          width: 50%;
          text-align: center;
          box-sizing: border-box;
          color: $font-color-placeholder;
          border: 1px solid $color-bg-table;
          border-bottom-color: $border-color;
          background-color: $color-bg-table;
        }

        .is-active {
          color: $color-primary;
          border: 1px solid $border-color;
          border-bottom: 0;
          background-color: $color-white;
        }
      }

      /deep/ .el-tabs__content {
        border: 1px solid $border-color;
        border-top: 0;
      }
    }
  }

  .cancel-leaguer-dialog {
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
      font-size: $font-size-primary + $two-px;
      color: $font-color-regular;
    }

    /deep/ .el-dialog__body {
      padding: 20px;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      position: relative;
      border-top: 1px $border-color solid;

      .el-checkbox {
        position: absolute;
        top: 20px;
        left: 20px;
        color: $font-color-primary;
      }

      .el-button {
        width: 180px;
      }
    }
  }
</style>
v
