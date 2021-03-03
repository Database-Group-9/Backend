const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database_cw',
    password: 'myPassword',
    port: 5432
});

const getMovies = (req, res) => {
    pool.query('SELECT * FROM movies ORDER BY movieId ASC', (err, results) => {
        if(err){
            throw new err
            console.log("ERROR!")
        }
        res.status(200).json(results.rows)
    });
};

const getRatings = (req, res) => {
    pool.query('SELECT * FROM ratings ORDER BY ratingId ASC', (err, results) => {
        if(err){
            throw new err
        }
        res.status(200).json(results.rows)
    });
};

const getTags = (req, res) => {
    pool.query('SELECT * FROM tags ORDER BY tagId ASC', (err, results) => {
        if(err){
            throw new err
        }
        res.status(200).json(results.rows)
    });
};

module.exports = {
    getMovies,
    getRatings,
    getTags
};