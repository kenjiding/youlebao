<template>
  <ych-page class="more-page">
    <el-row
      slot="extend"
      class="page-extend">
      <el-col
        :span="8"
        class="business-name">
        <i class="ych-icon-mendian"/>
        <span>{{ userInfo.BusinessName }}</span>
      </el-col>
      <el-col
        :span="10"
        class="has-hover"
        @click.native="passWordDialogVisible = true">
        <i class="ych-icon-account"/>
        <span>{{ userInfo.RealName }}</span>
        <span class="change-pwd">(修改密码)</span>
      </el-col>
    </el-row>
    <el-card class="card-wrap">
      <div class="top">
        <div class="title">收银台设置</div>
        <div class="setting-list">
          <el-card
            v-for="item in cashSettingList"
            :key="item.type"
            shadow="hover"
            class="setting-item"
            @click.native="settingDialog(item.type)">
            <ych-svg-icon
              :icon-name="item.type"
              width="100px"
              class="icon"
            />
            <span>{{ item.name }}</span>
          </el-card>
        </div>
        <div class="title">常用功能</div>
        <div class="setting-list">
          <el-card
            v-for="item in commonUseList"
            :key="item.type"
            shadow="hover"
            class="setting-item"
            @click.native="clickHandle(item)">
            <ych-svg-icon
              :icon-name="item.type"
              class="icon"
            />
            <span>{{ item.name }}</span>
          </el-card>
        </div>
      </div>
      <div class="bottom">
        <div>
          客服电话：400-9999-261
        </div>
        <el-button
          type="primary"
          plain
          @click="execTvm">
          远程助手
        </el-button>
        <span>系统版本号：{{ version }}</span>
      </div>
    </el-card>
    <PrintSetting
      :print-dialog-visible.sync="printDialogVisible"
    />
    <CommonSetting
      :common-dialog-visible.sync="commonDialogVisible"
    />
    <ChangePassWord
      :pass-word-dialog-visible.sync="passWordDialogVisible"
    />
    <AddClearCoinLog
      :log-index-visible.sync="logIndexVisible"/>
  </ych-page>
</template>

<script type="text/javascript">
/* eslint-disable import/no-extraneous-dependencies */
import { exec } from 'child_process';
import { remote } from 'electron';
import path from 'path';
import { mapState, mapGetters } from 'vuex';
import { keyByName as menuRulesByName } from '@/config/datas/menu-permissions-map';
import AddClearCoinLog from '@/components/coin-machine/AddClearCoinLog.vue';

import PrintSetting from '../_components/PrintSetting.vue';
import CommonSetting from '../_components/CommonSetting.vue';
import ChangePassWord from '../_components/ChangePassWord.vue';


export default {
  name: 'More',
  components: {
    PrintSetting,
    CommonSetting,
    ChangePassWord,
    AddClearCoinLog,
  },
  data() {
    return {
      cashSettingList: [
        {
          name: '通用设置',
          type: 'general-setting',
        },
        {
          name: '打印设置',
          type: 'printer-setting',
        },
        // {
        //   name: '收银初始化',
        //   type: 'cashier-init',
        // },
      ],
      commonUseList: [
        // {
        //   name: '彩票暂存',
        //   type: 'lottery-staging',
        // },
        {
          name: '出币异常处理',
          type: 'outcoin-error',
        },
        {
          name: '加币清币',
          type: 'add-clear-coin',
        },
      ],
      printDialogVisible: false,
      commonDialogVisible: false,
      passWordDialogVisible: false,
      logIndexVisible: false,
    };
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.info,
    }),

    ...mapGetters({
      openMenu: 'menu/openMenus',
    }),

    cashSettingFiltered() {
      return this.cashSettingList
        .filter(item => this.openMenu.includes(Number(menuRulesByName[item.type])));
    },
    commonUseFiltered() {
      return this.commonUseList
        .filter(item => this.openMenu.includes(Number(menuRulesByName[item.type])));
    },
    version() {
      return remote.app.getVersion();
    },
  },

  mounted() {},
  methods: {
    clickHandle(item) {
      this.$authorization(Number(menuRulesByName[item.type])).then((res) => {
        if (!res) return;
        const operation = {
          'outcoin-error': this.outCoinLog,
          'add-clear-coin': this.addCoinLog,
        };

        operation[item.type] && operation[item.type]();
      });
    },
    outCoinLog() {
      this.$createOutCoinLog();
    },
    addCoinLog() {
      this.logIndexVisible = true;
    },
    settingDialog(type) {
      this.$authorization(Number(menuRulesByName[type])).then((res) => {
        if (!res) return;
        if (type === 'general-setting') {
          this.commonDialogVisible = true;
        } else if (type === 'printer-setting') {
          this.printDialogVisible = true;
        }
      });
    },

    execTvm() {
      const cmdPath = path.join(__static, 'exe');
      const cmdStr = 'start TMV.exe';
      exec(cmdStr, {
        cwd: cmdPath,
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/theme.scss';
@import "@/styles/mixins.scss";
.page-extend {
  line-height: 50px;
  color: $color-white;
  padding-left: 35px;
  $four-size: 4px;
  .business-name {
    margin-right: 10px;
    display: flex!important;
    @include ellipsis(1);
  }
  .has-hover  {
    cursor: pointer;
    display: flex;
    -webkit-app-region: no-drag;
    white-space: nowrap;
    &:hover {
      .change-pwd {
        color: $color-white;
      }
    }
  }
  i {
    font-size: $font-size-regular + $four-size;
    color: $color-white;
    margin-right: 8px;
  }
  .change-pwd {
    margin-left: 5px;
    color: rgba($color-white, .5);
    font-size: $font-size-special;
  }
}
.title {
  color: $font-color-regular;
  font-size: $font-size-primary;
  padding: 0 0 10px 10px;
}
.card-wrap {
  height: 100%;
  box-sizing: border-box;
  /deep/ .el-card__body {
    display: flex;
    height: calc(100% - 40px);
    flex-direction: column;
    justify-content: space-between;
  }
}
.setting-list {
  display: flex;
  margin-bottom: 10px;
}
.setting-item {
  width: 200px;
  height: 200px;
  margin: 0 10px 10px 0;
  /deep/ .el-card__body {
    height: 200px;
    padding: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > span {
      color: $font-color-primary;
      font-size: $font-size-primary;
    }
  }
}
.bottom {
  display: flex;
  align-items: center;
  > div {
    width: 320px;
    height: 50px;
    line-height: 50px;
    margin-right: 10px;
    text-align: center;
    font-size: $font-size-regular;
    color: $font-color-regular;
    border: 1px solid $border-color;
    border-radius: $border-radius-small;
  }
  > span {
    font-size: $font-size-primary;
    color: $font-color-placeholder;
  }
  .el-button--primary {
    width: 180px;
    height: 50px;
    margin-right: 30px;
  }
}

.icon {
  margin-bottom: 25px;
}
</style>
