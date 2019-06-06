<template>
  <el-dialog
    :visible="visible"
    title="填写入会资料"
    width="800px"
    custom-class="fill-info-dialog"
    @close="handleClose">
    <el-container>
      <el-main class="fill-info-main">
        <!-- <div class="fill-info-main"> -->
        <el-form
          ref="form"
          :model="information"
          :rules="rules"
          :validate-on-rule-change="false"
          label-width="85px">
          <div class="card-left">
            <el-form-item label="会员级别:">
              <el-input
                v-model="information.levelName"
                :disabled="true"/>
            </el-form-item>
            <el-form-item
              label="会员卡号:"
              prop="PrintNumber">
              <el-input
                v-model="information.PrintNumber">
                <el-button
                  slot="append"
                  class="append-button"
                  @click="readCardClick">
                  读卡
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="有效期:">
              <el-input
                v-model="information.term"
                :disabled="true"/>
            </el-form-item>
            <el-form-item
              label="密码:"
              prop="UserPass">
              <el-input
                v-model="information.UserPass"
                type="password"/>
            </el-form-item>
            <el-form-item
              label="确认密码:"
              prop="passwordConfirm">
              <el-input
                v-model="information.passwordConfirm"
                type="password"/>
            </el-form-item>
            <el-form-item
              label="会员名称:"
              prop="ocRealName">
              <el-input
                v-model="information.ocRealName"/>
            </el-form-item>
            <el-form-item
              label="手机号:"
              prop="ocPhone">
              <el-input
                v-model="information.ocPhone"
                type="tel">
                <el-button
                  slot="append"
                  class="append-button"
                  @click="handleValidateClick">
                  验证
                </el-button>
              </el-input>
            </el-form-item>
          </div>
          <div class="card-right">

            <el-form-item
              label="身份证:"
              prop="ocIDCard">
              <el-input
                v-model="information.ocIDCard">
                <el-button
                  slot="append"
                  class="append-button"
                  @click="readIDCardClick">
                  读取
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item
              label="会员性别:"
              prop="ocSex">
              <el-select
                v-model="information.ocSex"
                placeholder="请选择">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item
              label="会员生日:"
              prop="ocBirthday">
              <el-date-picker
                v-model="information.ocBirthday"
                type="date"
                placeholder="请选择日期"/>
            </el-form-item>
            <el-form-item label="会员相片:">
              <div
                class="fill-info-photo"
              >
                <i
                  v-show="!information.leaguerPhotoSrc"
                  class="ych-icon-add icon-add"
                  @click="photographClick"/>
                <img
                  v-show="information.leaguerPhotoSrc"
                  :src="information.leaguerPhotoSrc">
                <el-button
                  v-show="information.leaguerPhotoSrc"
                  icon="ych-icon-close"
                  circle
                  size="mini"
                  type="danger"
                  @click="photoClearClick"/>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </el-main>
      <!-- <el-aside
        width="390px"
        class="fill-info-aside">
        <div class="fill-info-aside-title">入会商品:</div>
        <join-meal-goods
          :meal-goods ="childGoodsList"
          :meal-id="mealGoods.ID"/>
      </el-aside> -->
    </el-container>
    <div
      slot="footer">
      <el-button
        class="footer-button"
        @click="submit">确定</el-button>
        <!-- <el-button class="footer-button">开卡并填写资料</el-button> -->
    </div>

    <!-- <payment
      ref="Payment"
      :visible="paymentVisible"
      :actual-charge="actualCharge"
      :order-id="orderId"
      @close="handlePaymentClose"
      @cancel="handleOrderCancel"
      @complete="handleOrderComplete"/> -->

    <photograph
      ref="Photograph"
      :visible="photographVisible"
      @close="handlePhotographClose"
      @complete="handlePhotographComplete"/>

  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import JoinMealGoods from '@/modules/join/_components/JoinMealGoods.vue';
import Photograph from '@/modules/join/_components/Photograph.vue';
import Payment from '@/components/payment/Payment.vue';

