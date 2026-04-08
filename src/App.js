import { useState, useEffect } from "react";
import Stars from "./Stars";
import Button from "@mui/material/Button";

const average = (arr) =>
  arr.length === 0 ? 0 : arr.reduce((acc, cur) => acc + cur / arr.length, 0);

function Navbar({ count, query, onSearch }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />
      <p className="num-results">
        Found <strong>{count}</strong> results
      </p>
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Movie Finder</h1>
    </div>
  );
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MovieDetails({ id, onBack, onAdd, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    let handleEscape = (e) => {
      if (e.code === "Escape") onBack();
      console.log("closing");
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onBack]);

  useEffect(() => {
    document.title = `Movie | ${movie.Title}`;
    console.log(movie.Title);
    return () => {
      document.title = "Movie Finder app";
    };
  }, [movie.Title]);

  const isWatched = watched.some((x) => x.imdbID === id);
  const watchedMovie = watched.find((x) => x.imdbID === id);

  useEffect(() => {
    async function getMovie() {
      setIsLoading(true);
      let response = await fetch(
        `http://www.omdbapi.com/?apikey=d36b3136&i=${id}`,
      );
      let data = await response.json();
      setMovie(data);
      setIsLoading(false);
      console.log(data);
    }
    getMovie();
  }, [id]);

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onBack}>
              &larr;
            </button>
            <img src={movie.Poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <Stars rating={rating} setRating={setRating} />
                  {rating > 0 && (
                    <Button
                      onClick={() => {
                        console.log(
                          `Inside button add handler with ${movie.Title}`,
                        );
                        onAdd({ ...movie, userRating: rating });
                        onBack();
                      }}
                      variant="contained"
                    >
                      Add to List
                    </Button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie{" "}
                  {watchedMovie !== "undefined" && watchedMovie.userRating}{" "}
                  <span>⭐️</span>
                </p>
              )}
            </div>

            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedList({ watched, onRemove }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime.split(" ")[0]} min</span>
            </p>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                onRemove(movie.imdbID);
              }}
            >
              <span>⛔</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating),
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating),
  ).toFixed(2);
  const avgRuntime = average(
    watched.map((movie) => Number(movie.Runtime.split(" ")[0])),
  ).toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // use null instead of ""
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleBackClick() {
    setSelectedId(null);
  }

  function handleSelect(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleAdd(movie) {
    console.log(movie);
    console.log(`poster: ${movie.Poster}`);
    if (watched.some((x) => x.imdbID === movie.imdbID)) {
      console.log(`already contains ${movie.Title}`);
      return;
    }

    setWatched([
      ...watched,
      {
        ...movie,
      },
    ]);
  }

  function removeWatched(id) {
    let list = watched.filter((x) => x.imdbID !== id);
    setWatched(list);
  }

  useEffect(() => {
    let ignore = false;
    async function getMovies() {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=d36b3136&s=${query}`,
        );
        if (!ignore) {
          if (!response.ok)
            throw new Error("Error occurred while fetching data!");

          const data = await response.json();
          console.log(data);
          if (data.Response === "False") throw new Error(data.Error);

          setIsLoading(false);
          setMovies(data.Search);
        }
      } catch (err) {
        console.log(err);
        setErrorMsg(err.message); // always store a string
        setMovies([]); //after getting error, clear previous list
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setErrorMsg("");
      return;
    }
    getMovies();
    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <>
      <Navbar count={movies.length} query={query} onSearch={setQuery} />
      <main className="main">
        <Box>
          {errorMsg && <ErrorMessage message={errorMsg} />}
          {isLoading && <Loading />}
          {!isLoading && <MovieList movies={movies} onSelect={handleSelect} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              id={selectedId}
              onBack={handleBackClick}
              onAdd={handleAdd}
            />
          ) : (
            <>
              {" "}
              <WatchSummary watched={watched} />
              <WatchedList watched={watched} onRemove={removeWatched} />
            </>
          )}
        </Box>
      </main>
    </>
  );
}

function Loading() {
  return (
    <div className="loader">
      <p>Loading...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
