import { useEffect, useState } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]); // Store movies from API

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://mymovies-backend-seven.vercel.app/movies"
        );
        const data = await response.json();
        if (data.movies) {
          setMoviesData(data.movies); // Update movies data with API response
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.includes(movieTitle)) {
      setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => (
    <div key={i} className={styles.likedMoviesContainer}>
      <span className="likedMovie">{data}</span>
      <FontAwesomeIcon
        icon={faCircleXmark}
        onClick={() => updateLikedMovies(data)}
        className={styles.crossIcon}
      />
    </div>
  ));

  const popoverContent = (
    <div className={styles.popoverContent}>{likedMoviesPopover}</div>
  );

  // Movies list (use fetched moviesData)
  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.includes(data.title);
    return (
      <Movie
        key={i}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={data.title}
        overview={
          data.overview.length > 250
            ? data.overview.slice(0, 250) + "..."
            : data.overview
        }
        poster={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        voteAverage={data.vote_average} // Ensure API property names match
        voteCount={data.vote_count} // Ensure API property names match
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover
          title="Liked movies"
          content={popoverContent}
          className={styles.popover}
          trigger="click"
        >
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>{movies}</div>
    </div>
  );
}

export default Home;
