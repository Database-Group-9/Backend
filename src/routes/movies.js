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
    
    if(typeof req.query.genre === 'string'){
        req.query.genre = [req.query.genre]
    }
    if(typeof req.query.years === 'string'){
        req.query.years = [req.query.years]
    }
    try{
        res.json(await movies.getFilteredMovies(req.query.page, req.query.sortBy, req.query.orderBy, req.query.genre, req.query.years));
    }
    catch(err){
        console.error(`Error while retrieving movies `, err.message);
        next(err);
    }
});

router.get('/popular', async function(req, res, next){
    try{
        res.json(await movies.getPopularMovies(req.query.page, req.query.orderBy));
    }
    catch(err){
        console.error(`Error while retrieving popular movies `, err.message);
        next(err);
    }
});

router.get('/polarising', async function(req, res, next){
    try{
        res.json(await movies.getPolarisingMovies(req.query.page, req.query.orderBy, req.query.ratingsCount));
    }
    catch(err){
        console.error(`Error while retrieving most polarising movies `, err.message);
        next(err);
    }
});

module.exports = router;