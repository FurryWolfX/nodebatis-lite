class Pool {
  constructor(config) {
    // 以mysql的配置为基准
    this.config = Object.assign(
      {
        dialect: "mysql",
        host: "127.0.0.1",
        port: null,
        database: null,
        user: null,
        password: null,
        charset: "utf8",
        camelCase: false,
        pool: {
          minSize: 5,
          maxSize: 20,
          acquireIncrement: 5,
        },
      },
      config,
    );
    // 根据方言获取相应的_pool, API以mysql为基准
    if (this.config.dialect === "mysql") {
      const MysqlPool = require("./dialects/mysql/pool");
      this._pool = new MysqlPool(this.config);
    }
  }

  async getConnection() {
    return await this._pool.getConnection();
  }

  async query(sql, params, transactionConnection) {
    try {
      params = params || [];
      let connection = transactionConnection || (await this.getConnection());
      return new Promise((resolve, reject) => {
        connection._query(sql, params, (err, results) => {
          if (!err) {
            resolve(results);
          } else {
            reject(err);
          }
          if (!transactionConnection) {
            // 如果不是事务，执行完毕就关闭连接
            connection.release();
          }
        });
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  get dialect() {
    return this.config.dialect;
  }

  get host() {
    return this.config.host;
  }

  get port() {
    if (this.config.port) {
      return this.config.port;
    } else {
      throw new Error("the port is null, please set port");
    }
  }

  get user() {
    if (this.config.user) {
      return this.config.user;
    } else {
      throw new Error("the user is null, please set user");
    }
  }

  get password() {
    if (this.config.password) {
      return this.config.password;
    } else {
      throw new Error("the password is null, please set password");
    }
  }

  /**
   * 暴露原始pool给外部
   */
  getNativePool() {
    return this._pool.pool;
  }
}

module.exports = Pool;
