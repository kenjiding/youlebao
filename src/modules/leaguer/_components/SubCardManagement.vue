<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="主副卡"
    top="15vh"
    width="600px"
    class="sub-card-dialog"
    @close="handleClose"
    @open="onLoad">
    <div class="sub-card-form">
      <el-row>
        <el-col
          :span="4"
          class="sub-card-form-label">
          会员：
        </el-col>
        <el-col :span="15">
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
            @logout="handleReadCardLogout"/>
        </el-col>
        <el-col :span="4">
          <el-button
            v-if="!leaguerLock"
            style="margin-left: 10px"
            @click="handleClear">清空
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="4"
          class="sub-card-form-label">
          副卡：
        </el-col>
        <el-col :span="15">
          <el-input
            v-model="printNumber"
            class="read-sub"
            disabled>
            <el-button
              slot="append"
              class="append-button"
              @click="readCardClick">
              读卡
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            :disabled="!leaguerInfo.ID"
            type="primary"
            style="margin-left: 10px"
            @click="submit">开副卡</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="cardsTable"
            :data="leaguerSubCards"
            :max-height="320"
            highlight-current-row
            border
            class="sub-card-table">
            <el-table-column
              prop="PrintNumber"
              show-overflow-tooltip
              label="副卡"/>
            <el-table-column
              :formatter="depositFormat"
              prop="ValueType"
              show-overflow-tooltip
              label="押金"
              width="120"/>
            <el-table-column
              :formatter="statusFormat"
              prop="CardStatus"
              show-overflow-tooltip
              label="状态"
              width="80"/>
            <el-table-column
              prop="ICCardID"
              label="操作"
              fixed="right"
              width="100">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleCardStatusChange(scope.row)">
                  {{ scope.row.CardStatus === 'Disabled'?'解锁':'锁定' }}
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="handleCardCancel(scope.row)">还卡</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div
      slot="footer">
      <p
        v-if="subCardDeposit.ValueType"
        class="deposit-tips">副卡押金：{{ depositFormat(subCardDeposit) }}</p>
      <p
        v-else
        class="error-tips">未设置押金，请到管理后台-设置-会员设置-副卡押金设置</p>
    </div>
</el-dialog></template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'SubCardManagement',

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
      leaguerInfo: {},
      leaguerSubCards: [],
      loading: false,
      printNumber: '',
      cardId: '',
    };
  },

  computed: {
    ...mapGetters({
      subCardDeposit: 'leaguer/getSubCardDeposit',
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
      if (!this.subCardDeposit.ValueType) {
        this.$store.dispatch('leaguer/asyncSubCardDeposit', this);
      }
      if (this.leaguerLock) {
        this.leaguerInfo = this.leaguer;
        this.getLeaguerSubCards();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    getLeaguerSubCards() {
      this.$api['leaguer/leaguer/getAllSubCard']({
        LeaguerID: this.leaguerInfo.ID,
      }).then((res) => {
        this.leaguerSubCards = res.DataList;
        if (this.leaguerSubCards.length > 0) {
          const current = this.leaguerSubCards.find(item =>
            item.CardNumber === this.leaguerInfo.CardID);
          this.$refs.cardsTable.setCurrentRow(current);
        }
      });
    },

    depositFormat(row) {
      const valueTypeChs = {
        1: '预存款',
        3: '积分',
        401: '金币',
        402: '代币',
        403: '彩票',
      };
      return row.Money + valueTypeChs[row.ValueType];
    },

    statusFormat(row) {
      const statusChs = {
        Disabled: '禁用',
        Overdue: '已过期',
        Normal: '正常',
      };
      return statusChs[row.CardStatus];
    },

    readCardClick() {
      this.printNumber = '';
      this.cardId = '';
      const cardInfo = this.$device.readCard();
      if (cardInfo.cardID) {
        this.$api['leaguer/leaguer/checkLeaguerIsExist']({
          DeviceLgID: cardInfo.cardID,
        }).then((res) => {
          if (res.LeaguerID) {
            this.$message({
              message: '此卡已存在会员',
              type: 'warning',
            });
            return;
          }
          this.printNumber = cardInfo.cardNumber;
          this.cardId = cardInfo.cardID;
        });
      }
    },

    handleClose() {
      this.leaguerInfo = {};
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.printNumber = '';
      this.cardId = '';
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.leaguerInfo = leaguer;
        this.getLeaguerSubCards();
      }
    },

    handleReadCardLogout() {
      this.clearAll();
    },

    handleClear() {
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      } else {
        this.clearAll();
      }
    },

    clearAll() {
      this.leaguerInfo = {};
      this.leaguerSubCards = [];
      this.loading = false;
      this.printNumber = '';
      this.cardId = '';
    },

    handleCardStatusChange(row) {
      if (this.loading) return;
      this.loading = true;
      this.$api['leaguer/leaguer/updateSubCardState']({
        CardID: row.ICCardID,
        IsEnable: row.CardStatus === 'Disabled',
      }).then(() => {
        this.loading = false;
        this.$message({
          message: '操作成功',
          type: 'success',
        });
        this.getLeaguerSubCards();
      }).catch(() => {
        this.loading = false;
      });
    },

    handleCardCancel(row) {
      if (this.loading) return;
      this.loading = true;
      this.$confirm(`确定还卡【${row.PrintNumber}】,并退还押金${this.depositFormat(row)}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api['leaguer/leaguer/cancelSubCard']({
          CardID: row.ICCardID,
        }).then(() => {
          this.loading = false;
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.getLeaguerSubCards();
        }).catch(() => {
          this.loading = false;
        });
      }).catch(() => {
        this.loading = false;
      });
    },

    submit() {
      if (this.loading) return;
      if (!this.printNumber || !this.cardId) {
        this.$message({
          message: '请放入副卡',
          type: 'warning',
        });
        return;
      }
      this.loading = true;
      this.$confirm(`开副卡需要收取押金${this.depositFormat(this.subCardDeposit)},确定开卡?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api['leaguer/leaguer/addSubCard']({
          LeaguerID: this.leaguerInfo.ID,
          PrintNumber: this.printNumber,
          CardNumber: this.cardId,
        }).then(() => {
          this.loading = false;
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.printNumber = '';
          this.cardId = '';
          this.getLeaguerSubCards();
        }).catch(() => {
          this.loading = false;
        });
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .sub-card {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-table {
      margin-top: 10px;
    }

    &-form {
      margin-top: 10px;
      padding: 0 20px;

      &-label {
        text-align: right;
      }

      .icon-success {
        color: $color-success;
        margin-right: 5px;
      }

      .read-sub {
        position: relative;
        top: -12px;
      }

      .append-button {
        width: 56px;
        line-height: 40px;
        padding: 0;
        color: $color-primary;
      }

      /deep/ .el-row {
        color: $font-color-primary;
        line-height: 40px;
        margin-bottom: 10px;
      }

      /deep/ .el-row .el-col >.el-button {
        width: 80px;
        margin-left: 10px;
      }
    }
  }

  .sub-card-dialog {
    margin-bottom: 0;
    $two-px:2px;

    .deposit-tips {
      font-size: $font-size-primary;
      color: $font-color-secondary;
    }

    .error-tips {
      font-size: $font-size-primary;
      color: $color-danger;
    }

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
      line-height: 40px;
      padding: 10px 30px;
      text-align: left;
      border-top: 1px $border-color solid;

      .el-button {
        width: 360px;
      }
    }
  }
</style>
