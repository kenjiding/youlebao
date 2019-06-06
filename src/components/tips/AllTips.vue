<template>
  <el-dialog
    :visible="tipsVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="全部通知"
    class="dialog"
    width="600px"
    @close="closeDialog"
    @open="openDB">
    <div class="wrap">
      <div class="content">
        <div
          v-for="item in onePageData"
          :key="item.ID"
          class="content-item">
          <p class="left">
            <i
              :style="{color: tipsType(item.MsgLevel)}"
              class="ych-icon-duanxin"/>
          </p>
          <div class="right">
            <p>{{ item.Content }}</p>
            <p>{{ item.Time }}</p>
          </div>
        </div>

      </div>
      <div class="footer">
        <el-pagination
          :total="allData.length"
          :page-size="10"
          background
          layout="prev, pager, next"
          @current-change="getData"/>
      </div>
    </div>

  </el-dialog>
</template>

<script>
// import DB from '../indexedDB';

export default {
  name: '',

  props: {
    tipsVisible: {
      type: Boolean,
      default: false,
    },

  },

  data() {
    return {
      onePageData: [],
      DBObject: null,
      allData: [],
    };
  },

  methods: {
    openDB() {
      // if (this.DBObject) return;
      const indexedDBObj = window.indexedDB.open('tips_v1.1', 1);
      indexedDBObj.onsuccess = (e) => {
        this.DBObject = e.target.result;
        this.allTipsData();
      };
    },

    allTipsData() {
      const objectStore = this.DBObject.transaction('tipsStore').objectStore('tipsStore');

      objectStore.getAll().onsuccess = (e) => {
        this.allData = e.target.result;
        this.onePageData = this.allData.slice(0, 10);
      };
    },
    getData(val) {
      this.onePageData = this.allData.slice((val - 1) * 10, val * 10);
    },

    tipsType(type) {
      const obj = {
        Warning: '#F5A623',
        Emergency: '#E54B5E',
        Message: '#328BEB',
      };
      return obj[type];
    },
    closeDialog() {
      this.$emit('update:tipsVisible', false);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.dialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }

  /deep/ .el-dialog__header {
    padding: 10px 0 10px 20px;
    border-bottom: 1px solid $border-color;

    .el-dialog__headerbtn {
      margin-top: -5px;
    }
  }
}


.wrap {
  width: 100%;
}

.top {
  height: 30px;
  padding: 0 10px;
  border-bottom: 1px solid $border-color;

  span {
    display: inline-block;
    width: 50%;
    text-align: left;

    &:nth-child(2) {
      color: $color-primary;
      text-align: right;
      cursor: pointer;
    }
  }
}

.footer {
  height: 55px;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  color: $color-primary;
  border-top: 1px solid $border-color;

  &:hover {
    cursor: pointer;
  }
}

.content {
  width: 100%;
  height: 400px;
  overflow: auto;

  &-item {
    height: 70px;
    border-bottom: 1px solid $border-color;

    .left {
      width: 10%;
      float: left;
      height: 100%;

      i {
        display: inline-block;
        line-height: 70px;
        // stylelint-disable-next-line
        font-size: 35px;
        margin-left: 15px;
      }
    }

    .right {
      width: 88%;
      height: 100%;
      float: left;
      padding: 8px 10px 8px 0;
      box-sizing: border-box;
      background-color: $color-white;

      p {
        &:nth-child(1) {
          line-height: 18px;
          height: 35px;

          @include ellipsis(2);
        }

        &:nth-child(2) {
          height: 23px;
          line-height: 23px;
          font-size: $font-size-special;
          color: $font-color-placeholder;
        }
      }
    }
  }
}
</style>
