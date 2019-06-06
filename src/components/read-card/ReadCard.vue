<template>
  <el-tooltip
    v-model="errorTooltip"
    :hide-after="3000"
    placement="top"
    effect="light"
    manual>
    <div class="ych-read-card">
      <el-input
        v-model="localValue"
        :placeholder="placeholder"
        v-bind="$attrs"
        :class="{
          'ych-read-card--selecte': selectMode,
          ['ych-read-card--' + selectedType]: true,
          'ych-read-card--exist': existLeaguer,
        }"
        clearable
        @keyup.native.enter="manualInput"
        @focus="handleInputFocus"
      >
        <template
          slot="prepend">
          <div class="ych-read-card__prepend">
            <leaguer-icon
              v-show="existLeaguer && !selectMode"
              class="lg-icon"
              @click.native="selectMode = true;"/>
            <div
              class="ych-read-card__icons">
              <el-tooltip
                v-for="item in filteredIcons"
                :key="item.name"
                :content="item.tips"
                effect="light"
                placement="top">
                <i
                  :class="{
                    ['ych-icon-' + item.icon]: true,
                    'type--active': selectedType === item.name
                  }"
                  @click="changeType(item.name)"
                />
              </el-tooltip>
            </div>
          </div>
        </template>

        <template slot="append">
          <div
            v-if="existLeaguer"
            class="ych-read-card__leaguer">
            <el-popover
              :offset="6"
              :disabled="!popover"
              v-model="showLeaguerCard"
              popper-class="ych-read-card__leaguer-msg"
              placement="bottom"
              trigger="click">

              <leaguer-card
                :data="leaguerInfo"/>
              <el-button
                slot="reference"
                :class="{
                  'ych-read-card__leaguer-trigger--active': showLeaguerCard
                }"
                class="ych-read-card__leaguer-trigger">
                <div v-if="!leaguerInfo.IsMaster">副卡</div>
                {{ `${leaguerInfo.LeaguerCode}&nbsp;&nbsp;${leaguerInfo.RealName}` }}
              </el-button>

            </el-popover>
            <el-button
              type="danger"
              class="ych-read-card__leaguer-logout"
              @click="logout">
              登出
              <span
                v-if="autoLogout"
                class="ych-read-card__leaguer-logout-number">
                {{ logoutTimes }} s
              </span>
            </el-button>
          </div>

          <el-button
            v-else-if="['member', 'idcard'].includes(selectedType)"
            class="ych-read-card__btn"
            @click="onRead()">
            点击读卡
          </el-button>

          <el-button
            v-else-if="selectedType === 'keyboard'"
            type="primary"
            class="ych-read-card__btn-search"
            @click="manualInput">
            搜索
          </el-button>
        </template>

      </el-input>

      <leaguer-List
        :list="leaguerList"
        :visible.sync="leaguerListVisible"
        @confirm="confirmLeaguer"/>

    </div>

    <span
      slot="content"
      class="error-msg"
      v-text="errorMsg"/>
  </el-tooltip>
</template>

<script type="text/javascript">
import LeaguerCard from './LeaguerCard.vue';
import LeaguerList from './LeaguerList.vue';
import LeaguerIcon from './LeaguerIcon.vue';

const LOGOUT_TIMES = 180;

