const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getRatings(page = 1, sortBy = 'ratingId', orderBy = 'asc', filterBy = 'rating', filter = '%'){
    const offset = helper.getOffset(page, config.listPerPage);
    const filterType = helper.sanitiseParams(filterBy);
    const theFilter = helper.sanitiseParams(filter);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    console.log(filterType);
    var sql = format("SELECT * FROM ratings WHERE %s::text LIKE %L ORDER BY %s %s OFFSET %L LIMIT %L", 
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
    getRatings
}