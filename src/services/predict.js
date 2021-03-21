const db = require('./db');
const helper = require('../helper');

async function getRatingsForGenreAndTag(tag=[], genreId=[]){
    var sql = helper.getRatingsSql(tag, genreId);
    console.log("Hello")
    console.log(sql)
    const rows0 = await db.query(
        sql[0],
        []
    );
    const rows1 = await db.query(
        sql[1],
        []
    );
    const rows2 = await db.query(
        sql[2],
        []
    );

    
    const tags = helper.emptyOrRows(rows0)
    const genreIds = helper.emptyOrRows(rows1)
    const intersect = helper.emptyOrRows(rows2)
    // const intersectCount = intersect.length;
    // const intersectSum = 0
    // for(i=0; i < intersect.length; i++){
    //     intersectSum = intersectSum + intersect[i].avgrating
    // }
    // console.log(intersectSum)
    // const data2 = ((data0[0].avg * parseInt(data0[0].count)) + (data1[0].avg * parseInt(data1[0].count))) / (parseInt(data0[0].count) + parseInt(data1[0].count))
    const average = (tags[0].sum + genreIds[0].sum - intersect[0].sum) / (parseInt(tags[0].count) + parseInt(genreIds[0].count) - intersect[0].count)
    return{
        tags,
        genreIds,
        average
    }
}

async function getPersonalityForTag(tag=[]){
    var sql = helper.getPersonalitySql(tag);
    const rows = await db.query(
        sql,
        []
    );
    const data = helper.emptyOrRows(rows)
    return{
        data
    }
}

module.exports = {
    getRatingsForGenreAndTag,
    getPersonalityForTag
}