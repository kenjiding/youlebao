<template>
  <div class="gift-wrap">
    <el-card
      class="box-card cart-item">
      <div
        slot="header">
        可赠方案
      </div>
      <div
        v-for="(item, index) in giftInfoList"
        :key="item.ID"
        :class="{'cell-link': true, acvtive: isAcvtive === index}"
        @click="clickItem(item, index)">
        <span>{{ item.Name }}</span>
        <span><i class="el-icon-arrow-right"/></span>
      </div>
    </el-card>
    <el-card
      class="box-card detail-item">
      <div
        slot="header">
        方案详情
      </div>
      <div class="content">
        <div>
          <span>方案名称：</span>
          <span>{{ itemInfo.Name }}</span>
        </div>
        <div>
          <span>赠送游戏币数：</span>
          <span>{{ itemInfo.CoinNumber }}</span>
        </div>
        <div>
          <span>代币有限期：</span>
          <span>{{ itemInfo.CoinVerifyTime }}</span>
        </div>
        <div>
          <span>金币有限期：</span>
          <span>{{ itemInfo.GoldCoinVerifyTime }}</span>
        </div>
        <div>
          <span>赠送金币数：</span>
          <span>{{ itemInfo.GoldCoinNumber }}</span>
        </div>
        <div>
          <span>赠送积分数：</span>
          <span>{{ itemInfo.HeapcentNumber }}</span>
        </div>
        <div>
          <span>赠送彩票数：</span>
          <span>{{ itemInfo.LotteryNumber }}</span>
        </div>
        <div>
          <span>方案有效期：</span>
          <span>{{ itemInfo.SchemeVerifyTime }}</span>
        </div>
        <div>
          <span>方案周期：</span>
          <span>
            {{ planInfo(itemInfo) }}
          </span>
        </div>
        <div>
          <span>散客可用：</span>
          <span>{{ itemInfo.GuestUse ? '是' : '否' }}</span>
        </div>
        <div>
          <span>可用会员级别：</span>
          <span>{{ itemInfo.LgLevelName }}</span>
        </div>
        <el-button
          type="primary"
          @click="clickSend">赠送</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CoinMachineHelper from '@/main-process/devices/coin-machine/CoinMachineHelper';

