##### 调用硬件api
> 单独调用`this.$device`的错误信息会统一弹出，不需要单独处理。只需要判断状态码（errorCode)是否为0

- 方法

方法名 | 说明
---|---
readerCall | 读卡器检测
readCard | 读会员卡
readIDCard | 读身份证

- 读卡器检测（readerCall）
> 返回参数，当读卡器存在返回0

- 读会员卡（readCard）
> 返回参数

参数 | 说明
---|---
cardNumber | 会员卡印刷号
cardID | 会员卡芯片ID
errorCode | 状态码，读卡成功为0
errorMsg | 错误信息

- 读身份证（readIDCard）


参数 | 说明
---|---
name | 姓名
sex | 性别
birthday | 生日
address | 地址
idCardNum | 身份证号
portrait | 头像base64
errorCode | 错误码
errorMsg | 错误信息
