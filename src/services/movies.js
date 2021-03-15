const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getMovies(page = 1, sortBy = 'movieId', orderBy = 'asc', filterBy = 'title', filter = '%'){
    const offset = helper.getOffset(page, config.listPerPage);
    const filterType = helper.sanitiseParams(filterBy);
    const theFilter = helper.sanitiseParams(filter);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql_0 = format("SELECT COUNT(*) FROM movies WHERE %s ILIKE '%%%s%%'", 
                    filterType, theFilter)
    const rowNums = await db.query(
        sql_0,
        []
    );
    var sql = format("SELECT * FROM movies WHERE %s ILIKE '%%%s%%' ORDER BY %s %s OFFSET %L LIMIT %L", 
                    filterType, theFilter, sort, order, offset, config.listPerPage)
    console.log(sql)
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

async function getFilteredMovies(page = 1, sortBy = 'movieId', orderBy = 'asc', genre = [], years=[]){
    const offset = helper.getOffset(page, config.listPerPage);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    const sqlInput = helper.getFilteredMoviesSql(genre, years, sort, order, offset, config.listPerPage);
    const sqlEnhancedInput = helper.getEnhancedFilteredMoviesSql(genre, years);
    const rowNums = await db.query(
        sqlEnhancedInput,
        []
    );
    const rows = await db.query(
        sqlInput,
        []
    );
    const data = helper.emptyOrRows(rows)
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


async function getPopularMovies(page = 1, orderBy = 'desc'){
    const offset = helper.getOffset(page, config.listPerPage);
    const order = helper.sanitiseParams(orderBy);
    var sql_0 = format("SELECT COUNT(b.movieId) from " + 
                        "(SELECT movies.* FROM movies INNER JOIN " + 
                        "(SELECT movieId, COUNT(rating) AS noOfRatings FROM ratings GROUP BY movieId) a ON " + 
                        "a.movieId = movies.movieId ORDER BY noOfRatings %s)b ;", 
                        order)
    const rowNums = await db.query(
        sql_0,
        []
    );
    var sql = format("SELECT movies.*, a.noOfRatings FROM movies INNER JOIN " + 
                    "(SELECT movieId, COUNT(rating) AS noOfRatings FROM ratings GROUP BY movieId) a " +
                    "ON a.movieId = movies.movieId ORDER BY noOfRatings %s OFFSET %L LIMIT %L", 
                    order, offset, config.listPerPage)
    const rows = await db.query(
        sql,
        []
    );
    const totalPage = Math.ceil((rowNums[0].count)/ config.listPerPage)
    const totalRows = rows.length 
    const data = helper.emptyOrRows(rows)
    const meta = {page,
                  orderBy,
                  totalRows,
                  totalPage
                };
    return{
        data, 
        meta
    }
}

async function getPolarisingMovies(page = 1, orderBy = 'desc', ratingsCount = 20){
    const offset = helper.getOffset(page, config.listPerPage);
    const order = helper.sanitiseParams(orderBy);
    const count = helper.sanitiseParams(ratingsCount);
    var sql_0 = format("SELECT COUNT(b.movieId) FROM (SELECT movies.*, a.std FROM movies INNER JOIN " + 
                        "(SELECT movieId, STDDEV(rating) AS std FROM ratings GROUP BY movieId HAVING COUNT(movieId) > %s)a " + 
                        "ON a.movieId = movies.movieId ORDER BY std %s)b;", 
                        count, order)
    const rowNums = await db.query(
        sql_0,
        []
    );
    var sql = format("SELECT movies.*, a.std FROM movies INNER JOIN " + 
                    "(SELECT movieId, STDDEV(rating) AS std FROM ratings GROUP BY movieId HAVING COUNT(movieId) > %s)a " + 
                    "ON a.movieId = movies.movieId ORDER BY std %s OFFSET %L LIMIT %L;", 
                    count, order, offset, config.listPerPage)
    console.log(sql)
    const rows = await db.query(
        sql,
        []
    );
    const totalPage = Math.ceil((rowNums[0].count)/ config.listPerPage)
    const totalRows = rows.length 
    const data = helper.emptyOrRows(rows)
    const meta = {page,
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
    getFilteredMovies,
    getPopularMovies,
    getPolarisingMovies
}