export default {
  name: 'YchReadCard',

  components: {
    LeaguerCard,
    LeaguerList,
    LeaguerIcon,
  },

  inheritAttrs: false,

  props: {
    value: {
      type: String,
      default: null,
    },

    defaultType: {
      type: String,
      default: 'member',
      validator(value) {
        return ['member', 'idcard', 'keyboard'].indexOf(value) !== -1;
      },
    },

    placeholder: {
      type: String,
      default: '手机号/姓名/会员二维码',
    },

    // autoLogout: {
    //   type: Boolean,
    //   default: true,
    // },

    popover: {
      type: Boolean,
      default: true,
    },

    verifyState: {
      type: Boolean,
      default: true,
    },

    verifyDate: {
      type: Boolean,
      default: true,
    },

    verifyCardState: {
      type: Boolean,
      default: true,
    },

    // 漫游模式
    roamModel: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      cardIDNum: '',
      selectedType: this.defaultType,
      icons: [{
        name: 'member',
        icon: 'member-card',
        tips: '会员卡读卡器',
      }, {
        name: 'idcard',
        icon: 'id-card',
        tips: '身份证读卡器',
      }, {
        name: 'keyboard',
        icon: 'keyboard',
        tips: '键盘输入',
      }],
      // 是否为选择模式
      selectMode: false,

      leaguerInfo: {
        LeaguerCode: null,
        RealName: null,
      },
      // 自动登出时间
      logoutTimes: LOGOUT_TIMES,
      logoutTimer: null,
      // 会员卡片
      showLeaguerCard: false,

      // 会员列表
      leaguerListVisible: false,
      leaguerList: [],

      errorMsg: '',
      errorTooltipHideTimer: null,

      callBackAfterRead: null,
      autoLogout: false,

    };
  },

  computed: {
    localValue: {
      get() {
        return this.cardIDNum;
      },

      set(val) {
        this.cardIDNum = val;
        this.$emit('input', val);
      },
    },

    filteredIcons() {
      if (this.selectMode) {
        return this.icons;
      }
      return this.icons.filter(item => item.name === this.selectedType);
    },

    existLeaguer() {
      return Boolean(this.leaguerInfo.LeaguerCode);
    },

    errorTooltip: {
      get() {
        return Boolean(this.errorMsg);
      },

      set(val) {
        if (val) return;
        if (this.errorTooltipHideTimer) {
          clearTimeout(this.errorTooltipHideTimer);
        }
        this.errorMsg = '';
      },
    },
  },

  mounted() {
    this.checkDevices();
  },

  methods: {
    checkDevices() {
      if (this.$device.readerCall(true) === 0) {
        this.selectedType = 'member';
      } else if (this.$device.readIDCardCall(true) === 0) {
        this.selectedType = 'idcard';
      } else {
        this.selectedType = 'keyboard';
      }
    },

    changeType(name) {
      if (!this.selectMode) {
        this.selectMode = true;
        return;
      }
      if (this.selectedType !== name) {
        this.logout();
      }
      this.selectedType = name;
      this.selectMode = false;
      this.$nextTick(() => this.onRead());
    },

    onRead(cb = () => {}) {
      this.callBackAfterRead = cb;
      switch (this.selectedType) {
        case 'member':
          this.readMemberCard();
          break;

        case 'idcard':
          this.readIDCard();
          break;

        default:
          break;
      }
    },

    readMemberCard() {
      const cardInfo = this.$device.readCard(true);

      const { cardID, errorCode, errorMsg } = cardInfo;

      if (errorCode !== 0) {
        this.handleError(errorMsg);
        this.callBackWithLeaguer(this.leaguerInfo);

        return;
      }

      this.errorTooltip = false;
      if (this.roamModel) {
        this.getRoamLeaguerList(cardID, 'CardReader');
      } else {
        this.asyncFetchSingleLeaguerInfo(cardID);
      }
    },

    readIDCard() {
      const idCardInfo = this.$device.readIDCard(true);
      const { errorCode, errorMsg } = idCardInfo;

      if (errorCode !== 0) {
        this.handleError(errorMsg);
        return;
      }
      this.errorTooltip = false;
      this.getLeaguer(idCardInfo.idCardNum, 'IDCardReader');
    },

    handleError(msg) {
      // this.$emit('input', '');
      // this.$emit('change', null);
      // this.$emit('logout');

      this.errorMsg = msg;
      if (this.errorTooltipHideTimer) {
        clearTimeout(this.errorTooltipHideTimer);
      }
      this.errorTooltipHideTimer = setTimeout(() => {
        this.errorTooltip = false;
      }, 3000);
    },

    manualInput() {
      this.getLeaguer(this.cardIDNum, 'Keyboard');
    },

    handleInputFocus() {
      if (this.selectMode) {
        this.changeType('keyboard');
      }
    },

    asyncGetLeaguerList(id, deviceType) {
      this.$api['leaguer/getLeaguerListByCard']({
        DeviceLgID: id,
        DeviceType: deviceType,
      }).then((data) => {
        const list = data.LeaguerData;

        if (list.length <= 0) {
          return;
        }
        this.cardIDNum = '';
        if (list.length === 1) {
          this.asyncFetchSingleLeaguerInfo(null, list[0].ID);
          return;
        }

        this.leaguerList = list;
        this.leaguerListVisible = true;
      });
    },

    asyncFetchSingleLeaguerInfo(id, leaguerId) {
      this.$api['leaguer/getOneLeaguerBaseByCard']({
        DeviceLgID: id,
        VerifyState: this.verifyState,
        VerifyDate: this.verifyDate,
        VerifyCardState: this.verifyCardState,
        LeaguerID: leaguerId,
      }).then((data) => {
        this.clearLeaguer();
        this.asyncGetLeaguerAfter(data);
        this.callBackWithLeaguer(data);
      }, () => {
        this.callBackWithLeaguer(null);
        this.logout();
      });
    },

    callBackWithLeaguer(leaguer) {
      this.callBackAfterRead && this.callBackAfterRead(leaguer);
    },


    asyncGetLeaguerAfter(data) {
      Object.assign(this.leaguerInfo, data);
      if (this.leaguerInfo.LeaguerCode) this.selectMode = false;
      this.$emit('input', data.LeaguerCode);
      this.$emit('change', data);
      this.login();
    },

    login() {
      this.logoutTimes = LOGOUT_TIMES;

      if (this.logoutTimer) {
        clearInterval(this.logoutTimer);
      }

      if (this.autoLogout) {
        this.logoutTimer = setInterval(() => {
          --this.logoutTimes;
          if (this.logoutTimes <= 0) {
            this.logout();
          }
        }, 1000);
      }
    },

    logout() {
      this.clearLeaguer();
      this.cardIDNum = '';
      this.$emit('logout');
      this.$emit('input', '');
      this.$emit('change', null);
    },

    clearLeaguer() {
      this.leaguerInfo = {
        LeaguerCode: null,
        RealName: null,
      };
      this.logoutTimes = LOGOUT_TIMES;
      this.logoutTimer && clearInterval(this.logoutTimer);
      this.showLeaguerCard = false;
    },

    // 扩展方法
    getLeaguer(id, deviceType) {
      if (this.roamModel) {
        this.getRoamLeaguerList(id, deviceType);
      } else {
        this.asyncGetLeaguerList(id, deviceType);
      }
    },

    confirmLeaguer(data) {
      if (data.LeaguerStatus !== 'Normal' && this.roamModel) {
        const format = {
          Disabled: '禁用',
          Overdue: '已过期',
        };
        this.$alert(`会员状态为${format[data.LeaguerStatus]},不能漫游`, '提示', {
          type: 'error',
        });
        return;
      }
      if (this.roamModel && data.IsRoam) {
        this.confirmRoamLeaguer(data);
      } else {
        const { ID } = data;
        this.asyncFetchSingleLeaguerInfo(null, ID);
      }
    },

    // 漫游模式
    getRoamLeaguerList(id, deviceType) {
      this.$api['leaguer/getLgListByRoam']({
        DeviceLgID: id,
        DeviceType: deviceType,
      }).then((data) => {
        const list = data.LeaguerData;

        if (list.length <= 0) {
          return;
        }
        this.cardIDNum = '';
        if (data.ErrInfo) {
          this.$message({
            message: data.ErrInfo,
            type: 'warning',
          });
        }
        if (list.length === 1) {
          const leaguer = list[0];
          if (leaguer.LeaguerStatus !== 'Normal') {
            const format = {
              Disabled: '禁用',
              Overdue: '已过期',
            };
            this.$alert(`会员状态为${format[leaguer.LeaguerStatus]},不能漫游`, '提示', {
              type: 'error',
            });
            return;
          }
          if (leaguer.IsRoam) {
            this.confirmRoamLeaguer(leaguer);
          } else {
            this.asyncFetchSingleLeaguerInfo(null, leaguer.ID);
          }
          return;
        }

        this.leaguerList = list;
        this.leaguerListVisible = true;
      });
    },

    confirmRoamLeaguer(data) {
      this.$api['leaguer/getLeaguerDetailByRoam']({
        LeaguerID: data.ID,
        TargetBusinessID: data.OpenBusinessID,
      }).then((res) => {
        this.clearLeaguer();
        this.asyncGetLeaguerAfter(res);
        this.callBackWithLeaguer(res);
      }, () => {
        this.callBackWithLeaguer(null);
        this.logout();
      });
    },


  },
};
</script>

