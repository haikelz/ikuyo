import ky from "ky";

export const api = ky.create({
  headers: {
    "Content-Type": "application/json",
  },
});
