const NodebatisLite = require("../src/nodebatis-lite");
const path = require("path");

const nodebatis = new NodebatisLite(path.resolve(__dirname, "./yaml"), {
  debug: true,
  dialect: "mysql",
  host: "192.168.1.22",
  port: 3306,
  database: "test",
  user: "root",
  password: "junlian",
  camelCase: true,
  pool: {
    minSize: 5,
    maxSize: 20,
    acquireIncrement: 5,
  },
});

let transactionTest = async () => {
  let transaction = await nodebatis.getTransaction();
  try {
    let result3 = await transaction.update("test", { id: 2, name: "peter", age: 18 });
    let result1 = await transaction.insert("test", { name: "peter", age: 28 });
    let result2 = await transaction.query("test.query", { name: "peter" });
    await transaction.commit();
    return result1;
  } catch (e) {
    console.log(e);
    await transaction.rollback();
  }
};

(async function() {
  try {
    let result = await transactionTest();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
})();
