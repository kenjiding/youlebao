<template>
  <el-dialog
    :visible="dialogVisible"
    :append-to-body="true"
    class="dialog-wrap"
    title="退票"
    width="500px"
    @close="$emit('update:dialogVisible', false)">
    <el-form>
      <el-form-item
        label="套票："
        label-width="100px">
        <el-input
          v-model="formData.PackageTicketName"
          disabled/>
      </el-form-item>
      <el-form-item
        label="退票数量："
        label-width="100px">
        <el-input
          v-model="formData.Amount"
          disabled/>
      </el-form-item>
      <el-form-item
        label="原收总金额："
        label-width="100px">
        <el-input
          v-model="formData.OriginalTotal"
          disabled/>
      </el-form-item>
      <el-form-item
        label="退票手续费："
        label-width="100px">
        <el-input-number
          v-model="formData.Fee"
          :controls="false"
          :max="10000"
          class="input-number"/>
      </el-form-item>
      <el-form-item
        label="应退金额："
        label-width="100px">
        <el-input
          v-model="returnMoney"
          disabled/>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer">
      <el-button
        :loading="buttonStatus"
        type="primary"
        @click="postRefund">确定退票</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    packageLog: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {
        Amount: '',
        Fee: '',
        OriginalTotal: '',
        PackageTicketName: '',
        ReturnPrice: '',
      },
      buttonStatus: false,
    };
  },
  computed: {
    returnMoney() {
      return this.formData.OriginalTotal - this.formData.Fee;
    },
    idArr() {
      return this.packageLog.map(item => item.SaleLogID);
    },
  },

  watch: {
    dialogVisible(val) {
      val && this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    postRefund() {
      if (this.formData.Fee === '') {
        this.$message({
          message: '请填写退票手续费',
          type: 'warning',
        });
        return;
      }
      this.buttonStatus = true;
      this.$api['ticket/ticket/ticketOverdue']({
        PackageSaleLogIds: this.idArr,
        Fee: this.formData.Fee,
      }, {
        errorCodeIgnore: ['22014'],
      }).then(() => {
        this.$emit('update:dialogVisible', false);
        this.$emit('update-table');
        this.buttonStatus = false;
        this.$message({
          message: '退票成功',
          type: 'success',
        });
      }, (res) => {
        if (res.ResponseStatus.ErrorCode === '22014') {
          this.$confirm(`${res.ResponseStatus.Message}，是否强制退票？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            const msgInstance = this.$message({
              message: '正在强制退票中...',
              type: 'warning',
              duration: 0,
            });
            this.$api['ticket/ticket/ticketOverdueForce']({
              PackageSaleLogIds: this.idArr,
              Fee: this.formData.Fee,
            }).then(() => {
              msgInstance.close();
              this.$message({
                message: '强制退票成功',
                type: 'success',
              });
              this.$emit('update:dialogVisible', false);
            }, () => {
              msgInstance.close();
            }).catch(() => {
              msgInstance.close();
            });
          });
        }
        this.buttonStatus = false;
      });
    },
    getData() {
      this.$api['ticket/ticket/getTicketOverdueDetail']({
        PackageSaleLogIds: this.idArr,
      }).then((res) => {
        Object.assign(this.formData, res);
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/theme.scss";

.input-number {
  width: 100%;

  /deep/ .el-input {
    input {
      text-align: left;
    }
  }

}

.dialog-wrap {
  /deep/ .el-dialog {
    border-radius: $border-radius;
  }

  /deep/ .el-dialog__body{
    padding-right: 40px;
    padding-bottom: 0;
  }

  /deep/ .dialog-footer {
    text-align: center;

    .el-button--primary {
      width: 180px;
    }
  }
}
</style>
