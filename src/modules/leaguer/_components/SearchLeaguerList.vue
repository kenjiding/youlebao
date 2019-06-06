<template>
  <el-dialog
    :visible.sync="localVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="800px"
    title="查询结果"
  >
    <el-table
      :data="list"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column
        property="OpenBusiness"
        label="开卡商户"
        width="100"/>
      <el-table-column
        property="LeaguerCode"
        label="会员号"
        width="100"/>
      <el-table-column
        property="RealName"
        label="会员姓名"
        width="100"/>
      <el-table-column
        property="Phone"
        label="手机号"
        width="120"/>
      <el-table-column
        property="LeaguerLevelName"
        label="会员级别"
        width="100"/>
      <el-table-column
        property="RegTime"
        label="入会时间"
        width="120"/>
      <el-table-column
        property="IDCard"
        label="身份证"
        width="150"/>
      <el-table-column
        :formatter="cardStatuFormatter"
        property="CardStatu"
        label="卡状态"
        width="80"/>
      <el-table-column
        :formatter="leaguerStatusFormatter"
        property="LeaguerStatus"
        label="会员状态"
        width="80"/>
    </el-table>

    <span slot="footer">
      <el-button
        type="primary"
        @click="handleConfirm">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: 'SearchLeaguerList',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    list: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      currentRow: null,
    };
  },

  computed: {
    localVisible: {
      get() {
        return this.visible;
      },

      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },

  methods: {
    cardStatuFormatter(row) {
      const value = {
        Normal: '正常',
        Disabled: '禁用',
        CardNotFound: '无',
      };
      return value[row.CardStatu];
    },

    leaguerStatusFormatter(row) {
      const value = {
        Normal: '正常',
        Disabled: '禁用',
        Overdue: '已过期',
      };
      return value[row.LeaguerStatus];
    },

    handleCurrentChange(val) {
      this.currentRow = val;
      // this.$emit('confirm', val);
    },

    handleConfirm() {
      if (!this.currentRow) {
        this.$message({
          message: '请选择查询结果',
          type: 'warning',
        });
        return;
      }
      this.$emit('confirm', this.currentRow.ID);
      this.localVisible = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
