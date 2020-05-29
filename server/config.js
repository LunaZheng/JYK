/*
七牛云配置
*/
const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'n-p-Jo4ABdWaJR_coBUCPQLyUdcmz46KH-a1fXnN'
const secretKey = 'fA970fb-F6A0-aAs83vlRM2tDYdkbZxrzSRuySY-'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: 'test-bfl',
  expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

module.exports = {
  uploadToken
}
