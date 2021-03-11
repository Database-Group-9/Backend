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

router.get('/filteredByGenre', async function(req, res, next){
    try{
        res.json(await movies.getFilteredMoviesByGenre(req.query.page, req.query.sortBy, req.query.orderBy, req.query.genre));
    }
    catch(err){
        console.error(`Error while retrieving movies `, err.message);
        next(err);
    }
});

router.get('/filteredByYear', async function(req, res, next){
    try{
        res.json(await movies.getFilteredMoviesByYearRange(req.query.page, req.query.sortBy, req.query.orderBy, req.query.years));
    }
    catch(err){
        console.error(`Error while retrieving movies `, err.message);
        next(err);
    }
});


module.exports = router;