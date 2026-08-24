import api from "@/lib/axios";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await api.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const verifyOTP = async (data: {
  email: string;
  otp: string;
}) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export const resendOTP = async (email: string) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};