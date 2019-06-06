<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员漫游"
    top="12vh"
    width="800px"
    class="leaguer-roam-dialog"
    @close="handleClose"
    @open="onLoad">
    <leaguer-roam
      ref="leaguerRoam"
      class="dialog-content"/>
  </el-dialog>
</template>

<script>
import LeaguerRoam from '../_components/LeaguerRoam.vue';

export default {
  name: 'LeaguerRoamDialog',

  components: {
    LeaguerRoam,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isCreate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      localVisible: false,
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.localVisible;
      },

      set(val) {
        this.localVisible = val;
        this.$emit('update:visible', val);
      },
    },
  },

  watch: {
    visible(val) {
      this.localVisible = val;
    },
  },

  mounted() {
    this.isCreate && (this.localVisible = true);
  },

  methods: {
    onLoad() {
      this.$nextTick(() => {
        this.$refs.leaguerRoam.readCard();
      });
    },

    handleClose() {
      this.$refs.leaguerRoam.logout();
      this.$emit('close');
      this.remove && this.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.leaguer-roam-dialog {
  margin-bottom: 0;
  $two-px:2px;

  .dialog-content{
    top: 0 !important;
    border-radius: $border-radius;
  }

  /deep/ .el-dialog__header {
    height: 50px;
    padding: 0;
    border-bottom: 1px $border-color solid;
  }

  /deep/ .el-dialog__title {
    padding-left: 30px;
    line-height: 50px;
    font-size: $color-bg-primary + $two-px;
    color: $font-color-regular;
  }

  /deep/ .el-dialog__body {
    padding: 20px;
    position: relative;
  }

  /deep/ .el-dialog__footer {
    height: 60px;
    padding: 10px 30px;
    border-top: 1px $border-color solid;

    .el-button {
      width: 120px;
    }
  }
}
</style>
