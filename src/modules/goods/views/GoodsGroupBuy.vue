<template>
  <ych-page>
    <div class="wrap">
      <div
        ref="topHeight"
        class="search-top">
        <el-radio-group
          v-model="channelValue"
          class="channel-select"
          size="medium">
          <el-radio-button
            v-for="item in ChannelList"
            :key="item.Value"
            :label="item.Value">
            {{ item.Text }}
          </el-radio-button>
        </el-radio-group>
        <el-input
          v-model="gruopID"
          :style="{
            width: `calc(100% - 50px - ${(ChannelList.length) * 120}px)`
          }"
          placeholder="请输入团购验证码"
          class="code-inp"
          @keyup.native.enter="checkID">
          <template slot="append">
            <el-button
              type="primary"
              @click="checkID">验证</el-button>
          </template>
        </el-input>
      </div>
      <Search-item
        ref="searchItem"
        :channel-list="ChannelList"
        @search-data="searchDataHandle"/>
      <el-table
        :data="ChannelOrderList"
        :height="tableHeight"
        highlight-current-row
        border
        class="table-wrap">
        <el-table-column
          prop="OrderNum"
          label="订单号"
          header-align="center"
          align="center"
          show-overflow-tooltip
          min-width="200"/>
        <el-table-column
          prop="ThirdOrderNum"
          label="第三方订单号"
          header-align="center"
          align="center"
          show-overflow-tooltip
          min-width="200"/>
        <el-table-column
          prop="Code"
          show-overflow-tooltip
          width="150"
          header-align="center"
          align="center"
          label="验证码"/>
        <el-table-column
          prop="ChannelName"
          show-overflow-tooltip
          label="渠道"
          header-align="center"
          align="center"
          width="100"/>
        <el-table-column
          prop="ChannelGoodsName"
          label="渠道商品名称"
          header-align="center"
          align="center"
          width="140"
          show-overflow-tooltip/>
        <el-table-column
          prop="GoodsName"
          header-align="center"
          align="center"
          min-width="140"
          label="商品名称"
          show-overflow-tooltip/>
        <el-table-column
          prop="GoodsTypeName"
          show-overflow-tooltip
          label="商品类型"
          header-align="center"
          align="center"
          width="150"/>
        <el-table-column
          prop="Amount"
          label="数量"
          show-overflow-tooltip
          align="right"
          width="80"/>
        <el-table-column
          prop="Price"
          label="金额"
          show-overflow-tooltip
          align="right"
          width="80"/>
        <el-table-column
          prop="BuyerInfo"
          label="购买人信息"
          header-align="center"
          align="center"
          show-overflow-tooltip
          min-width="160"/>
        <el-table-column
          prop="UsedTime"
          header-align="center"
          align="center"
          label="核销时间"
          show-overflow-tooltip
          width="160"/>
        <el-table-column
          prop="Operator"
          show-overflow-tooltip
          label="操作员工"
          header-align="center"
          align="center"
          width="100"/>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="!scope.row.CanPrint"
              type="text"
              size="small"
              @click="handleClick(scope.row)">绑定/打印</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          :total="listTotal"
          :current-page.sync="pageIndex"
          :page-size="20"
          background
          layout=" total,jumper,prev, pager, next"
          @current-change="currentChange"/>
      </div>
    </div>

    <el-dialog
      :visible.sync ="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="团购核销"
      width="800px"
      @close="readCardShow = true">
      <div class="table-wrap">
        <ych-read-card
          v-show="readCardShow"
          ref="readCardComponent"
          @change="handleReadLeaguer"
          @logout="handleLeaguerLogout"/>
        <DialogTable
          :select-show="selectShow"
          :table-data="DialogTableData"/>
      </div>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="clearData">取 消</el-button>
        <el-button
          :loading="sellLoading"
          type="primary"
          @click="beforeCheckGroup">核 销</el-button>
      </span>
    </el-dialog>

    <memberInfo
      ref="fillInformation"
      :visible="visible"
      :meal-goods="currentGoods"
      :need-register="isNeed"
      @close="memberInfoClose"
      @comfirm="comfirmMemberInfo"/>

    <fill-extend-info
      ref="fillExtendInfo"
      :visible="fillExtendVisible"
      @close="fillExtendClose"
      @submit="handleGetExtendInfo"/>

    <out-ticket
      ref="outTicket"
      :default-tab="outTicketType"
      :leaguer="currentLeaguer"
      :visible.sync="outTicketVisible"
      :ticket-list="ticketList"
      need-tips
      @closed="handleOutTicketClosed"/>
  </ych-page>

</template>

