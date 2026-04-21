import { BASE_URL } from "./url";

export const getMe = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};