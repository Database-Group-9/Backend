const db = require('./db');
const helper = require('../helper');
var format = require('pg-format');

async function getTotalRows(table='movies'){
    const db_table = helper.sanitiseParams(table);
    var sql = format("SELECT COUNT(*) as count FROM %s", 
                    db_table)
    const rows = await db.totalRowsQuery(
        sql,
        []
    );
    const data = helper.emptyOrRows(rows)
    return{
        data, 
        table
    }
}

module.exports = {
    getTotalRows
}