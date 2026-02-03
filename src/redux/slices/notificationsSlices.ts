import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotificationState = {
  unreadCount: number;
  acknowledgedCount: number;
};

const initialState: NotificationState = {
  unreadCount: 0,
  acknowledgedCount:
    typeof window !== "undefined"
      ? Number(localStorage.getItem("acknowledgedCount") || 0)
      : 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },    acknowledgeNotifications(state) {
      state.acknowledgedCount = state.unreadCount;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "acknowledgedCount",
          String(state.acknowledgedCount)
        );
      }
    },
  },
});

export const { setUnreadCount, acknowledgeNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
