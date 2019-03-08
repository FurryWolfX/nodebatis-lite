const _ = require("lodash");

module.exports.camelCase = function(data) {
  if (_.isArray(data)) {
    let array = [];
    for (let item of data) {
      let parsedItem = {};
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          parsedItem[_.camelCase(key)] = item[key];
        }
      }
      array.push(parsedItem);
    }
    return array;
  } else {
    let parsedData = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        parsedData[_.camelCase(key)] = data[key];
      }
    }
    return parsedData;
  }
};

module.exports.snakeCase = function(data) {
  if (_.isArray(data)) {
    let array = [];
    for (let item of data) {
      let parsedItem = {};
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          parsedItem[_.snakeCase(key)] = item[key];
        }
      }
      array.push(parsedItem);
    }
    return array;
  } else {
    let parsedData = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        parsedData[_.snakeCase(key)] = data[key];
      }
    }
    return parsedData;
  }
};
