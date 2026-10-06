import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  initialManagedMovies,
  type ManagedMovie,
  type MovieDraft,
} from "../../data/managedMovies";
import {
  addMovie as addMovieRequest,
  deleteMovie as deleteMovieRequest,
  getMovies,
  updateMovie as updateMovieRequest,
} from "../../services/api/movieApi";

export const MOVIE_IDS_STORAGE_KEY = "chill-advanced-fe2b-api-movie-ids";

export type MoviesState = {
  items: ManagedMovie[];
  status: "idle" | "loading" | "succeeded" | "failed";
  pending: boolean;
  error: string;
  lastSyncedAt: string | null;
};

const initialState: MoviesState = {
  items: [],
  status: "idle",
  pending: false,
  error: "",
  lastSyncedAt: null,
};

function readStoredIds() {
  const value = window.localStorage.getItem(MOVIE_IDS_STORAGE_KEY);
  if (value === null) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];
  } catch {
    return [];
  }
}

function writeStoredIds(movies: ManagedMovie[]) {
  window.localStorage.setItem(
    MOVIE_IDS_STORAGE_KEY,
    JSON.stringify(movies.map((movie) => movie.id)),
  );
}

function messageFrom(reason: unknown) {
  return reason instanceof Error
    ? reason.message
    : "API film belum dapat dihubungi. Silakan coba lagi.";
}

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async () => {
    try {
      let ids = readStoredIds();

      if (ids === null) {
        const seededMovies: ManagedMovie[] = [];
        for (const movie of initialManagedMovies) {
          const draft: MovieDraft = {
            title: movie.title,
            genre: movie.genre,
            rating: movie.rating,
            year: movie.year,
            poster: movie.poster,
          };
          seededMovies.push(await addMovieRequest(draft));
        }
        writeStoredIds(seededMovies);
        ids = seededMovies.map((movie) => movie.id);
      }

      const movies = await getMovies(ids);
      writeStoredIds(movies);
      return { movies, syncedAt: new Date().toISOString() };
    } catch (reason) {
      throw new Error(messageFrom(reason));
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { movies: MoviesState };
      return state.movies.status !== "loading";
    },
  },
);

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (draft: MovieDraft) => {
    try {
      const movie = await addMovieRequest(draft);
      return { movie, syncedAt: new Date().toISOString() };
    } catch (reason) {
      throw new Error(messageFrom(reason));
    }
  },
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, draft }: { id: string; draft: MovieDraft }) => {
    try {
      const movie = await updateMovieRequest(id, draft);
      return { movie, syncedAt: new Date().toISOString() };
    } catch (reason) {
      throw new Error(messageFrom(reason));
    }
  },
);

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id: string) => {
    try {
      await deleteMovieRequest(id);
      return { id, syncedAt: new Date().toISOString() };
    } catch (reason) {
      throw new Error(messageFrom(reason));
    }
  },
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.items = action.payload.movies;
        state.status = "succeeded";
        state.lastSyncedAt = action.payload.syncedAt;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Data film belum dapat dimuat.";
      })
      .addCase(createMovie.pending, operationStarted)
      .addCase(createMovie.fulfilled, (state, action) => {
        state.items.unshift(action.payload.movie);
        operationFinished(state, action.payload.syncedAt);
      })
      .addCase(createMovie.rejected, operationFailed)
      .addCase(updateMovie.pending, operationStarted)
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.items = state.items.map((movie) =>
          movie.id === action.payload.movie.id ? action.payload.movie : movie,
        );
        operationFinished(state, action.payload.syncedAt);
      })
      .addCase(updateMovie.rejected, operationFailed)
      .addCase(deleteMovie.pending, operationStarted)
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.items = state.items.filter((movie) => movie.id !== action.payload.id);
        operationFinished(state, action.payload.syncedAt);
      })
      .addCase(deleteMovie.rejected, operationFailed);
  },
});

function operationStarted(state: MoviesState) {
  state.pending = true;
  state.error = "";
}

function operationFinished(state: MoviesState, syncedAt: string) {
  state.pending = false;
  state.status = "succeeded";
  state.lastSyncedAt = syncedAt;
}

function operationFailed(state: MoviesState, action: { error: { message?: string } }) {
  state.pending = false;
  state.error = action.error.message ?? "Operasi API gagal. Silakan coba lagi.";
}

export default moviesSlice.reducer;
