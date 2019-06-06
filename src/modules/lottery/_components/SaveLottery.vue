<template>
  <div class="save-lottery">
    <div class="save-lottery-tips">
      <p>操作指引：</p>
      1.通过碎票机，把彩票存到公共卡；2.读取公共卡，输入暂存票数，把暂存小票给顾客
    </div>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="top">
      <el-row
        type="flex"
        justify="space-between">
        <el-col :span="10">
          <el-form-item
            label="公共卡"
            prop="leaguerCode">
            <el-input
              v-if="leaguerLock"
              v-model="formData.leaguerId"
              disabled/>
            <read-card
              v-else
              ref="cardReader"
              :value="cardKeyValue"
              :auto-logout="false"
              class="read-card"
              @change="handleReadLeaguer"
              @logout="handleReadCardLogout"/>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="现有票数"
            prop="nowValue">
            <el-input-number
              :disabled="true"
              :controls="false"
              :min="0"
              :max="999999"
              v-model="formData.nowValue"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="暂存票数"
        prop="saveValue">
        <el-input-number
          ref="saveValue"
          :controls="false"
          :min="0"
          :max="formData.nowValue"
          v-model="formData.saveValue"
          @focus="handleSaveValueFocus"/>
      </el-form-item>
      <el-form-item
        label="备注"
        class="summary-input"
        prop="summary">
        <el-input
          v-model="formData.summary"/>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';

export default {
  name: 'SaveLottery',

  components: {
    ReadCard,
  },

  props: {
    leaguer: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      cardKeyValue: '',
      formData: {
        leaguerId: '',
        leaguerCode: '',
        nowValue: 0,
        saveValue: '',
        summary: '',
      },
    };
  },

  computed: {
    leaguerLock() {
      return Boolean(this.leaguer.ID);
    },

    rules() {
      const validateValue = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (Number(value) <= 0) {
            callback(new Error('暂存票数必须大于0'));
          }
          if (Number(this.formData.nowValue) < Number(value)) {
            callback(new Error('暂存票数不能大于现有票数'));
          }
          callback();
        }
      };

      const validateNowValue = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (Number(value) <= 0) {
            callback(new Error('现有票数为0,不能暂存彩票'));
          }
          callback();
        }
      };

      return {
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
        ],
        nowValue: [
          { validator: validateNowValue, trigger: 'blur' },
        ],
        saveValue: [
          { required: true, message: '请输入暂存票数', trigger: 'blur' },
          { validator: validateValue, trigger: 'blur' },
        ],
        summary: [
          { required: true, message: '请填写备注', trigger: 'blur' },
        ],
      };
    },
  },

  methods: {
    onLoad() {
      if (this.formData.leaguerId) return;
      if (this.leaguerLock) {
        this.formData.leaguerId = this.leaguer.ID;
        this.formData.leaguerCode = this.leaguer.LeaguerCode;
        this.getLeaguerLottery();
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.formData.leaguerId = leaguer.ID;
        this.formData.leaguerCode = leaguer.LeaguerCode;
        this.getLeaguerLottery();
        this.$refs.saveValue.focus();
      }
    },

    getLeaguerLottery() {
      this.$api['leaguer/leaguer/getLgAccountListByValueTypes']({
        LeaguerID: this.formData.leaguerId,
        ValueTypes: [403],
      }).then((res) => {
        if (res.DataList.length > 0) {
          this.formData.nowValue = res.DataList[0].Remain;
          this.formData.saveValue = res.DataList[0].Remain;
          this.$refs.form.validate();
        }
      });
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
    },

    handleSaveValueFocus(e) {
      e.currentTarget.select();
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$emit('complete');
          return;
        }

        this.$api['lottery/lottery/lotTempStorage']({
          LeaguerID: this.formData.leaguerId,
          StorageNumber: this.formData.saveValue,
          Summary: this.formData.summary,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '彩票暂存成功',
          });
          this.$emit('print', res);
          this.clear();
        }).catch(() => {
          this.$emit('complete');
        });
      });
    },

    clear() {
      this.printData = {};
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
    },
  },

};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .save-lottery {
    padding: 0 10px;

    &-tips {
      padding: 5px;
      margin-bottom: 10px;
      line-height: 20px;
      border-radius: $border-radius;
      background-color: $font-color-currency;
    }

    /deep/ .el-form-item__label {
      padding-bottom: 0;
    }

    .summary-input {
      /deep/ .el-input__inner {
        width: 100%;
      }
    }

    /deep/ .el-input__inner {
      width: 320px;
      text-align: left;
    }
  }

</style>
