const db = require('./db');
const helper = require('../helper');
var format = require('pg-format');

async function getTotalRows(table='movies'){
    const db_table = helper.sanitiseParams(table);
    var sql = format("SELECT COUNT(*) FROM %s", 
                    db_table)
    const rows = await db.query(
        sql,
        []
    );
    const data = helper.emptyOrRows(rows)
    const meta = {table};
    return{
        data, 
        meta
    }
}

module.exports = {
    getTotalRows
}