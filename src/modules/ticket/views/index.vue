<template>
  <ych-page class="page">
    <div class="wrap">
      <div
        ref="wrapTop"
        class="wrap-top">
        <el-radio-group
          v-model="formData.DateRange"
          @change="quickClick">
          <el-radio-button label="Today">今日</el-radio-button>
          <el-radio-button label="ThirtyDays">近30日</el-radio-button>
          <el-radio-button label="OneYear">近1年</el-radio-button>
          <el-radio-button label="All">全部</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="timeVal"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="datePickerClick"/>
        <ych-read-card
          ref="giftReadCard"
          class="read-card"
          @change="readCardHandle"
          @logout="logoutHandle"/>
        <el-select
          v-model="formData.ChannelID"
          clearable
          placeholder="请选择渠道"
          @change="searchClick">
          <el-option
            v-for="item in options"
            :key="item.Value"
            :label="item.Text"
            :value="item.Value"/>
        </el-select>

        <el-input
          v-model="formData.Condition"
          placeholder="请输入订单号/票码/套票名称/购票人姓名、手机号"
          clearable
          class="search-input"
          @keyup.native.enter="searchClickHandle">
          <template slot="append">
            <el-button
              type="primary"
              @click="searchClickHandle">搜索</el-button>
          </template>
        </el-input>
        <el-button
          type="primary"
          class="clear-btn"
          plain
          @click="clearSearch">重置</el-button>
      </div>
      <div class="wrap-main">
        <el-tabs
          v-model="formData.TicketStatus"
          @tab-click="searchClick">
          <el-tab-pane
            label="待使用"
            name="BeUse"/>
          <el-tab-pane
            label="已失效"
            name="LossEffect"/>
          <el-tab-pane
            label="全部"
            name="All"/>
        </el-tabs>
        <Table
          :table-data="tableData"
          :table-height="tableHeigth"
          @rows-click="rightPageShow"
          @selection-change="handleSelect"/>
        <div class="pagination-wrap">
          <el-button
            :disabled="disabledStatus"
            type="primary"
            @click="dialogVisible = true">退票</el-button>
          <el-pagination
            :total="listTotal"
            :current-page.sync="pageIndex"
            :page-size="20"
            background
            layout=" total,jumper,prev, pager, next"
            @current-change="getData"/>
        </div>
        <div
          class="main-card">
          <transition
            name="slide">
            <RightPage
              v-show="closeArrow"
              ref="ticketDetail"
              :row-id="rowID"
              :row-info="rowInfo"
              :content-height="tableHeigth"
              @close-arrow="closeArrow = !closeArrow"/>
          </transition>
        </div>
      </div>
    </div>
    <RefundTicketDialog
      :dialog-visible.sync="dialogVisible"
      :package-log="packageLog"
      @update-table="getData"/>
  </ych-page>
</template>

<script>
import { mapState } from 'vuex';

import Table from '../_components/IndexTable.vue';
import RightPage from '../_components/RightPage.vue';
import RefundTicketDialog from '../_components/RefundTicketDialog.vue';

