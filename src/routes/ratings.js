const express = require('express');
const router = express.Router();
const ratings = require('../services/ratings');

router.get('/', async function(req, res, next){
    try{
        res.json(await ratings.getRatings(req.query.page, req.query.sortBy, req.query.orderBy, req.query.filterBy, req.query.filter));
    }
    catch(err){
        console.error(`Error while retrieving ratings `, err.message);
        next(err);
    }
});

router.get('/tag', async function(req, res, next){
    try{
        res.json(await ratings.getRatingsForTag(req.query.tag));
    }
    catch(err){
        console.error(`Error while retrieving ratings for tag `, err.message);
        next(err);
    }
});

router.get('/genre', async function(req, res, next){
    try{
        res.json(await ratings.getRatingsForGenres(req.query.genreId));
    }
    catch(err){
        console.error(`Error while retrieving ratings for genres `, err.message);
        next(err);
    }
});

router.get('/allGenres', async function(req, res, next){
    try{
        res.json(await ratings.getRatingsForAllGenres(req.query.orderBy, req.query.sortBy));
    }
    catch(err){
        console.error(`Error while retrieving ratings for all genres `, err.message);
        next(err);
    }
});


module.exports = router;