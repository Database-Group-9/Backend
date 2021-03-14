const express = require('express');
const router = express.Router();
const movie = require('../services/movie');

router.get('/', async function(req, res, next){
    try{
        res.json(await movie.getMovie(req.query.movieId));
    }
    catch(err){
        console.error(`Error while retrieving movie `, err.message);
        next(err);
    }
});


module.exports = router;