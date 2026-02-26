import axios from "axios";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    throw error;
  },
);
