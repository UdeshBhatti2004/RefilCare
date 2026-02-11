import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({

    getNotifications: builder.query<
      { notifications: any[]; unreadCount: number },
      void
    >({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllRead: builder.mutation<void, void>({
      query: () => ({
        url: `/notifications/mark-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
} = notificationsApi;
