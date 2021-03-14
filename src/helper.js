var format = require('pg-format');
const db = require('./services/db');

function getOffset(currentPage = 1, listPerPage){
    return (currentPage - 1) * [listPerPage];
}

function sanitiseParams(params){
    if(!NaN){
        return params;
    }
}

function getFilteredMoviesSql(genreList, yearList, sortBy, orderBy, offset, limit){
    if(genreList === undefined && yearList === undefined ){
        throw ` Both lists do not exist!`
    }
    if(genreList.length == 0){
        genreList.push('%')
    }
    if (yearList.length == 0){
        yearList.push('0')
    }
    if(yearList.length > 2){
        throw 'Year list can only have up to two elements!'
    }
    var sqlInput = format("SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId::text LIKE %L)", genreList[0]);
    for(i = 1; i < genreList.length; i++){
        sqlInput = sqlInput.concat(format(" INTERSECT SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId::text LIKE %L)", genreList[i]))
    }
    sqlInput = sqlInput.concat(format(" AND year >= %L", yearList[0]));
    if(yearList.length == 2){
        sqlInput = sqlInput.concat(format(" AND year <= %L", yearList[1]))
    }
    var finalSql = sqlInput.concat(format(" ORDER BY %s %s OFFSET %L LIMIT %L", sortBy, orderBy, offset, limit));
    return finalSql;
}

function getEnhancedFilteredMoviesSql(genreList, yearList){
    if(genreList === undefined){
        throw 'Genre list does not exist!'
    }
    if(genreList.length == 0){
        genreList.push('%')
    }
    if (yearList.length == 0){
        yearList.push('0')
    }
    if(yearList.length > 2){
        throw 'Year list can only have up to two elements!'
    }
    var sqlInput = format("SELECT COUNT(b.movieId) FROM (SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId::text LIKE %L)", genreList[0]);
    for(i = 1; i < genreList.length; i++){
        sqlInput = sqlInput.concat(format(" INTERSECT SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId::text LIKE %L)", genreList[i]))
    }
    sqlInput = sqlInput.concat(format(" AND year >= %L", yearList[0]));
    if(yearList.length == 2){
        sqlInput = sqlInput.concat(format(" AND year <= %L", yearList[1]))
    }
    sqlInput = sqlInput.concat(")b")
    return sqlInput
}

function getRatingsSql(tagList, genreId){
    if(tagList == undefined){
        throw `Tags list does not exist!`
    }
    if(genreId == undefined){
        throw `Genres list does not exist!`
    }
    if(tagList.length == 0){
        tagList.push('%')
    }
    if(genreId.length == 0){
        genreId.push('0')
    }
    var tagSqlInput = format("SELECT COUNT(avg), SUM(avg) FROM (SELECT DISTINCT movieid FROM tags WHERE tag ILIKE %L", tagList[0])
    for(i = 1; i < tagList.length; i++){
        tagSqlInput = tagSqlInput.concat(format(" OR tag ILIKE %L", tagList[i]))
    }
    tagSqlInput = tagSqlInput.concat(format(") a JOIN (SELECT movieid, avg(rating) FROM ratings as c GROUP BY c.movieid)c ON a.movieid=c.movieid"));

    var genreSqlInput = format("SELECT COUNT(d.count), SUM(d.avg) FROM (SELECT COUNT(c.movieId), AVG(c.avg) FROM (SELECT b.movieId, b.genreId, AVG(b.avg) FROM (SELECT movie_genre.*, a.avg AS avg FROM movie_genre INNER JOIN (SELECT movieId, AVG(rating) AS avg FROM ratings GROUP BY movieId) a ON a.movieId = movie_genre.movieiD ORDER BY genreid asc) b GROUP BY b.movieId, b.genreid) c WHERE c.genreid = %L", genreId[0])
    for(i = 1; i < genreId.length; i++){
        genreSqlInput = genreSqlInput.concat(format(" OR c.genreid = %L", genreId[i]))
    }
    genreSqlInput = genreSqlInput.concat(format(" GROUP BY c.movieid) d"))

    var intersectSql = format("SELECT COUNT(a.movieId), SUM(CAST(a.avgrating AS float)) FROM (SELECT movieid, avgrating FROM movies WHERE movieid IN (SELECT movieid FROM movie_genre WHERE genreid = %L", genreId[0])
    for(i = 1; i < tagList.length; i++){
        intersectSql = intersectSql.concat(format("OR genreid = %L", genreId[i]))
    }
    intersectSql = intersectSql.concat(format(") INTERSECT SELECT movieid, avgrating FROM movies WHERE movieid IN (SELECT movieid FROM tags WHERE tag ILIKE %L", tagList[0]))
    for(i = 1; i < tagList.length; i++){
        tagSqlInput = tagSqlInput.concat(format(" OR tag ILIKE %L", tagList[i]))
    }
    intersectSql = intersectSql.concat(format(")) a"));

    return [tagSqlInput, genreSqlInput, intersectSql]
}

function getRatingsForMultipleTagsSql(tagList){
    if(tagList == undefined){
        throw `Tags list does not exist!`
    }
    if(tagList.length == 0){
        throw `Tags list is empty`
    }
    var sqlInput = format("SELECT AVG(avg) FROM (SELECT DISTINCT movieid FROM tags WHERE tag = %L", tagList[0])
    for(i = 1; i < tagList.length; i++){
        sqlInput = sqlInput.concat(format(" OR tag = %L", tagList[i]))
    }
    var finalSql = sqlInput.concat(format(") a JOIN (SELECT movieid, avg(rating) FROM ratings as c GROUP BY c.movieid)c ON a.movieid=c.movieid"));
    return finalSql
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

function segment(res){
    totalRows = 0
    like = 0
    dislike = 0
    overallLike = 0
    overallNeutral = 0
    overallDislike = 0
    for(i = 0; i < res.length; i++){
        totalRows++
        if (res[i]["rating"] > 2.5){
            like++
        }
        else if (res[i]["rating"] <= 2.5){
            dislike++
        }

        if (res[i]["diff"] > 0.5){
            overallLike++
        }
        else if (res[i]["diff"] < -0.5){
            overallDislike++
        }
        else {
            overallNeutral++
        }
    }
    likePercent = (like / totalRows) * 100
    dislikePercent = (dislike / totalRows) * 100
    overallLikePercent = (overallLike / totalRows) * 100
    overallNeutralPercent = (overallNeutral / totalRows) * 100
    overallDislikePercent = (overallDislike / totalRows) * 100

    return {"likePercent": likePercent, 
        "dislikePercent":dislikePercent, 
        "overallLikePercent":overallLikePercent, 
        "overallNeutralPercent":overallNeutralPercent, 
        "overallDislikePercent":overallDislikePercent
    }
}

function emptyOrRows(rows){
    if(!rows){
        return [];
    }
    return rows;
}

module.exports = {
    getOffset,
    getRatingsSql,
    getRatingsForMultipleGenresSql,
    getRatingsForMultipleTagsSql,
    getFilteredMoviesSql,
    getEnhancedFilteredMoviesSql,
    emptyOrRows,
    segment,
    sanitiseParams
}