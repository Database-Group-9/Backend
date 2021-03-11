const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getGenres(sortBy = 'genreId', orderBy = 'asc', filterBy = 'genre', filter = '%'){
    const filterType = helper.sanitiseParams(filterBy);
    const theFilter = helper.sanitiseParams(filter);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql = format("SELECT * FROM genres WHERE %s::text LIKE %L ORDER BY %s %s", 
                    filterType, theFilter, sort, order)
    const rows = await db.query(
        sql,
        []
    );
    const totalRows = rows.length
    const data = helper.emptyOrRows(rows)
    const meta = {sortBy,
                  orderBy,
                  filterBy,
                  filter,
                  totalRows
                };
    return{
        data, 
        meta
    }
}

module.exports = {
    getGenres
}