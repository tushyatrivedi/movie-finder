import { useState, useEffect } from "react";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movies, setMovies] = useState([]);
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

  return [movies, errorMsg, isLoading];
}
