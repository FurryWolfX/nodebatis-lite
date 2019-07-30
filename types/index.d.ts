import { Pool } from "mysql";

export interface PoolConfig {
  minSize: number;
  maxSize: number;
  connectionLimit: number;
}

export interface NodeBatisLiteConfig {
  debug?: boolean;
  debugCallback?: Function;
  dialect: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  camelCase?: boolean;
  pool?: PoolConfig;
}

// 针对 ES6 和 TS
export default class NodeBatisLite {
  constructor(dir: string, config: NodeBatisLiteConfig);
  execute(sql: string, params?: Array<string | number>): Promise<any>;
  query(key: string, data: Object): Promise<any>;
  insert(tableName: string, data: Object): Promise<any>;
  update(tableName: string, data: Object, idKey?: string): Promise<any>;
  del(tableName: string, id: string | number | Array<string | number>, idKey?: string): Promise<any>;
  find(tableName: string, dataArray: Array<string>, id: string, paramKey?: string): Promise<any>;
  getTransaction(): Promise<{
    execute(sql: string, params?: Array<string | number>): Promise<any>;
    query(key: string, data: Object): Promise<any>;
    insert(tableName: string, data: Object): Promise<any>;
    update(tableName: string, data: Object, idKey?: string): Promise<any>;
    del(tableName: string, id: string | number | Array<string | number>, idKey?: string): Promise<any>;
    find(tableName: string, dataArray: Array<string>, id: string, paramKey?: string): Promise<any>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
  }>;
  getPool(): Pool;
}

// 针对 CMD
export function execute(sql: string, params?: Array<string | number>): Promise<any>;
export function query(key: string, data: Object): Promise<any>;
export function insert(tableName: string, data: Object): Promise<any>;
export function update(tableName: string, data: Object, idKey?: string): Promise<any>;
export function del(tableName: string, id: string | number | Array<string | number>, idKey?: string): Promise<any>;
export function find(tableName: string, dataArray: Array<string>, id: string, paramKey?: string): Promise<any>;
export function getTransaction(): Promise<{
  execute(sql: string, params?: Array<string | number>): Promise<any>;
  query(key: string, data: Object): Promise<any>;
  insert(tableName: string, data: Object): Promise<any>;
  update(tableName: string, data: Object, idKey?: string): Promise<any>;
  del(tableName: string, id: string | number | Array<string | number>, idKey?: string): Promise<any>;
  find(tableName: string, dataArray: Array<string>, id: string, paramKey?: string): Promise<any>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}>;
export function getPool(): Pool;
