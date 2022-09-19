import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  // // I think this is the old way of doing things:
  // function fetchMovieHandler() {
  //   // * Recall that fetch is an async function *
  //   fetch("https://swapi.dev/api/films/")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       const transformMovies = data.results.map(movieData => {
  //         return {
  //           id: movieData.episode_id,
  //           title: movieData.title,
  //           openingText: movieData.opening_crawl,
  //           releaseDate: movieData.release_date
  //         }
  //       })
  //       setMovies(transformMovies);
  //     });
  // }

  // This is how I learned it a while back with the Node.js app. Seems much more familiar
  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // * Recall that fetch is an async function *
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      const transformMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // This is a really clever way of making the fatch function run on the opening of the page... just use useEffect. With an empty array for the dependencies, you can have it only render once, and never again since the dependencies are not being updated.

  // OR, you can set the fucntion as a dependancy so that when it changes, we update the page. This needs to be used with useContext though so that the browser only comapres it to the last saved version of the function, and wont be stuck in an infinite loop.
  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && (
          <p>No movies to show. Try fetching some!</p>
        )}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading... pelase wait. </p>}
      </section>
    </React.Fragment>
  );
}

export default App;
