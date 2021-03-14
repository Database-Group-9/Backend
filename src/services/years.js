const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getYears(page = 1, sortBy = 'year', orderBy = 'asc', filterBy = 'year', filter = '%'){
    config.listPerPage = 20
    const offset = helper.getOffset(page, config.listPerPage);
    const filterType = helper.sanitiseParams(filterBy);
    const theFilter = helper.sanitiseParams(filter);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql_0 = format("SELECT COUNT(DISTINCT(year)) FROM movies WHERE %s::text LIKE %L", 
                    filterType, theFilter)
    const rowNums = await db.query(
        sql_0,
        []
    );
    var sql = format("SELECT DISTINCT(year) FROM movies WHERE %s::text LIKE %L ORDER BY %s %s", 
                    filterType, theFilter, sort, order, offset, config.listPerPage)
    const rows = await db.query(
        sql,
        []
    );
    // const totalPage = Math.ceil((rowNums[0].count)/ config.listPerPage)
    const totalRows = rows.length
    const data = helper.emptyOrRows(rows)
    const meta = {page,
                  sortBy,
                  orderBy,
                  filterBy,
                  filter,
                  totalRows
                //   totalPage
                };
    return{
        data, 
        meta
    }
}

module.exports = {
    getYears
}