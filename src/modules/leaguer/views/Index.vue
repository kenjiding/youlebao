<template>
  <ych-page>
    <div class="leaguer-info-container">
      <div
        ref="leaguerInfoHeader"
        class="leaguer-info-header">
        <read-card
          ref="cardReader"
          :value="cardKeyValue"
          :auto-logout="false"
          :popover="false"
          :verify-state="false"
          :verify-date="false"
          :verify-card-state="false"
          class="read-card"
          @change="handleReadLeaguer"
          @logout="clearClick"/>
        <el-input
          v-model="searchKeyValue"
          placeholder="请输入手机号/姓名/卡号/身份证/会员二维码"
          class="input-search"
          @keyup.native.enter="searchClick">
          <el-button
            slot="append"
            @click="searchClick">搜索</el-button>
        </el-input>
        <el-button @click="clearClick">清空</el-button>
      </div>
      <div class="leaguer-info-main">
        <div class="leaguer-info-main-info">
          <div class="info-img">
            <img
              v-if="leaguerInformation.LeaguerPhoto"
              :src="imgSrc">
            <img
              v-else
              src="../../../assets/member-photo.png">
          </div>
          <div class="info-content">
            <div class="info-header">
              <span class="p-name">{{ leaguerInformation.RealName }}</span>
              <el-tag
                v-show="leaguerInformation.LeaguerStatus !== undefined"
                :class="{'tag-status': true, ['tag-status-'+ tagType]: true}"
                :hit="false"
                size="small">{{ leaguerStatusChs }}
              </el-tag>

              <el-dropdown
                split-button
                trigger="click"
                class="dropdown-button"
                type="primary"
                size="small"
                @click="handleEditClick"
                @command="handleCommandClick">
                编辑资料
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="usableStatus < 3"
                    command="compensate">补币</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 3"
                    command="transfer">储值过户</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 3"
                    command="lock">账户锁定/解锁</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 2"
                    command='renewal'
                    divided>续期</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 3"
                    command='level'>级别变更</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 2"
                    command="change">补/换卡</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 3"
                    command="subCard">主副卡管理</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 3"
                    command="password">修改密码</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 1"
                    command="enable"
                    divided>启用/禁用</el-dropdown-item>
                  <el-dropdown-item
                    :disabled="usableStatus < 1"
                    command="cancel">注销</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <div>
              <span>会员卡号: </span>
              <span>{{ leaguerInformation.LeaguerCode }}</span>
            </div>
            <div>
              <span>会员级别: </span>
              <span>{{ leaguerInformation.LeaguerLevelName }}</span>
            </div>
            <div>
              <span>身份证号: </span>
              <span>{{ leaguerInformation.IDCard }}</span>
            </div>
            <div>
              <span>手机号码: </span>
              <span>{{ leaguerInformation.Phone }}</span>
            </div>
            <div>
              <span>入会时间: </span>
              <span>{{ leaguerInformation.RegTime }}</span>
            </div>
            <div>
              <span>过期时间: </span>
              <span>{{ leaguerInformation.VerifyTime }}</span>
            </div>
            <div>
              <span>会员生日: </span>
              <span>{{ leaguerInformation.Birthday }}</span>
            </div>
            <div>
              <span>开卡商户: </span>
              <span>{{ leaguerInformation.OpenBusiness }}</span>
            </div>
            <div>
              <span>上次到店: </span>
              <span>{{ leaguerInformation.LastInBusinessDate }}</span>
            </div>
          </div>
        </div>
        <div class="leaguer-info-main-value">
          <div
            v-if="!leaguerValues.length"
            class="empty-box">
            <img src="../../../assets/empty-value.png">
            <span>该会员暂无储值数据</span>
          </div>
          <div
            v-for="item in leaguerValues"
            v-else
            :key="item.ValueCode"
            :class="{'le-five': leaguerValues.length > 5}"
            class="value-item">
            <el-row :gutter="5">
              <el-col
                :span="4"
                class="value-item-label">
                <span>{{ item.ValueName }}:</span>
              </el-col>
              <el-col
                :span="6"
                class="value-item-amount">
                <el-button
                  v-if="(item.ValueCode === 401 || item.ValueCode === 402) && item.AllAmount > 0"
                  type="text"
                  class="value-item-link"
                  @click="showAccountDetail(item.ValueCode)">{{ item.AllAmount }}
                </el-button>
                <span v-else-if="item.ValueCode === 1 && item.AllAmount > 0">
                  {{ item.AllAmount | number('0.00') }}
                </span>
                <span v-else>{{ item.AllAmount || '-' }}</span>
              </el-col>
              <el-col
                :span="10"
                class="value-item-summery">
                <span>{{ item.Summary }}</span>
              </el-col>
              <el-col
                :span="4">
                <el-button
                  v-if="item.ValueCode === 402"
                  v-show="canGetCoin"
                  type="text"
                  size="small"
                  @click="handleCommandClick('getCoin')">提币</el-button>
                <el-button
                  v-else-if="item.ValueCode === 403"
                  v-show="hasLeaguer && usableStatus === 3"
                  type="text"
                  size="small"
                  @click="handleCommandClick('storeLottery')">存票</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <leaguer-tables
        ref="leaguerTables"
        :table-height="tableHeight"
        :leaguer-id="leaguerInformation.ID"
        @row-click="handleRowClick" />

      <div
        class="main-card">
        <transition
          name="slide">
          <RightPage
            v-show="closeArrow"
            ref="ticketDetail"
            :row-id="ticketID"
            :row-info="ticketInfo"
            :content-height="tableHeigth"
            @close-arrow="closeArrow = !closeArrow"/>
        </transition>
      </div>


      <edit-leaguer-info
        v-if="componentState['edit']"
        ref="editLeaguerInfo"
        :visible.sync="eidtInfoVisible"
        :leaguer-id="leaguerInformation.ID"
        @complete="handleEidtInfoComplete"
      />

      <compensate-coin
        v-if="componentState['compensate']"
        ref="compensateCoin"
        :visible.sync="componentVisible['compensate']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('compensate')"
        @complete="handleComponentComplete('compensate')"
      />

      <transfer-account
        v-if="componentState['transfer']"
        ref="transferAccount"
        :visible.sync="componentVisible['transfer']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('transfer')"
        @complete="handleComponentComplete('transfer')"
      />

      <lock-account
        v-if="componentState['lock']"
        ref="lockAccount"
        :visible.sync="componentVisible['lock']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('lock')"
        @complete="handleComponentComplete('lock')"
      />

      <edit-password
        v-if="componentState['password']"
        ref="editPassword"
        :visible.sync="componentVisible['password']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('password')"
      />

      <enable-state-change
        v-if="componentState['enable']"
        ref="enableStateChange"
        :visible.sync="componentVisible['enable']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('enable')"
        @complete="handleComponentComplete('enable')"
      />

      <renewal
        v-if="componentState['renewal']"
        ref="renewal"
        :visible.sync="componentVisible['renewal']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('renewal')"
        @complete="handleComponentComplete('renewal')"
      />

      <level-change
        v-if="componentState['level']"
        ref="levelChange"
        :visible.sync="componentVisible['level']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('level')"
        @complete="handleComponentComplete('level')"
      />

      <card-change
        v-if="componentState['change']"
        ref="cardChange"
        :visible.sync="componentVisible['change']"
        :leaguer="leaguerInformation"
        :is-create="false"
        @close="handleComponentClose('change')"
        @complete="handleComponentComplete('change')"
      />

      <cancel-leaguer
        v-if="componentState['cancel']"
        ref="cancelLeaguer"
        :visible.sync="componentVisible['cancel']"
        :leaguer="leaguerInformation"
        :is-create="false"
        @close="handleComponentClose('cancel')"
        @complete="handleComponentComplete('cancel')"
      />

      <get-coin
        v-if="componentState['getCoin']"
        ref="getCoin"
        :visible.sync="componentVisible['getCoin']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('getCoin')"
        @complete="handleComponentComplete('getCoin')"
      />

      <store-lottery
        v-if="componentState['storeLottery']"
        ref="storeLottery"
        :visible.sync="componentVisible['storeLottery']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('storeLottery')"
        @complete="handleComponentComplete('storeLottery')"
      />

      <sub-card-management
        v-if="componentState['subCard']"
        ref="subCard"
        :visible.sync="componentVisible['subCard']"
        :leaguer="leaguerInformation"
        @close="handleComponentClose('subCard')"
        @complete="handleComponentComplete('subCard')"
      />

      <search-leaguer-List
        :list="leaguerList"
        :visible.sync="leaguerListVisible"
        @confirm="handleSearchListConfirm"/>

      <account-detail
        :visible.sync="accountDetailVisible"
        :value-type="accountDetailType"
        :leaguer-id="leaguerInformation.ID"/>

    </div>
