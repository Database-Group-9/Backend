const express = require('express');
const router = express.Router();
const predict = require('../services/predict');

router.get('/ratings', async function(req, res, next){
    if(typeof req.query.tag === 'string'){
        req.query.tag = [req.query.tag]
    }
    try{
        res.json(await predict.getRatingsForGenreAndTag(req.query.tag, req.query.genreId));
    }
    catch(err){
        console.error(`Error while retrieving ratings for ratings prediction `, err.message);
        next(err);
    }
});

router.get('/personality', async function(req, res, next){
    if(typeof req.query.tag === 'string'){
        req.query.tag = [req.query.tag]
    }
    try{
        res.json(await predict.getPersonalityForTag(req.query.tag));
    }
    catch(err){
        console.error(`Error while retrieving ratings for personality prediction `, err.message);
        next(err);
    }
});

module.exports = router;