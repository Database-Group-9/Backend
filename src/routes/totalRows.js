const express = require('express');
const router = express.Router();
const totalRows = require('../services/totalRows');

router.get('/', async function(req, res, next){
    try{
        res.json(await totalRows.getTotalRows(req.query.table));
    }
    catch(err){
        console.error(`Error while retrieving total rows `, err.message);
        next(err);
    }
});



module.exports = router;