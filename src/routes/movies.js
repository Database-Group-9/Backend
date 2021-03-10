const express = require('express');
const router = express.Router();
const movies = require('../services/movies');

router.get('/', async function(req, res, next){
    try{
        res.json(await movies.getMovies(req.query.page, req.query.sortBy, req.query.orderBy, req.query.filterBy, req.query.filter));
    }
    catch(err){
        console.error(`Error while retrieving movies `, err.message);
        next(err);
    }
});

router.get('/filtered', async function(req, res, next){
    try{
        res.json(await movies.getFilteredMoviesByGenre(req.query.page, req.query.sortBy, req.query.orderBy, req.query.genre));
    }
    catch(err){
        console.error(`Error while retrieving movies `, err.message);
        next(err);
    }
});

router.get('/multipleFiltered', async function(req, res, next){
    try{
        res.json(await movies.getMultipleFilteredMoviesByGenre(req.query.page, req.query.sortBy, req.query.orderBy, req.query.genre1, req.query.genre2));
    }
    catch(err){
        console.error(`Error while retrieving movies `, err.message);
        next(err);
    }
});

module.exports = router;