const {Pool, Client} = require('pg');
const config = require('../config');
const pool = new Pool(config.db)
const client = new Client(config.db);

async function query(query, params){
    const {rows, fields} = await pool.query(query, params);
    //const {rows, fields} = await client.query(query, params);
    return rows;
}

module.exports = {
    query
};