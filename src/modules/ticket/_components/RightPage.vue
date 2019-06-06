<template>
  <div
    class="wrap">
    <div class="wrap-page">
      <el-row class="row-one">
        <el-col :span="elColSpan">
          <div class="grid-content bg-purple">{{ ticketType }}</div>
        </el-col>

        <div v-show="ticketItemShow">
          <el-col :span="ticketTypeSpan()">
            <div class="grid-content bg-purple">总次数</div>
          </el-col>
          <el-col :span="ticketTypeSpan()">
            <div class="grid-content bg-purple-light">剩余次数</div>
          </el-col>
        </div>
        <el-col
          v-show="!ticketItemShow"
          :span="elColSpan">

          <div class="grid-content bg-purple-light">有效期</div>
        </el-col>

        <el-col :span="ticketTypeSpan()">
          <div class="grid-content bg-purple">陪同票</div>
        </el-col>
        <el-col :span="ticketTypeSpan()">
          <div class="grid-content bg-purple-light">可离场时间</div>
        </el-col>
      </el-row>
      <el-row class="tick-num">
        <el-col :span="elColSpan">
          <div
            :style="{color: '#000'}"
            class="grid-content bg-purple">{{ formatter(packageData.Status) }}</div>
        </el-col>
        <div v-show="ticketItemShow">
          <el-col :span="ticketTypeSpan()">
            <div class="grid-content bg-purple">{{ packageData.RemainCount }}</div>
          </el-col>
          <el-col :span="ticketTypeSpan()">
            <div class="grid-content bg-purple-light">{{ packageData.Remain }}</div>
          </el-col>
        </div>
        <el-col
          v-show="!ticketItemShow"
          :span="elColSpan">
          <el-tooltip
            :content="packageData.OverdueDate"
            class="item"
            effect="dark"
            placement="top-start">
            <div class="grid-content bg-purple">
              {{ packageData.OverdueDate }}
            </div>
          </el-tooltip>

        </el-col>
        <el-col :span="ticketTypeSpan()">
          <div class="grid-content bg-purple">{{ peiTongTicket }}</div>
        </el-col>
        <el-col :span="ticketTypeSpan()">
          <div class="grid-content bg-purple-light">
            {{ packageData.PermissionLeaveTimeSpan }}分钟
          </div>
        </el-col>
      </el-row>

      <div class="tick-card-right">
        <div>
          <p><span>套票名称：</span>{{ packageData.PackageTicketName }}</p>
          <p><span>订单号：</span>{{ packageData.OrderNum }}</p>
          <p><span>购买时间：</span>{{ packageData.LogTime }}</p>


          <p><span>购买渠道：</span>{{ packageData.ChannelName }}</p>
          <p>
            <span>有效期：</span>
            <span class="timeStyle">
              {{ packageData.EffectiveStartTime + ' 至' }}
            </span>
          </p>
          <p style="padding-left: 75px;">{{ packageData.OverdueTime }}</p>
        </div>

        <div class="content-avator">
          <div class="avator-left">
            <img
              v-if="packageData.LeaguerPhoto"
              :src="'data:image/png;base64,'+ packageData.LeaguerPhoto">
            <img
              v-if="!packageData.LeaguerPhoto"
              src="../../../assets/member-photo.png">
          </div>

          <p class="member-style">
            {{ packageData.LeaguerLevelName }}
          </p>

          <div class="avator-right">
            <p>{{ packageData.LeaguerName || packageData.LeaguerCode }}</p>
            <p><i class="ych-icon-dianhua"/>{{ packageData.Phone }}</p>
            <p><i class="ych-icon-member-card"/>{{ packageData.LeaguerCode }}</p>
          </div>
          <div/>
        </div>
      </div>

      <div class="content">
        <el-tabs
          v-model="activeName"
          @tab-click="getTicketRemain">
          <el-tab-pane
            label="使用记录"
            name="log">
            <el-table
              :data="usedTableData"
              :height="contentHeight - 320"
              border
              highlight-current-row
              style="width: 100%">
              <el-table-column
                show-overflow-tooltip
                prop="MachineName"
                label="游乐项目"/>
              <el-table-column
                show-overflow-tooltip
                prop="LogTime"
                label="使用时间"/>
            </el-table>
            <el-pagination
              :total="listTotal"
              :current-page.sync="logPageIndex"
              :page-size="10"
              small
              background
              layout=" prev, pager, next"
              @current-change="getTicketRemain"/>
          </el-tab-pane>

          <el-tab-pane
            label="可玩项目"
            name="game">
            <div
              v-show="witchInfoShow === 'TicketValue'">
              <el-table
                :data="gameItemData.DataList"
                :height="contentHeight - 320"
                border
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  show-overflow-tooltip
                  prop="MachineName"
                  label="游乐项目"/>
                <el-table-column
                  show-overflow-tooltip
                  prop="AllTimes"
                  label="全部次数"/>
                <el-table-column
                  show-overflow-tooltip
                  prop="RemainTimes"
                  label="剩余次数"/>
              </el-table>
              <el-pagination
                :total="listTotal"
                :current-page.sync="gamePageIndex"
                :page-size="10"
                small
                background
                layout=" prev, pager, next"
                @current-change="getTicketRemain"/>
            </div>

            <div
              v-show="witchInfoShow === 'TicketValue2'"
              :style="{height: (contentHeight - 290) +'px'}"
              class="pText">
              <p>
                <span>可玩项目：</span>{{ gameInfoText.ticktValue }}
              </p>
              <p><span>共享次数：</span>{{ gameItemData.TotalShareCount }}</p>
              <p><span>使用次数：</span>{{ gameItemData.ShareUsedCount }}</p>
              <p><span>剩余次数：</span>{{ gameItemData.RemainShareCount }}</p>
            </div>
            <div
              v-show="witchInfoShow === 'notTicketValue'"
              :style="{height: (contentHeight - 310) +'px'}"
              class="gameText">
              <p><span>可玩项目：</span>{{ gameInfoText.TicketTime }}</p>
              <p><span>计时收费：</span>{{ gameItemData.TimeDetail }}</p>

            </div>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>
    <div class="content-bottom">
      <el-button
        v-show="peiTongTicket !== 0"
        type="primary"
        @click="printPeiTongHandle">打印陪同票</el-button>
      <el-button
        v-show="buttonStatus"
        type="primary"
        @click="printTicket">打印套票</el-button>
      <el-button
        v-show="buttonStatus"
        type="primary"
        @click="bindTicket">绑定票码</el-button>
    </div>
    <p
      class="close-arrow"
      @click="showRightPage">
      <i class="el-icon-arrow-right"/>
    </p>
    <out-ticket
      ref="outTicket"
      :default-tab="outTicketType"
      :visible.sync="outTicketVisible"
      :ticket-list="ticketList"
      @closed="handleOutTicketClosed"/>
  </div>
