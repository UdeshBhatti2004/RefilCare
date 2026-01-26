import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationsSlices";
import { notificationsApi } from "./api/notificationsApi";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
