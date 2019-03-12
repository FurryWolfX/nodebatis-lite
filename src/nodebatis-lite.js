const _ = require("lodash");
const Pool = require("./lib/pool");
const SqlContainer = require("./lib/sqlContainer");
const builder = require("./lib/sqlBuilder");
const snakeCase = require("./utils/caseHandle").snakeCase;
const camelCase = require("./utils/caseHandle").camelCase;

class NodebatisLite {
  constructor(dir, config) {
    if (!dir) {
      throw new Error("please set dir!");
    }
    if (!config) {
      throw new Error("please set config!");
    }
    this.debug = config.debug || false;
    this.debugCallback = config.debugCallback;
    this.config = config;
    this.pool = new Pool(config);
    this.sqlContainer = new SqlContainer(dir);
  }

  /**
   * 执行
   */
  async execute(sql, params) {
    const key = "execute sql ";
    if (this.debug) {
      if (this.debugCallback && typeof this.debugCallback === "function") {
        this.debugCallback(key, sql, params);
      } else {
        console.info(key, sql, params || "");
      }
    }
    let result = await this.pool.query(key, sql, params);
    if (this.config.camelCase === true) {
      result = camelCase(result);
    }
    return result;
  }

  async query(key, data) {
    let sqlObj = this.sqlContainer.get(key, data);
    if (this.debug) {
      if (this.debugCallback && typeof this.debugCallback === "function") {
        this.debugCallback(key, sqlObj.sql, sqlObj.params || "");
      } else {
        console.info(key, sqlObj.sql, sqlObj.params || "");
      }
    }
    let result = await this.pool.query(key, sqlObj.sql, sqlObj.params);
    if (this.config.camelCase === true) {
      result = camelCase(result);
    }
    return result;
  }

  /**
   * 构建插入sql，提供外部使用
   * @param tableName
   * @param data
   * @returns {Promise<*>}
   */
  async insert(tableName, data) {
    if (tableName && data) {
      if (this.config.camelCase === true) {
        data = snakeCase(data);
      }
      let sqlObj = builder.getInsertSql(tableName, data);
      let key = `_auto_builder_insert_${tableName}`;
      if (this.debug) {
        if (this.debugCallback && typeof this.debugCallback === "function") {
          this.debugCallback(key, sqlObj.sql, sqlObj.params || "");
        } else {
          console.info(key, sqlObj.sql, sqlObj.params || "");
        }
      }
      return await this.pool.query(key, sqlObj.sql, sqlObj.params);
    } else {
      console.error("insert need tableName and data");
    }
  }

  /**
   * 构建更新sql，提供外部使用
   * @param tableName
   * @param data
   * @param idKey 主键的名字
   * @returns {Promise<*>}
   */
  async update(tableName, data, idKey = "id") {
    if (tableName && data) {
      if (this.config.camelCase === true) {
        data = snakeCase(data);
        idKey = _.snakeCase(idKey);
      }
      let sqlObj = builder.getUpdateSql(tableName, data, idKey);
      let key = `_auto_builder_update_${tableName}`;
      if (this.debug) {
        if (this.debugCallback && typeof this.debugCallback === "function") {
          this.debugCallback(key, sqlObj.sql, sqlObj.params || "");
        } else {
          console.info(key, sqlObj.sql, sqlObj.params || "");
        }
      }
      return await this.pool.query(key, sqlObj.sql, sqlObj.params);
    } else {
      console.error("update need tableName and data");
    }
  }

  /**
   * 构建删除sql，提供外部使用
   * @param tableName
   * @param id
   * @param idKey 主键的名字
   * @returns {Promise<*>}
   */
  async delete(tableName, id, idKey) {
    if (tableName && id) {
      let sqlObj = builder.getDeleteSql(tableName, id, idKey);
      let key = `_auto_builder_delete_${tableName}`;
      if (this.debug) {
        if (this.debugCallback && typeof this.debugCallback === "function") {
          this.debugCallback(key, sqlObj.sql, sqlObj.params || "");
        } else {
          console.info(key, sqlObj.sql, sqlObj.params || "");
        }
      }
      return await this.pool.query(key, sqlObj.sql, sqlObj.params);
    } else {
      console.error("delete need tableName and id");
    }
  }

  /**
   * 构建简易的查询sql
   * @param tableName
   * @param dataArray 需要查询的字段名的数组
   * @param id
   * @param paramKey
   * @returns {Promise<*>}
   */
  async find(tableName, dataArray, id, paramKey) {
    if (tableName && dataArray && id) {
      let sqlObj = builder.getFindSql(tableName, dataArray, id, paramKey);
      let key = `_auto_builder_find_${tableName}`;
      if (this.debug) {
        if (this.debugCallback && typeof this.debugCallback === "function") {
          this.debugCallback(key, sqlObj.sql, sqlObj.params || "");
        } else {
          console.info(key, sqlObj.sql, sqlObj.params || "");
        }
      }
      return await this.pool.query(key, sqlObj.sql, sqlObj.params);
    } else {
      console.error("find need tableName and dataArray and id");
    }
  }

  /**
   * 暴露原始pool给外部
   */
  getPool() {
    return this.pool.getPool();
  }
}

module.exports = NodebatisLite;
