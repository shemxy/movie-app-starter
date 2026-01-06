import { useEffect, useState } from "react";
const KEY = "10e33087";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("batman");

  // useEffect(()=> {
  //   const controller = new AbortController();
  //     fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal}) // to link Abort controller to the fetch
  //       .then((res) => res.json())
  //       .then((data) => data.Response === "True" && setMovies(data.Search))
  //       .catch((err)=> console.log(err));
  //       return() => controller.abort(); //cleanup statement before re-rendering. cancel request, re-render, send new one out. mitigate race condition problem
  // }, [query]);

  //Async Function (async/await) preferred cus cleaner, btr err handling
  useEffect(()=> {
    const controller = new AbortController();
    const fetchMovies = async () => { 
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal, }
        );
        const data = await response.json();
        if (data.Response === "True") {
          setMovies(data.Search);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };
    fetchMovies();
    return () => {
      controller.abort();
    };
  }, [query]);

  

  return (
    <div>
      <h1>Movies</h1>
      <input 
        type="text" 
        placeholder="Search movies..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.imdbID}>
              <td>{movie.Title}</td>
              <td>{movie.Year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
