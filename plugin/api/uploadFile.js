var env = require('./oss');
const Base64 = require('./base64.js');
const Crypto_util = require('./crypto.js');
const sign = require('./signature.js');
var utilMd5 = require('./md5.js');

const uploadFile = function (params) {
    if (!params.filePath || params.filePath.length < 9) {
        wx.showModal({
            title: '图片错误',
            content: '请重试',
            confirmColor: '#f55a45',
            showCancel: false,
        })
        return;
    }
    const md5 = utilMd5.hexMD5(params.filePath);
    const kind = params.filePath.split(".")[1];
    const aliyunFileKey = params.dir +env.file_path()+ md5+'.'+kind;
    const aliyunServerURL = env.uploadImageUrl;
    const accessid = env.OSSAccessKeyId;
    const policyBase64 = env.get_policy();
    const signature = 'lCETDBmBL56bSLWUi8DeXzCQD8k=';
    wx.uploadFile({
        url: aliyunServerURL,
        filePath: params.filePath,
        name: 'file',
        formData: {
            'key': aliyunFileKey,
            'OSSAccessKeyId': accessid,
            'policy': policyBase64,
            'signature': signature,
            'success_action_status': '200'
        },
        success: function (res) {
            if (res.statusCode != 200) {
                if (params.fail) {
                    params.fail(res)
                }
                return;
            }
            if (params.success) {
                params.success(aliyunFileKey);
            }
        },
        fail: function (err) {
            err.wxaddinfo = aliyunServerURL;
            if (params.fail) {
                params.fail(err)
            }
        },
        complete: function () {
            if (params.complete) {
                params.complete();
            }
        }
    })
}
module.exports = uploadFile;