</ych-page></template>

<script>
import { mapState } from 'vuex';
import { uniqBy } from 'lodash';
import { IS_DEVELOP } from '@/config';
import { RightPage } from '@/modules/ticket';
import ReadCard from '@/components/read-card/ReadCard.vue';
import SearchLeaguerList from '../_components/SearchLeaguerList.vue';
import LeaguerTables from '../_components/LeaguerTables.vue';
import EditLeaguerInfo from '../_components/EditLeaguerInfo.vue';
import CompensateCoin from '../_components/CompensateCoin.vue';
import TransferAccount from '../_components/TransferAccount.vue';
import LockAccount from '../_components/LockAccount.vue';
import EditPassword from '../_components/EditPassword.vue';
import EnableStateChange from '../_components/EnableStateChange.vue';
import Renewal from '../_components/Renewal.vue';
import LevelChange from '../_components/LevelChange.vue';
import CardChange from '../_components/CardChange.vue';
import CancelLeaguer from '../_components/CancelLeaguer.vue';
import GetCoin from '../_components/GetCoin.vue';
import StoreLottery from '../_components/StoreLottery.vue';
import AccountDetail from '../_components/AccountDetail.vue';
import SubCardManagement from '../_components/SubCardManagement.vue';


export default {
  name: 'LeaguerInformation',

  components: {
    ReadCard,
    SearchLeaguerList,
    LeaguerTables,
    EditLeaguerInfo,
    CompensateCoin,
    TransferAccount,
    LockAccount,
    EditPassword,
    EnableStateChange,
    Renewal,
    LevelChange,
    CardChange,
    CancelLeaguer,
    GetCoin,
    StoreLottery,
    AccountDetail,
    RightPage,
    SubCardManagement,
  },

  data() {
    return {
      leaguerInformation: {},
      cardKeyValue: '',
      searchKeyValue: '',
      lgValues: [],
      leaguerList: [],
      leaguerListVisible: false,

      componentState: {
        edit: false,
        compensate: false,
        transfer: false,
        lock: false,
        password: false,
        enable: false,
        renewal: false,
        level: false,
        change: false,
        cancel: false,
        getCoin: false,
        storeLottery: false,
        subCard: false,
      },

      eidtInfoVisible: false,
      componentVisible: {
        compensate: false,
        transfer: false,
        lock: false,
        password: false,
        enable: false,
        renewal: false,
        level: false,
        change: false,
        cancel: false,
        getCoin: false,
        storeLottery: false,
        subCard: false,
      },

      accountDetailVisible: false,
      accountDetailType: 402,

      // 套票弹窗属性
      closeArrow: false,
      ticketID: '',
      ticketInfo: {},
    };
  },

  computed: {
    ...mapState({
      client: state => state.client,
      tableWidth: state => state.client.pageWidth,
    }),

    tableHeigth() {
      return this.$store.state.client.pageHeight - 166;
    },

    usableStatus() {
      const leaguerStatusNum = {
        Disabled: 1,
        Overdue: 2,
        Normal: 3,
      };
      if (this.leaguerInformation.ID) {
        return leaguerStatusNum[this.leaguerInformation.LeaguerStatus];
      }
      return 0;
    },

    leaguerValues() {
      const arr = this.lgValues || [];
      if (IS_DEVELOP) {
        return uniqBy(arr, 'ValueCode');
      }
      return arr;
    },

    imgSrc() {
      return this.leaguerInformation.LeaguerPhoto ? `data:image/png;base64,${this.leaguerInformation.LeaguerPhoto}` : null;
    },

    tagType() {
      switch (this.leaguerInformation.LeaguerStatus) {
        case 'Disabled':
          return 'danger';
        case 'Overdue':
          return 'danger';
        default:
          return 'success';
      }
    },

    leaguerStatusChs() {
      switch (this.leaguerInformation.LeaguerStatus) {
        case 'Disabled':
          return '禁用';
        case 'Overdue':
          return '已过期';
        default:
          return '正常';
      }
    },

    hasLeaguer() {
      return Boolean(this.leaguerInformation.ID);
    },

    canGetCoin() {
      if (this.hasLeaguer && this.usableStatus === 3) {
        if (this.leaguerValues && this.leaguerValues.length > 0) {
          const coinValue = this.leaguerValues.filter(value => value.ValueCode === 402);
          if (coinValue.length > 0) {
            return coinValue[0].AllAmount > 0;
          }
        }
      }
      return false;
    },

    tableHeight() {
      let searchHeight = 70;
      if (this.$refs && this.$refs.leaguerInfoHeader) {
        searchHeight = this.$refs.leaguerInfoHeader.clientHeight;
      }
      return this.client.pageHeight - 240 - searchHeight;
    },
  },

  activated() {
    if (this.$route.query.id) {
      this.readLeaguer(null, this.$route.query.id);
    }
  },

  deactivated() {
    this.$refs.cardReader.logout();
  },

  methods: {
    handleReadLeaguer(leaguer) {
      this.leaguerInformation = leaguer || {};
      if (leaguer) {
        this.searchKeyValue = '';
        this.$nextTick(() => {
          this.readLeaguerValues();
          this.$refs.leaguerTables.reLoad();
        });
      }
    },

    searchClick() {
      if (!this.searchKeyValue) { return; }
      this.$api['leaguer/getLeaguerListByCard']({
        DeviceLgID: this.searchKeyValue.trim(),
        DeviceType: 'Keyboard',
      }).then((data) => {
        const list = data.LeaguerData;

        if (list.length <= 0) {
          return;
        }
        if (list.length === 1) {
          this.$refs.cardReader.logout();
          this.readLeaguer(null, list[0].ID);
          return;
        }

        this.leaguerList = list;
        this.leaguerListVisible = true;
      });
    },

    handleSearchListConfirm(data) {
      this.$refs.cardReader.logout();
      const ID = data;
      this.readLeaguer(null, ID);
    },

    readLeaguer(id, leaguerId) {
      this.$api['leaguer/leaguer/getOneLeaguerBaseByCard']({
        DeviceLgID: id,
        VerifyState: false,
        VerifyDate: false,
        VerifyCardState: false,
        LeaguerID: leaguerId,
      }).then((res) => {
        this.leaguerInformation = res || {};
        this.$nextTick(() => {
          this.readLeaguerValues();
          this.$refs.leaguerTables.reLoad();
        });
      });
    },

    clearClick() {
      this.leaguerInformation = {};
      this.lgValues = [];
      this.searchKeyValue = '';
      this.$refs.leaguerTables.allClear();
      this.closeArrow = false;
    },

    readLeaguerValues() {
      if (this.leaguerInformation.ID) {
        this.$api['leaguer/leaguer/getLeaguerAllValue']({
          LeaguerID: this.leaguerInformation.ID,
        }).then((res) => {
          this.lgValues = res.DataList || [];
        });
      } else {
        this.lgValues = [];
      }
    },

    handleEidtInfoComplete() {
      this.eidtInfoVisible = false;
      this.readLeaguer(null, this.leaguerInformation.ID);
    },

    handleEditClick() {
      if (this.usableStatus >= 3) {
        this.componentState.edit = true;
        this.$nextTick(() => {
          this.eidtInfoVisible = true;
        });
      }
    },

    handleCommandClick(command) {
      this.componentState[command] = true;
      this.$nextTick(() => {
        this.componentVisible[command] = true;
      });
    },

    handleComponentClose(val) {
      this.componentVisible[val] = false;
    },

    handleComponentComplete(val) {
      // this.componentVisible[val] = false;
      if (val === 'cancel') {
        this.$refs.cardReader.logout();
      } else {
        this.readLeaguer(null, this.leaguerInformation.ID);
      }
    },

    showAccountDetail(type) {
      this.accountDetailVisible = true;
      this.accountDetailType = type;
    },

    handleRowClick(val) {
      this.closeArrow = true;
      this.ticketID = val.ID;
      this.ticketInfo = val;
      this.$nextTick(() => {
        this.$refs.ticketDetail.onLoad();
      });
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";
  @import "@/styles/mixins.scss";

  .leaguer-info {
    &-container {
      background-color: $color-bg-primary;
      border-radius: $border-radius;
      position: relative;

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

      .main-card {
        height: calc(100% - 60px);
        z-index: 2000;
        position: absolute;
        right: 0;
        top: 60px;
        border-radius: $border-radius;
      }
    }

    &-header {
      display: flex;
      flex: row nowrap;
      overflow: hidden;
      padding: 10px 20px;
      height: 60px;
      border-bottom: 1px solid $border-color;
      box-sizing: border-box;
      .input-search {
        max-width: calc(100% - 390px);
        width: 30%;
        margin-right: 10px;

        /deep/ .el-button {
          color: $color-primary;
        }
      }

      /deep/ .el-button {
        color: $font-color-primary;
      }
    }

    &-main {
      // width: 1080px;
      height: 240px;
      padding: 10px 20px;
      display: flex;
      flex: row nowrap;
      overflow: hidden;
      align-items: center;
      box-sizing: border-box;

      &-info {
        height: 200px;
        padding: 20px;
        background-color: $color-white;
        display: flex;
        flex: row wrap;
        justify-content: flex-start;
        $eg-px: 8px;

        .info-img {
          width: 200px;
          height: 200px;

          img {
            width: 200px;
            height: 200px;
          }
        }

        .info-header {
          position: relative;
          width: 100% !important;
          height: 60px !important;
          line-height: 50px;
        }

        .info-content {
          min-width: 450px;
          max-width: 675px;
          height: 210px;
          margin-left: 20px;
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-start;
          align-items: flex-start;
          overflow: hidden;

          > div {
            width: 215px;
            height: 30px;
            margin-right: 10px;
            color: $font-color-primary;
            font-size: $font-size-primary;
            display: flex;
            align-items: center;
          }
        }

        .p-name {
          width: 60%;
          padding-top: 2px;
          line-height: 36px;

          @include ellipsis(2);
          font-size: $font-size-regular + $eg-px!important;
          color: $font-color-regular!important;
        }

        .tag-status {
          margin-left: 8px;
          border-radius: $border-radius;
          color: $color-white;
          border: 0;

          &-success {
            background-color: $color-success;
          }

          &-danger {
            background-color: $color-danger;
          }
        }
      }


      &-value {
        min-width: 310px;
        max-width: 370px;
        flex: 1;
        box-sizing: border-box;
        border-radius: $border-radius;
        border: 1px solid $border-color;
        background-color: $color-white;
        .value-item {
          $two-px: 2px;
          height: 40px;
          line-height: 40px;
          > div {
            display: flex;
          }
          &:first-child {
            border-top-left-radius: $border-radius;
            border-top-right-radius: $border-radius;
          }
          &:last-child {
            border-bottom-left-radius: $border-radius;
            border-bottom-right-radius: $border-radius;
          }

          &-label {
            text-align: right;
            font-size: $font-size-primary;
            color: $font-color-primary;
          }

          &-amount {
            text-align: left;
            font-size: $font-size-primary + $two-px;
            color: $font-color-currency;
          }

          &-link {
            text-decoration: underline;
            font-size: $font-size-primary + $two-px;
            color: $font-color-currency;
            padding: 0;
          }

          &-summery {
            text-align: center;
            font-size: $font-size-special;
            color: $font-color-placeholder;
          }
        }
        .le-five {
          height: 30px;
          line-height: 30px;
        }
        .value-item:nth-child(odd) {
          background: $color-white;
        }

        .value-item:nth-child(even) {
          background: $color-bg-regular;
        }
      }
    }
  }
  .empty-box {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    img {
      width: 114px;
      height: 88px;
    }
    span {
      color: $font-color-placeholder;
    }
  }
  .read-card {
    width: 320px;
    margin-right: 10px;
  }

  .dropdown-button {
    position: absolute;
    right: 0;

    /deep/ .el-button {
      font-size: $font-size-primary;
    }
  }

</style>
