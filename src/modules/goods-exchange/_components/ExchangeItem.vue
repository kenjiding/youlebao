<template>
  <div class="item-wrap">
    <div class="top">
      <div class="top-p">
        <span >{{ itemData.name }}</span>
        <span>
          <i
            class="ych-icon-kuozhan"
            @click="$emit('change-item')"/>
          <i
            class="el-icon-close"
            @click="$emit('close-info')"/>
        </span>
      </div>
      <div class="top-value">
        <span>余额：
          <span :style="{color: itemData.textColor}">{{ overageMoney | number }}</span>
        </span>
        <el-button
          size="mini"
          type="info"
          class="query-more"
          @click="queryMoreClick">可兑换商品
          <i class="ych-icon-pull-right el-icon--right"/>
        </el-button>
      </div>
      <ych-read-card
        ref="readCardComponent"
        :auto-logout="false"
        @change="changeCard"
        @logout="clearData"/>
    </div>
    <div
      class="conten-show">
      <div class="content">
        <div
          class="content-item">
          <el-row class="row-header">
            <el-col :span="9">
              <el-popover
                v-model="popoverVisible"
                class="clearButton"
                placement="right">
                <p>确定清空？</p>
                <div style="text-align: right">
                  <el-button
                    size="mini"
                    type="text"
                    @click="popoverVisible = false">取消</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="clearAllItem">确定</el-button>
                </div>

              </el-popover>
              <i
                class="el-icon-close"
                @click="popoverVisible = true"/>
              名称</el-col>
            <el-col :span="5">库存</el-col>
            <el-col :span="5">数量</el-col>
            <el-col :span="5">小计</el-col>
          </el-row>

          <div
            :style="{
              height: (itemHeight - 375) + 'px',
              overflow: 'auto',
          }">
            <el-row
              v-for="(item, index) in acountItemList"
              :key="item.GoodsID"
              class="row-item">
              <el-col :span="9">
                <el-col
                  :span="6"
                  @click.native="deleteItem(index)">
                  <i class="el-icon-close"/>
                </el-col>
                <el-col :span="18">
                  <p>{{ item.GoodsName }}</p>
                  <p>({{ item.GoodsNO }})</p>
                </el-col>
              </el-col>
              <el-col :span="5">{{ item.Amount === -1 ? '--' : item.Amount }}</el-col>
              <el-col :span="5">
                <el-input-number
                  ref="exchangeInput"
                  :max="item.GoodsType !== 102 ? 9999 : 99"
                  :min="0"
                  :controls="false"
                  v-model="item.inputNum"
                  type="number"
                  @keyup.enter.native="moveMouse"
                  @input="changePrice(item.ExchangePrice, index)"/></el-col>
              <el-col :span="5">{{ item.acountPrice }}</el-col>
            </el-row>
          </div>

        </div>
        <el-select
          ref="selectSearch"
          v-model="inputVal"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          :disabled="selectDisabled"
          filterable
          remote
          placeholder="请输入商品名称/编号/兑价/条形码"
          @keyup.enter.native="inputWithEnter"
          @change="selectItem">
          <el-option
            v-for="item in tableData"
            :key="item.GoodsID"
            :label="item.GoodsName"
            :value="item.GoodsNO"/>
        </el-select>
      </div>

      <div class="bottom">
        <p>
          <span class="first-span">共{{ acountItemList.length }}项，合计：</span>
          <span>￥{{ allItem }}</span>
        </p>
        <p>
          <span class="first-span">
            <i class="ych-icon-info"/>立减：
          </span>
          <span>- ￥{{ diacountNum }}</span>
        </p>
        <div
          v-loading="!stopPay"
          :style="{backgroundColor: itemData.bgColor}"
          class="primary"
          @click="checkFormData">
          <div class="button-text1">
            <span>兑换：</span>
            <span>(兑换余额：{{ overageMoney - allCount }})</span>
          </div>
          <div
            class="button-text2"><span>{{ allCount }}</span></div>
        </div>
      </div>
    </div>
    <div class="wave-img">
      <img src="../../../assets/down-wave.png">
    </div>

    <exchange-goods-query
      ref="queryGoods"
      :visible.sync="goodsQueryVisible"
      :type-value="itemType[itemData.type]"
      :type-name="itemData.name"
      :leaguer-level="levelID"
      :max-value="Number(overageMoney)"
      class="query-more"
      @add="handleGoodsQueryAdd"
    />
  </div>
