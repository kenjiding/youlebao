<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    title="填写入会资料"
    top="10vh"
    width="1000px"
    append-to-body
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
          :inline="true"
          label-width="85px">
          <el-form-item label="会员级别:">
            <el-input
              v-model="information.levelName"
              :disabled="true"/>
          </el-form-item>
          <el-form-item
            label="密码:"
            prop="password">
            <el-input
              v-model="information.password"
              type="password"
              placeholder="请输入,默认密码为123456"/>
          </el-form-item>
          <el-form-item
            :label="cardMediaChs+':'"
            prop="leaguerCode">
            <el-input
              v-model="information.leaguerCode"
              :disabled="isReadType">
              <el-button
                v-if="isReadType"
                slot="append"
                class="append-button"
                @click="readCardClick">
                读卡
              </el-button>
              <el-button
                v-else-if="information.CardMedia === 'NoCard'"
                slot="append"
                class="append-button"
                @click="handleValidateClick(information.leaguerCode)">
                验证
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="确认密码:"
            prop="passwordConfirm">
            <el-input
              v-model="information.passwordConfirm"
              type="password"
              placeholder="请输入,默认密码为123456"/>
          </el-form-item>
          <el-form-item label="有效期:">
            <el-input
              v-model="information.term"
              :disabled="true"/>
          </el-form-item>
          <div class="border-line"/>
          <div class="fill-info-panel">
            <div>
              <el-form-item
                label="会员名称:"
                prop="leaguerName">
                <el-input
                  v-model="information.leaguerName"/>
              </el-form-item>

              <el-form-item
                label="会员性别:"
                prop="leaguerSex">
                <el-select
                  v-model="information.leaguerSex"
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
                prop="leaguerBirthday">
                <el-date-picker
                  v-model="information.leaguerBirthday"
                  type="date"
                  placeholder="请选择日期"/>
              </el-form-item>
              <el-form-item
                v-show="information.CardMedia !== 'NoCard'"
                label="手机号:"
                prop="leaguerPhone">
                <el-input
                  v-model="information.leaguerPhone"
                  type="tel">
                  <el-button
                    slot="append"
                    class="append-button"
                    @click="handleValidateClick(information.leaguerPhone)">
                    验证
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item
                label="身份证:"
                prop="leaguerIDCard">
                <el-input
                  v-model="information.leaguerIDCard">
                  <el-button
                    slot="append"
                    class="append-button"
                    @click="readIDCardClick">
                    读取
                  </el-button>
                </el-input>
              </el-form-item>
            </div>
            <div style="float: left">
              <el-form-item label="会员相片:">
                <div
                  class="fill-info-photo"
                  @click.self="photographClick">
                  <div @click="photographClick">
                    <i
                      v-show="!imgSrc"
                      class="ych-icon-add icon-add"/>
                    <p v-show="!imgSrc">拍摄</p>
                  </div>
                  <img
                    v-show="imgSrc"
                    :src="imgSrc">
                  <el-button
                    v-show="imgSrc"
                    icon="ych-icon-close"
                    circle
                    size="mini"
                    type="danger"
                    @click="photoClearClick"/>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-main>
      <el-aside
        width="342px"
        class="fill-info-aside">
        <join-meal-goods
          ref="joinMealGoods"
          :meal-goods.sync ="childGoodsList"
          :meal-id="mealGoods.ID"
          :can-delete="isSellDeleteBindGoods"/>
      </el-aside>
    </el-container>
    <div
      slot="footer">
      <el-button
        :loading="loading"
        class="footer-button"
        @click="submit">开卡</el-button>
        <!-- <el-button class="footer-button">开卡并填写资料</el-button> -->
    </div>

    <payment
      ref="Payment"
      :visible="paymentVisible"
      :actual-charge="actualCharge"
      :order-id="orderId"
      @close="handlePaymentClose"
      @cancel="handleOrderCancel"
      @complete="handleOrderComplete"/>

    <photograph
      ref="Photograph"
      :visible="photographVisible"
      @close="handlePhotographClose"
      @complete="handlePhotographComplete"/>

    <order-receipt
      ref="orderReceipt"
      :order-id="orderId"/>

  </el-dialog>
