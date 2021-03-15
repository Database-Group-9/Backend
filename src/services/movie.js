const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getMovie(movieId){
    if(movieId == null){
        throw `Please enter movieId! `
    }
    const movie = helper.sanitiseParams(movieId);
    var sql = format("SELECT * FROM movies WHERE movieId=%s", 
                    movie);
    
    const rows = await db.query(
        sql,
        []
    )
    data = helper.emptyOrRows(rows);

    var sql_1 = format("SELECT DISTINCT(tag) FROM tags WHERE movieId=%s", 
                        movie);

    const rows1 = await db.query(
        sql_1,
        []
    )
    res = helper.emptyOrRows(rows1);
    data.push({"tags": []})
    res.map((item) => {
        data[1]["tags"].push(item["tag"])
    });

    var sql_2 = format("SELECT genre, genreId FROM genres WHERE genreId IN (SELECT DISTINCT(genreId) FROM movie_genre WHERE movieId=%s)",movie);
    const rows2 = await db.query(
        sql_2,
        []
    )
    res = helper.emptyOrRows(rows2);
    data.push({"genres": [], "genreId": []})
    res.map((item) => {
        data[2]["genres"].push(item["genre"]);
        data[2]["genreId"].push(item["genreid"]);
    });

    var sql_3 = format("SELECT t.range AS range, COUNT(*) AS count FROM (SELECT CASE WHEN rating <= 5 AND rating > 4 THEN '4-5' WHEN rating <= 4 AND rating > 3 THEN '3-4' WHEN rating <= 3 AND rating > 2 THEN '2-3' WHEN rating <= 2 AND rating > 1 THEN '1-2' ELSE '0-1' END AS range FROM ratings WHERE movieId=%s)t GROUP BY t.range", movie);
    const rows3 = await db.query(
        sql_3,
        []
    )
    res = helper.emptyOrRows(rows3);
    data.push({"ratings": []})
    res.map((item) => {
        data[3]["ratings"].push([item['range'], item['count']])
    });

    var sql_4 = format("SELECT ratings.userid, ratings.rating, ratings.rating - b.avg AS DIFF FROM ratings INNER JOIN (SELECT AVG(rating) AS avg,userid FROM ratings WHERE userid IN (select distinct userid FROM ratings WHERE movieid=%L) GROUP BY userid)b ON ratings.userId=b.userId WHERE movieId=%L", movieId, movieId);
    const rows4 = await db.query(
        sql_4,
        []
    )
    
    var sql_5 = format("SELECT AVG(rating), tag FROM (SELECT * FROM ratings WHERE userid IN (SELECT userid FROM tags AS a WHERE movieid= %L))c JOIN (SELECT userid, tag from tags WHERE movieid = %L)b ON c.userid = b.userid WHERE movieid = %L GROUP BY tag;", movieId, movieId, movieId);
    const rows5 = await db.query(
        sql_5,
        []
    )
    
    res = helper.emptyOrRows(rows4);
    allPercent = helper.segment(res)
    data.push(allPercent);
    res = helper.emptyOrRows(rows5);
    console.log(res)
    data.push({"tag_ratings": []})
    res.map((item) => {
        data[5]["tag_ratings"].push([item['avg'], item['tag']])
    });
    const meta = {movieId}
    return{
        data,
        meta
    }
}

module.exports = {
    getMovie
}