const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3001;
const router = require("./routes");
const controller = require('./routes/controller');

// this allows express to get body info for POST requests
app.use(express.json());

app.use(morgan("combined"));

app.use("./routes", router);

app.get('/', function(req, res){
    let movies = controller.getMovies();
    res.json(movies);
});

// app.get('/movieId', (req, res) => {
//     let movieById = controller.getMovieById(req.params.movieId);
//     if(movieById !== undefined){
//       res.json(movieById);
//     }
//     else
//     {
//       res.status(400).send({
//         message: `There are no movies assigned to this id!`
//       });
//     }
//   });
  
// app.post('/', (req, res) => {
//     let newMovie = controller.addMovie(req.body);
  
//     if(newMovie === false){
//       res.status(400).send({
//         message: "An error has occurred while adding new movie to the list"
//       });
//     }
//     else
//     {
//       res.json({
//         message: "New movie added!", newMovie
//       });
//     }
// });
  
// app.put("/movieId", (req, res) => {
//     let updatedMovie = controller.updateMovie(req.params.movieId, req.body);
  
//     if (updatedMovie === false) {
//         res.status(400).send({
//             message: "Oops, an error has ocurred while updating movie.",
//         });
//     } else {
//         res.json({
//             message: `Movie ${req.params.movieId} has been updated!`,
//             updatedMovie
//         });
//     }
// });
  
// app.delete("/movieId", (req, res) => {
//     let movieIsDeleted = controller.deleteMovie(req.params.movieId);
  
//     if (movieIsDeleted === false) {
//         res.status(400).send({
//             message: "Sorry, the movie you're trying to delete does not exist."
//         });
//     } else {
//         res.status(200).send({
//             message: `Movie (id: ${req.params.movieId}) has been deleted!`,
//         });
//     }
// });  

app.listen(port, () => {
    console.log(`Express running on port ${port}.`);
});