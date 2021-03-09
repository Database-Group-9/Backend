const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getTags(page = 1, sortBy = 'tagId', orderBy = 'asc', filterBy = 'timestamp', filter = '%'){
    const offset = helper.getOffset(page, config.listPerPage);
    const filterType = helper.sanitiseParams(filterBy);
    const theFilter = helper.sanitiseParams(filter);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql = format("SELECT * FROM tags WHERE %s::text LIKE %L ORDER BY %s %s OFFSET %L LIMIT %L", 
                    filterType, theFilter, sort, order, offset, config.listPerPage)
    const rows = await db.query(
        sql,
        []
    );
    const data = helper.emptyOrRows(rows)
    const meta = {page,
                  sortBy,
                  orderBy,
                  filterBy,
                  filter
                };
    return{
        data, 
        meta
    }
}

module.exports = {
    getTags
}