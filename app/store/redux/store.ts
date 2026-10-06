import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      movies: moviesReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