</template>

<script>
import OutTicket from '../../sell/_components/OutTicket.vue';

export default {
  name: '',

  components: {
    OutTicket,
  },

  props: {
    rowId: {
      type: String,
      default: '',
    },
    rowInfo: {
      type: Object,
      default: () => ({}),
    },
    contentHeight: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      activeName: 'log',
      closeArrow: true,
      tableData: [],
      packageData: {
        ChargeMode: '',
        Status: '',
      },
      gamePageIndex: 1,
      logPageIndex: 1,
      listTotal: null,
      gameItemData: {
        DataList: [],
      },
      usedTableData: [],
      xmlTemplate: '',
      ticketList: [],
      outTicketVisible: false,
      outTicketType: 'print',
      printIndex: 0,
      printMax: 0,
    };
  },

  computed: {
    peiTongTicket() {
      return this.packageData.NumOfAccompany - this.packageData.PrintedNumberOfAccompany;
    },
    buttonStatus() {
      return ['UnUsed', 'InUse'].indexOf(this.packageData.Status) > -1;
    },
    ticketItemShow() {
      return this.packageData.ChargeMode === 'TicketValue';
    },
    witchInfoShow() {
      if (this.gameItemData.TimeDetail === '') {
        if (this.gameItemData.TotalShareCount === 0) {
          return 'TicketValue';
        }
        return 'TicketValue2';
      }
      return 'notTicketValue';
    },
    gameInfoText() {
      let name = '';
      const dataLength = this.gameItemData.DataList.length;
      this.gameItemData.DataList.forEach((item, index) => {
        if (index >= dataLength - 1) {
          name += (`${item.MachineName}`);
        } else {
          name += (`${item.MachineName}，`);
        }
      });
      return {
        ticktValue: name,
        TicketTime: name,
      };
    },
    ticketType() {
      const ticketObj = {
        TicketValue: '计次票',
        TicketTime: '计时票',
        TicketTerm: '期限票',
      };

      return ticketObj[this.packageData.ChargeMode];
    },
    elColSpan() {
      const ticketObj = {
        TicketValue: 4,
        TicketTime: 6,
        TicketTerm: 6,
      };
      return this.packageData.ChargeMode ? ticketObj[this.packageData.ChargeMode] : 6;
    },
  },

  created() {
    this.getTicketRemain();
  },

  methods: {
    onLoad() {
      if (!this.rowId) return;
      console.log('right page onload');
      this.getData();
      this.getTicketRemain();
    },
    printPeiTongHandle() {
      this.$prompt('', '请输入打印张数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: 1,
        inputPattern: /^([1-9]{1}[0-9]{0,8})$/,
        inputErrorMessage: '退款金额必须为大于0且8位内的整数',
      }).then(({ value }) => {
        if (value > this.peiTongTicket) {
          this.$message({
            message: `最多可打印的${this.peiTongTicket}张陪同票`,
            type: 'warning',
          });
          return;
        }
        this.printMax = Number(value);
        if (this.printIndex < value) {
          this.printPeiTong();
        } else {
          this.printIndex = 0;
        }
      }).catch(() => {
      });
    },

    printPeiTongLoop() {
      if (this.printIndex < this.printMax) {
        this.printPeiTong();
      } else {
        this.printIndex = 0;
      }
    },

    printPeiTong() {
      this.xmlTemplate = '';

      this.$api['ticket/ticket/getTickerPrint']({
        PackageTicketLogID: this.rowId,
        IsPeiTong: true,
      }).then((res) => {
        const _this = this;
        this.xmlTemplate = res.PrintTemplate;
        this.$createPrintWebView({
          $props: {
            printType: 'receiptsPrint',
            XmlData: 'xmlTemplate',
          },
          onComplete() {
            console.log('打印完成');
            _this.printIndex++;
            _this.$api['ticket/ticket/printPTforSuccessed']({
              SaleLogId: _this.packageData.SaleLogID,
            }).then(() => {
              _this.printPeiTongLoop();
            });
          },
        });
      });
    },
    bindTicket() {
      const DataList = [{
        SellLogInfoList: [{
          SellLogID: this.packageData.SaleLogID,
          MainPrint: '',
          AccompanyPrint: '',
          MaxNumber: 1,
          Status: this.packageData.Status,
          BindTicketCode: this.packageData.TicketId,
        }],
        GoodsName: this.packageData.PackageTicketName,
        Number: 1,
        GoodsType: 102,
      }];

      this.ticketList = DataList;
      this.outTicketType = 'bind';
      this.outTicketVisible = true;
    },
    formatter(row) {
      const status = {
        UnUsed: '未使用',
        InUse: '使用中',
        Complete: '已完成',
        Returned: '已退货',
        Overdue: '已过期',
        Cancel: '会员已注销',
      };
      return status[row];
    },
    ticketTypeSpan() {
      return this.ticketItemShow ? (this.elColSpan + 1) : this.elColSpan;
    },
    printTicket() {
      const DataList = [{
        SellLogInfoList: [{
          SellLogID: this.packageData.SaleLogID,
          MainPrint: '',
          AccompanyPrint: '',
          MaxNumber: this.peiTongTicket,
          Status: this.packageData.Status,
          BindTicketCode: this.packageData.TicketId,
          // RemainAccompany: this.peiTongTicket,
        }],
        GoodsName: this.packageData.PackageTicketName,
        Number: 1,
        GoodsType: 102,
      }];

      this.ticketList = DataList;
      this.outTicketType = 'print';
      this.outTicketVisible = true;
    },
    handleOutTicketClosed() {},
    getTicketRemain() {
      const Data = {
        SaleLogID: this.rowId,
        PageInfo: {
          PageIndex: null,
          PageSize: 10,
        },
      };
      if (this.activeName === 'log') {
        this.getLogData(Data);
      } else {
        this.getGameItemData(Data);
      }
    },
    getGameItemData(Data) {
      Data.PageInfo.PageIndex = this.gamePageIndex;
      this.$api['ticket/ticket/getTicketRemain'](Data).then((res) => {
        this.gameItemData = res;
        this.listTotal = res.Total;
      });
    },
    getLogData(Data) {
      Data.PageInfo.PageIndex = this.logPageIndex;
      this.$api['ticket/ticket/getTicketPlayLog'](Data).then((res) => {
        this.usedTableData = res.DataList;
        this.listTotal = res.Total;
      });
    },
    getData() {
      this.$api['ticket/ticket/getTicketSaleLogDetail']({ SaleLogID: this.rowId })
        .then((res) => {
          this.packageData = res;
          this.printIndex = 0;
        });
    },
    showRightPage() {
      this.closeArrow = !this.closeArrow;
      this.$emit('close-arrow', this.closeArrow);
    },
  },
};
</script>

