<template>
  <ych-page>
    <div class="wrap">
      <div
        ref="searchItem"
        class="top">
        <ych-read-card
          ref="readCardComponent"
          v-model="memberCode"
          class="read-card"
          @change="changeCard"
          @logout="clearData"/>

        <el-input
          v-model="iDCardNumber"
          placeholder="点击读取散客身份证"
          @keyup.enter.native="keyupEnter">
          <el-button
            slot="prepend"
            type="primary"
            icon="ych-icon-id-card"
            @click="readIdCard"/>
        </el-input>
        <el-button
          @click="clearHandle">清空</el-button>
        <el-button
          type="text"
          class="span-right"
          @click="showGiftLog">已赠方案</el-button>
      </div>
      <div
        :style="{height: tableHeight+ 'px'}"
        class="wrap-content">
        <IDCartItem :card-data="customerInfo" />
        <GiftItem
          :id-card="iDCardCode"
          :menber-id="customerInfo.ID"
          @update-data="clearHandle"/>
      </div>
      <GiftCoinDialog
        :dialog-visible.sync="dialogVisible"/>
    </div>
  </ych-page>
</template>

<script>
import { mapState } from 'vuex';
import GiftCoinDialog from '../_components/GiftCoinDialog.vue';
import IDCartItem from '../_components/IDCartItem.vue';
import GiftItem from '../_components/GiftItem.vue';

export default {
  name: '',
  components: {
    IDCartItem,
    GiftItem,
    GiftCoinDialog,
  },

  data() {
    return {
      customerInfo: {},
      memberCode: '',
      iDCardCode: '',
      dialogVisible: false,
      iDCardName: '',
      iDCardNumber: '',
      tableHeight: 0,
    };
  },
  computed: {
    ...mapState({
      pageHeight: state => state.client.pageHeight,
      pageWidth: state => state.client.pageWidth,
    }),
  },
  watch: {
    pageHeight(val) {
      this.tableHeight = val - this.$refs.searchItem.clientHeight;
    },
    pageWidth() {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight;
    },
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.pageHeight - this.$refs.searchItem.clientHeight;
    });
  },
  methods: {
    keyupEnter() {
      if (this.memberCode) this.$refs.readCardComponent.logout();
      this.iDCardCode = this.iDCardNumber;
    },

    clearData() {
      this.customerInfo = {};
      this.iDCardName = '';
      this.iDCardCode = '';
    },
    clearHandle() {
      this.$refs.readCardComponent.logout();
      this.iDCardName = '';
      this.iDCardCode = '';
      this.iDCardNumber = '';
      this.customerInfo = {};
    },
    readIdCard() {
      const data = this.$device.readIDCard();
      this.iDCardNumber = data.idCardNum;
      this.iDCardName = data.idCardNum;
      this.iDCardCode = data.idCardNum;
    },
    changeCard(val) {
      this.customerInfo = val || {};
      this.iDCardCode = '';
      this.iDCardName = '';
    },
    showGiftLog() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.wrap {
  overflow: hidden;
  height: 100%;
  background-color: $color-white;
  border-radius: $border-radius;
}

.wrap-content {
  display: flex;
}

.read-card {
  float: left;
}

.top {
  padding: 10px 20px;
  /deep/ .el-input-group {
    width: 320px;
    $six-size: 6px;

    &:nth-child(1) {
      margin-right: 10px;
    }

    &:nth-child(2) {
      margin-right: 10px;
    }

    .ych-icon-id-card {
      font-size: $font-size-regular + $six-size;
      color: $color-primary;
    }
  }

  span {
    font-family: PingFangSC-Regular;
    font-size: $font-size-primary;
    font-weight: normal;
    font-stretch: normal;
    display: inline-block;
    margin-left: 10px;
    padding: 10px;
  }

  .span-right {
    float: right;
    color: $color-primary;
  }
}

</style>
