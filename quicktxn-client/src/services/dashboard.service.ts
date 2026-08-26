import api from "@/lib/api";

export const getProfile = async (token: string) => {
  const response = await api.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getWallet = async (token: string) => {
  const response = await api.get("/wallet/balance", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getTransactions = async (token: string) => {
  const response = await api.get(
    "/transactions?page=1&limit=5",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getNotifications = async (token: string) => {
  const response = await api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const markNotificationAsRead = async (
  token: string,
  id: string
) => {
  const response = await api.patch(
    `/notifications/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};