</template>

<script>
import ExchangeGoodsQuery from '../_components/ExchangeGoodsQuery.vue';

export default {
  name: 'ExchangeItem',

  components: {
    ExchangeGoodsQuery,
  },

  props: {
    itemData: {
      type: Object,
      default: () => {},
    },
    itemHeight: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      memberID: '',
      levelID: '',
      inputVal: '',
      tableData: [],
      inputNum: '',
      restaurants: [],
      selectLoading: false,
      popoverVisible: false,
      acountItemList: [],
      itemType: {
        Lottery: 403,
        Integral: 3,
        Token: 402,
        Gold: 401,
      },
      allCount: '',
      diacountNum: '',
      selectDisabled: true,
      overageMoney: '',
      cardData: {},
      stopPay: true,
      selectFirst: false,
      goodsQueryVisible: false,
    };
  },

  computed: {
    allItem() {
      return this.acountItemList.reduce(
        (total, item) => total + item.acountPrice,
        0,
      );
    },
  },

  methods: {
    inputWithEnter() {
      this.selectFirst = true;
    },
    moveMouse() {
      this.$nextTick(() => {
        this.$refs.selectSearch.$el.children[0].children[0].select();
      });
    },
    clearAllItem() {
      this.popoverVisible = false;

      this.acountItemList = [];
      this.diacountNum = '';
      this.allCount = '';
    },
    exchangeGoodsPrice() {
      // if (this.acountItemList.length < 1) return;
      const goodsIDs = this.acountItemList.map(item => ({
        GoodsID: item.GoodsID,
        Amount: Number(parseInt(item.inputNum, 10)),
      }));
      const formData = {
        LeaguerID: this.memberID,
        GoodsList: goodsIDs,
        ExchangeValueType: this.itemType[this.itemData.type],
      };
      this.$api['goods-exchange/exchange/checkExchangeGoods'](formData).then((res) => {
        this.diacountNum = res.TotalDiscount;
        this.allCount = res.TotalExchangePrice;
      });
    },
    checkFormData() {
      const inputEmpty = this.acountItemList.some(item => item.inputNum === '' || item.inputNum === '0');
      let errorMess = null;

      if (!this.memberID) {
        errorMess = '请读取会员卡';
      } else if (inputEmpty) {
        errorMess = '商品数量不能为空或者0';
      } else if (this.acountItemList.length < 1) {
        errorMess = '请选择兑换的商品';
      } else if (this.overageMoney - this.allCount < 0) {
        errorMess = '余额不足';
      }

      if (errorMess) {
        this.$message({
          message: errorMess,
          type: 'warning',
        });
        return;
      }

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
            LeaguerID: this.memberID,
            PassWord: encryptedPwd,
          }).then(() => {
            this.exchangeBefore();
          });
        });
      } else {
        this.exchangeBefore();
      }
    },

    exchangeBefore() {
      if (this.itemType[this.itemData.type] === 403 &&
        this.cardData.CardTypeCode === 'PublicCard') {
        this.$confirm('【公共卡】兑换后，将清空所有彩票余额。是否确定兑换?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              this.exchangeButton(done);
            } else {
              done();
            }
          },
        });
      } else {
        this.exchangeButton(false);
      }
    },
    exchangeButton(done) {
      if (!this.stopPay) return;
      this.stopPay = false;
      const goodsIDs = this.acountItemList.map(item => ({
        GoodsID: item.GoodsID,
        Amount: Number(parseInt(item.inputNum, 10)),
      }));
      this.$api['goods-exchange/exchange/exchangeGoods']({
        LeaguerID: this.memberID,
        ExchangeValueType: this.itemType[this.itemData.type],
        GoodsList: goodsIDs,
      }).then((res) => {
        this.$message({
          message: '兑换成功！',
          type: 'success',
        });
        this.$emit('print', res.ExchangeLogID);
        this.$emit('save-close');
        this.stopPay = true;
        done && done();
      }, () => {
        this.stopPay = true;
        done && done();
      });
    },
    changePrice(singlePrice, index) {
      // 控制输入不能为小数
      const cacheInput = this.acountItemList[index].inputNum;
      if (!/^\d+$/.test(cacheInput)) {
        this.acountItemList[index].inputNum = Number(cacheInput.toString().slice(0, cacheInput.toString().indexOf('.')));
      }
      // 计算小计
      this.acountItemList[index].acountPrice = singlePrice * this.acountItemList[index].inputNum;
      // 调用计算接口
      this.exchangeGoodsPrice();
    },
    deleteItem(index) {
      this.acountItemList.splice(index, 1);
      this.exchangeGoodsPrice();
    },
    selectItem(val) {
      const selectItem = this.tableData.find(item => item.GoodsNO === val);
      this.addAcountItem(selectItem);
    },

    addAcountItem(val) {
      const oneItem = Object.assign({
        inputNum: 1,
        acountPrice: 0,
      }, val);

      const goodsIndex = this.acountItemList.findIndex(item => item.GoodsNO === val.GoodsNO);

      this.inputVal = '';

      if (goodsIndex >= 0) {
        this.acountItemList[goodsIndex].inputNum++;
        this.$nextTick(() => {
          this.$refs.exchangeInput[goodsIndex]
            .$el.children[0].children[0].select();
        });
      } else {
        this.acountItemList.push(oneItem);
        this.$nextTick(() => {
          this.$refs.exchangeInput[this.acountItemList.length - 1]
            .$el.children[0].children[0].select();
        });
      }

      this.tableData = [];
    },

    remoteMethod(query) {
      if (query !== '') {
        this.selectLoading = true;
        this.getData(query);
      } else {
        this.tableData = [];
      }
    },
    getData(query) {
      this.$api['goods-exchange/exchange/getExchangeGoodsByExchangeType']({
        LgLevelID: this.levelID,
        ExchangeType: this.itemType[this.itemData.type],
        Value: query,
      })
        .then((res) => {
          this.tableData = res.DataList;
          this.selectLoading = false;
          if (this.selectFirst && this.tableData.length > 0) {
            this.handleSelectChange(this.tableData[0]);
            this.$refs.selectSearch.blur();
            setTimeout(() => { this.$refs.selectSearch.focus(); }, 200);
          }
        });
    },
    handleSelectChange(item) {
      this.addAcountItem(item);
      this.inputVal = '';
      this.tableData = [];
      this.selectFirst = false;
    },
    handleGoodsQueryAdd(item) {
      this.addAcountItem(item);
    },

    changeCard(data) {
      if (data) {
        this.cardData = data;
        this.levelID = data.LeaguerLevelID;
        this.memberID = data.ID;

        const itemData = data.LgValues
          .find(item => Number(item.ValueCode) === this.itemType[this.itemData.type]);

        this.overageMoney = itemData ? itemData.Remain : 0;

        this.$nextTick(() => {
          this.goodsQueryVisible && this.$refs.queryGoods.reLoad();
        });
      }
      if (this.memberID) {
        this.selectDisabled = false;
      }
      this.exchangeGoodsPrice();
    },

    clearData() {
      this.memberID = '';
      this.overageMoney = '';
      this.diacountNum = '';
      this.allCount = '';
      this.selectDisabled = !!this.memberID;
    },

    queryMoreClick() {
      this.goodsQueryVisible = !this.goodsQueryVisible;
      this.$nextTick(() => {
        this.goodsQueryVisible && this.$refs.queryGoods.reLoad();
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.clearButton {
  width: 0 !important;
  height: 0 !important;
}

.row-header {
  padding: 10px;
  background-color: $color-bg-table;

  /deep/ .el-col {
    text-align: center;
    font-size: $font-size-primary;
    color: $font-color-placeholder;

    &:first-of-type {
      text-align: left;
    }

    .el-icon-close {
      font-size: $font-size-primary;
      display: inline-block;
      margin-right: 10px;
    }
  }
}

.row-item {
  height: 60px;
  color: $font-color-placeholder;
  background-color: $color-white;
  border-bottom: 1px solid $border-color;

  &:hover {
    background-color: $color-tag;
  }

  /deep/ .el-input-number {
    width: 60px;
  }

  /deep/ .el-col-5 {
    line-height: 60px;

    input {
      background-color: $color-bg-primary;
      padding: 0;
      width: 60px;
      text-align: center;
    }
  }

  /deep/ .el-col {
    height: 100%;
    font-size: $font-size-primary;
    text-align: center;

    @include ellipsis(1);

    .el-col-6 {
      height: 100%;
      .el-icon-close {
        display: inline-block;
        line-height: 60px;
      }

      /* &:hover {
        color: $color-danger;
      } */
    }

    .el-col-18 {
      height: 100%;
      font-size: $font-size-primary;
      color: $font-color-placeholder;

      p {
        padding: 3px 0;
        text-align: left;
        font-size: $font-size-special;

        &:nth-child(1) {
          margin-top: 13px;
          // stylelint-disable-next-line
          font-size: 15px;
          color: $font-color-regular;
        }
      }
    }
  }
}

.primary {
  width: 320px;
  background-color: $color-primary;
  height: 60px;
  border-radius: $border-radius-small;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 10px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    opacity: .8;
  }

  .button-text1 {
    height: 100%;
    color: $color-white;
    float: left;
    box-sizing: border-box;
    width: 40%;
    text-align: center;
    padding: 7px 0 0 15px;

    span {
      display: block;
      height: 40%;
      line-height: 25px;
      text-align: left;
      font-size: $font-size-primary;

      &:nth-child(2) {
        font-size: $font-size-special;
        color: $color-bg-secondary;
      }
    }
  }

  .button-text2 {
    height: 100%;
    color: $color-white;
    float: left;
    line-height: 60px;
    box-sizing: border-box;
    width: 60%;
    font-size: $font-size-secondary;
    text-align: right;
    padding-right: 10px;
  }
}

.first-span {
  width: 40%;

  /deep/ .ych-icon-info {
    // stylelint-disable-next-line
    font-size: 16px;
    color: $font-color-currency;
  }
}

.bottom {
  background-color: $color-white;
  overflow: hidden;
  border-top: 1px dashed $border-color;

  p {
    padding: 10px 20px;
    color: $font-color-secondary;
    span {
      display: inline-block;
      text-align: right;

      &:last-child {
        width: 60%;
      }
    }
  }
}

.content {

  /deep/ .el-input--suffix {
    input {
      height: 40px !important;
    }
  }

  &-item {
    /* min-height: 340px; */
    background-color: $color-white;
  }

  /deep/ .has-gutter {
    th {
      text-align: center;

      &:nth-child(1) {
        text-align: left;
      }
    }
  }

  /deep/ .el-table{
    background-color: $color-bg-table;

    .el-table__body-wrapper {
      background-color: $color-white;
    }
  }

  /deep/ .el-select {
    width: 100%;
    background-color: $color-white;

    .el-input {
      padding: 10px;
      box-sizing: border-box;

      input {
        background-color: $color-bg-primary;
      }
    }

    /deep/ .el-button {
      width: 70px;
      color: $color-white;
      padding: 12px 5px;
    }
  }


  /deep/ .is-leaf {
    background-color: $color-bg-table;
  }

  /deep/ .el-table__row {
    td {
      padding: 5px 0;

      &:nth-child(1) {
        padding: 5px 0 5px 5px;
      }
      .cell {
        padding: 0;
        text-align: center;

        .el-input {
          padding: 0;

          input {
            padding: 0;
            text-align: center;
          }
        }
      }
    }

    .cell {
      color: $font-color-secondary;
      .el-icon-close {
        display: inline-block;
        float: left;
        margin: 13px 5px 0 0;
        font-size: $font-size-regular;
      }

      .table-cell {
        float: left;
        text-align: left;
      }
    }
  }
}

.item-wrap {
  width: 340px;
  border-radius: $border-radius;
  /* height: 96%; */
  // background-color: $color-bg-table;
  // border: 1px solid $border-color;
  float: left;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;

  i {
    &:hover {
      cursor: pointer;
    }
  }

  .top {
    width: 100%;
    background-color: $color-bg-table;
    padding: 10px 10px 0;
    box-sizing: border-box;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    $two-px: 2px;

    /deep/ .ych-read-card {
      margin-top: 10px;
    }

    &-p{
      font-size: $font-size-primary + $two-px;
      overflow: hidden;
      margin-bottom: 6px;

      span {
        display: inline-block;
        color: $font-color-regular;
      }

      .el-icon-close {
        font-size: $font-size-regular;
        color: $font-color-placeholder;
      }

      .ych-icon-kuozhan {
        font-size: $font-size-primary;
        display: inline-block;
        margin-right: 10px;
        color: $font-color-secondary;
      }
    }

    >div {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
    }

    .query-more {
      width: 120px;
      background-color: $border-color;
      font-size: $font-size-primary;
      color: $font-color-primary;

      .ych-icon-pull-right {
        position: relative;
        right: -8px;
        font-size: $font-size-special;
        color: $font-color-placeholder;
      }
    }
  }

  .wave-img {
    font-size: 0;
    img {
      width: 340px;
      height: 10px;
    }
  }
}
</style>