<script>
import { mapState, mapGetters } from 'vuex';
import checkCoinMachineLink from '@/utils/checkCoinMachineLink';
import OutTicket from '@/modules/sell/_components/OutTicket.vue';
import FillExtendInfo from '@/modules/sell/_components/FillExtendInfo.vue';
import SearchItem from '../_components/SearchItem.vue';
import SearchTable from '../_components/SearchTable.vue';
import DialogTable from '../_components/DialogTable.vue';
import memberInfo from '../_components/FillMemberInfo.vue';


export default {
  name: 'GoodsGroupBuy',

  components: {
    SearchItem,
    SearchTable,
    DialogTable,
    memberInfo,
    FillExtendInfo,
    OutTicket,
  },

  data() {
    return {
      visible: false,
      outTicketVisible: false,
      outTicketType: 'print',
      sellLoading: false,
      currentGoods: {
        GoodsID: '',
      },
      errorGoodsId: '',
      dialogVisible: false,
      memberID: '',
      currentLeaguer: {},
      gruopID: '',
      DialogTableData: [],
      searchData: {
        ChannelID: '',
        GoodsType: '',
        StartDate: '',
        EndDate: '',
        Keyword: '',
        PageInfo: {},
      },
      ChannelList: [],
      ChannelOrderList: [],
      selectShow: false,
      channelValue: '',
      listTotal: null,
      pageIndex: 1,
      searchObj: {},
      isJoin: false,
      isNeed: false,
      fillExtendVisible: false,
      OrderItemExtended: '',
      OutCoinVisible: false,
      tableHeight: 0,
      goodsInCompleteOrder: [],
      isNeedOutCoin: true,
      readCardShow: true,
      ticketList: [],
    };
  },

  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
      machineIsLink: state => state.machine.machineIsLink,
    }),
    outCoinAmount() {
      const coin = this.goodsInCompleteOrder.filter(item => item.GoodsType === 101);
      if (coin.length > 0) {
        return coin[0].Number;
      }
      return 0;
    },
    ...mapGetters({
      hasTicketRegister: 'gobalConfig/hasTicketRegister',
    }),
  },
  watch: {
    pageHeight(val) {
      this.tableHeight =
        val - this.$refs.searchItem.$el.clientHeight - this.$refs.topHeight.clientHeight - 60;
    },
    pageWidth() {
      this.tableHeight =
        this.pageHeight - this.$refs.searchItem.$el.clientHeight - this.$refs.topHeight.clientHeight
        - 60;
    },
  },
  created() {
    this.getdropDownData();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight =
        this.pageHeight - this.$refs.searchItem.$el.clientHeight - this.$refs.topHeight.clientHeight
         - 60;
    });
  },
  methods: {
    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.memberID = leaguer.ID;
        this.currentLeaguer = leaguer;
      }
    },
    handleLeaguerLogout() {
      this.memberID = '';
      this.currentLeaguer = {};
    },
    handleClick(val) {
      this.isNeedOutCoin = false;
      this.printHandle(val.OrderID);
    },
    fillExtendClose() {
      this.fillExtendVisible = false;
    },
    memberInfoClose() {
      this.visible = false;
    },
    comfirmMemberInfo(val) {
      this.visible = false;
      this.OrderItemExtended = val;

      this.postWriteOff();
    },
    handleGetExtendInfo(val) {
      this.fillExtendVisible = false;
      this.OrderItemExtended = val;

      this.postWriteOff();
    },
    currentChange(val) {
      this.pageIndex = val;
      this.getData();
    },
    getData() {
      this.searchData.PageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };
      this.searchData.StartDate = this.$date().format('YYYY-MM-DD');
      this.searchData.EndDate = this.searchData.StartDate;
      const data = Object.assign({}, this.searchData, this.searchObj);
      this.$api['goods/groupBuy/getChannelOrder'](data).then((res) => {
        this.ChannelOrderList = res.DataList;
        this.listTotal = res.Total;
      });
    },
    getdropDownData() {
      this.$api['goods/groupBuy/getChannelDropDown']().then((res) => {
        this.ChannelList = res.DataList;
      });
    },
    searchDataHandle(obj) {
      this.pageIndex = 1;
      this.searchObj = obj;
      this.getData();
    },
    clearData() {
      this.dialogVisible = false;
      if (this.memberID) this.$refs.readCardComponent.logout();
      this.DialogTableData = [];
    },
    handleOutTicketClosed() {
      if (this.outCoinAmount) {
        this.isNeedOutCoin && this.outCoinMethods();
      }
    },
    outCoinMethods() {
      const _this = this;
      this.OutCoinVisible = true;
      this.$createOutCoin({
        $props: {
          animationVisible: 'OutCoinVisible',
          outCoin: 'outCoinAmount',
        },
        $events: {
          complete() {
            _this.dialogVisible = false;
          },
          closeDialog() {
            _this.OutCoinVisible = false;
          },
          error() {
            _this.outCoinErrLog();
          },
        },
      });
    },
    outCoinErrLog() {
      this.$api['physicalCoin/orderOutCoinError']({
        OrderID: this.errorGoodsId,
      });
    },

    beforeCheckGroup() {
      let hasPhysicalCoin = false;
      this.DialogTableData.forEach((item) => {
        item.ChildGoodsList.forEach((secondItem) => {
          if (secondItem.CoinType === 'PhysicalCoin') {
            hasPhysicalCoin = true;
          } else if (secondItem.CoinType === 'AutoCoin') {
            if (!this.memberID) {
              hasPhysicalCoin = true;
            }
          }
        });
      });

      if (hasPhysicalCoin) {
        this.sellLoading = true;
        checkCoinMachineLink().then(() => {
          this.sellLoading = false;

          this.checkGroupInfo();
        }, () => {
          this.$alert(
            '<p>无法售卖实物币，售币机未连接。</p><p>请尝试以下方法解决：</p><p>1.检查连接线是否正常</p><p>2.重启售币机</p>',
            '提示', {
              dangerouslyUseHTMLString: true,
              type: 'error',
            },
          );
          this.sellLoading = false;
        });
      } else {
        this.checkGroupInfo();
      }
    },
    checkGroupInfo() {
      this.isJoin = false;
      this.isNeed = false;
      this.OrderItemExtended = '';
      this.currentGoods.GoodsID = '';
      let type;
      for (const item of this.DialogTableData) {
        type = item.GoodsInfo.GoodsType;
        switch (type) {
          case 1:
            this.isJoin = true;
            // 遍历ChildGoodsList，判断商品类型
            this.joinMember(item);
            break;

          case 2:
            // 如果没有会员
            if (!this.checkMember()) return;
            break;

          case 6:
            // 遍历ChildGoodsList，判断商品类型
            if (!this.cycleCheckList(item)) return;
            break;

          case 101:
            if (item.GoodsInfo.CoinType === 'PhysicalCoin') {
              if (!this.machineIsLink) {
                this.$message({
                  message: '售币机未连接',
                  type: 'warning',
                });
                return;
              }
              // 出实物币 并且拼接 "OrderItemExtended": {"CoinType": “1" }
              this.addStringCointype();
            } else if (item.GoodsInfo.CoinType === 'VirtualCoin') {
              // if 会员为空 alert '读会员卡' return ;
              if (!this.checkMember()) return;
            } else if (item.GoodsInfo.CoinType === 'AutoCoin') {
              // if 会员为空 ,拼接 "OrderItemExtended": {"CoinType": “1" }, 先核销再，出实物币

              if (!this.memberID) {
                this.addStringCointype();
              }
              // 在核销成功后，在成功的回调里，判断会员是否为空，然后调用出实物币的操作
            }
            break;

          case 102:
            if (item.GoodsInfo.IsNeedRegister) this.isNeed = true;
            break;

          default:
            break;
        }
      }

      // 遍历结束
      if (this.isJoin) {
        this.visible = true;
        this.currentGoods = this.DialogTableData[0].GoodsInfo;
      } else if (this.isNeed) {
        if (this.hasTicketRegister) {
          this.fillExtendVisible = true;
        }
      } else {
        this.postWriteOff();
      }
    },

    addStringCointype() {
      this.OrderItemExtended = {
        CoinType: '1',
      };
      this.OrderItemExtended = JSON.stringify(this.OrderItemExtended);
    },

    checkMember() {
      if (!this.memberID) {
        this.$message({
          message: '请读取会员',
          type: 'warning',
        });
        return false;
      }
      return true;
    },

    joinMember(list) {
      for (const item of list.ChildGoodsList) {
        if (item.GoodsType === 102) {
          if (item.IsNeedRegister) this.isNeed = true;
        }
      }
    },

    cycleCheckList(list) {
      let AutoCoinNum = 0;
      let VirtualCoinType = false;
      for (const item of list.ChildGoodsList) {
        switch (item.GoodsType) {
          case 2:
            // 如果没有会员
            if (!this.checkMember()) return false;
            break;
          case 101:
            if (item.CoinType === 'AutoCoin') {
              AutoCoinNum++;
              // 如果没有会员
              if (!this.memberID) {
                if (AutoCoinNum <= 1 && !VirtualCoinType) {
                  this.addStringCointype();
                }
              }
            } else if (item.CoinType === 'VirtualCoin') {
              VirtualCoinType = true;
              this.OrderItemExtended = '';
              if (!this.checkMember()) {
                return false;
              }
            }
            break;
          case 102:
            if (item.IsNeedRegister) this.isNeed = true;
            break;

          default:
            break;
        }
      }
      return true;
    },

    postWriteOff() {
      this.sellLoading = true;

      this.$api['goods/groupBuy/writeOff']({
        ChannelID: this.channelValue,
        Code: this.gruopID,
        LeaguerID: this.memberID,
        OrderItemExtended: this.OrderItemExtended,
        GoodsID: this.currentGoods.GoodsID,
      }).then((res) => {
        this.sellLoading = false;
        this.isNeedOutCoin = true;
        this.errorGoodsId = res.OrderID;
        this.clearData();
        this.writeOffPrintHandle(res.OrderID);

        this.$message({
          message: '核销成功',
          type: 'success',
        });
      }, () => {
        this.sellLoading = false;
      });
    },

    printHandle(itemOrderID) {
      this.$api['goods/goodsType/getTicketSaleLogByOrderByGruopBuy']({
        OrderID: itemOrderID,
      }).then((res) => {
        this.ticketList = res.DataList;

        if (this.ticketList.length > 0) {
          this.outTicketType = res.IsPrint ? 'print' : 'bind';
          this.outTicketVisible = true;
        }
      });
    },

    writeOffPrintHandle(itemOrderID) {
      this.$api['sell/sell/orderCompletedFollowOperaction']({
        OrderID: itemOrderID,
      }).then((res) => {
        this.goodsInCompleteOrder = res.DataList;

        this.ticketList = this.goodsInCompleteOrder.filter(item => item.GoodsType === 102);

        if (this.ticketList.length > 0) {
          this.outTicketType = res.IsPrint ? 'print' : 'bind';
          this.outTicketVisible = true;
        } else if (this.outCoinAmount) {
          this.isNeedOutCoin && this.outCoinMethods();
        }
      }, () => {
      });
    },

    getWriteOffTable() {
      this.$api['goods/groupBuy/getGoodsByCode']({
        ChannelID: this.channelValue,
        Code: this.gruopID,
      }).then((res) => {
        if (res.DataList.length <= 0) return;
        this.DialogTableData = res.DataList;

        this.dialogVisible = true;
        this.isJionMember();
      });
    },
    isJionMember() {
      this.DialogTableData.forEach((item) => {
        if (item.GoodsInfo.GoodsType === 1) {
          this.readCardShow = false;
        }
      });
    },
    checkID() {
      if (!this.channelValue || !this.gruopID) {
        this.$message({
          message: `${!this.gruopID ? '请输入团购码' : '请输入渠道'}`,
          type: 'warning',
        });
        return;
      }
      this.getWriteOffTable();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.pagination-wrap {
  width: 100%;
  height: 60px;
  text-align: right;
  background-color: $color-white;
  border-top: solid 1px $border-color;
  box-sizing: border-box;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  /deep/ .el-pagination {
    width: 80%;
    float: right;
    margin: 15px 20px 0 0;
    .el-pagination__jump {
      margin-left: 0;
      margin-right: 10px;
    }
  }
}

.table-wrap {
  width: 100%;

  /deep/ .el-input-group {
    width: 320px;
  }
}

.wrap {
  width: 100%;

  /deep/ .search-top {
    width: 100%;
    padding: 30px 20px;
    //stylelint-disable-next-line
    background-color: #5A6882;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    .el-radio-button__orig-radio:checked + .el-radio-button__inner,
    .el-radio-button__inner:hover,
    .el-radio-button__inner:focus {
      //stylelint-disable-next-line
      color: #409EFF;
      //stylelint-disable-next-line
      border-color: #C6E2FF;
      //stylelint-disable-next-line
      background-color: #ECF5FF;
      box-shadow: none;
    }
    .el-radio-button__inner {
      padding: 0;
      height: 40px;
      line-height: 40px;
      width: 120px;
    }
    .channel-select {
      display: flex;
    }

    .el-col {
      height: 80px;

      .el-input__inner {
        height: 80px;
        border: none;
        color: $color-primary;
        font-size: $font-size-regular;
      }
    }
    .el-col-6 {
      width: 129px;
      border-right: 2px solid $color-bg-secondary;
      .el-input__inner {
        text-align: center;
      }
    }
  }
}
/deep/ .el-input-group__append {
  background-color: $color-white;
  color: $color-primary;
  width: 98px;
  padding: 0;
  text-align: center;

  &:hover {
    background-color: $color-bg-table;
  }
}
.code-inp {
  margin-left: 10px;
  max-width: 418px;
  /deep/ .el-input-group__append {
    background-color: $color-primary;
    color: $color-white;
    border-color: $color-primary;
    &:hover {
      //stylelint-disable-next-line
      background: #66B1FF;
      //stylelint-disable-next-line
      border-color: #66B1FF;
    }
    &:active {
      //stylelint-disable-next-line
      background: #3A8EE6;
      //stylelint-disable-next-line
      border-color: #3A8EE6;
    }
  }
}

</style>