export default {
  name: '',

  components: {
    JoinMealGoods,
    Payment,
    Photograph,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mealGoods: {
      type: Object,
      default: () => [{}],
    },
    needRegister: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      cardKeyValue: '',
      childGoodsList: [],
      needValidateItems: [],
      information: {
        CardID: '',
        ocRealName: '',
        UserPass: '',
        ocPhone: '',
        ocIDCard: '',
        ocSex: '',
        ocBirthday: '',
        PrintNumber: '',


        levelName: '',
        passwordConfirm: '',
        leaguerPhotoSrc: '',
        CardMedia: '',
      },
      sexOptions: [{
        value: '1',
        label: '男',
      }, {
        value: '2',
        label: '女',
      }, {
        value: '-1',
        label: '未选择',
      }],
      paymentVisible: false,
      photographVisible: false,
      actualCharge: 0,
      orderId: '',
    };
  },

  computed: {
    ...mapGetters({
      registerneedValidateItems: 'gobalConfig/getTicketRegister',
    }),
    rules() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (value.length < 6) {
            callback(new Error('密码必须大于6位!'));
          }
          if (this.information.UserPass !== '') {
            this.$refs.form.validateField('passwordConfirm');
          }
          callback();
        }
      };

      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          if (this.information.UserPass !== '') {
            callback(new Error('请再次确认密码!'));
          } else {
            callback();
          }
        } else if (value.length < 6) {
          callback(new Error('密码必须大于6位!'));
        } else if (value !== this.information.UserPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      const validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (!(/^1[0-9]{10}$/.test(value))) {
          callback(new Error('请输入正确的手机号!'));
        } else {
          callback();
        }
      };

      return {

        PrintNumber: [
          { required: true, message: '请读卡', trigger: 'blur' },
          // {
          //   min: 10, max: 15, message: '长度在 10 到 15 个字符', trigger: 'blur',
          // },
        ],
        UserPass: [
          { validator: validatePass, trigger: 'blur' },
        ],
        passwordConfirm: [
          { validator: validatePass2, trigger: 'blur' },
        ],
        ocRealName: [
          {
            required: this.checkFormData('ValidateName', 'IsName'),
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        ocPhone: [
          {
            required: this.checkFormData('ValidatePhone', 'IsPhone'),
            message: '请输入手机号',
            trigger: 'blur',
          },
          { validator: validatePhone, trigger: 'blur' },
        ],
        ocIDCard: [
          {
            required: this.checkFormData('ValidateIDCard', 'IsIDCard'),
            message: '请读取身份证',
            trigger: 'blur',
          },
        ],
        ocSex: [
          {
            required: this.checkFormData('ValidateSex', 'IsSex'),
            message: '请选择性别',
            trigger: 'blur',
          },
        ],
        ocBirthday: [
          {
            required: this.checkFormData('ValidateBirthday', 'IsBirthday'),
            message: '请输入生日',
            trigger: 'blur',
          },
        ],
      };
    },
  },

  watch: {
    visible(val) {
      if (!val) return;
      this.onLoad();
    },
  },

  created() {
    // this.onLoad();
  },

  methods: {
    addString(name, registerName) {
      const obj = {
        ValidateName: {
          1: 'PackageTicketRegister_Name',
          2: 'ocRealName',
        },
        ValidatePhone: {
          1: 'PackageTicketRegister_Phone',
          2: 'ocPhone',
        },
        ValidateSex: {
          1: 'PackageTicketRegister_Sex',
          2: 'ocSex',
        },
        ValidateIDCard: {
          1: 'PackageTicketRegister_IDCard',
          2: 'ocIDCard',
        },
        ValidateBirthday: {
          1: 'PackageTicketRegister_Birthday',
          2: 'ocBirthday',
        },
      };

      const valiName = obj[name][1];
      const formName = obj[name][2];

      if (this.needValidateItems[name] || this.registerneedValidateItems[registerName]) {
        this.information[valiName] = this.information[formName];
      }
    },
    checkFormData(ValidateName, name) {
      // console.log(this.needValidateItems, this.registerneedValidateItems, 88888);
      if (this.needRegister) {
        this.addString(ValidateName, name);
        return this.needValidateItems[ValidateName] ||
          this.registerneedValidateItems[name];
      }
      return this.needValidateItems[ValidateName];
    },
    onLoad() {
      this.$api['join/joinIn/getJoinInMealDetail']({
        GoodsID: this.mealGoods.GoodsID,
      }).then((res) => {
        this.information.levelName = res.LeaguerLevelName;
        this.information.term = res.ExpireDays;
        this.information.CardMedia = res.CardMedia;
        this.childGoodsList = res.DataList;
        this.needValidateItems = res.NeedValidateItems || {};
      }, () => {
        this.$emit('close');
      });
    },

    readCardClick() {
      this.information.CardID = '';
      this.information.PrintNumber = '';
      const cardInfo = this.$device.readCard();
      if (cardInfo.cardID) {
        this.$api['leaguer/leaguer/checkLeaguerIsExist']({
          DeviceLgID: cardInfo.cardID,
        }).then((res) => {
          if (res.LeaguerID) {
            this.$message({
              message: '此卡已存在会员',
              type: 'warning',
            });
            return;
          }
          this.information.CardID = cardInfo.cardID;
          this.information.PrintNumber = cardInfo.cardNumber;
        });
      }
    },

    readIDCardClick() {
      const idCardInfo = this.$device.readIDCard();
      this.information.ocIDCard = idCardInfo.idCardNum;
      this.information.ocRealName = idCardInfo.name;
      this.information.ocBirthday = idCardInfo.birthday;
      this.information.ocSex = idCardInfo.sex === '2' ? 'Girl' : 'Boy';
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        if (!this.information.ocSex) {
          this.information.ocSex = '-1';
        }
        if (!this.information.UserPass) {
          this.$confirm('密码为空，默认123456，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.information.UserPass = '123456';
            this.$emit('comfirm', JSON.stringify(this.information));
          }).catch(() => {});
        } else {
          this.$emit('comfirm', JSON.stringify(this.information));
        }
      });

      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      //     if (!this.information.ocSex) {
      //       this.information.ocSex = '-1';
      //     }
      //     this.$emit('comfirm', JSON.stringify(this.information));
      //   }
      // });
    },

    handleOrderComplete() {
      this.$api['sell/order/orderPaymentCompleted']({
        OrderID: this.orderId,
      }).then(() => {
        this.$refs.form.resetFields();
        this.$message({
          message: '会员开卡成功',
          type: 'success',
        });
      });
      this.paymentVisible = false;
      this.$emit('close');
    },

    handleOrderCancel() {
      this.$api['sell/order/cancelOrder']({
        OrderID: this.orderId,
      }).then(() => {
        this.$message({
          message: '订单已取消',
          type: 'success',
        });
      });
    },

    handlePaymentClose() {
      this.paymentVisible = false;
    },

    handleClose() {
      this.$refs.form.resetFields();
      this.$emit('close');
    },

    photographClick() {
      this.$refs.Photograph.start();
      this.photographVisible = true;
    },

    handlePhotographClose() {
      this.photographVisible = false;
    },

    handlePhotographComplete(img) {
      this.information.leaguerPhotoSrc = img;
      this.photographVisible = false;
    },

    photoClearClick() {
      this.information.leaguerPhotoSrc = '';
    },

    handleValidateClick() {
      if (this.information.leaguerPhone === '') { return; }
      if (!(/^1[0-9]{10}$/.test(this.information.leaguerPhone))) {
        return;
      }

      this.$api['global/sendMessageByCode']({
        PhoneNum: this.information.leaguerPhone,
      }).then((res) => {
        this.$alert(
          `本次会员验证码为：${res.Code}`,
          '会员验证码',
          {
            confirmButtonText: '验证通过',
            // callback: (action) => {
            // },
          },
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .card-left {
    width: 49%;
    float: left;
  }
  .card-right {
    width: 49%;
    float: right;
  }

  .fill-info-main{
    width: 370px;
    height: 480px;
    padding: 20px 20px 5px;
    overflow-y: auto;
    $two-px:2px;

    /deep/ .el-input {
      width: 235px;
    }

    .append-button {
      width: 46px;
      padding: 0;
      color: $font-color-secondary;
    }

    .border-line {
      border: 2px $border-color solid;
      margin-bottom: 10px;
    }

    .fill-info-photo {
      height: 240px;
      width: 240px;
      border: 1px $font-color-placeholder solid;

      .icon-add {
        position: absolute;
        top: 100px;
        left: 70px;
        // stylelint-disable-next-line
        font-size: 100px;
        color: $font-color-placeholder;
      }

      /deep/ .el-button {
        position: absolute;
        top: 5px;
        right: 52px;

        i {
          color: $color-white;
        }
      }

      img {
        height: 240px;
        width: 240px;
      }


    }

    /deep/ .el-form-item__label {
      color: $font-color-primary;
    }
  }

  .fill-info-aside {
    padding: 20px;

    &-title {
      margin: 0 8px 8px;
      color: $font-color-primary;
      font-size: $font-size-primary;
    }
  }


  .footer-button {
    color: $color-white;
    background-color: $color-primary;
  }

</style>

<style lang="scss">
  @import "@/styles/theme.scss";

  .fill-info-dialog {
    $two-px:2px;

    /deep/ .el-dialog__header {
      height: 50px;
      padding: 0;
      // stylelint-disable-next-line
      border-bottom: 1px #DDD solid;
    }

    /deep/ .el-dialog__title {
      padding-left: 30px;
      line-height: 50px;
      // stylelint-disable-next-line
      font-size: 16px;
      // stylelint-disable-next-line
      color: #333;
    }

    /deep/ .el-dialog__body {
      /* padding: 0; */
      background-color: $color-bg-primary;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      border-top: 1px $border-color solid;
    }
  }
</style>
