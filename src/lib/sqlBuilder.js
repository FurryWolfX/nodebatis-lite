const { escapeId } = require("sqlstring");
const _ = require("lodash");

/**
 * 处理插入语句和参数
 * @param tableName
 * @param data
 * @returns {{params: Array, sql: string}}
 */
exports.getInsertSql = (tableName, data) => {
  const columns = [],
    params = [],
    holders = [];
  const _tableName = escapeId(tableName);
  Object.keys(data).forEach(key => {
    columns.push(escapeId(key));
    holders.push("?");
    params.push(data[key]);
  });
  const columnsString = columns.join(",");
  const holdersString = holders.join(",");
  const sql = `insert into ${_tableName} (${columnsString}) values (${holdersString})`;
  return { sql, params };
};

/**
 * 处理更新语句和参数
 * @param tableName
 * @param data
 * @param idKey
 * @returns {{params: Array, sql: string}}
 */
exports.getUpdateSql = (tableName, data, idKey = "id") => {
  const params = [],
    holders = [];
  let where = "";
  const _tableName = escapeId(tableName);
  Object.keys(data).forEach(key => {
    if (key !== idKey) {
      holders.push(`${escapeId(key)} = ?`);
      params.push(data[key]);
    }
  });
  const holdersString = holders.join(",");
  if (data.hasOwnProperty(idKey)) {
    where = `where ${escapeId(idKey)} = ?`;
    params.push(data[idKey]);
  }
  const sql = `update ${_tableName} set ${holdersString} ${where}`;
  return { sql, params };
};

/**
 * 处理删除语句
 * @param tableName
 * @param id 可以是数组，如果是数组就批量删除
 * @param idKey
 * @returns {{params: Object, sql: string}}
 */
exports.getDeleteSql = (tableName, id, idKey = "id") => {
  const _tableName = escapeId(tableName);
  const _idKey = escapeId(idKey);
  if (_.isArray(id)) {
    const idArray = id;
    let sql = `delete from ${_tableName} where `;
    const conditions = [];
    idArray.forEach(() => conditions.push(`${_idKey} = ?`));
    sql += conditions.join(" or ");
    return {
      sql: sql,
      params: id,
    };
  } else {
    const sql = `delete from ${_tableName} where ${_idKey} = ?`;
    return {
      sql: sql,
      params: [id],
    };
  }
};

/**
 * 通过ID查找
 * @param tableName
 * @param dataArray
 * @param id
 * @param paramKey
 * @returns {{params: *[], sql: string}}
 */
exports.getFindSql = (tableName, dataArray, id, paramKey = "id") => {
  const _tableName = escapeId(tableName);
  const _paramKey = escapeId(paramKey);
  const _data = dataArray.join(",");
  const sql = `select ${_data} from ${_tableName} where ${_paramKey} = ?`;
  return {
    sql: sql,
    params: [id],
  };
};
