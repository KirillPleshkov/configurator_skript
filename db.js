import pkg from 'pg';
const {Pool} = pkg;

export const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'kir.kir@@',
    database: 'configurator',
    port: 5432,
})