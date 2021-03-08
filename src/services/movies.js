const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAllMovies(page = 1, sortBy = 'movieId', orderBy = 'asc'){
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        'SELECT * FROM movies ORDER BY ' + sortBy +' ' + orderBy + ' OFFSET $1 LIMIT $2',
        [offset, config.listPerPage]
    );
    const data = helper.emptyOrRows(rows)
    const meta = {page,
                  sortBy,
                  orderBy
                };

    return{
        data, 
        meta
    }
}

module.exports = {
    getAllMovies
}