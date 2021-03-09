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

module.exports = router;