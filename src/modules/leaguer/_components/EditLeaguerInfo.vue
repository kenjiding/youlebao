<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="会员资料"
    top="5vh"
    width="900px"
    class="edit-info-dialog"
    @close="handleClose"
    @open="onLoad">
    <el-radio-group v-model="activeTab">
      <el-radio-button label="base">基础资料</el-radio-button>
      <el-radio-button label="extend">更多资料</el-radio-button>
    </el-radio-group>
    <el-form
      ref="form"
      :model="leaguerInfo"
      :rules="rules"
      :validate-on-rule-change="false"
      label-width="85px"
      label-position="left">
      <div
        v-show="activeTab==='base'"
        class="edit-info-form">
        <div>
          <el-form-item
            label="会员卡号:"
            prop="leaguerCode">
            <el-input
              v-if="leaguerLock"
              v-model="leaguerInfo.LeaguerCode"
              disabled/>
            <read-card
              v-else
              ref="cardReader"
              :value="cardKeyValue"
              :auto-logout="false"
              class="read-card"
              @logout="handleReadCardLogout"
              @change="handleReadLeaguer"/>
          </el-form-item>
          <el-form-item
            label="会员名称:"
            prop="RealName">
            <el-input
              v-model="leaguerInfo.RealName"
              :maxlength="20"/>
          </el-form-item>
          <el-form-item
            label="会员生日:"
            prop="leaguerBirthday">
            <el-date-picker
              v-model="leaguerInfo.Birthday"
              type="date"
              placeholder="请选择日期"/>
          </el-form-item>
          <el-form-item
            label="会员级别:">
            <el-input
              v-model="leaguerInfo.LeaguerLevelName"
              :disabled="true"/>
          </el-form-item>
          <el-form-item
            label="身份证:"
            prop="leaguerIDCard">
            <el-input
              v-model="leaguerInfo.IDCard"
              class="input-special">
              <el-button
                slot="append"
                class="append-button"
                @click="readIDCardClick">
                读取
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="手机号:"
            prop="Phone">
            <el-input
              v-model="leaguerInfo.Phone"
              class="input-special"
              type="tel">
              <el-button
                slot="append"
                class="append-button"
                @click="handleValidateClick">
                验证
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="会员性别:"
            prop="leaguerSex">
            <el-select
              v-model="leaguerInfo.Sex"
              placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item
            label="指纹信息:">
            <el-button @click="editFingerVisible=true">
              {{ `录入指纹${hasLeaguerFinger?'':'(未录入)'}` }}
            </el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="子女1姓名:">
            <el-input
              v-model="lgChild1.Name"
              :maxlength="20"/>
          </el-form-item>
          <el-form-item
            label="子女1生日:">
            <el-date-picker
              v-model="lgChild1.Birthday"
              type="date"
              placeholder="请选择日期"/>
          </el-form-item>
          <el-form-item
            label="子女1性别:">
            <el-select
              v-model="lgChild1.Sex"
              placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="会员相片:">
            <div
              class="edit-info-photo"
            >
              <i
                v-show="!imgSrc"
                class="ych-icon-add icon-add"
                @click="photographClick"/>
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
      <div
        v-show="activeTab==='extend'"
        class="edit-info-form">
        <div>
          <el-form-item
            label="电子邮箱:"
            prop="Email">
            <el-input
              v-model="leaguerInfo.Email"
              :maxlength="32"/>
          </el-form-item>
          <el-form-item
            label="邮政编号:"
            prop="IMNO">
            <el-input
              v-model="leaguerInfo.IMNO"
              :maxlength="32"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="子女2姓名:"
            prop="secondChildName">
            <el-input
              v-model="lgChild2.Name"
              :maxlength="20"/>
          </el-form-item>
          <el-form-item
            label="子女2生日:"
            prop="secondChildBirthday">
            <el-date-picker
              v-model="lgChild2.Birthday"
              type="date"
              placeholder="请选择日期"/>
          </el-form-item>
          <el-form-item
            label="子女2性别:"
            prop="secondChildSex">
            <el-select
              v-model="lgChild2.Sex"
              placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="住宅地址:"
            prop="Address">
            <el-input
              v-model="leaguerInfo.Address"
              :maxlength="120"
              class="input-address"/>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div
      slot="footer">
      <el-button
        type="primary"
        @click="save">保存</el-button>
      <el-button
        type="primary"
        @click="printLeaguerCard">打印卡片</el-button>
    </div>

    <photograph
      ref="Photograph"
      :visible="photographVisible"
      @close="handlePhotographClose"
      @complete="handlePhotographComplete"/>

    <edit-leaguer-finger
      :visible.sync="editFingerVisible"
      :leaguer-id="leaguerId"
      :leaguer-finger="leaguerInfo.LeaguerFinger"
      @complete="handleGetFingerComplete"/>
  </el-dialog>
