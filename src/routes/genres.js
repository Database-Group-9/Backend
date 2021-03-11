const express = require('express');
const router = express.Router();
const genres = require('../services/genres');

router.get('/', async function(req, res, next){
    try{
        res.json(await genres.getGenres(req.query.page, req.query.sortBy, req.query.orderBy, req.query.filterBy, req.query.filter));
    }
    catch(err){
        console.error(`Error while retrieving genres `, err.message);
        next(err);
    }
});

module.exports = router;