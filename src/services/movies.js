const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getMovies(page = 1, sortBy = 'movieId', orderBy = 'asc', filterBy = 'year', filter = '%'){
    const offset = helper.getOffset(page, config.listPerPage);
    const filterType = helper.sanitiseParams(filterBy);
    const theFilter = helper.sanitiseParams(filter);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql_0 = format("SELECT COUNT(*) FROM movies WHERE %s::text LIKE %L", 
                    filterType, theFilter)
    const rowNums = await db.query(
        sql_0,
        []
    );
    var sql = format("SELECT * FROM movies WHERE %s::text LIKE %L ORDER BY %s %s OFFSET %L LIMIT %L", 
                    filterType, theFilter, sort, order, offset, config.listPerPage)
    const rows = await db.query(
        sql,
        []
    );
    const totalPage = Math.ceil((rowNums[0].count)/ config.listPerPage)
    const totalRows = rows.length
    const data = helper.emptyOrRows(rows)
    const meta = {page,
                  sortBy,
                  orderBy,
                  filterBy,
                  filter,
                  totalRows,
                  totalPage
                };
    return{
        data, 
        meta
    }
}

async function getFilteredMoviesByGenre(page = 1, sortBy = 'movieId', orderBy = 'asc', genre = []){
    const offset = helper.getOffset(page, config.listPerPage);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    const sqlInput = helper.getFilteredMoviesByGenreSql(genre, sort, order, offset, config.listPerPage);
    const sqlEnhancedInput = helper.getEnhancedFilteredMoviesByGenreSql(genre);
    const rowNums = await db.query(
        sqlEnhancedInput,
        []
    );
    const rows = await db.query(
        sqlInput,
        []
    );
    const data = helper.emptyOrRows(rows)
    console.log(rowNums)
    const totalPage = Math.ceil((rowNums[0].count)/ config.listPerPage)
    const totalRows = rows.length
    const meta = {page,
                  sortBy,
                  orderBy,
                  totalRows,
                  totalPage
                };
    return{
        data, 
        meta
    }
}

async function getFilteredMoviesByYearRange(page = 1, sortBy = 'movieId', orderBy = 'asc', years= []){
    const offset = helper.getOffset(page, config.listPerPage);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    const sqlInput = helper.getFilteredMoviesByYearSql(years, sort, order, offset, config.listPerPage);
    const sqlEnhancedInput = helper.getEnhancedFilteredMoviesByYearSql(years);
    const rowNums = await db.query(
        sqlEnhancedInput,
        []
    );
    const rows = await db.query(
        sqlInput,
        []
    );
    const data = helper.emptyOrRows(rows)
    console.log(rowNums)
    const totalPage = Math.ceil((rowNums[0].count)/ config.listPerPage)
    const totalRows = rows.length
    const meta = {page,
                  sortBy,
                  orderBy,
                  totalRows,
                  totalPage
                };
    return{
        data, 
        meta
    }
}

module.exports = {
    getMovies,
    getFilteredMoviesByGenre,
    getFilteredMoviesByYearRange
}