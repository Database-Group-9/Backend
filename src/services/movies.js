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
    var sql = format("SELECT * FROM movies WHERE %s::text LIKE %L ORDER BY %s %s OFFSET %L LIMIT %L", 
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

async function getFilteredMoviesByGenre(page = 1, sortBy = 'movieId', orderBy = 'asc', genre = '%'){
    const offset = helper.getOffset(page, config.listPerPage);
    const movie_genre = helper.sanitiseParams(genre);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql = format("SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L)) ORDER BY %s %s OFFSET %L LIMIT %L", 
                    movie_genre, sort, order, offset, config.listPerPage)
    const rows = await db.query(
        sql,
        []
    );
    const data = helper.emptyOrRows(rows)
    const meta = {page,
                  sortBy,
                  orderBy,
                  movie_genre
                };
    return{
        data, 
        meta
    }
}

async function getMultipleFilteredMoviesByGenre(page = 1, sortBy = 'movieId', orderBy = 'asc', genre1 = '%', genre2 = '%'){
    const offset = helper.getOffset(page, config.listPerPage);
    const genre_1 = helper.sanitiseParams(genre1);
    const genre_2 = helper.sanitiseParams(genre2);
    const sort = helper.sanitiseParams(sortBy);
    const order = helper.sanitiseParams(orderBy);
    var sql = format("SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L)) " + 
                    "INTERSECT SELECT * from movies WHERE movieId IN (SELECT movieId from movie_genre WHERE genreId IN (SELECT genreId from genres WHERE genre::text LIKE %L)) ORDER BY %s %s OFFSET %L LIMIT %L", 
                    genre_1, genre_2, sort, order, offset, config.listPerPage)
    const rows = await db.query(
        sql,
        []
    );
    const data = helper.emptyOrRows(rows)
    const meta = {page,
                  sortBy,
                  orderBy,
                  genre_1,
                  genre_2
                };
    return{
        data, 
        meta
    }
}



module.exports = {
    getMovies,
    getFilteredMoviesByGenre,
    getMultipleFilteredMoviesByGenre
}