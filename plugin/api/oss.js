var Base64 = require('./base64');
var oss = {
    OSSAccessKeyId:'073bZXbGCy8GMitg',
    AccessKeySecret: 'j7XAXyiPTD1vEV3HQPl65t2FX0SKV7',
    uploadImageUrl: 'https://colorvwxapp.oss-cn-shanghai.aliyuncs.com',
    get_policy: function () {
        var policyText = {
            "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
            "conditions": [
                ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
            ]
        };
        return Base64.encode(JSON.stringify(policyText))
    },
    file_path: function () {
        var currentdate = "";
        var date = new Date();
        var seperator1 = "";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate+'/';
    },
    uuid:function(){
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); 
      }
      return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
    }
}
module.exports = oss;