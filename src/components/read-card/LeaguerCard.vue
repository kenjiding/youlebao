<template>
  <div class="leaguer-card">
    <div class="leaguer-card__info">
      <div class="leaguer-card__portrait">
        <span class="leaguer-card__portrait-img">
          <img
            v-if="leaguerInfo.LeaguerPhoto"
            :src="imgSrc">
          <img
            v-else
            src="../../assets/read-card-img.png">
        </span>
      </div>

      <div class="leaguer-card__msg">
        <div class="leaguer-card__msg-top">
          <el-tooltip
            :content="leaguerInfo.RealName"
            class="item"
            effect="dark"
            placement="bottom-end">
            <span class="leaguer-card__realname">{{ leaguerInfo.RealName }}</span>
          </el-tooltip>

          <el-button
            size="mini"
            type="text"
            @click="jumpInfo">
            详情
          </el-button>
        </div>

        <div class="leaguer-card__msg-bottom">
          <span>
            <i class="el-icon-phone"/>
            {{ leaguerInfo.Phone }}
          </span>
          <span>
            <i class="ych-icon-member-card"/>
            {{ leaguerInfo.LeaguerCode }}
          </span>
        </div>
      </div>

      <div class="leaguer-card__float">
        <span class="leaguer-card__level-name">
          {{ leaguerInfo.LeaguerLevelName }}
        </span>
        <span class="leaguer-card__level-name-triangle"/>
        <span v-if="birthdayDistance <= 7 && leaguerInfo.Birthday">
          {{ birthdayDistance === 0 ? '今天生日' : `还有  ${birthdayDistance} 天生日` }}</span>
      </div>
    </div>
    <div class="leaguer-card__values">
      <el-row
        v-for="(value, index) in leaguerValues"
        :key="index"
        :gutter="10">
        <el-col
          v-for="item in value"
          :key="item.ValueCode"
          :span="12">
          <div class="leaguer-card__values-item">
            <span>{{ item.ValueName }}</span>
            <span>{{ item.Remain }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { chunk as _chunk } from 'lodash';

export default {
  name: 'LeaguerCard',

  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    leaguerInfo: {
      ID: null,
      LeaguerCode: null,
      LeaguerLevelName: null,
      LeaguerStatus: null,
      RealName: null,
      VerifyTime: null,
      Birthday: null,
      Phone: null,
      LeaguerPhoto: null,
      CardID: null,
      IsUse: false,
      LgValues: [],
    },
  }),

  computed: {
    birthdayDistance() {
      const currentYear = this.$date().year();

      const birthday = this.$date(this.leaguerInfo.Birthday).set('year', currentYear).toDate();
      const now = new Date();

      const days = birthday.getTime() - now.getTime();

      // eslint-disable-next-line
      let instance = Math.ceil(days / (1000 * 60 * 60 * 24));
      if (instance < 0) {
        const isLeapYear = this.$date(currentYear).isLeapYear();
        instance = (isLeapYear ? 366 : 365) + instance;
      }

      return instance;
    },

    leaguerValues() {
      return _chunk(this.leaguerInfo.LgValues, 2);
    },
    imgSrc() {
      return this.leaguerInfo.LeaguerPhoto ? `data:image/png;base64,${this.leaguerInfo.LeaguerPhoto}` : null;
    },
  },

  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(newVal) {
        Object.assign(this.leaguerInfo, newVal || {});
      },
    },
  },

  methods: {
    jumpInfo() {
      this.$router.push({
        path: '/leaguer',
        query: { id: this.leaguerInfo.ID },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';
@import '@/styles/mixins.scss';

$two-px: 2px;

.leaguer-card {
  width: 320px;
  padding: 10px;
  box-sizing: border-box;
  overflow: initial;

  &__info {
    display: flex;
    position: relative;
    width: 100%;
  }

  &__portrait {
    &-img {
      display: inline-block;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border-radius: $border-radius-circle;
      border: 2px solid $font-color-golden;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__msg {
    flex: 1;
    margin-left: 15px;

    &-top {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;

      /deep/ .el-button {
        padding: 0;
        margin-right: 5px;
      }
    }

    &-bottom {
      margin-top: 7px;

      > span {
        width: 100%;
        display: inline-block;
        font-size: $font-size-primary;
        color: $font-color-placeholder;

        &:first-child {
          margin-bottom: 8px;
        }
      }

      i {
        color: $font-color-placeholder;
        // stylelint-disable-next-line
        font-size: 14px;
        margin-right: 5px;
      }
    }
  }

  &__values {
    &-item {
      line-height: 30px;
      // stylelint-disable-next-line
      background-color: #F6F6F6;
      margin-top: 10px;
      padding: 0 10px;
      font-size: $font-size-special;
      color: $font-color-primary;
      box-sizing: border-box;
      display: inline-flex;
      justify-content: space-between;
      width: 100%;

      > span:first-child{
        width: 3.5em;
        margin-right: 5px;
        @include ellipsis;
      }

      > span:last-child {
        font-size: $font-size-regular;
        flex: 1;
        text-align: right;
        @include ellipsis;
      }
    }
  }

  &__float {
    position: absolute;
    left: -14px;
    bottom: 0;
    width: 105%;
    height: 20px;
    line-height: 20px;
    color: $font-color-currency;
    font-size: $font-size-special;
  }

  &__level-name {
    // position: relative;
    background-color: $color-regular;
    display: inline-block;
    width: 140px;
    text-align: center;
    color: $color-white;
    box-sizing: border-box;
    box-shadow: 0 1px 1px rgba($color-black, .2);

    &-triangle {
      width: 0;
      height: 0;
      border-right: 20px solid transparent;
      border-top: 20px solid $color-regular;
      margin-right: 10px;
      position: relative;
      bottom: -16px;
    }
  }

  &__realname {
    width: 140px;
    font-size: $font-size-regular;
    color: $font-color-regular;
    margin-right: 10px;
    @include ellipsis(1);
  }
}

</style>

