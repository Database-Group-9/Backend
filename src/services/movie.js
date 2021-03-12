const db = require('./db');
const config = require('../config');
const helper = require('../helper');
var format = require('pg-format');

async function getMovie(movieId){
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

    var sql_2 = format("SELECT genre FROM genres WHERE genreId IN (SELECT DISTINCT(genreId) FROM movie_genre WHERE movieId=%s)",movie);

    const rows2 = await db.query(
        sql_2,
        []
    )

    res = helper.emptyOrRows(rows2);
    data.push({"genres": []})
    res.map((item) => {
        data[2]["genres"].push(item["genre"])
    });

    var sql_3 = format("SELECT t.range AS range, COUNT(*) AS count FROM (SELECT CASE WHEN rating <= 5 AND rating > 4 THEN '4-5' WHEN rating <= 4 AND rating > 3 THEN '3-4' WHEN rating <= 3 AND rating > 2 THEN '2-3' WHEN rating <= 2 AND rating > 1 THEN '1-2' ELSE '0-1' END AS range FROM ratings WHERE movieId=%s)t GROUP BY t.range", movie);

    const rows3 = await db.query(
        sql_3,
        []
    )

    res = helper.emptyOrRows(rows3);
    console.log(res);
    data.push({"ratings": []})
    res.map((item) => {
        data[3]["ratings"].push([item['range'], item['count']])
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