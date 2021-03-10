var format = require('pg-format');

function getOffset(currentPage = 1, listPerPage){
    return (currentPage - 1) * [listPerPage];
}

function sanitiseParams(params){
    if(!NaN){
        return params;
    }
}

function getSql(genreList, sortBy, orderBy, offset, limit){
    if(genreList === undefined){
        throw 'Genre list does not exist!'
    }
    if(genreList.length == 0){
        genreList.push('%')
    }
    var sqlInput = format("SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE '%'))", genreList[0]);
    for(i = 1; i < genreList.length; i++){
        sqlInput = sqlInput.concat(format(" INTERSECT SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L))", genreList[i]))
    }
    var finalSql = sqlInput.concat(format(" ORDER BY %s %s OFFSET %L LIMIT %L", sortBy, orderBy, offset, limit));
    return finalSql
}

function getEnhancedSql(genreList, sortBy, orderBy){
    if(genreList === undefined){
        throw 'Genre list does not exist!'
    }
    if(genreList.length == 0){
        genreList.push('%')
    }
    var sqlInput = format("SELECT COUNT(b.movieId) FROM (SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L))", genreList[0]);
    for(i = 1; i < genreList.length; i++){
        sqlInput = sqlInput.concat(format(" INTERSECT SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L))", genreList[i]))
    }
    sqlInput = sqlInput.concat(")b")
    return sqlInput
}

function emptyOrRows(rows){
    if(!rows){
        return [];
    }
    return rows;
}

module.exports = {
    getOffset,
    getSql,
    getEnhancedSql,
    emptyOrRows,
    sanitiseParams
}