import { IPromise } from "./promise";
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
  pool?: PoolConfig
}

export default class NodeBatisLite {
  constructor(dir: string, config: NodeBatisLiteConfig);

  execute(sql: string, params: Array<any>): IPromise;

  query(key: string, data: Object): IPromise;

  insert(tableName: string, data: Object): IPromise;

  update(tableName: string, data: Object, idKey?: string): IPromise;

  del(tableName: string, id: string | number, idKey?: string): IPromise;

  find(tableName: string, dataArray: Array<string>, id: string, paramKey?: string): IPromise;

  getPool(): Pool
}

export function execute(sql: string, params: Array<any>): IPromise;
export function query(key: string, data: Object): IPromise;
export function insert(tableName: string, data: Object): IPromise;
export function update(tableName: string, data: Object, idKey?: string): IPromise;
export function del(tableName: string, id: string | number, idKey?: string): IPromise;
export function find(tableName: string, dataArray: Array<string>, id: string, paramKey?: string): IPromise;
export function getPool(): Pool;


