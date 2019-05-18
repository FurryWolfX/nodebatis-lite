const NodeBatisLite = require("../src/nodebatis-lite");
const path = require("path");

const nodebatis = new NodeBatisLite(path.resolve(__dirname, "./yaml"), {
  debug: true,
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3306,
  database: "test",
  user: "root",
  password: "haosql",
  camelCase: true,
  pool: {
    minSize: 5,
    maxSize: 20,
    acquireIncrement: 5
  }
});

let insertTest = async () => {
  let ret = await nodebatis.insert("test", { age: 29, name: "peter", nickName: "pp" });
  console.log("insertTest:", ret);
};

let queryTest = async age => {
  try {
    let ret = await nodebatis.query("test.query", { age });
    console.log("queryTest:", JSON.stringify(ret));
  } catch (e) {
    console.log(e);
  }
};

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
  console.log("bathInsertTest:", ret);
};

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
    console.log("forTest:", JSON.stringify(ret));
  } catch (e) {
    console.log(e);
  }
};

let updateTest = async () => {
  let ret = await nodebatis.update("test", { id: 1, age: 21, name: "bezos" });
  console.log("updateTest", ret);
};

let deleteTest = async id => {
  let ret = await nodebatis.del("test", id);
  console.log("deleteTest", ret);
};

let findTest = async () => {
  let ret = await nodebatis.find("test", ["*"], 1);
  console.log("findTest", ret);
};

let ifTest = async () => {
  let ret = await nodebatis.query("test.ifTest", {param: 0});
  console.log("ifTest", ret);
};

// ifTest();
insertTest()
  .then(() => queryTest(18))
  .then(() => batchInsertTest())
  .then(() => forTest())
  .then(() => updateTest());

// deleteTest(12);
// deleteTest([4, "6"]);

// nodebatis.execute("ALTER TABLE test.test ADD column1 varchar(100) NULL;", []);

// findTest();
