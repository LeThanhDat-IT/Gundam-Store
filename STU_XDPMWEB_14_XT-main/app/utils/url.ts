export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5045";

export const SHOP_APP_URL =
  process.env.NEXT_PUBLIC_SHOP_APP_URL || "http://localhost:5173";

export const getImageUrl = (path?: string) => {
  if (!path) return "/default_avatar.png";

  if (path.startsWith("data:")) return path;

  if (path.startsWith("blob:")) return path;

  if (path.startsWith("http")) return path;

  if (path.startsWith("/")) return path;

  if (path.startsWith("/storage")) {
     return `${BASE_URL}${path}`;
  }

  return `${BASE_URL}/storage/${path}`;
};