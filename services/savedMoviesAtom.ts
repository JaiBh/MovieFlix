import { fetchMovieById } from "@/services/api";
import { atom } from "jotai";
import { getSavedMovies } from "./appwrite";

export const savedMoviesAtom = atom<Movie[]>([]);

export const fetchSavedMoviesAtom = atom(
  (get) => get(savedMoviesAtom),
  async (get, set, userId: string) => {
    const data = await getSavedMovies(userId!);
    if (!data || data.length < 1) {
      set(savedMoviesAtom, []);
    } else {
      const movies: Movie[] = [];
      await Promise.all(
        data.map(async (item) => {
          const resp = await fetchMovieById(item.movie_id);
          if (resp) {
            movies.push(resp as Movie);
          }
        })
      );
      set(savedMoviesAtom, movies);
    }
  }
);
