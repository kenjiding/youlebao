<template>
  <el-container class="main-container">
    <el-aside
      class="main-menu"
      width="80px">
      <Menu/>
      <div
        class="main-setting"
        @click="changePeriod">
        <span >账期</span>
        <span>{{ currentPeriodName }}</span>
      </div>
    </el-aside>
    <el-container>
      <el-header
        class="main-header">
        <second-menu/>
        <div
          class="iconWrap">
          <GlobalMachaineIcon/>
          <el-badge
            :is-dot="isFirstUseKeFu === 'unused'"
            class="kefu-badge">
            <i
              class="ych-icon-kefu kefu-icon"
              @click="showJiaXinService"/></el-badge>

          <tips
            class="tips"/>
        </div>
      </el-header>
      <el-main class="main-views">
        <control-bar/>
        <transition name="fade-transverse">
          <keep-alive :max="10">
            <router-view/>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
    <PeriodList
      :current-sys-date="currentSysDate"
      :current-period.sync="currentPeriod"
      :period-list="periodList"
      :dialog-visible="dialogVisible"
      :period-list-loading.sync ="periodListLoading"
      @closeLoginPeriod="closeLoginPeriod"
      @getPeriod="getPeriod"
      @close-dialog="dialogVisible = false"/>
    <LoginPeriodDialog
      :current-sys-date="currentSysDate"
      :current-period="currentPeriod"
      :login-period-visible="loginPeriodVisible"
      @changePeriod="changePeriod"
      @close-dialog="closeLoginPeriod"/>
  </el-container>
</template>

<script type="text/javascript">

import { mapActions, mapState } from 'vuex';
import GlobalMachaineIcon from '@/components/coin-machine/GlobalMachaineIcon.vue';
import Tips from '@/components/tips/index.vue';
import { keyByName as menuRulesByName } from '@/config/datas/menu-permissions-map';

import Menu from '../_components/Menu.vue';
import SecondMenu from '../_components/SecondMenu.vue';
import ControlBar from '../_components/ControlBar.vue';
import PeriodList from '../_components/PeriodList.vue';
import LoginPeriodDialog from '../_components/LoginPeriodDialog.vue';

export default {
  name: 'Main',
  components: {
    Menu,
    ControlBar,
    SecondMenu,
    PeriodList,
    GlobalMachaineIcon,
    LoginPeriodDialog,
    Tips,
  },
  data() {
    return {
      dialogVisible: false,
      loginPeriodVisible: false,
      currentPeriod: '',
      periodList: [],
      currentSysDate: '',
      isCanChoosePeriod: false,
      periodListLoading: false,
      isFirstUseKeFu: 'unused',
    };
  },
  computed: {
    ...mapState({
      isLogin: state => state.route.name === 'login',
      userInfo: state => state.user.info,
    }),
    currentPeriodName() {
      const temp = (this.periodList || []).find(item => item.Text === this.currentPeriod);
      const periodName = this.isCanChoosePeriod ? '-' : this.currentPeriod;
      return (temp || {}).Text || periodName;
    },
  },
  created() {
    this.listenWindowResize();
  },
  mounted() {
    setTimeout(() => this.getPeriod(false), 1000);
    this.isFirstUseKeFu = localStorage.getItem('kefu') || 'unused';
  },

  methods: {
    ...mapActions([
      'listenWindowResize',
    ]),
    showJiaXinService() {
      window.jiaxinTogglerDiv();
      localStorage.setItem('kefu', 'used');
      this.isFirstUseKeFu = 'used';
    },
    closeLoginPeriod() {
      this.loginPeriodVisible = false;
    },
    changePeriod() {
      this.$authorization(Number(menuRulesByName['select-period'])).then((res) => {
        if (!res) return;
        this.dialogVisible = true;
      });
    },
    getPeriod(hasRefresh) {
      this.$api['main/period/getLoginPeriod']({
        IsContainCurrSysDate: true,
      }).then((res) => {
        this.periodListLoading = false;
        this.currentPeriod = res.CurrentPeriod;
        this.currentSysDate = res.CurrentSysDate;
        this.isCanChoosePeriod = res.IsCanChoosePeriod;
        this.periodList = res.PeriodList;
        if (res.CurrentPeriod !== res.CurrentSysDate && !hasRefresh) {
          this.loginPeriodVisible = true;
        }
      }, () => {
        this.periodListLoading = false;
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';

// 修改该class时，注意ych-page的extend插槽的宽度计算
.iconWrap {
  overflow: hidden;
  width: 230px;
  margin-right: 137px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kefu-icon {
  color: rgba($color-white, .5);
  cursor: pointer;
  -webkit-app-region: no-drag;
  &:hover {
    color: $color-white;
  }
}
.kefu-badge {
  margin-right: -45px;
  /deep/ .is-fixed {
    top: 2px;
    right: 10px;
    height: 5px;
    width: 5px;
  }
}
.tips {

  width: 24px;
  cursor: pointer;
  -webkit-app-region: no-drag;

  /deep/ .is-fixed {
    right: 11px;
    top: 5px;
    height: 5px;
    width: 5px;
    padding: 0;
  }

  /deep/ .ych-icon-tixing {
    // stylelint-disable-next-line
    font-size: 27px;
    color: rgba(255, 255, 255, .5);

    &:hover {
      color: $color-white;
    }
  }
}

.main-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $color-regular;
  -webkit-app-region: drag;
}

.main-views {
  padding: 0;
  overflow: inherit;
}

.main-setting {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  cursor: pointer;
  font-size: $font-size-mini;
  color: $color-white;
  transition: .2;
  position: relative;
  -webkit-app-region: no-drag;
  &:hover {
    background-color: rgba($color-black, .2);
  }
  span {
    &:first-child {
      margin-bottom: 5px;
      color: rgba($color-white, .5);
    }
    &:first-child::after {
      content: '';
      display: inline-block;
      vertical-align: middle;
      width: 18px;
      margin-left: 2px;
      height: 1px;
      background-color: rgba($color-white, .5);
    }
    &:first-child::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      width: 18px;
      margin-right: 2px;
      height: 1px;
      background-color: rgba($color-white, .5);
    }
  }
}

.main-header {
  display: flex;
  justify-content: space-between;
  height: 50px !important;
  width: 100%;
  background-color: $color-regular;
  padding: 0;
  padding-left: 10px;
  -webkit-app-region: drag;
}
</style>
