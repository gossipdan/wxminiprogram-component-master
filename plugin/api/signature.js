const env = require('./oss');
const Base64 = require('./base64.js');
const Crypto_util = require('./crypto.js');
const Crypto = require('./hmac.js');
const sha = require('./sha1.js');
var signature = {
    get_signature: function () {
        const accesskey = env.AccessKeySecret;
        const policyBase64 = env.get_policy();
        const bytes = Crypto.HMAC(sha.SHA1, policyBase64, accesskey, {
            asBytes: true
        });
        const signature = Crypto_util.bytesToBase64(bytes);
        return signature;
    }
}
module.exports = signature;