export default [{
  name: 'getLeaguerPackageTickets',
  method: 'POST',
  desc: '获取会员的所有套票',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerPackageTickets',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerPackageTickets',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PageInfo: true, // typeName: PageInfo  desc: 当前页数
  },
}, {
  name: 'getAccountChanged',
  method: 'POST',
  desc: '获取会员储值变更明细',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetAccountChanged',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetAccountChanged',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    Type: true, // typeName: Int  desc: 1预存款 3积分,401金币，402代币，403彩票
    PageInfo: true, // typeName: PageInfo  desc: 当前页码
    ChangeType: true, // typeName: Int  desc: 1：消费、2：充值、3：赠送、4：补币、5：存取币
  },
}, {
  name: 'changeLgLevel',
  method: 'POST',
  desc: '修改会员级别',
  path: '/ProfessionalCash/api/v1.0/Leaguer/ChangeLgLevel',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/ChangeLgLevel',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    ChangeLevelID: true, // typeName: Guid  desc: 变更会员级别
  },
}, {
  name: 'checkFingerWrite',
  method: 'POST',
  desc: '指纹录入检查',
  path: '/ProfessionalCash/api/v1.0/Leaguer/CheckFingerWrite',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/CheckFingerWrite',
  params: {
    FingerData: true, // typeName: String  desc: 指纹（Base64字符串）
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    FingerType: true, // typeName: FingerType  desc: 指纹类型
    FingerSort: true, // typeName: Int  desc: 指纹序号
    FingerList: true, // typeName:   desc: 已录入的指纹项
  },
}, {
  name: 'checkLeaguerIsExist',
  method: 'POST',
  desc: '读卡获取会员ID（检查会员是否已经存在）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/CheckLeaguerIsExist',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/CheckLeaguerIsExist',
  params: {
    DeviceLgID: true, // typeName: String  desc: 卡ID
  },
}, {
  name: 'getOneLeaguerBaseByCard',
  method: 'POST',
  desc: '获取一个会员的信息(读卡用)',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetOneLeaguerBaseByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetOneLeaguerBaseByCard',
  params: {
    DeviceLgID: false, // typeName: String  desc: 卡ID（读卡时用）
    VerifyState: false, // typeName: Boolean  desc: 是否验证会员状态
    VerifyDate: false, // typeName: Boolean  desc: 是否验证过期时间
    VerifyCardState: false, // typeName: Boolean  desc: 验证卡片状态
    LeaguerID: false, // typeName: String  desc: 会员ID（手输的时候用到）
  },
}, {
  name: 'getRejoinSet',
  method: 'POST',
  desc: '会员续期起始时间是否为当前',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetRejoinSet',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetRejoinSet',
  params: {
  },
}, {
  name: 'getLeaguerPrintModel',
  method: 'POST',
  desc: '会员卡片打印',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerPrintModel',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerPrintModel',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'checkLgPwd',
  method: 'POST',
  desc: '校验会员密码',
  path: '/ProfessionalCash/api/v1.0/Leaguer/CheckLgPwd',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/CheckLgPwd',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PassWord: true, // typeName: String  desc: 密码
    CardID: false, // typeName: String  desc: 卡ID，方便发卡机
  },
}, {
  name: 'checkLgICCard',
  method: 'POST',
  desc: '会员卡检查',
  path: '/ProfessionalCash/api/v1.0/Leaguer/CheckLgICCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/CheckLgICCard',
  params: {
    ICCard: true, // typeName: String  desc: 芯片号
    CardNumber: true, // typeName: String  desc: 卡号
    LeaguerID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'getLgLevelJoinCardType',
  method: 'POST',
  desc: '获取会员级别入会卡介质',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLgLevelJoinCardType',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLgLevelJoinCardType',
  params: {
    LgLevelID: true, // typeName: Guid  desc: 会员级别ID
  },
}, {
  name: 'storeLottery',
  method: 'POST',
  desc: '手动存彩票',
  path: '/ProfessionalCash/api/v1.0/Leaguer/StoreLottery',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/StoreLottery',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    Amount: true, // typeName: Number  desc: 数量
    Summary: true, // typeName: String  desc: 备注
  },
}, {
  name: 'getLeaguerAllValue',
  method: 'POST',
  desc: '获取会员储值列表',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerAllValue',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerAllValue',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'leaguerCancel',
  method: 'POST',
  desc: '会员注销（退款又退卡）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/LeaguerCancel',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/LeaguerCancel',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    ReturnMoney: true, // typeName: Number  desc: 退款金额
    IsPrintDetail: false, // typeName: Boolean  desc: 是否打印清单
    Remark: false, // typeName: String  desc: 备注说明
  },
}, {
  name: 'lockLgAccount',
  method: 'POST',
  desc: '锁定/解锁账户储值',
  path: '/ProfessionalCash/api/v1.0/Leaguer/LockLgAccount',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/LockLgAccount',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    LgValueTypeList: true, // typeName:   desc:
  },
}, {
  name: 'getLeaguerListByCard',
  method: 'POST',
  desc: '输入手机号码，读取身份证等会返回多个会员信息，故先调此接口，选择会员后，再通过会员ID 调用获取一个会员的接口',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerListByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerListByCard',
  params: {
    DeviceLgID: true, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: true, // typeName: DeviceType  desc: 设备类型
  },
}, {
  name: 'updateBaseInfo',
  method: 'POST',
  desc: '修改会员资料',
  path: '/ProfessionalCash/api/v1.0/Leaguer/UpdateBaseInfo',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/UpdateBaseInfo',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    Sex: true, // typeName: LgSex  desc: 性别
    LgChild1: false, // typeName: LgChild  desc: 子女1信息
    LgChild2: false, // typeName: LgChild  desc: 子女2信息
    Address: false, // typeName: String  desc: 地址
    Email: false, // typeName: String  desc: 邮箱
    IMNO: false, // typeName: String  desc: 邮政编码
    Birthday: true, // typeName: String  desc: 会员生日
    LeaguerName: true, // typeName: String  desc: 会员名称
    Phone: true, // typeName: String  desc: 手机号
    IDCard: false, // typeName: String  desc: 身份证号
    LeaguerPhoto: false, // typeName: String  desc: 会员相片
    Height: false, // typeName: Number  desc: 相片高度
    Width: false, // typeName: Number  desc: 相片宽度
  },
}, {
  name: 'returnTempletLeaguerPrepaid',
  method: 'POST',
  desc: '退预存款前 先检查预存款状态 是否需要解冻预存款',
  path: '/ProfessionalCash/api/v1.0/Leaguer/ReturnTempletLeaguerPrepaid',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/ReturnTempletLeaguerPrepaid',
  params: {
    LeaguerId: true, // typeName: Guid  desc: 会员
    PrepaidAmount: true, // typeName: Number  desc: 预存款数量
    RefundPrice: true, // typeName: Number  desc: 退预存款金额
    IsPrintDetail: false, // typeName: Boolean  desc: 是否打印清单
  },
}, {
  name: 'getPromotionCouponLogList',
  method: 'POST',
  desc: '查询会员优惠券列表',
  path: '/ProfessionalCash/api/v1.0/Promotion/GetPromotionCouponLogList',
  mockPath: '/ProfessionalCash/api/v1.0/Promotion/GetPromotionCouponLogList',
  params: {
    LeaguerCode: true, // typeName: String  desc: 会员编号
    State: true, // typeName: String  desc: 优惠券状态（Actived、SendOut、Used、Invalid）
  },
}, {
  name: 'unFrozenLeaguerPrepaid',
  method: 'POST',
  desc: '解冻储值（注销时可用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/UnFrozenLeaguerPrepaid',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/UnFrozenLeaguerPrepaid',
  params: {
    LeaguerId: true, // typeName: Guid  desc: 会员ID
    ValueCode: true, // typeName: String  desc: 储值编号（预存款传1）
  },
}, {
  name: 'saveLeaguerFinger',
  method: 'POST',
  desc: '保存会员的指纹',
  path: '/ProfessionalCash/api/v1.0/Leaguer/SaveLeaguerFinger',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/SaveLeaguerFinger',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    FingerList: true, // typeName:   desc: 指纹列表
  },
}, {
  name: 'getCurBusinessPrepaid',
  method: 'POST',
  desc: '详情见下方注释: getCurBusinessPrepaid',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetCurBusinessPrepaid',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetCurBusinessPrepaid',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'getLeaguerValueBatchChanged',
  method: 'POST',
  desc: '储值批次查询',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerValueBatchChanged',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerValueBatchChanged',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员
    ChangeType: true, // typeName: String  desc: 储值特征 1=预存款 3=积分,401金币，402代币，403彩票
    ValueStatus: true, // typeName: String  desc:
    PageInfo: true, // typeName: PageInfo  desc:
  },
}, {
  name: 'updateLgPwd',
  method: 'POST',
  desc: '修改会员密码',
  path: '/ProfessionalCash/api/v1.0/Leaguer/UpdateLgPwd',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/UpdateLgPwd',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PassWord: true, // typeName: String  desc: 新密码
    OldPassWord: true, // typeName: String  desc: 旧密码
  },
}, {
  name: 'createLgReJoinOrder',
  method: 'POST',
  desc: '会员续卡创建订单',
  path: '/ProfessionalCash/api/v1.0/Leaguer/CreateLgReJoinOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/CreateLgReJoinOrder',
  params: {
    GoodsData: true, // typeName:   desc: 商品列表
    LeaguerID: true, // typeName: Guid  desc: 会员id
    ExtendInfo: true, // typeName: String  desc: 扩展信息（json格式字符串）
  },
}, {
  name: 'isCurrBusiness',
  method: 'POST',
  desc: '检查是否是开卡商户的会员',
  path: '/ProfessionalCash/api/v1.0/Leaguer/IsCurrBusiness',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/IsCurrBusiness',
  params: {
    LeaguerID: true, // typeName: Guid  desc:
  },
}, {
  name: 'getLgAccountListByValueTypes',
  method: 'POST',
  desc: '根据储值类型获取会员储值',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLgAccountListByValueTypes',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLgAccountListByValueTypes',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    ValueTypes: true, // typeName: Int  desc: 储值类型
    IgnoreNullValue: false, // typeName: Boolean  desc: 忽略空储值
  },
}, {
  name: 'updateLgPwdAuth',
  method: 'POST',
  desc: '修改会员密码（需要权限，但不需要旧密码）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/UpdateLgPwdAuth',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/UpdateLgPwdAuth',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PassWord: true, // typeName: String  desc: 密码
  },
}, {
  name: 'getLgAccountList',
  method: 'POST',
  desc: '获取会员储值信息（注销会员用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLgAccountList',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLgAccountList',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    IsSearchChildGood: false, // typeName: String  desc: 是否搜索入会绑定商品（注销会员时用）
    BusinessID: true, // typeName: Guid  desc: 门店ID
  },
}, {
  name: 'getAllLgLevel',
  method: 'POST',
  desc: '获取所有会员级别',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetAllLgLevel',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetAllLgLevel',
  params: {
  },
}, {
  name: 'getPlayLogItem',
  method: 'POST',
  desc: '会员游玩记录查询',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetPlayLogItem',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetPlayLogItem',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PageInfo: true, // typeName: PageInfo  desc: 所在页码
  },
}, {
  name: 'getChargeJoinLForCannel',
  method: 'POST',
  desc: '获取会员注销参数',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetChargeJoinLForCannel',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetChargeJoinLForCannel',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'setLeaguerEnable',
  method: 'POST',
  desc: '会员启用/禁用',
  path: '/ProfessionalCash/api/v1.0/Leaguer/SetLeaguerEnable',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/SetLeaguerEnable',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    IsEnable: true, // typeName: Boolean  desc: 是否启用
    DisEnableReson: false, // typeName: String  desc: 禁用原因
  },
}, {
  name: 'lgUseTransferValue',
  method: 'POST',
  desc: '储值过户接口',
  path: '/ProfessionalCash/api/v1.0/Leaguer/LgUseTransferValue',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/LgUseTransferValue',
  params: {
    SourceLeaguerID: true, // typeName: Guid  desc: 源会员ID
    TargetLeaguerID: true, // typeName: Guid  desc: 过户会员ID
    LgValueList: true, // typeName:   desc: 储值变更列表
  },
}, {
  name: 'createLgChangeCardOrder',
  method: 'POST',
  desc: '会员换卡补卡创建订单',
  path: '/ProfessionalCash/api/v1.0/Leaguer/CreateLgChangeCardOrder',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/CreateLgChangeCardOrder',
  params: {
    GoodsData: true, // typeName:   desc: 商品列表
    LeaguerID: true, // typeName: Guid  desc: 会员id
    ExtendInfo: true, // typeName: String  desc: 扩展信息（json格式字符串）
  },
}, {
  name: 'getGoodsByLgLevelID',
  method: 'POST',
  desc: '根据会员级别获取相应商品',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetGoodsByLgLevelID',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetGoodsByLgLevelID',
  params: {
    LgLevelID: true, // typeName: Guid  desc: 会员等级ID
    GoodsType: true, // typeName: Int  desc: 商品类型（3、补卡，4、换卡,5、续期）
  },
}, {
  name: 'getLeaguerOrderItemList',
  method: 'POST',
  desc: '会员消费记录',
  path: '/ProfessionalCash/api/v1.0/Order/GetLeaguerOrderItemList',
  mockPath: '/ProfessionalCash/api/v1.0/Order/GetLeaguerOrderItemList',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员ID
    PageInfo: true, // typeName: PageInfo  desc: 分页信息
  },
}, {
  name: 'getLeaguerBaseByCard',
  method: 'POST',
  desc: '获取会员卡基本信息',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerBaseByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerBaseByCard',
  params: {
    DeviceLgID: true, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: true, // typeName: String  desc: 设备类型
  },
}, {
  name: 'getLeaguerDetailByCard',
  method: 'POST',
  desc: '获取会员信息详情',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByCard',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByCard',
  params: {
    DeviceLgID: false, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: false, // typeName: DeviceType  desc: 设备类型
    VerifyState: false, // typeName: Boolean  desc: 是否验证会员状态
    VerifyDate: false, // typeName: Boolean  desc: 是否验证过期时间
    VerifyCardState: false, // typeName: Boolean  desc: 验证卡片状态
    LeaguerID: false, // typeName: String  desc: 会员ID
  },
}, {
  name: 'leaguerCannelChangePrice',
  method: 'POST',
  desc: '判断是否有会员注销是否有更改注销价权限',
  path: '/ProfessionalCash/api/v1.0/Leaguer/LeaguerCannelChangePrice',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/LeaguerCannelChangePrice',
  params: {
  },
}, {
  name: 'lgValueRoam',
  method: 'POST',
  desc: '储值漫游（收银台用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/LgValueRoam',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/LgValueRoam',
  params: {
    LeaguerBaseID: true, // typeName: Guid  desc: 会员ID
  },
}, {
  name: 'getLgListByRoam',
  method: 'POST',
  desc: '漫游获取多个会员信息（收银台用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLgListByRoam',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLgListByRoam',
  params: {
    DeviceLgID: true, // typeName: String  desc: 会员相应设备ID（卡ID、身份证号、指纹等）
    DeviceType: true, // typeName: String  desc: 设备类型
  },
}, {
  name: 'getLeaguerDetailByRoam',
  method: 'POST',
  desc: '获取一个会员信息（收银台用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByRoam',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLeaguerDetailByRoam',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员id
    TargetBusinessID: true, // typeName: Guid  desc: 目标商户ID
  },
}, {
  name: 'lgValueRoamReturn',
  method: 'POST',
  desc: '储值漫回（收银台用）',
  path: '/ProfessionalCash/api/v1.0/Leaguer/LgValueRoamReturn',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/LgValueRoamReturn',
  params: {
    LeaguerBaseID: true, // typeName: Guid  desc: 会员id
  },
}, {
  name: 'getLgRoamRecordByCash',
  method: 'POST',
  desc: '漫游记录',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetLgRoamRecordByCash',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetLgRoamRecordByCash',
  params: {
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    PageInfo: true, // typeName: PageInfo  desc: 当前页数
    DateRange: false, // typeName: DateRange  desc: 日期范围
    StartTime: false, // typeName: String  desc: 记录开始时间
    EndTime: false, // typeName: String  desc: 记录结束时间
    RoamType: false, // RoamType: PageInfo  desc: 漫游类型
    ValueType: false, // ValueType: PageInfo  desc: 储值类型
  },
}, {
  name: 'getTransferInfoLog',
  method: 'POST',
  desc: '漫游日记',
  path: '/ProfessionalCash/api/v1.0/Leaguer/GetTransferInfoLog',
  mockPath: '/ProfessionalCash/api/v1.0/Leaguer/GetTransferInfoLog',
  params: {
    LeaguerID: false, // typeName: Guid  desc: 会员ID
    PageInfo: true, // typeName: PageInfo  desc: 当前页数
    DateRange: false, // typeName: DateRange  desc: 日期范围
    StartTime: false, // typeName: String  desc: 记录开始时间
    EndTime: false, // typeName: String  desc: 记录结束时间
    OperationState: false, // RoamType: PageInfo  desc: 操作状态
    ValueTypeCode: false, // ValueType: PageInfo  desc: 储值类型
  },
}, {
  name: 'getSubCardDeposit',
  method: 'POST',
  desc: '获取副卡押金',
  path: '/ProfessionalCash/api/v1.0/SubCard/GetSubCardDeposit',
  mockPath: '/ProfessionalCash/api/v1.0/SubCard/GetSubCardDeposit',
  params: {
  },
}, {
  name: 'getAllSubCard',
  method: 'POST',
  desc: '获取所有会员副卡',
  path: '/ProfessionalCash/api/v1.0/SubCard/GetAllSubCard',
  mockPath: '/ProfessionalCash/api/v1.0/SubCard/GetAllSubCard',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员id
  },
}, {
  name: 'addSubCard',
  method: 'POST',
  desc: '增加副卡',
  path: '/ProfessionalCash/api/v1.0/SubCard/AddSubCard',
  mockPath: '/ProfessionalCash/api/v1.0/SubCard/AddSubCard',
  params: {
    LeaguerID: true, // typeName: Guid  desc: 会员id
    PrintNumber: true, // typeName: String  desc: 印刷号
    CardNumber: true, // typeName: String  desc: 卡芯片号
  },
}, {
  name: 'cancelSubCard',
  method: 'POST',
  desc: '取消副卡',
  path: '/ProfessionalCash/api/v1.0/SubCard/CancelSubCard',
  mockPath: '/ProfessionalCash/api/v1.0/SubCard/CancelSubCard',
  params: {
    CardID: true, // typeName: Guid  desc: 卡id
  },
}, {
  name: 'updateSubCardState',
  method: 'POST',
  desc: '修改副卡状态',
  path: '/ProfessionalCash/api/v1.0/SubCard/UpdateSubCardState',
  mockPath: '/ProfessionalCash/api/v1.0/SubCard/UpdateSubCardState',
  params: {
    CardID: true, // typeName: Guid  desc: 卡id
    IsEnable: true, // typeName: Boolean  desc: 是否启用
  },
}];

/** **********
下方为接口的描述详情, 请根据相应的接口名称寻找描述详情

getCurBusinessPrepaid描述详情:
注销会员时
若FrozenPrepaid > 0 及UnJoinRate > 0时 需提示是否需要是否需要解冻预存款

*********** */
