import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data.data;
};

export const getDashboard = async () => {
  const res = await api.get("/user/dashboard");
  return res.data.data;
};

export const getTransactions = async () => {
  // We'll connect this when we build the transaction API
  return [];
};