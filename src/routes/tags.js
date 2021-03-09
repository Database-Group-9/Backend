const express = require('express');
const router = express.Router();
const tags = require('../services/tags');

router.get('/', async function(req, res, next){
    try{
        res.json(await tags.getTags(req.query.page, req.query.sortBy, req.query.orderBy, req.query.filterBy, req.query.filter));
    }
    catch(err){
        console.error(`Error while retrieving tags `, err.message);
        next(err);
    }
});

module.exports = router;