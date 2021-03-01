var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.get('/', function(req, res){
    let movies = controller.getMovies();
    res.json(movies);
});

router.get('/movieId', (req, res) => {
  let movieById = controller.getMovieById(req.params.movieId);
  if(movieById !== undefined){
    res.json(movieById);
  }
  else
  {
    res.status(400).send({
      message: `There are no movies assigned to this id!`
    });
  }
});

router.post('/', (req, res) => {
  let newMovie = controller.addMovie(req.body);

  if(newMovie === false){
    res.status(400).send({
      message: "An error has occurred while adding new movie to the list"
    });
  }
  else
  {
    res.json({
      message: "New movie added!", newMovie
    });
  }
});

router.put("/movieId", (req, res) => {
  let updatedMovie = controller.updateMovie(req.params.movieId, req.body);

  if (updatedMovie === false) {
      res.status(400).send({
          message: "Oops, an error has ocurred while updating movie.",
      });
  } else {
      res.json({
          message: `Movie ${req.params.movieId} has been updated!`,
          updatedMovie
      });
  }
});

router.delete("/movieId", (req, res) => {
  let movieIsDeleted = controller.deleteMovie(req.params.movieId);

  if (movieIsDeleted === false) {
      res.status(400).send({
          message: "Sorry, the movie you're trying to delete does not exist."
      });
  } else {
      res.status(200).send({
          message: `Movie (id: ${req.params.movieId}) has been deleted!`,
      });
  }
});

module.exports = router;
