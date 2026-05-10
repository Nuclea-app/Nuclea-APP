const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `${process.env.NEXT_PUBLIC_BASE_URL}`;

export default baseUrl;

export const appName = process.env.NEXT_PUBLIC_APP_NAME;
