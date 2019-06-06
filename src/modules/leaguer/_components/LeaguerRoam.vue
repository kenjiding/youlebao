<template>
  <div
    class="leaguer-roam">
    <no-auth
      v-if="!roamEnabled"
      :title="'未开通会员漫游功能'"
      :content="'本功能可实现不同门店的储值漫游共用（预存款、代币、金币、积分、彩票）。您可以在管理后台-设置-开通漫游功能。'"/>
    <div v-else>
      <div class="leaguer-roam-header">
        <read-card
          ref="cardReader"
          :value="cardKeyValue"
          :auto-logout="false"
          :roam-model="true"
          :placeholder="'会员号/手机号/身份证号'"
          class="read-card"
          @logout="handleReadCardLogout"
          @change="handleReadLeaguer"/>
        <el-button
          :disabled="!hasLeaguer || roaming"
          type="primary"
          @click="submitRoamClick">漫游</el-button>
        <el-button
          :disabled="roaming"
          @click="clearClick">清空</el-button>
        <div class="right-button">
          <el-button
            @click="serverLogsVisible = true"
          >漫游日志
          </el-button>
          <el-button
            @click="logsVisible = true"
          >漫游记录
          </el-button>
        </div>
      </div>
      <div class="leaguer-roam-info">
        <div>会员卡号：{{ leaguerInfo.LeaguerCode }}</div>
        <div>会员名称：{{ leaguerInfo.RealName }}</div>
        <div>会员级别：{{ leaguerInfo.LeaguerLevelName }}</div>
        <div class="div-special">手机号：{{ leaguerInfo.Phone }}</div>
        <div class="div-special">开卡店：{{ leaguerInfo.OpenBusiness }}</div>
        <div>入会时间：{{ leaguerInfo.RegTime }}</div>
      </div>
      <div
        v-show="!roaming"
        class="leaguer-roam-state">
        <i
          v-show="roamSuccess && roamMessage"
          class="el-icon-success leaguer-roam-icon icon-success"/>
        <i
          v-show="!roamSuccess && roamMessage"
          class="el-icon-warning leaguer-roam-icon icon-warning"/>
        <span>{{ roamMessage }}</span>
        <div v-show="roamSuccess">当前会员级别：
          <span class="level-name">{{ leaguerInfo.LeaguerLevelName }}</span>
          <el-button
            style="margin-left: 20px"
            type="text"
            @click="levelChangeVisible = true">修改级别</el-button>
        </div>
      </div>
      <div
        v-show="roaming || valueData.length > 0"
        class="leaguer-roam-list">
        <el-table
          v-loading="roaming"
          :data="groupValues"
          :span-method="arraySpanMethod"
          :summary-method="getSummaries"
          height="300"
          border
          show-summary
          style="width: 100%">
          <el-table-column
            :formatter="roamTypeFormatter"
            header-align="center"
            prop="RoamType"
            width="80"/>
          <el-table-column
            prop="BusinessName"
            label="门店"/>
          <template v-for="type in valueTypeData">
            <el-table-column
              :key="type"
              :label="valueTypeChs[type]"
              header-align="center"
              align="center"
              prop="Values"
              width="100">
              <template slot-scope="scope">
                <span>{{ getValueAmount(scope.row.Values, type) }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
      <roam-logs :visible.sync="logsVisible"/>
      <roam-logs-server :visible.sync="serverLogsVisible"/>
      <level-change
        ref="levelChange"
        :is-create="false"
        :visible.sync="levelChangeVisible"
        :leaguer="leaguerInfo"
        @close="handleLevelChangeClose"
        @complete="handleLevelChangeComplete"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReadCard from '@/components/read-card/ReadCard.vue';
import RoamLogs from '../_components/RoamLogs.vue';
import RoamLogsServer from '../_components/RoamLogsServer.vue';
import LevelChange from '../_components/LevelChange.vue';
import NoAuth from '../_components/NoAuth.vue';

export default {
  name: 'LeaguerRoam',

  components: {
    ReadCard,
    RoamLogs,
    RoamLogsServer,
    LevelChange,
    NoAuth,
  },

  data() {
    return {
      cardKeyValue: '',
      leaguerInfo: {},
      roamSuccess: false,
      roamMessage: '',
      valueData: [],
      valueTypeData: [],
      valueTypeChs: {
        1: '预存款',
        3: '积分',
        401: '金币',
        402: '代币',
        403: '彩票',
      },
      roaming: false,
      roamDataLength: 0,
      localDataLength: 0,
      logsVisible: false,
      serverLogsVisible: false,
      levelChangeVisible: false,
    };
  },

  computed: {
    ...mapGetters({
      extensionModule: 'gobalConfig/getExtensionModule',
    }),

    roamEnabled() {
      return Boolean(this.extensionModule.find(emodule => emodule === 'LeaguerRoam'));
    },

    hasLeaguer() {
      return Boolean(this.leaguerInfo.ID);
    },

    localData() {
      if (this.valueData.length > 0) {
        return this.valueData.filter(row => row.RoamType === 'Local');
      }
      return [];
    },
    roamData() {
      if (this.valueData.length > 0) {
        return this.valueData.filter(row => row.RoamType === 'Roam');
      }
      return [];
    },

    groupValues() {
      if (this.valueData.length > 0) {
        return this.localData.concat(this.roamData);
      }
      return [];
    },
  },

  methods: {
    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.leaguerInfo = leaguer;
      }
    },

    handleReadCardLogout() {
      this.leaguerInfo = {};
      this.clear();
    },

    roamTypeFormatter(cellValue) {
      const type = {
        Roam: '漫入',
        Local: '原储值',
      };
      return type[cellValue.RoamType];
    },

    arraySpanMethod({ rowIndex, columnIndex }) {
      const localDataLength = this.localData.length;
      const roamDataLength = this.roamData.length;
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return [localDataLength || roamDataLength, 1];
        } else if (rowIndex === localDataLength) {
          return [roamDataLength, 1];
        }
        return [0, 0];
      }
      return [1, 1];
    },

    getValueAmount(data, type) {
      if (!data) {
        return '-';
      }
      const value = data.find(row => row.ValueCode === type);
      if (value) {
        return value.Amount;
      }
      return '-';
    },

    getSummaries(param) {
      const { data } = param;
      const totalRow = [];

      // 获取所有储值记录行
      const values = [];
      data.forEach((row) => {
        if (row.Values.length > 0) {
          values.push(...row.Values);
        }
      });

      // 按储值类型归类合计
      this.valueTypeData.forEach((type, index) => {
        let total = 0;
        values.forEach((row) => {
          if (row.ValueCode === type) {
            total += row.Amount;
          }
        });

        if (total) {
          totalRow[index] = total;
        } else {
          totalRow[index] = '-';
        }
      });

      totalRow.unshift('漫入后本店总储值');
      totalRow.unshift('');
      return totalRow;
    },

    submitRoamClick() {
      this.roaming = true;
      this.clear();
      this.$api['leaguer/leaguer/lgValueRoam']({
        LeaguerBaseID: this.leaguerInfo.ID,
      }).then((res) => {
        this.roaming = false;
        this.valueTypeData = res.ShowValueCode;
        this.valueData = res.DataList;
        if (res.ErrorInfo) {
          this.roamSuccess = false;
          this.roamMessage = res.ErrorInfo;
          this.$alert(res.ErrorInfo, '提示', {
            type: 'error',
          });
        } else {
          this.roamSuccess = true;
          this.roamMessage = '漫游成功！';
          this.$message({
            message: '漫游成功',
            type: 'success',
          });
        }
      }, (res) => {
        this.roaming = false;
        if (res.ResponseStatus) {
          this.roamMessage = res.ResponseStatus.Message;
        } else {
          this.$alert('网络异常，请检查网络', '提示', {
            type: 'error',
          });
        }
      });
    },

    clearClick() {
      this.$refs.cardReader.logout();
    },

    clear() {
      this.roamSuccess = false;
      this.roamMessage = '';
      this.valueData = [];
      this.valueTypeData = [];
    },

    readCard() {
      this.$refs.cardReader && this.$refs.cardReader.onRead();
    },

    logout() {
      this.$refs.cardReader && this.$refs.cardReader.logout();
    },

    handleLevelChangeClose() {
      this.levelChangeVisible = false;
    },

    handleLevelChangeComplete() {
      this.readLeaguer(null, this.leaguerInfo.ID);
    },

    readLeaguer(id, leaguerId) {
      this.$api['leaguer/leaguer/getOneLeaguerBaseByCard']({
        DeviceLgID: id,
        VerifyState: false,
        VerifyDate: false,
        VerifyCardState: false,
        LeaguerID: leaguerId,
      }).then((res) => {
        this.leaguerInfo = res || {};
      });
    },
  },

};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.leaguer-roam {
  width: 800px;
  min-height: 570px;
  background-color: $color-white;
  padding-bottom: 30px;
  $two-px: 2px;
  position: absolute;
  top: 80px;
  left: calc(50% - 400px);
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .4);

  &-header {
    height: 40px;
    padding: 20px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    position: relative;

    .right-button {
      position: absolute;
      right: 20px;
    }
  }

  &-info {
    margin: 0 20px;
    background-color: $color-bg-regular;
    padding: 10px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    >div {
      width: 50%;
      height: 40px;
      line-height: 40px;
      font-size: $font-size-primary;
      color: $font-color-primary;
    }

    .div-special {
      width: calc(50% - 14px);
      padding-left: 14px;
    }
  }

  &-state {
    height: 50px;
    padding-left: 30px;
    line-height: 50px;
    font-size: $font-size-primary;
    color: $font-color-primary;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;

    .level-name {
      font-size: $font-size-primary + $two-px;
      color: $font-color-regular;
    }
  }

  &-icon {
    width: 14px;
    height: 14px;
    line-height: 50px;
    margin-right: 5px;
  }

  .icon-success{
    color: $color-success;
  }

  .icon-warning{
    color: $color-warning;
  }

  &-list {
    padding: 0 20px;

    /deep/ .el-table__body {
      font-size: $font-size-primary;
      color: $font-color-primary;
    }

    /deep/ .el-table__header {
      .has-gutter{
        td:first-child {
          border-right: 0;
        }

        th:nth-child(2) {
          .cell {
            position: relative;
            left: -40px;
            text-align: center;
          }
        }
      }
    }

    /deep/ .el-table__row td {
      height: 50px;
    }

    /deep/ .el-table__footer {
      height: 60px;

      .has-gutter{
        td {
          font-size: $font-size-primary + $two-px;
          color: $font-color-primary;
          padding: 0;
        }

        td:first-child {
          border-right: 0;
        }

        td:nth-child(2) {
          .cell {
            position: relative;
            left: -40px;
            text-align: center;
          }
        }
      }
    }
  }

  .read-card {
    width: 320px;
    margin-right: 10px;
  }
}
</style>

