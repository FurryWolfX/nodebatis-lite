const mysql = require("mysql");

class Pool {
  /**
   * 通过配置构造连接池
   * @param config
   */
  constructor(config) {
    this.pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      charset: config.charset,
      connectionLimit: config.pool.connectionLimit,
    });
  }

  /**
   * 建立连接
   * @returns {Promise<any>}
   */
  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (!err) {
          // 为了对外暴露一致的接口
          connection._query = connection.query;
          resolve(connection);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * 获取事务
   * @returns {Promise<any>}
   */
  getTransactionConnection() {
    let that = this;
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (!err) {
          connection.beginTransaction(err => {
            if (!err) {
              connection._query = connection.query;
              resolve(connection);
            } else {
              reject(err);
            }
          });
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * 提交事务
   * @param connection
   * @returns {Promise<any>}
   */
  commit(connection) {
    return new Promise((resolve, reject) => {
      connection.commit(err => {
        if (!err) {
          resolve(true);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * 事务回滚
   * @param connection
   * @returns {Promise<unknown>}
   */
  rollback(connection) {
    return new Promise((resolve, reject) => {
      connection.rollback(() => {
        resolve(true);
      });
    });
  }

  /**
   * 释放连接
   * @param connection
   */
  release(connection) {
    connection.release();
  }
}

module.exports = Pool;
