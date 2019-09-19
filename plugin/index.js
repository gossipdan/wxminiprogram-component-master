let data = require('./api/data.js');
let config = require('./api/config.js');
module.exports = {
  getData: data.getData,
  setData: data.setData, 
  config: config,
}