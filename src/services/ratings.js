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
    var sql_0 = format("SELECT COUNT(*) FROM ratings WHERE %s::text LIKE %L", 
                    filterType, theFilter)
    const rowNums = await db.query(
        sql_0,
        []
    );
    var sql = format("SELECT * FROM ratings WHERE %s::text LIKE %L ORDER BY %s %s OFFSET %L LIMIT %L", 
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

async function getRatingsForGenreAndTag(tag=[], genreId=[]){
    var sql = helper.getRatingsSql(tag, genreId);
    const rows0 = await db.query(
        sql[0],
        []
    );
    const rows1 = await db.query(
        sql[1],
        []
    );
    const rows2 = await db.query(
        sql[2],
        []
    );

    
    const tags = helper.emptyOrRows(rows0)
    const genreIds = helper.emptyOrRows(rows1)
    const intersect = helper.emptyOrRows(rows2)
    // const intersectCount = intersect.length;
    // const intersectSum = 0
    // for(i=0; i < intersect.length; i++){
    //     intersectSum = intersectSum + intersect[i].avgrating
    // }
    // console.log(intersectSum)
    // const data2 = ((data0[0].avg * parseInt(data0[0].count)) + (data1[0].avg * parseInt(data1[0].count))) / (parseInt(data0[0].count) + parseInt(data1[0].count))
    const average = (tags[0].sum + genreIds[0].sum - intersect[0].sum) / (parseInt(tags[0].count) + parseInt(genreIds[0].count) - intersect[0].count)
    return{
        tags,
        genreIds,
        average
    }
}


async function getRatingsForTag(tag=[]){
    var sql = helper.getRatingsForMultipleTagsSql(tag);
    const rows = await db.query(
        sql,
        []
    );
    
    const data = helper.emptyOrRows(rows)
    const meta = {tag};
    return{
        data, 
        meta
    }
}

async function getRatingsForGenres(genreId=[]){
    const genreList = helper.sanitiseParams(genreId);
    var sql = helper.getRatingsForMultipleGenresSql(genreList)
    const rows = await db.query(
        sql,
        []
    );
    const data = helper.emptyOrRows(rows)
    const meta = {genreId};
    return{
        data, 
        meta
    }
}

async function getRatingsForAllGenres(orderBy = 'asc', sortBy = 'genreId'){
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql = format("SELECT b.genreId, AVG(b.avg) FROM (SELECT movie_genre.*, a.avg AS avg FROM movie_genre INNER JOIN (select movieId, AVG(rating) AS avg FROM ratings GROUP BY movieId) a ON a.movieId = movie_genre.movieiD ORDER BY genreid %s) b GROUP BY %s", 
                    order, sort)
    const rows = await db.query(
        sql,
        []
    );
    const totalRows = rows.length
    const data = helper.emptyOrRows(rows)
    const meta = {sortBy,
                  orderBy,
                  totalRows
                };
    return{
        data, 
        meta
    }
}

module.exports = {
    getRatings,
    getRatingsForTag,
    getRatingsForGenres,
    getRatingsForGenreAndTag,
    getRatingsForAllGenres
}