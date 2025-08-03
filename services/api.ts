export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&include_adult=false`;

  const resp = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch movies: ${resp.statusText}`);
  }

  const data = await resp.json();

  return data.results;
};

export const fetchMovieById = async (moveId: number) => {
  const resp = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${moveId}`, {
    headers: TMDB_CONFIG.headers,
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch movie: ${resp.statusText}`);
  }

  const data = await resp.json();

  return data;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const resp = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );
    if (!resp.ok) {
      throw new Error("Failed to fetch movie details");
    }
    const data = await resp.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
