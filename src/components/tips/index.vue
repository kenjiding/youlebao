<template>
  <div>
    <el-popover
      v-model="tipsVisible"
      popper-class="global-tips-popover"
      placement="top"
      width="300"
      @show="getNotReadList"
      @hide="alreadyRead">
      <div class="wrap">
        <div class="top">
          <span>通知 ({{ notReadList.length }}条未读)</span>
          <el-button
            type="text"
            @click="alreadyRead">全部标记已读</el-button>
        </div>
        <div class="content">
          <div
            v-for="item in notReadList"
            :key="item.ID"
            class="content-item">
            <p
              class="left">
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
          <el-button
            type="text"
            @click="allTipsVisible = true">查看全部通知</el-button>
        </div>
      </div>
      <el-badge
        slot="reference"
        :is-dot="bellOnMark"
        class="item">
        <i
          class="ych-icon-tixing"/>
      </el-badge>

    </el-popover>
    <AllTips
      :tips-visible.sync="allTipsVisible"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { unionBy } from 'lodash';
import { IS_DEVELOP } from '@/config';

import AllTips from './AllTips.vue';

export default {
  name: '',

  components: {
    AllTips,
  },

  data() {
    return {
      indexDB: null,
      DBObject: null,
      settime: null,
      receivedMsg: null,
      tipsVisible: false,
      allTipsVisible: false,
      notifyObj: null,
      bellOnMark: false,
      notReadList: [],
      globalIndexDB: null,
    };
  },

  computed: {
    ...mapState({
      terminalId: (state) => {
        const termina = state.user.info.Termina;
        return termina ? termina.TerminalId : null;
      },
    }),
  },

  created() {
    this.watchHandle();
  },

  methods: {
    mockApi() {
      let time = 1;
      setInterval(() => {
        this.add({
          Time: `2018/12/1 12:15:${time}`,
          Content: 'uYVNGknkFi',
          MsgType: 'MachineAlarm',
          MsgLevel: 'Watting',
          ID: +new Date(),
          isRead: 'notRead',
        });
        time++;
      }, 1000);
    },
    getNotReadList() {
      if (!this.DBObject) {
        this.indexedDbInit();
        return;
      }

      this.notReadList = [];
      const objectStore = this.DBObject.transaction('tipsStore').objectStore('tipsStore');

      const indexMark = objectStore.index('isRead');

      const request = indexMark.openCursor(IDBKeyRange.only('notRead'));
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          this.notReadList.push(cursor.value);
          cursor.continue();
        } else {
          // 根据时间降序排序
          this.sortTipsList(this.notReadList);
        }
      };
    },
    watchHandle() {
      let watchObj = null;
      watchObj = this.$watch('terminalId', (newVal) => {
        if (!newVal) return;
        this.indexedDbInit();
        watchObj && watchObj();
      }, {
        deep: true,
      });
    },
    tipsType(type) {
      const obj = {
        Warning: '#F5A623',
        Emergency: '#E54B5E',
        Message: '#328BEB',
      };
      return obj[type];
    },

    sortTipsList(sortArr) {
      function transforDate(stringTime) {
        return Date.parse(new Date(stringTime)) / 1000;
      }
      // 根据时间降序排序
      sortArr.sort((a, b) => transforDate(b.Time) - transforDate(a.Time));
    },

    alreadyRead() {
      this.notReadList.forEach((item) => {
        const obj = Object.assign({}, item);
        obj.isRead = 'alreadyRead';
        this.put(obj);
      });
      this.notReadList = [];
      this.bellOnMark = false;
    },

    isHasNotRead() {
      const objectStore = this.DBObject.transaction('tipsStore').objectStore('tipsStore');

      const indexMark = objectStore.index('isRead');

      const request = indexMark.get('notRead');

      request.onsuccess = (e) => {
        const results = e.target.result;

        this.bellOnMark = !!results;

        console.log('铃铛亮：', this.bellOnMark);
      };
    },

    indexedDbInit(storeName = 'tipsStore') {
      this.globalIndexDB = window.indexedDB.open('tips_v1.1', 1);

      this.globalIndexDB.onerror = (e) => {
        console.log('数据库打开出错！', e);
        setTimeout(() => {
          this.indexedDbInit();
        }, 1000);
      };

      this.globalIndexDB.onsuccess = (e) => {
        this.DBObject = e.target.result;
        console.log('数据库打开成功');
        // 收银台打开后，判断是否存在未读信息
        this.isHasNotRead();

        // 数据库打开成功，然后连接websocket
        this.webSocketInit();
        // this.mockApi();

        // 删除一天前的数据
        this.delectOneweekData();
      };

      this.globalIndexDB.onupgradeneeded = (e) => {
        let objectStore = null;
        this.DBObject = e.target.result;

        // 判断一下，这张表格是否存在，如果不存在再新建
        if (!this.DBObject.objectStoreNames.contains(storeName)) {
          // objectStore = this.DBObject.createObjectStore(storeName, { keyPath: 'ID' });
          objectStore = this.DBObject.createObjectStore(storeName, {
            keyPath: 'Num',
            autoIncrement: true,
          });

          objectStore.createIndex('isRead', 'isRead', { unique: false });
        }
      };
    },

    delectOneweekData() {
      const objectStore = this.DBObject.transaction('tipsStore').objectStore('tipsStore');

      objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        let time;
        // const nowTime = this.$date(new Date()).unix();

        if (cursor) {
          time = this.$date(cursor.value.Time).valueOf();

          if (this.isYestday(time)) {
            this.deleteDataItem(cursor.value.Num);
          }
          cursor.continue();
        }
      };
    },

    isYestday(theDate) {
      const date = (new Date()); // 当前时间
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
      return theDate < today;
    },

    deleteDataItem(ID) {
      const request = this.DBObject.transaction(['tipsStore'], 'readwrite')
        .objectStore('tipsStore')
        .delete(ID);

      request.onsuccess = () => {
        console.log('数据删除成功');
      };
    },

    deleteDB(name) {
      window.indexedDB.deleteDatabase(name);
    },

    // 写入数据
    add(data, callback) {
      if (!this.DBObject.objectStoreNames.contains('tipsStore')) {
        return;
      }
      const request = this.DBObject.transaction(['tipsStore'], 'readwrite')
        .objectStore('tipsStore')
        .add(data);

      request.onsuccess = (event) => {
        console.log('数据写入成功', event);
        // 将铃铛点亮的标记
        this.bellOnMark = true;
        callback && callback();
      };

      request.onerror = (event) => {
        console.log('数据写入失败', event, this.receivedMsg.ID);
      };
    },


    // 更新数据
    put(data, callback) {
      if (!this.DBObject.objectStoreNames.contains('tipsStore')) {
        return;
      }

      const request = this.DBObject.transaction(['tipsStore'], 'readwrite')
        .objectStore('tipsStore')
        .put(data);

      request.onsuccess = (event) => {
        console.log('数据更新成功', event);
        callback && callback();
      };

      request.onerror = (event) => {
        console.log('数据更新失败', event);
      };
    },

    selectChange(val) {
      this.$electronStore.set(
        'commonForm',
        Object.assign({ machineWarning: !val }, this.machineWarning),
      );

      if (!val) return;
      this.$alert('您已经关闭机台警告提醒，如需开启请到<通用设置>开启', {
        confirmButtonText: '确定',
      });
    },

    notifyHandle(info) {
      let htmlTemplate = '';
      if (info.MsgType === 'MachineAlarm') {
        htmlTemplate = this.$createElement(
          'el-checkbox',
          {
            style: 'color: teal',
            on: {
              change: this.selectChange,
            },
          },
          '不再提醒',
        );
      }
      this.notifyObj = this.$notify({
        title: info.Content,
        type: 'warning',
        dangerouslyUseHTMLString: true,
        message: htmlTemplate,
      });
    },

    getWsHost() {
      const wsHost = this.$electronStore.get('host') || '';
      const mark = wsHost.lastIndexOf(':') + 1;
      const wsHostPort = Number(wsHost.slice(mark)) + 10000;

      return `ws${wsHost.slice(4, mark)}${String(wsHostPort)}?tid=${this.terminalId}`;
    },

    checkSettingStatus() {
      const commonSetting = this.$electronStore.get('commonForm') || {};

      const value = String(commonSetting.machineWarning);
      const valArr = ['undefined', 'null', '', 'true'];

      return valArr.indexOf(value) > -1;
    },

    webSocketInit() {
      const ws = new WebSocket(this.getWsHost());
      // const ws = new WebSocket('ws://192.168.0.51:19998');

      // 接收服务端数据时触发事件
      ws.onmessage = (evt) => {
        this.receivedMsg = JSON.parse(evt.data);

        console.log('服务端已经接受到数据...', this.receivedMsg, `连接状态${ws.readyState}`);

        Object.assign(this.receivedMsg, {
          isRead: 'notRead',
        });

        if (this.checkSettingStatus() &&
        this.receivedMsg.MsgLevel === 'Emergency') {
          this.notifyHandle(this.receivedMsg);
        }

        this.add(this.receivedMsg);
      };

      // 断开 web socket 连接成功触发事件
      ws.onclose = () => {
        console.log('连接已关闭...', `连接状态${ws.readyState}`);
        if (ws.readyState !== 1 && !IS_DEVELOP) {
          setTimeout(() => {
            this.webSocketInit();
          }, 1000);
        }
      };
    },
  },
};
</script>

<style lang="scss">
//解决消息弹框的默认padding影响布局的问题
.global-tips-popover {
  padding: 0;
}
</style>


<style lang='scss' scoped>
@import "@/styles/theme.scss";
@import "@/styles/mixins.scss";

.wrap {
  width: 100%;
}

.top {
  height: 30px;
  padding: 0 10px 10px;
  border-bottom: 1px solid $border-color;

  span {
    display: inline-block;
    width: 50%;
    text-align: left;
  }

  .el-button--text {
    width: 50%;
    text-align: right;
  }
}

.footer {
  height: 40px;
  box-sizing: border-box;
  text-align: center;
  color: $color-primary;
  border-top: 1px solid $border-color;
}

.content {
  width: 100%;
  height: 400px;
  overflow: auto;

  &-item {
    height: 70px;
    border-bottom: 1px solid $border-color;

    .left {
      width: 20%;
      float: left;
      height: 100%;

      i {
        display: inline-block;
        line-height: 70px;
        font-size: $font-size-bigger;
        margin-left: 15px;
      }
    }

    .right {
      width: 80%;
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
