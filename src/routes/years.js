const express = require('express');
const router = express.Router();
const years = require('../services/years');

router.get('/', async function(req, res, next){
    try{
        res.json(await years.getYears(req.query.page, req.query.sortBy, req.query.orderBy, req.query.filterBy, req.query.filter));
    }
    catch(err){
        console.error(`Error while retrieving years `, err.message);
        next(err);
    }
});

module.exports = router;