<style lang="scss">
.el-form-item__content {
  .ych-read-card {
    width: 100% !important;
  }
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';
@import '@/styles/mixins.scss';

.ych-read-card {
  position: relative;
  min-width: 320px;
  max-height: 40px;
  /deep/ .el-input-group {
    height: 100%;
  }

  /deep/ .el-input-group__prepend {
    min-width: 50px;
    padding: 0 5px;
    height: 100%;
    box-sizing: border-box;
    cursor: pointer;
    // background-color: $color-white;
  }

  /deep/ .el-input-group__append {
    background-color: $color-white;
    display: none;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    // overflow: hidden;
    cursor: pointer;
    padding: 0;
    &:hover {
      // stylelint-disable-next-line
      background-color: #EBF3FD;
    }
  }

  /deep/ &.el-input--medium {
    .el-input-group__append {
      height: 26px;
    }
  }

  /deep/ &.el-input--small {
    .el-input-group__append {
      height: 22px;
    }
  }

  /deep/ &.el-input--mini {
    .el-input-group__append {
      height: 18px;
    }
  }

  /deep/ .el-input__inner {
    width: 100% !important;
  }

  &__btn {
    width: 100%;
    color: $font-color-primary !important;

    &-search {
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

  &__prepend {
    .lg-icon {
      position: absolute;
      top: 0;
    }
  }

  &__prepend:hover {
    .lg-icon {
      display: none;
    }
  }

  &__icons {
    width: 100%;
    height: 100%;
  }

  &__prepend {
    height: 38px;
    .lg-icon {
      position: absolute;
      top: 0;
    }
  }

  &__prepend:hover {
    .lg-icon {
      display: none;
    }
  }

  &__leaguer {
    color: $font-color-placeholder;
    overflow: hidden;
    display: inline-flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-bottom-right-radius: $border-radius-small;
    border-top-right-radius: $border-radius-small;

    > span {
      display: inline-flex;
      align-items: center;
      flex: 1;
      justify-content: center;
    }

    &-trigger {
      width: 100%;
      max-width: 210px!important;
      box-sizing: border-box;
      color: $font-color-primary !important;
      @include ellipsis(1);

      > span {
        width: 100%;
        max-width: 208px!important;
        box-sizing: border-box;
        overflow: hidden;

        > div {
          padding: 2px;
          background-color: $color-warning;
          position: absolute;
          top: 0;
          left: 0;
          border-bottom-right-radius: $border-radius;
          color: $color-white;
          font-size: $font-size-mini;
        }
      }

      &:hover,
      &--active {
        padding: 7px 13px;
        margin: 4px !important;
        max-width: 200px!important;
        // stylelint-disable-next-line
        background-color: #EBF3FD !important;
      }


    }

    // /deep/ .ych-read-card__leaguer-msg {
    //   padding: 0;
    // }
    &-logout {
      font-size: $font-size-special !important;
      width: 60px!important;
      margin: 0!important;
      padding: 0;
      border-left: 1px solid $border-color!important;
      text-align: center;
      cursor: pointer;
      color: $color-danger!important;
      background-color: $color-bg-regular!important;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      &:hover {
        background-color: $color-danger!important;
        color: $color-white!important;
      }

      &-number  {
        font-size: $font-size-mini !important;
      }
      // border-left: 1px solid $border-color!important;
    }
  }

  [class*=ych-icon-] {
    // stylelint-disable-next-line
    font-size: 26px;
    height: 100%;
    display: inline-flex;
    align-items: center;
    color: rgba($color-primary, .5);
    padding: 0 5px;
    &.type--active {
      color: $color-primary;
    }
  }
}

.ych-read-card--member,
.ych-read-card--idcard {
  /deep/ .el-input-group__append {
    display: table-cell;
    border-left: 1px solid $border-color;
  }

  /deep/ .el-input__inner {
    display: none;
  }
}

.ych-read-card--keyboard {
  /deep/ .el-input-group__append {
    width: 60px;
    display: table-cell;
    // border: 1px solid $border-color;
    border: 0;
  }

  // /deep/ .el-input__inner {
  //   display: none;
  // }
}

.ych-read-card--exist {
  /deep/ .el-input__inner {
    display: none;
  }
  /deep/ .el-input-group__append {
    width: 100%;
    border: 1px solid $border-color;
  }
  // /deep/ .el-input-group__prepend {
  //   background-color: $color-bg-table;
  // }
  &:hover {
    /deep/ .el-input-group__append {
      background-color: $color-white;
    }
  }
}

.error-msg {
  color: $color-danger;
}

// .leaguer-card {
//   // position: absolute;
//   // right: 0;
// }


</style>

<style lang="scss">
.ych-read-card {

  &.el-input--medium {
    .el-input-group__append {
      height: 36px;
    }
  }

  &.el-input--small {
    .el-input-group__append {
      height: 32px;
    }
  }

  &.el-input--mini {
    .el-input-group__append {
      height: 28px;
    }
  }
}

.ych-read-card__leaguer-msg {
  padding: 0 !important;
}
</style>

