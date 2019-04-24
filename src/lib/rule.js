const yaml = require("js-yaml");
const fs = require("fs");

class Rule {
  constructor(file) {
    this.doc = yaml.safeLoad(fs.readFileSync(file, "utf8"));
    this.namespace = this.doc.namespace;
    this.rawSql = new Map();
    this.getAllSql();
  }

  getAllSql() {
    Object.keys(this.doc).forEach(key => {
      if (key !== "namespace") {
        this.getSql(key, this.doc[key]);
      }
    });
  }

  /**
   * yaml sql 解析规则
   * @param name
   * @param sql
   */
  getSql(name, sql) {
    let sqls = [],
      cond = {};
    if (typeof sql === "string") {
      sqls.push(sql.replace(/\n/g, "").trim());
    } else {
      for (let s of sql) {
        if (typeof s === "string") {
          sqls.push(s.replace(/\n/g, "").trim());
        } else {
          for (let key in s) {
            if (s.hasOwnProperty(key)) {
              key = key.trim();
              cond = {};
              cond.name = key;
              switch (key) {
                case "if":
                  cond.test = s["if"].test;
                  cond.sql = s["if"].sql;
                  break;
                case "for":
                  cond.array = s["for"].array || [];
                  cond.sql = s["for"].sql || "";
                  cond.seperator = s["for"].seperator || ",";
                  break;
              }
            }
          }
          sqls.push(cond);
        }
      }
    }
    this.rawSql.set(name, sqls);
  }
}

module.exports = Rule;
