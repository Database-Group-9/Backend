const _ = require("lodash");
const bodyNotEmpty = require("../utils/bodyNotEmpty");
const idExists = require("../utils/idExist");
let movies = require("../public/mock-movies");

function getMovies() {
    return movies;
}

function getMovieById(id) {
    return movies.find(movie => movie.movieId === id );
}

function addMovie(newMovie) {
    if (bodyNotEmpty(newMovie)) {
        newMovie.movieId = `${ movies.length + 1 }`;
        movies.push(newMovie);
        return newMovie;
    } else {
        return false;
    }
}

function updateMovie(id, movieToUpdate) {
    if (bodyNotEmpty(movieToUpdate)) {
        let moviePosition = movies.findIndex(movie => movie.movieId === id);
        if (moviePosition >= 0) {
          movies[moviePosition] = movieToUpdate;
          return movies[moviePosition];
        }
    } else {
        return false;
    }
}

function deleteMovie(id) {
    if (!idExists(movies, id)) {
        return false;
    } else {
        let movieToDelete = movies.find(movie => movie.movieId === id);
        _.pull(movies, movieToDelete);
        return true;
    }
}

module.exports = {
    getMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
};