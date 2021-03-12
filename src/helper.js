var format = require('pg-format');

function getOffset(currentPage = 1, listPerPage){
    return (currentPage - 1) * [listPerPage];
}

function sanitiseParams(params){
    if(!NaN){
        return params;
    }
}

function getFilteredMoviesByGenreSql(genreList, sortBy, orderBy, offset, limit){
    if(genreList === undefined){
        throw 'Genre list does not exist!'
    }
    if(genreList.length == 0){
        genreList.push('%')
    }
    var sqlInput = format("SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId::text LIKE %L)", genreList[0]);
    for(i = 1; i < genreList.length; i++){
        sqlInput = sqlInput.concat(format(" INTERSECT SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L))", genreList[i]))
    }
    var finalSql = sqlInput.concat(format(" ORDER BY %s %s OFFSET %L LIMIT %L", sortBy, orderBy, offset, limit));
    return finalSql
}

function getEnhancedFilteredMoviesByGenreSql(genreList){
    if(genreList === undefined){
        throw 'Genre list does not exist!'
    }
    if(genreList.length == 0){
        genreList.push('%')
    }
    var sqlInput = format("SELECT COUNT(b.movieId) FROM (SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId::text LIKE %L)", genreList[0]);
    for(i = 1; i < genreList.length; i++){
        sqlInput = sqlInput.concat(format(" INTERSECT SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L))", genreList[i]))
    }
    sqlInput = sqlInput.concat(")b")
    return sqlInput
}

function getFilteredMoviesByYearSql(yearList, sortBy, orderBy, offset, limit){
    if(yearList === undefined){
        throw 'Year list does not exist!'
    }
    if(yearList.length == 0){
        yearList.push('0')
    }
    if(yearList.length > 2){
        throw 'Year list can only have up to two elements!'
    }
    var sqlInput = format("SELECT * from movies WHERE year >= %L", yearList[0]);
    if(yearList.length == 2){
        sqlInput = sqlInput.concat(format(" AND year <= %L", yearList[1]))
    }
    var finalSql = sqlInput.concat(format(" ORDER BY %s %s OFFSET %L LIMIT %L", sortBy, orderBy, offset, limit));
    return finalSql
}

function getEnhancedFilteredMoviesByYearSql(yearList){
    if(yearList === undefined){
        throw 'Year list does not exist!'
    }
    if(yearList.length == 0){
        yearList.push('%')
    }
    if(yearList.length > 2){
        throw 'Year list can only have up to two elements!'
    }
    var sqlInput = format("SELECT COUNT(*) from movies WHERE year >= %L", yearList[0]);
    if(yearList.length == 2){
        sqlInput = sqlInput.concat(format(" AND year <= %L", yearList[1]))
    }
    return sqlInput
}

function getRatingsForMultipleGenresSql(genreList){
    if(genreList == undefined){
        throw `Genre list does not exist!`
    }
    if(genreList.length == 0){
        throw `Genre list is empty`
    }
    var sqlInput = format("SELECT AVG(c.avg) FROM (SELECT b.genreId, AVG(b.avg) FROM (SELECT movie_genre.*, a.avg AS avg FROM movie_genre INNER JOIN (SELECT movieId, AVG(rating) AS avg FROM ratings GROUP BY movieId) a ON a.movieId = movie_genre.movieiD ORDER BY genreid asc) b GROUP BY genreid) c WHERE c.genreid = %L", genreList[0])
    for(i = 1; i < genreList.length; i++){
        sqlInput = sqlInput.concat(format(" OR c.genreid = %L", genreList[i]))
    }
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
    getFilteredMoviesByGenreSql,
    getEnhancedFilteredMoviesByGenreSql,
    getFilteredMoviesByYearSql,
    getEnhancedFilteredMoviesByYearSql,
    getRatingsForMultipleGenresSql,
    emptyOrRows,
    sanitiseParams
}