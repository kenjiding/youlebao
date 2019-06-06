##### 读卡组件

- Options

参数 | 说明 | 类型 | 可选值 | 默认值
---  |---   | ---- | ------ | -----
value(v-model) | 卡ID / 身份证号 / | String
default-type | 默认类型 | String | member / idcard / keyboard | member
auto-logout | 自动登出 | Boolean | - | true
popover | 会员信息弹窗 | Boolean | - | true
verify-state | 是否验证会员状态 | Boolean | - | true
verify-date | 是否验证过期时间 | Boolean | - | true
verify-card-state | 验证卡片状态 | Boolean | - | true


- Events


事件名称 | 说明 | 回调参数
-------- | ---- | -------
change | 查询会员信息后触发 | 会员信息
logout | 登出后触发 | - 


- methods

方法名称 | 说明
-------- | ----
logout | 会员登出