<style lang='scss' scoped>
// stylelint-disable
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.timeStyle {
  display: inline-block !important;
  width: 70% !important;
  color: $font-color-regular !important;
  text-align: left !important;
}

.gameText {
  padding: 10px 0 10px 30px;
  font-size: $font-size-primary;
  line-height: 20px;

  span {
    color: $font-color-secondary;
  }
}

.pText {
  overflow: auto;
  background-color: $color-white;
  border-top: 1px solid $border-color;
  font-size: $font-size-primary;
  line-height: 20px;

  span {
    color: $font-color-secondary;
  }

  p {
    padding: 10px 0 10px 30px;
    color: $font-color-regular;

    &:nth-child(1) {
      padding-top: 20px;
    }
  }
}

.wrap-page {
  overflow: auto;
}

.close-arrow {
  display: flex;
  width: 35px;
  height: 35px;
  border-radius: $border-radius-circle;
  position: absolute;
  left: -20px;
  top: 48%;
  font-size: $font-size-regular;
  background-color: $color-white;
  border: 1px solid $border-color;
  justify-content: center;
  align-items: center;
  color: $font-color-secondary;
  z-index: 2000;
}

.content-bottom {
  height: 45px;
  padding: 0 5px;
  margin-top: 10px;
  text-align: right;

  /deep/ .el-button {
    width: 170px;
    height: 35px;
  }
}

