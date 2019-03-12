# nodebatis-lite

简化和重构自 nodebatis

做了再三的考虑，为了以后支持多方言，nodebatis-lite 不包含 mysql 驱动，需要用户自己安装。

API 与 nodebatis 不完全兼容！（重要的话说三遍）

API 与 nodebatis 不完全兼容！（重要的话说三遍）

API 与 nodebatis 不完全兼容！（重要的话说三遍）

# Install

```bash
npm install @wolfx/nodebatis-lite mysql
```

或

```bash
yarn add @wolfx/nodebatis-lite mysql
```

# API

- Result execute(string sql, Array params) 执行原始 sql
- Result query(string key, Object data)
- Result insert(string tableName, Object data)
- Result update(string tableName, Object data, string idKey = "id")
- Result delete(string tableName, string|int id, string idKey)
- Pool getPool() 暴露原始 pool 给外部

# 示例代码

## 连接 mysql

```javascript
const NodebatisLite = require("@wolfx/nodebatis-lite");
const nodebatis = new NodebatisLite(path.resolve(__dirname, "./yaml"), {
  debug: true,
  debugCallback: (key, sql, params) => {
    // 这里可以接入log4js等
    // 使用debugCallback后debug不会输出log，需要在回调中自己处理
  },
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3306,
  database: "test",
  user: "root",
  password: "haosql",
  pool: {
    minSize: 5,
    maxSize: 20,
    connectionLimit: 5
  }
});
```

## 利用 find 快速查询数据

```javascript
let findTest = async () => {
  let ret = await nodebatis.find("test", ["*"], 1);
};
```

默认是通过 id 查询，当然，你可以指定字段名

```javascript
let findTest = async () => {
  let ret = await nodebatis.find("test", ["*"], 1, "yourName");
};
```

## 利用 insert 方法快速插入数据

```javascript
let insertTest = async () => {
  let ret = await nodebatis.insert("test", { age: 29, name: "peter" });
};
```

## 利用 update 方法快速更新数据

```javascript
let updateTest = async () => {
  let ret = await nodebatis.update("test", { id: 1, age: 21, name: "bezos" });
};
```

如果你的主键不叫 id，比如叫 yourKey

```javascript
let updateTest = async () => {
  let ret = await nodebatis.update(
    "test",
    { id: 1, age: 21, name: "bezos" },
    "yourKey"
  );
};
```

## 利用 delete 方法快速删除数据

```javascript
let deleteTest = async id => {
  let ret = await nodebatis.delete("test", id);
};
```

如果你的主键不叫 id，比如叫 yourKey

```javascript
let deleteTest = async id => {
  let ret = await nodebatis.delete("test", id, "yourKey");
};
```

## 通用查询

### 定义 YAML

```yaml
namespace: "test"

attrs: id, name, age

query:
  - select {{ test.attrs }} from test where
  - age > :age

forTest:
  - select * from test where
  - id in (
  - for:
      array: ids
      sql: :id
      seperator: ","
  - )
```

### 编写 JS

```javascript
// 查询处所有大于指定age的数据
let queryTest = async age => {
  try {
    let ret = await nodebatis.query("test.query", { age });
  } catch (e) {
    console.log(e);
  }
};
```

for 关键字使用示例

```javascript
// 查询出id是1或2或3的数据
let forTest = async () => {
  try {
    let ids = [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      }
    ];
    let ret = await nodebatis.query("test.forTest", { ids });
  } catch (e) {
    console.log(e);
  }
};
```

## 批量插入

```yaml
namespace: "test"

batchInsert:
  - insert into test(name, age) values
  - for:
      array: data
      sql: (:name, :age)
      seperator: ","
```

```javascript
let batchInsertTest = async () => {
  let ret = await nodebatis.query("test.batchInsert", {
    data: [
      {
        name: "batch-" + parseInt(Math.random() * 10),
        age: 18
      },
      {
        name: "batch-" + parseInt(Math.random() * 10),
        age: 19
      },
      {
        name: "batch-" + parseInt(Math.random() * 10),
        age: 17
      }
    ]
  });
};
```

## 执行原始 sql

```javascript
nodebatis.execute("ALTER TABLE test.test ADD column1 varchar(100) NULL;", []);
```
