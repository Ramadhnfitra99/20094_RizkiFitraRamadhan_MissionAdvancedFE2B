"use client";

import { useCallback, useEffect } from "react";
import type { MovieDraft } from "../data/managedMovies";
import {
  MOVIE_IDS_STORAGE_KEY,
  createMovie as createMovieThunk,
  deleteMovie as deleteMovieThunk,
  fetchMovies,
  updateMovie as updateMovieThunk,
} from "../store/redux/moviesSlice";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";

export function useMoviesApi() {
  const dispatch = useAppDispatch();
  const { items, status, pending, error, lastSyncedAt } = useAppSelector(
    (state) => state.movies,
  );

  useEffect(() => {
    if (status === "idle") void dispatch(fetchMovies());
  }, [dispatch, status]);

  useEffect(() => {
    if (status === "succeeded") {
      window.localStorage.setItem(
        MOVIE_IDS_STORAGE_KEY,
        JSON.stringify(items.map((movie) => movie.id)),
      );
    }
  }, [items, status]);

  const refresh = useCallback(async () => {
    await dispatch(fetchMovies()).unwrap();
  }, [dispatch]);

  const createMovie = useCallback(
    (draft: MovieDraft) => dispatch(createMovieThunk(draft)).unwrap().then(({ movie }) => movie),
    [dispatch],
  );

  const updateMovie = useCallback(
    (id: string, draft: MovieDraft) =>
      dispatch(updateMovieThunk({ id, draft })).unwrap().then(({ movie }) => movie),
    [dispatch],
  );

  const removeMovie = useCallback(
    async (id: string) => {
      await dispatch(deleteMovieThunk(id)).unwrap();
    },
    [dispatch],
  );

  return {
    movies: items,
    loading: status === "idle" || status === "loading",
    pending,
    error,
    lastSyncedAt: lastSyncedAt ? new Date(lastSyncedAt) : null,
    refresh,
    createMovie,
    updateMovie,
    deleteMovie: removeMovie,
  };
}