</template>

<script>
import JoinMealGoods from '@/modules/join/_components/JoinMealGoods.vue';
import Photograph from '@/modules/join/_components/Photograph.vue';
import Payment from '@/components/payment/Payment.vue';
import OrderReceipt from '@/modules/order/_components/OrderReceipt.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'FillInformation',

  components: {
    JoinMealGoods,
    Payment,
    Photograph,
    OrderReceipt,
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
  },

  data() {
    return {
      cardKeyValue: '',
      childGoodsList: [],
      isSellDeleteBindGoods: true,
      needValidateItems: [],
      information: {
        levelName: '',
        leaguerName: '',
        leaguerCode: '',
        leaguerCardID: '',
        leaguerIDCard: '',
        password: '',
        passwordConfirm: '',
        leaguerPhone: '',
        leaguerSex: '',
        leaguerBirthday: '',
        leaguerPhotoSrc: '',
        CardMedia: '',
        CashPledge: 0,
        Cost: 0,
      },
      sexOptions: [{
        value: 'Boy',
        label: '男',
      }, {
        value: 'Girl',
        label: '女',
      }],
      paymentVisible: false,
      photographVisible: false,
      actualCharge: 0,
      orderId: '',
      loading: false,
      isPrintReceipt: false,
      extendInfo: '',
    };
  },

  computed: {
    ...mapGetters({
      hasTicketRegister: 'gobalConfig/hasTicketRegister',
      ticketValidateItems: 'gobalConfig/getTicketRegister',
    }),

    imgSrc() {
      return this.information.leaguerPhotoSrc ? `data:image/png;base64,${this.information.leaguerPhotoSrc}` : '';
    },

    needExtendInfo() {
      return this.childGoodsList.some(item => item.NeedExtraInfo === true);
    },

    cardMediaChs() {
      const cardMediaEnum = {
        LeaguerCard: '会员卡号',
        IcCard: '临时卡号',
        NoCard: '手机号',
        Parper: '腕带编号',
      };
      return cardMediaEnum[this.information.CardMedia] || '会员卡号';
    },

    isReadType() {
      return this.information.CardMedia === 'LeaguerCard' || this.information.CardMedia === 'IcCard';
    },

    rules() {
      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (value.length > 32) {
          callback(new Error('会员名称不能大于32个字符!'));
        } else if ((/[`~!#$%^&*()\-+=<>?:"{}|,.\\/;'\\[\]·~！#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im.test(value))) {
          callback(new Error('会员名称不能有特殊符号!'));
        } else {
          callback();
        }
      };

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (value.length < 6) {
            callback(new Error('密码必须大于等于6位!'));
          }
          if (this.information.password !== '') {
            this.$refs.form.validateField('passwordConfirm');
          }
          callback();
        }
      };

      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          if (this.information.password !== '') {
            callback(new Error('请再次确认密码!'));
          } else {
            callback();
          }
        } else if (value.length < 6) {
          callback(new Error('密码必须大于等于6位!'));
        } else if (value !== this.information.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      const validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (this.information.CardMedia !== 'NoCard') {
          if (!(/^1[0-9]{10}$/.test(value))) {
            callback(new Error('请输入正确的手机号!'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

      const validateNoCard = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (this.information.CardMedia === 'NoCard') {
          if (!(/^1[0-9]{10}$/.test(value))) {
            callback(new Error('请输入正确的手机号!'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };

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
          { validator: validateName, trigger: 'blur' },
          {
            required: this.needValidateItems.ValidateName ||
                      (this.needExtendInfo && this.ticketValidateItems.IsName),
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        leaguerCode: [
          { required: true, message: '请读卡', trigger: 'blur' },
          { validator: validateNoCard, trigger: 'blur' },
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
        ],
        passwordConfirm: [
          { validator: validatePass2, trigger: 'blur' },
        ],
        leaguerPhone: [
          {
            required: (this.needValidateItems.ValidatePhone ||
                      (this.needExtendInfo && this.ticketValidateItems.IsPhone))
                      && this.information.CardMedia !== 'NoCard',
            message: '请输入手机号',
            trigger: 'blur',
          },
          { validator: validatePhone, trigger: 'blur' },
        ],
        leaguerIDCard: [
          {
            required: this.needValidateItems.ValidateIDCard ||
                      (this.needExtendInfo
                      && this.ticketValidateItems.IsIDCard),
            message: '请读取身份证',
            trigger: 'blur',
          },
          { validator: validateIDCard, trigger: 'blur' },
        ],
        leaguerSex: [
          {
            required: this.needValidateItems.ValidateSex ||
                      (this.needExtendInfo && this.ticketValidateItems.IsSex),
            message: '请选择性别',
            trigger: 'blur',
          },
        ],
        leaguerBirthday: [
          {
            required: this.needValidateItems.ValidateBirthday ||
                      (this.needExtendInfo
                      && this.ticketValidateItems.IsBirthday),
            message: '请输入生日',
            trigger: 'blur',
          },
        ],
      };
    },
  },

  created() {
    // this.onLoad();
  },

  methods: {
    onLoad() {
      this.$api['join/joinIn/getJoinInMealDetail']({
        GoodsID: this.mealGoods.ID,
      }).then((res) => {
        this.information.levelName = res.LeaguerLevelName;
        this.information.term = res.ExpireDays;
        this.information.CardMedia = res.CardMedia;
        this.information.CashPledge = res.CashPledge;
        this.information.Cost = res.Cost;
        this.childGoodsList = res.DataList.map(item => ({
          ...item,
          Fixed: 0,
        }));
        this.childGoodsList.unshift({
          GoodsID: 'fixed002',
          GoodsName: '工本费',
          Price: res.Cost,
          Amount: 1,
          GoodsType: 'fixed',
          Fixed: 1,
        });
        this.childGoodsList.unshift({
          GoodsID: 'fixed001',
          GoodsName: '卡押金',
          Price: res.CashPledge,
          Amount: 1,
          GoodsType: 'fixed',
          Fixed: 1,
        });
        this.isSellDeleteBindGoods = res.IsSellDeleteBindGoods;
        this.isPrintReceipt = res.IsPrint;
        this.needValidateItems = res.NeedValidateItems || {};
        this.$nextTick(() => {
          if (this.information.CardMedia === 'IcCard'
          || this.information.CardMedia === 'LeaguerCard') {
            this.readCardClick();
          }
          this.$refs.joinMealGoods.onLoad();
        });
      }, () => {
        this.$emit('close');
      });
    },

    readCardClick() {
      this.information.leaguerCode = '';
      this.information.leaguerCardID = '';
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
          this.information.leaguerCode = cardInfo.cardNumber;
          this.information.leaguerCardID = cardInfo.cardID;
        });
      }
    },

    readIDCardClick() {
      const idCardInfo = this.$device.readIDCard();
      this.information.leaguerIDCard = idCardInfo.idCardNum;
      this.information.leaguerName = idCardInfo.name;
      this.information.leaguerBirthday = idCardInfo.birthday;
      this.information.leaguerSex = idCardInfo.sex === '2' ? 'Girl' : 'Boy';
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        if (!this.information.password) {
          this.$confirm('密码为空，默认123456，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.information.password = '123456';
            this.information.passwordConfirm = '123456';
            this.joinInAction();
          }).catch(() => {});
        } else {
          this.joinInAction();
        }
      });
    },

    setExtendInfo() {
      if (!this.needExtendInfo || !this.hasTicketRegister) {
        return;
      }
      const jsonExtendInfo = {};
      if (this.ticketValidateItems.IsName) {
        jsonExtendInfo.PackageTicketRegister_Name = this.information.leaguerName;
      }
      if (this.ticketValidateItems.IsSex) {
        jsonExtendInfo.PackageTicketRegister_Sex = this.information.leaguerSex;
      }
      if (this.ticketValidateItems.IsBirthday) {
        jsonExtendInfo.PackageTicketRegister_Birthday = this.information.leaguerBirthday;
      }
      if (this.ticketValidateItems.IsIDCard) {
        jsonExtendInfo.PackageTicketRegister_IDCard = this.information.leaguerIDCard;
      }
      if (this.ticketValidateItems.IsPhone) {
        jsonExtendInfo.PackageTicketRegister_Phone = this.information.leaguerPhone;
      }
      console.log(jsonExtendInfo);
      this.extendInfo = JSON.stringify(jsonExtendInfo);
    },

    joinInAction() {
      this.loading = true;
      this.setExtendInfo();
      if (this.information.CardMedia === 'NoCard') {
        this.information.leaguerPhone = this.information.leaguerCode;
      }
      if (this.information.CardMedia === 'Parper') {
        this.information.leaguerCardID = this.information.leaguerCode;
      }
      this.$api['join/joinIn/confrimJoinIn']({
        MealID: this.mealGoods.ID,
        GoodsData: this.$refs.joinMealGoods.localGoodsList.filter(goods => goods.Fixed === 0),
        CardID: this.information.leaguerCardID,
        CardNumber: this.information.leaguerCode,
        IDCardNumber: this.information.leaguerIDCard,
        Name: this.information.leaguerName,
        Sex: this.information.leaguerSex,
        Phone: this.information.leaguerPhone,
        Password: this.information.password,
        Birthday: this.information.leaguerBirthday,
        Photo: this.information.leaguerPhotoSrc.replace('data:image/png;base64,', ''),
        PhotoWidth: 200,
        PhotoHeight: 200,
        MediaType: this.information.CardMedia,
        ExtendInfo: this.extendInfo,
      }).then((res) => {
        this.orderId = res.OrderID;
        this.actualCharge = res.ActualCharge;
        this.paymentVisible = true;
      }, () => {
        this.loading = false;
      });
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
        if (this.isPrintReceipt) {
          this.$refs.orderReceipt.onPrint();
        }
      });
      this.loading = false;
      this.paymentVisible = false;
      this.information.leaguerPhotoSrc = '';
      this.information.leaguerCardID = '';
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
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    },

    handlePaymentClose() {
      this.paymentVisible = false;
    },

    handleClose() {
      this.$refs.form.resetFields();
      this.information.leaguerPhotoSrc = '';
      this.information.leaguerCardID = '';
      this.$emit('close');
    },

    photographClick() {
      this.photographVisible = true;
    },

    handlePhotographClose() {
      this.photographVisible = false;
    },

    handlePhotographComplete(img) {
      this.information.leaguerPhotoSrc = img.replace('data:image/png;base64,', '');
      this.photographVisible = false;
    },

    photoClearClick() {
      this.information.leaguerPhotoSrc = '';
    },

    handleValidateClick(phone) {
      if (phone === '') { return; }
      if (!(/^1[0-9]{10}$/.test(phone))) {
        return;
      }

      this.$api['global/sendMessageByCode']({
        PhoneNum: phone,
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

  .fill-info-main{
    width: 640px;
    height: 530px;
    padding: 0;
    overflow: hidden;
    $two-px:2px;

    /deep/ .el-input {
      width: 210px;
    }

    .append-button {
      width: 46px;
      padding: 0;
      color: $color-primary;
    }

    .border-line {
      border: 1px $border-color solid;
      margin-bottom: 20px;
      margin-right: 20px;
    }

    .fill-info-photo {
      height: 205px;
      width: 205px;
      border: 1px $border-color solid;

      > div {
        position: absolute;
        top: 70px;
        left: 87px;
      }

      .icon-add {
        // stylelint-disable-next-line
        font-size: 30px;
        color: $color-primary;
      }

      p {
        line-height: 16px;
        font-size: $font-size-primary;
        color: $font-color-placeholder;
      }

      /deep/ .el-button {
        position: absolute;
        top: 5px;
        right: 10px;

        i {
          color: $color-white;
        }
      }

      img {
        height: 205px;
        width: 205px;
      }


    }

    /deep/ .el-form-item__label {
      color: $font-color-primary;
    }
  }

  .fill-info-panel {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;

    > div {
      width: 305px;
    }

    // > div:nth-child(2) {
    //   width: 307px;
    // }

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
      padding: 20px;
      background-color: $color-bg-primary;
    }

    /deep/ .el-dialog__footer {
      height: 60px;
      padding: 10px 30px;
      border-top: 1px $border-color solid;
      text-align: center;

      .el-button {
        width: 320px;
      }
    }
  }
</style>
