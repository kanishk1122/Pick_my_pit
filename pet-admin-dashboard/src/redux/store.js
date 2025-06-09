"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// Create a function to create the store so we can properly handle SSR
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    // Add middleware to handle serialization issues with SSR
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Create the store
export const store = makeStore();