export default {
  name: '',

  props: {
    menberId: {
      type: String,
      default: '',
    },
    idCard: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      giftInfoList: [],
      itemInfo: {},
      schemeID: '',
      isAcvtive: '',
      outCoinVisible: false,
      orderID: '',
      confirmButton: true,
    };
  },

  computed: {
    ...mapState({
      allMachineInfo: state => state.machine.machineInfo,
    }),
  },

  watch: {
    menberId(val, oldVal) {
      if (val === oldVal || !val) {
        this.giftInfoList = [];
        this.itemInfo = {};
        this.schemeID = '';
        this.isAcvtive = '';
        return;
      }
      this.getGiftList({
        LeaguerID: this.menberId,
        GuestIDCard: null,
      });
    },
    idCard(val, oldVal) {
      if (val === oldVal || !val) {
        this.giftInfoList = [];
        this.itemInfo = {};
        this.schemeID = '';
        this.isAcvtive = '';
        return;
      }
      if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val))) {
        this.$message({
          message: '请输入正确的身份证号!',
          type: 'warning',
        });
        return;
      }

      this.getGiftList({
        GuestIDCard: this.idCard,
        LeaguerID: null,
      });
    },
  },
  methods: {
    planInfo(itemInfo) {
      return itemInfo.Cycle ?
        `${itemInfo.Cycle}(已领${itemInfo.UseTimes}/${itemInfo.LimitedTimes}次)` : '';
    },
    clickSend() {
      if (!this.schemeID) {
        this.$message({
          message: '您还没选择方案',
          type: 'warning',
        });
        return;
      }

      this.confirmButton = !this.idCard;

      this.$confirm(`${this.confirmButton ? '请选择“存入会员卡”，还是“出实物”' : '出实物'}`, '提示', {
        confirmButtonText: '出实物币',
        cancelButtonText: '存入会员卡',
        showCancelButton: this.confirmButton,
        distinguishCancelAndClose: true,
        type: 'warning',
      }).then(() => {
        this.outCoinBefore();
      }).catch((action) => {
        if (action === 'cancel') {
          this.saveGivingCoin(false);
        }
      });
    },

    async outCoinBefore() {
      const machineObj = await CoinMachineHelper.defaultMachine;

      if (machineObj) {
        const mark = await machineObj.isMachineLink;

        if (mark) {
          if (this.allMachineInfo.Amont >= this.itemInfo.CoinNumber) {
            this.outCoin(Number(this.itemInfo.CoinNumber) || 0);
          } else {
            this.$message({
              message: '售币机总币数少于赠送游戏币数',
              type: 'warning',
            });
          }
        } else {
          this.$message({
            message: '售币机未连接',
            type: 'warning',
          });
        }
      } else {
        this.$message({
          message: '售币机未连接',
          type: 'warning',
        });
      }
    },
    outCoin(num) {
      const _this = this;
      this.outCoinVisible = true;

      this.$createOutCoin({
        $props: {
          animationVisible: 'outCoinVisible',
          outCoin: num,
          needTolog: false,
        },
        $events: {
          complete() {
            _this.outCoinVisible = false;
            _this.saveGivingCoin(true);
          },
          closeDialog() {
            _this.outCoinVisible = false;
          },
          error() {
          },
        },
      });
    },
    beforeSaveGiving() {
      this.$api['leaguer/coin/outCoinBeforeSaveFillCoinLog']({
        OutCoins: this.itemInfo.CoinNumber,
        CoinType: 0,
        Summary: 0,
      }).then((res) => {
        this.orderID = res.LogID;
        this.outCoin(Number(this.itemInfo.CoinNumber) || 0);
      });
    },
    saveGivingComplete() {
      this.$api['leaguer/coin/completedFillCoinLog']({
        LogID: this.orderID,
        OutCoins: this.itemInfo.CoinNumber,
      });
    },
    saveGivingCoin(IsOutCoinStatus) {
      this.$api['activity-gift/givingCoin/saveGivingCoinLog']({
        SchemeID: this.schemeID,
        IsOutCoin: IsOutCoinStatus,
        LeaguerID: this.menberId,
        IDCard: this.idCard,
      }).then(() => {
        const text = '存入会员卡成功';
        if (!IsOutCoinStatus) {
          this.$message({
            type: 'success',
            message: text,
          });
        }
        this.$emit('update-data');
      }, () => {
      });
    },
    orderError() {
      this.$api['leaguer/coin/cancelFillCoinLog']({
        LogID: this.orderID,
        OutCoins: 0,
      });
    },
    clickItem(item, index) {
      this.schemeID = item.ID;
      this.itemInfo = item;
      this.isAcvtive = index;
      // this.orderID = item.ID;
    },
    getGiftList(data) {
      this.$api['activity-gift/givingCoin/getGivingCoinScheme'](data).then((res) => {
        this.giftInfoList = res.DataList;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
.gift-wrap {
  display: flex;
  flex: 2;
  >div {
    &:first-child {
      border-left: 1px solid $border-color;
      border-right: 1px solid $border-color;
    }
    &:last-child {
      flex: 1;
    }
  }
}
.acvtive {
  //stylelint-disable-next-line
  background-color: #EBF3FD;
}

.content {
  padding-left: 20px;
  width: 100%;
  /deep/ .el-button--primary {
    width: 300px;
    margin: 50px auto 0;
    display: block;
  }

  div {
    min-height: 40px;
    display: flex;
    align-items: center;
    font-size: $font-size-primary;
    span {
      &:first-child {
        min-width: 100px;
      }
    }
  }
}

.cell-link {
  cursor: pointer;
  padding: 0 10px 0 20px;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid $color-bg-table;
  &:hover {
    //stylelint-disable-next-line
    background-color: #EBF3FD;
  }

  span {
    display: inline-block;

    &:nth-child(1) {
      width: 90%;
      font-size: $font-size-primary;
    }
    &:nth-child(2) {
      text-align: right;
      width: 10%;
    }
  }
}

.box-card {
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  height: 100%;
  /deep/ .el-card__header {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    border-bottom: 0;
    background-color: $color-bg-table;
  }

  /deep/ .el-card__body {
    padding: 20px 0;
    height: calc(100% - 40px);
    box-sizing: border-box;

    .item {
      height: 30px;
      line-height: 30px;
    }
  }
}
.detail-item {
  /deep/ .el-card__body {
    padding: 20px 0 0;
    display: flex;
    justify-content: center;
  }
}
.cart-item {
  min-width: 260px;
  max-width: 280px;
  flex: 1;
}
</style>