export default {
  name: '',
  components: {
    Table,
    RightPage,
    RefundTicketDialog,
  },
  data() {
    return {
      formData: {
        LogTimeBegin: '',
        LogTimeEnd: '',
        LeaguerID: '',
        Condition: '',
        ChannelID: '',
        TicketStatus: 'All',
        DateRange: 'Today',
        PageInfo: {},
      },
      rowInfo: {},
      packageLog: [],
      dialogVisible: false,
      rowID: '',
      disabledStatus: true,
      tableData: [],
      timeVal: [],
      closeArrow: false,
      listTotal: null,
      pageIndex: 1,
      options: [],
      topBarHeight: 90,
    };
  },

  computed: {
    ...mapState({
      // tableHeigth: state => state.client.pageHeight - 220,
      tableWidth: state => state.client.pageWidth,
    }),
    tableHeigth() {
      return this.$store.state.client.pageHeight - this.topBarHeight - 121 - 5;
    },
  },

  watch: {
    tableWidth() {
      this.topBarHeight = this.$refs.wrapTop.clientHeight;
    },
  },

  activated() {
    this.topBarHeight = this.$refs.wrapTop.clientHeight;
    this.clearSearch();
  },

  created() {
    this.getData();
    this.getdropDownData();
  },

  methods: {
    clearSearch() {
      this.formData.ChannelID = '';
      this.formData.Condition = '';
      this.timeVal = [];
      this.$refs.giftReadCard.clearLeaguer();
      this.logoutHandle();
    },
    logoutHandle() {
      this.formData.LeaguerID = '';
      this.getData();
    },
    readCardHandle(data) {
      this.formData.LeaguerID = data && data.ID;
      this.formData.DateRange = 'All';
      this.searchClick();
    },
    datePickerClick() {
      this.formData.DateRange = '';
      this.searchClick();
    },
    quickClick() {
      this.timeVal = '';
      this.searchClick();
    },
    searchClickHandle() {
      if (!this.formData.Condition) {
        this.$message({
          message: '请输入搜索内容',
          type: 'warning',
        });
        return;
      }
      this.formData.TicketStatus = 'All';
      this.searchClick();
    },
    handleSelect(val) {
      if (val.length > 0) {
        this.disabledStatus = !(val.length > 0);
        this.packageLog = val;
      } else {
        this.disabledStatus = true;
      }
    },
    rightPageShow(val) {
      this.closeArrow = true;
      this.rowID = val.SaleLogID;
      this.rowInfo = val;
      this.$nextTick(() => {
        this.$refs.ticketDetail.onLoad();
      });
    },
    getdropDownData() {
      this.$api['others/getAllChannel']().then((res) => {
        this.options = res.DataList;
        // this.options.push({
        //   Text: '本店',
        //   Value: '00000000-0000-0000-0000-000000000000',
        // });
      });
    },
    searchClick() {
      this.disabledStatus = true;
      this.packageLog = [];
      this.pageIndex = 1;
      this.getData();
    },
    getData() {
      const time = this.timeVal;
      if (time) {
        this.formData.LogTimeBegin = this.$date(time[0]).format('YYYY-MM-DD');
        this.formData.LogTimeEnd = this.$date(time[1]).format('YYYY-MM-DD');
      } else {
        this.formData.LogTimeBegin = '';
        this.formData.LogTimeEnd = '';
      }
      this.formData.PageInfo = {
        PageIndex: this.pageIndex,
        PageSize: 20,
      };

      this.$api['ticket/ticket/ticketQuery'](this.formData).then((res) => {
        this.listTotal = res.Total;
        this.tableData = res.DataList;
      });
    },
    currentChange() {
      this.disabledStatus = true;
      this.packageLog = [];
      this.getData();
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.page {
  /deep/ .ych-page__wrap {
  }
}

.slide-enter-active {
  transition: all .3s ease;
}
.slide-leave-active {
  transition: all .8s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(300px);
  opacity: 0;
}

.pagination-wrap {
  width: 100%;
  height: 60px;
  text-align: right;
  background-color: $color-white;
  border-top: solid 1px $border-color;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;

  /deep/ .el-button--primary {
    float: left;
    margin: 10px 0 0 20px;
  }

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

.main-card {
  height: 100%;
  z-index: 2000;
  position: absolute;
  right: 0;
  top: 0;
}

.wrap-main {
  width: 100%;
  margin-top: 10px;
  overflow: hidden;
  position: relative;
}

.wrap {
  width: 100%;
  background-color: $color-white;
  padding-top: 10px;
  border-radius: $border-radius;

  /deep/ .el-tabs__header {
    background-color: $color-white;
    margin: 0;
    margin-bottom: 5px;

    .el-tabs__nav {
      margin-left: 30px;
    }
  }

  .wrap-top {
    overflow: hidden;

    div {
      padding-left: 10px;
    }

    /deep/ .el-radio-group {
      margin-right: 10px;
      margin-bottom: 10px;
      float: left;
    }

    /deep/ .el-date-editor {
      width: 250px;
      margin-bottom: 10px;
      float: left;
    }

    /deep/ .ych-read-card {
      width: 330px;
      margin-bottom: 10px;
      float: left;
    }

    .search-input {
      max-width: 418px;
      margin-right: 10px
    }

    /deep/ .el-select {
      margin-bottom: 10px;

      float: left;
    }
  }
}
</style>
