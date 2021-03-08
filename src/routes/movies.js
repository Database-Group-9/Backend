const express = require('express');
const router = express.Router();
const movies = require('../services/movies');

router.get('/', async function(req, res, next){
    try{
        res.json(await movies.getAllMovies(req.query.page));
    }
    catch(err){
        console.error(`Error while retrieving movies `, err.message);
        next(err);
    }
});

module.exports = router;