.avator-right {
  line-height: 22px;
  text-align: left;
  padding-left: 20px;
  margin-top: -5px;
  box-sizing: border-box;
  color: $font-color-regular;
  font-size: 14px;
  width: 100%;

  p {
    color: $font-color-primary;
    &:nth-child(1) {
      text-align: center;
      font-size: 18px;
      color: $font-color-regular;
      padding-right: 18px;
    }
  }

  i {
    font-size: 14px;
    color: $font-color-placeholder;
    display: inline-block;
    margin-right: 5px;
  }
}

.avator-left {
  margin: 0 auto;
  float: none !important;
  width: 100px !important;
  height: 100px;
  border-radius: $border-radius-circle;
  background-color: $font-color-placeholder;
  position: relative;

  img {
    width: 92px;
    height: 92px;
    margin: 0 auto;
    display: block;
    border-radius: 50%;
    position: relative;
    top: 5px;
  }
}


.member-style {
  width: 100px;
  height: 20px;
  border-radius: $border-radius;
  margin: 0 auto;
  background-color: $color-regular;
  text-align: center;
  line-height: 20px;
  color: $color-white;
  position: relative;
  top: -10px;
  font-size: $font-size-special;
}

.content-avator {
  width: 200px;
  height: 200px;
  box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, .2);
  text-align: center;
  border-radius: $border-radius;
  padding-top: 10px;
  box-sizing: border-box;
}

.content {
  /* height: 400px; */

  /deep/ .el-tabs__content {
    /* height: 85%; */
    background-color: $color-bg-secondary;

    .el-pagination {
      text-align: right;
      padding: 4px 20px 3px;
      background-color: $color-white;
      border-bottom: 1px solid $border-color;
    }

    .el-tab-pane {
      background-color: $color-bg-secondary;

      .has-gutter {
        th {
          box-sizing: border-box;
          padding-left: 20px;
        }
      }

      .el-table__row {
        .el-tooltip {
          box-sizing: border-box;
          padding-left: 30px;
        }
      }

      .el-table__body-wrapper {
        height: 100%;
        overflow-y: auto;
      }

      /* .el-table {
        height: 146px;
        overflow: auto;
      } */

    }
  }

  /deep/ .el-tabs__header {
    margin: 0;

    .el-tabs__nav-wrap::after {
      content: none;
    }

    .el-tabs__nav {
      margin-left: 30px;
    }
  }
}

.tick-card-right {
  width: 100%;
  padding: 15px 0 10px 20px;
  box-sizing: border-box;
  line-height: 33px;
  font-size: $font-size-primary;
  color: $font-color-regular;
  border-top: 1px solid $color-bg-table;
  @include ellipsis(1);

  div {
    float: left;
    overflow: hidden;

    &:first-child {
      width: 62%;
    }
  }

  span {
    text-align: right;
    display: inline-block;
    width: 75px;
    font-size: $font-size-primary;
    color: $font-color-placeholder;
  }
}

.tick-num {
  padding: 5px 0 10px;
  /deep/ .grid-content {
    font-size: $font-size-regular;
    color: $color-warning;

    @include ellipsis(1);
  }
}

.wrap {
  width: 600px !important;
  padding: 15px 0 0;
  box-shadow: 0 4px 18px 0 rgba($color-black, .2);
  border: 1px solid $color-bg-table;
  background-color: $color-white;
  box-sizing: border-box;
  height: 100%;

  .el-col {
    text-align: center;
    color: $font-color-placeholder;
    font-size: $font-size-special;
    /* padding: 0 5px 10px 5px; */
  }
}

.row-one {
  padding: 5px 0;
}
</style>