</template>

<script>
import ReadCard from '@/components/read-card/ReadCard.vue';
import Photograph from '@/modules/join/_components/Photograph.vue';
import EditLeaguerFinger from '@/modules/leaguer/_components/EditLeaguerFinger.vue';

export default {
  name: 'EditLeaguerInfo',

  components: {
    ReadCard,
    Photograph,
    EditLeaguerFinger,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    leaguerId: {
      type: String,
      default: '',
    },
    isCreate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      localVisible: false,
      activeTab: 'base',
      sexOptions: [{
        value: 'Boy',
        label: '男',
      }, {
        value: 'Girl',
        label: '女',
      }, {
        value: 'Unknow',
        label: '未知',
      }],
      cardKeyValue: '',
      leaguerInfo: {},
      lgChild1: {},
      lgChild2: {},
      needValidateItems: [],
      photographVisible: false,
      editFingerVisible: false,
      XMLData: '',
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

    leaguerLock() {
      return Boolean(this.leaguerId);
    },

    hasLeaguerFinger() {
      if (this.leaguerInfo.LeaguerFinger) {
        return Boolean(this.leaguerInfo.LeaguerFinger.length);
      }
      return false;
    },

    imgSrc() {
      return this.leaguerInfo.LeaguerPhoto ? `data:image/png;base64,${this.leaguerInfo.LeaguerPhoto}` : '';
    },

    rules() {
      const validatePhone = (rule, value, callback) => {
        console.log(value);
        if (value === '') {
          callback();
        } else if (!(/^1[0-9]{10}$/.test(value))) {
          callback(new Error('请输入正确的手机号!'));
        } else {
          callback();
        }
      };

      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (value && value.length > 32) {
          callback(new Error('会员名称不能大于32个字符!'));
        } else if ((/[`~!#$%^&*()\-+=<>?:"{}|,.\\/;'\\[\]·~！#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im.test(value))) {
          callback(new Error('会员名称不能有特殊符号!'));
        } else {
          callback();
        }
      };

      return {
        RealName: [
          { validator: validateName, trigger: 'blur' },
        ],
        Phone: [
          { validator: validatePhone, trigger: 'blur' },
        ],
      };
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
      if (this.leaguerLock) {
        this.$api['leaguer/leaguer/getLeaguerDetailByCard']({
          LeaguerID: this.leaguerId,
        }).then((res) => {
          this.leaguerInfo = res;
          this.lgChild1 = res.LgChild1 || { Name: '', Birthday: '', Sex: '' };
          this.lgChild2 = res.LgChild2 || { Name: '', Birthday: '', Sex: '' };
        }, () => {});
      } else {
        this.$nextTick(() => {
          if (this.$refs.cardReader) {
            this.$refs.cardReader.onRead();
          }
        });
      }
    },

    readIDCardClick() {
      const idCardInfo = this.$device.readIDCard();
      console.log(idCardInfo.sex);
      if (!idCardInfo.idCardNum) { return; }
      if (!this.leaguerInfo.RealName && !this.leaguerInfo.Birthday) {
        this.leaguerInfo.IDCard = idCardInfo.idCardNum;
        this.leaguerInfo.RealName = idCardInfo.name;
        this.leaguerInfo.Birthday = idCardInfo.birthday;
        this.leaguerInfo.Sex = idCardInfo.sex === '2' ? 'Girl' : 'Boy';
        return;
      }
      const differentNumber = this.leaguerInfo.IDCard
        && this.leaguerInfo.IDCard !== idCardInfo.idCardNum;
      const differentName = this.leaguerInfo.RealName
        && this.leaguerInfo.RealName !== idCardInfo.name;
      const differentBirthday = this.leaguerInfo.Birthday
        && this.leaguerInfo.Birthday !== idCardInfo.birthday;
      const differentSex = this.leaguerInfo.Sex
        && this.leaguerInfo.Sex !== (idCardInfo.sex === '2' ? 'Girl' : 'Boy');
      if (differentNumber || differentName || differentBirthday || differentSex) {
        this.$confirm('会员资料与身份证信息不一致，是否将会员资料更新为当前身份证读取信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.leaguerInfo.IDCard = idCardInfo.idCardNum;
          this.leaguerInfo.RealName = idCardInfo.name;
          this.leaguerInfo.Birthday = idCardInfo.birthday;
          this.leaguerInfo.Sex = idCardInfo.sex === '2' ? 'Girl' : 'Boy';
        }).catch(() => { });
      } else {
        this.leaguerInfo.IDCard = idCardInfo.idCardNum;
        this.leaguerInfo.RealName = idCardInfo.name;
        this.leaguerInfo.Birthday = idCardInfo.birthday;
        this.leaguerInfo.Sex = idCardInfo.sex === '2' ? 'Girl' : 'Boy';
      }
    },

    photographClick() {
      // this.$refs.Photograph.start();
      this.photographVisible = true;
    },

    handlePhotographClose() {
      this.photographVisible = false;
    },

    handlePhotographComplete(img) {
      this.leaguerInfo.LeaguerPhoto = img.replace('data:image/png;base64,', '');
      this.photographVisible = false;
    },

    photoClearClick() {
      this.leaguerInfo.LeaguerPhoto = '';
    },

    handleClose() {
      if (this.$refs.cardReader) {
        this.$refs.cardReader.logout();
      }
      this.$emit('close');
      this.remove && this.remove();
    },

    handleReadLeaguer(leaguer) {
      if (leaguer) {
        this.$api['leaguer/leaguer/getLeaguerDetailByCard']({
          LeaguerID: leaguer.ID,
        }).then((res) => {
          this.leaguerInfo = res;
          this.lgChild1 = res.LgChild1 || { Name: '', Birthday: '', Sex: '' };
          this.lgChild2 = res.LgChild2 || { Name: '', Birthday: '', Sex: '' };
        }, () => {});
      }
    },

    handleReadCardLogout() {
      this.$refs.form.resetFields();
      this.leaguerInfo = {};
      this.lgChild1 = { Name: '', Birthday: '', Sex: '' };
      this.lgChild2 = { Name: '', Birthday: '', Sex: '' };
    },

    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        this.$api['leaguer/leaguer/updateBaseInfo']({
          LeaguerID: this.leaguerInfo.ID,
          Sex: this.leaguerInfo.Sex,
          LgChild1: this.lgChild1,
          LgChild2: this.lgChild2,
          Address: this.leaguerInfo.Address,
          Email: this.leaguerInfo.Email,
          IMNO: this.leaguerInfo.IMNO,
          Birthday: this.leaguerInfo.Birthday,
          LeaguerName: this.leaguerInfo.RealName,
          Phone: this.leaguerInfo.Phone,
          IDCard: this.leaguerInfo.IDCard,
          LeaguerPhoto: this.leaguerInfo.LeaguerPhoto,
          Height: 200,
          Width: 200,
        }).then(() => {
          this.$message({
            message: '会员资料保存成功',
            type: 'success',
          });
          this.$emit('complete');
          this.$emit('close');
          this.remove && this.remove();
        });
      });
    },

    handleGetFingerComplete() {
      this.$api['leaguer/leaguer/getLeaguerDetailByCard']({
        LeaguerID: this.leaguerInfo.ID,
      }).then((res) => {
        this.leaguerInfo.LeaguerFinger = res.LeaguerFinger;
      }, () => {});
      this.editFingerVisible = false;
    },

    printLeaguerCard() {
      this.$createPrintWebView({
        $props: {
          XmlData: 'XMLData',
          printType: 'memberPrint',
        },
        onComplete() {
        },
        onCancel() {
        },
      });
      this.XMLData = '';
      this.$api['leaguer/leaguer/getLeaguerPrintModel']({
        LeaguerID: this.leaguerInfo.ID,
      }).then((res) => {
        this.XMLData = res.PrintContent;
      });
    },

    handleValidateClick() {
      if (this.leaguerInfo.Phone === '') { return; }
      if (!(/^1[0-9]{10}$/.test(this.leaguerInfo.Phone))) {
        return;
      }

      this.$api['global/sendMessageByCode']({
        PhoneNum: this.leaguerInfo.Phone,
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
  @import '@/styles/theme.scss';

  .edit-info {
    width: 370px;
    height: 480px;
    padding: 20px;
    overflow-y: auto;
    $two-px:2px;

    &-form {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;

      > div {
        width: 410px;
        margin-top: 20px;
        // margin-right: 30px;
      }

      .input-special {
        width: 315px;
        /deep/ .el-input__inner {
          width: 269px !important;
        }
      }

      .input-address {
        /deep/ .el-input__inner {
          width: 760px !important;
        }
      }

      .append-button {
        width: 46px;
        padding: 0;
        color: $color-primary;
      }

      /deep/ .el-form-item__label {
        color: $font-color-primary;
      }

      /deep/ .el-input__inner {
        width: 315px;
      }
    }

    &-photo {
      height: 240px;
      width: 240px;
      border: 1px $font-color-placeholder solid;
      position: relative;

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
        right: 10px;

        i {
          color: $color-white;
        }
      }

      img {
        height: 240px;
        width: 240px;
      }
    }
  }

  .edit-info-dialog {
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
    }
  }
</style>
