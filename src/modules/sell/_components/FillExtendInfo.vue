<template>
  <el-dialog
    :visible="visible"
    title="请输入购票信息"
    width="500px"
    class="fill-extend-dialog"
    append-to-body
    @close="handleClose"
    @open="onLoad">
    <el-form
      ref="form"
      :model="extendInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="right">
      <div class="fill-extend-form">
        <el-form-item
          v-if="needValidateItems['IsName']"
          label="姓名:"
          prop="leaguerName">
          <el-input
            v-model="extendInfo.leaguerName"/>
        </el-form-item>
        <el-form-item
          v-if="needValidateItems['IsPhone']"
          label="手机号:"
          prop="leaguerPhone">
          <el-input
            v-model="extendInfo.leaguerPhone"/>
        </el-form-item>
        <el-form-item
          v-if="needValidateItems['IsIDCard']"
          label="身份证号:"
          prop="leaguerIDCard">
          <el-input
            v-model="extendInfo.leaguerIDCard"
            class="input-special">
            <el-button
              slot="append"
              class="append-button"
              @click="readIDCardClick">
              读卡
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="needValidateItems['IsBirthday']"
          label="生日:"
          prop="leaguerBirthday">
          <el-date-picker
            v-model="extendInfo.leaguerBirthday"/>
        </el-form-item>
        <el-form-item
          v-if="needValidateItems['IsSex']"
          label="性别:"
          prop="leaguerSex">
          <el-select
            v-model="extendInfo.leaguerSex">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FillExtendInfo',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    leaguer: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      extendInfo: {
        leaguerName: '',
        leaguerPhone: '',
        leaguerIDCard: '',
        leaguerBirthday: '',
        leaguerSex: '',
      },
      sexOptions: [{
        value: 'Boy',
        label: '男',
      }, {
        value: 'Girl',
        label: '女',
      },
      // {
      //   value: 'Unknow',
      //   label: '未知',
      // }
      ],
    };
  },

  computed: {
    ...mapGetters({
      needValidateItems: 'gobalConfig/getTicketRegister',
    }),

    rules() {
      const validateIDCard = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
          callback(new Error('请输入正确的身份证号!'));
        } else {
          callback();
        }
      };

      return {
        leaguerName: [
          { required: this.needValidateItems.IsName, message: '请输入会员姓名', trigger: 'blur' },
        ],
        leaguerPhone: [
          {
            required: this.needValidateItems.IsPhone, message: '请输入会员手机号', trigger: 'blur', pattern: /^1\d{10}$/,
          },
        ],
        leaguerIDCard: [
          {
            required: this.needValidateItems.IsIDCard, message: '请读取会员身份证', trigger: 'blur',
          },
          { validator: validateIDCard, trigger: 'blur' },
        ],
        leaguerBirthday: [
          { required: this.needValidateItems.IsBirthday, message: '请输入会员生日', trigger: 'blur' },
        ],
        leaguerSex: [
          { required: this.needValidateItems.IsSex, message: '请选择会员性别', trigger: 'blur' },
        ],
      };
    },
  },

  methods: {
    onLoad() {
      if (this.leaguer.ID) {
        this.extendInfo.leaguerName = this.leaguer.RealName;
        this.extendInfo.leaguerPhone = this.leaguer.Phone;
        this.extendInfo.leaguerIDCard = this.leaguer.IDCard;
        this.extendInfo.leaguerBirthday = this.leaguer.Birthday;
        this.extendInfo.leaguerSex = this.leaguer.Sex === 'Unknow' ? '' : this.leaguer.Sex;
      }
    },

    handleClose() {
      // this.$refs.form.resetFields();
      this.extendInfo.leaguerName = '';
      this.extendInfo.leaguerPhone = '';
      this.extendInfo.leaguerIDCard = '';
      this.extendInfo.leaguerBirthday = '';
      this.extendInfo.leaguerSex = '';
      this.$emit('close');
    },

    readIDCardClick() {
      const idCardInfo = this.$device.readIDCard();
      this.extendInfo.leaguerIDCard = idCardInfo.idCardNum;
      this.extendInfo.leaguerName = idCardInfo.name;
      this.extendInfo.leaguerBirthday = idCardInfo.birthday;
      this.extendInfo.leaguerSex = idCardInfo.sex === '2' ? 'Girl' : 'Boy';
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        const jsonExtendInfo = {};
        if (this.needValidateItems.IsName) {
          jsonExtendInfo.PackageTicketRegister_Name = this.extendInfo.leaguerName;
        }
        if (this.needValidateItems.IsSex) {
          jsonExtendInfo.PackageTicketRegister_Sex = this.extendInfo.leaguerSex;
        }
        if (this.needValidateItems.IsBirthday) {
          jsonExtendInfo.PackageTicketRegister_Birthday = this.extendInfo.leaguerBirthday;
        }
        if (this.needValidateItems.IsIDCard) {
          jsonExtendInfo.PackageTicketRegister_IDCard = this.extendInfo.leaguerIDCard;
        }
        if (this.needValidateItems.IsPhone) {
          jsonExtendInfo.PackageTicketRegister_Phone = this.extendInfo.leaguerPhone;
        }
        this.$emit('submit', JSON.stringify(jsonExtendInfo));
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/styles/theme.scss';

  .fill-extend {
    width: 370px;
    height: 480px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      padding: 0 20px;

      .input-special {
        width: 320px;

        /deep/ .el-input__inner {
          width: 274px;
        }

        .append-button {
          width: 46px;
          padding: 0;
          color: $font-color-secondary;
        }
      }

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input__inner {
        width: 320px;
      }
    }
  }

  .fill-extend-dialog {
    margin-bottom: 0;
    $two-px:2px;

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
