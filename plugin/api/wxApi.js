const Utils = require('./promise.js');
let nullFn = () => {
};
function IllegalAPIException(name) {
    this.message = "No Such API [" + name + "]";
    this.name = 'IllegalAPIException';
}
let services = {
    sleep: function (time) {
        return new Utils.Promise(function (resolve, reject) {
            setTimeout(resolve, time);
        })
    },
    stop: function() {
        return new Utils.Promise(function (resolve, reject) {
        })
    },
    taskSequence: function () {
        return new Utils.Promise(function (resolve, reject) {
            resolve()
        })
    }
};
const wsAPI = new Proxy(services, {
    get: function (target, property) {
        if (property in target) {
            return target[property];
        } else if (property in wx) {
            return (obj) => {
                return new Utils.Promise(function (resolve, reject) {
                    obj = obj || {};
                    obj.success = (...args) => {
                        resolve(...args)
                    };
                    obj.fail = (...args) => {
                        reject(...args);
                    };
                    obj.complete = nullFn;
                    wx[property](obj);
                });
            }
        } else {
            throw new IllegalAPIException(property);
        }
    }
});
module.exports = wsAPI;