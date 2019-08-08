const _ = require("lodash");
const Pool = require("./lib/pool");
const SqlContainer = require("./lib/sqlContainer");
const builder = require("./lib/sqlBuilder");
const { snakeCase, camelCase } = require("./utils/caseHandle");

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
   * 处理debug
   * @param key
   * @param sql
   * @param params
   */
  handleDebug(key, sql, params) {
    if (this.debug) {
      if (this.debugCallback && typeof this.debugCallback === "function") {
        this.debugCallback(key, sql, params || "");
      } else {
        console.info(key, sql, params || "");
      }
    }
  }

  /**
   * 执行 原始sql
   * await nodebatis.execute("ALTER TABLE test.test ADD column1 varchar(100) NULL;", []);
   * @param sql
   * @param params
   * @param transactionConnection
   * @returns {Promise<*>}
   */
  async execute(sql, params = [], transactionConnection) {
    const key = "execute sql ";
    this.handleDebug(key, sql, params);
    let result = await this.pool.query(sql, params, transactionConnection);
    if (this.config.camelCase === true) {
      result = camelCase(result);
    }
    return result;
  }

  /**
   * 通用查询
   * await nodebatis.query("test.forTest", { ids });
   * @param key
   * @param data
   * @param transactionConnection
   * @returns {Promise<*>}
   */
  async query(key, data, transactionConnection) {
    let sqlObj = this.sqlContainer.get(key, data);
    this.handleDebug(key, sqlObj.sql, sqlObj.params);
    let result = await this.pool.query(sqlObj.sql, sqlObj.params, transactionConnection);
    if (this.config.camelCase === true) {
      result = camelCase(result);
    }
    return result;
  }

  /**
   * 构建插入sql，提供外部使用
   * await nodebatis.insert("test", { age: 29, name: "peter", nickName: "pp" });
   * @param tableName
   * @param data
   * @param transactionConnection
   * @returns {Promise<*>}
   */
  async insert(tableName, data, transactionConnection) {
    if (tableName && data) {
      if (this.config.camelCase === true) {
        data = snakeCase(data);
      }
      let sqlObj = builder.getInsertSql(tableName, data);
      let key = `_auto_builder_insert_${tableName}`;
      this.handleDebug(key, sqlObj.sql, sqlObj.params);
      return await this.pool.query(sqlObj.sql, sqlObj.params, transactionConnection);
    } else {
      throw new Error("insert() need tableName and data");
    }
  }

  /**
   * 构建更新sql，提供外部使用
   * await nodebatis.update("test", { id: 1, age: 21, name: "bezos" })
   * @param tableName
   * @param data
   * @param idKey 主键的名字
   * @param transactionConnection
   * @returns {Promise<*>}
   */
  async update(tableName, data, idKey = "id", transactionConnection) {
    if (tableName && data) {
      if (this.config.camelCase === true) {
        data = snakeCase(data);
        idKey = _.snakeCase(idKey);
      }
      let sqlObj = builder.getUpdateSql(tableName, data, idKey);
      let key = `_auto_builder_update_${tableName}`;
      this.handleDebug(key, sqlObj.sql, sqlObj.params);
      return await this.pool.query(sqlObj.sql, sqlObj.params, transactionConnection);
    } else {
      throw new Error("update() need tableName and data");
    }
  }

  /**
   * 构建删除sql，提供外部使用
   * await nodebatis.del("test", id, "id")
   * @param tableName
   * @param id
   * @param idKey 主键的名字
   * @param transactionConnection
   * @returns {Promise<*>}
   */
  async del(tableName, id, idKey = "id", transactionConnection) {
    if (tableName && id) {
      let sqlObj = builder.getDeleteSql(tableName, id, idKey);
      let key = `_auto_builder_delete_${tableName}`;
      this.handleDebug(key, sqlObj.sql, sqlObj.params);
      return await this.pool.query(sqlObj.sql, sqlObj.params, transactionConnection);
    } else {
      throw new Error("delete() need tableName and id");
    }
  }

  /**
   * 构建简易的查询sql
   * await nodebatis.find("test", ["*"], 1, "id");
   * @param tableName
   * @param dataArray 需要查询的字段名的数组
   * @param param 参数
   * @param paramKey 参数的字段名
   * @param transactionConnection
   * @returns {Promise<*>}
   */
  async find(tableName, dataArray, param, paramKey = "id", transactionConnection) {
    if (tableName && dataArray && param) {
      let sqlObj = builder.getFindSql(tableName, dataArray, param, paramKey);
      let key = `_auto_builder_find_${tableName}`;
      this.handleDebug(key, sqlObj.sql, sqlObj.params);
      return await this.pool.query(sqlObj.sql, sqlObj.params, transactionConnection);
    } else {
      throw new Error("find() need tableName and dataArray and id");
    }
  }

  async beginTransaction() {
    let transactionConnection = await this.pool.beginTransaction();
    transactionConnection.execute = async (sql, params = []) => {
      return await this.execute(sql, params, transactionConnection);
    };
    return transactionConnection;
  }

  async commit(transactionConnection) {
    return await this.pool.commit(transactionConnection);
  }

  async rollback(transactionConnection) {
    await this.pool.rollback(transactionConnection);
  }

  /**
   * 获取事务连接
   * @returns {Promise<*>}
   */
  async getTransaction() {
    let transactionConnection = await this.beginTransaction();
    return {
      connection: transactionConnection,
      execute: async (key, data) => {
        return await this.execute(key, data, transactionConnection);
      },
      query: async (key, data) => {
        return await this.query(key, data, transactionConnection);
      },
      find: async (tableName, dataArray, id, paramKey) => {
        return await this.find(tableName, dataArray, id, paramKey, transactionConnection);
      },
      insert: async (tableName, data) => {
        return await this.insert(tableName, data, transactionConnection);
      },
      update: async (tableName, data, idKey) => {
        return await this.update(tableName, data, idKey, transactionConnection);
      },
      del: async (tableName, id, idKey) => {
        return await this.del(tableName, id, idKey, transactionConnection);
      },
      commit: async () => {
        let ret = null;
        try {
          ret = await this.commit(transactionConnection);
        } catch (e) {
          throw new Error("transaction commit error. 事务提交失败。");
        } finally {
          transactionConnection.release();
        }
        return ret;
      },
      rollback: async () => {
        let ret = null;
        try {
          ret = await this.rollback(transactionConnection);
        } catch (e) {
          throw new Error("transaction rollback error. 事务回滚失败。");
        } finally {
          transactionConnection.release();
        }
        return ret;
      },
    };
  }

  /**
   * 暴露原始pool给外部
   */
  getPool() {
    return this.pool.getNativePool();
  }
}

module.exports = NodebatisLite;
