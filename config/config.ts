let backendUrl;

if (process.env.REACT_APP_STATUS === "development") {
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_LINK;
} else if (process.env.REACT_APP_STATUS === "production") {
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_PRODUCTION_LINK;
} else {
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_LINK;
}

const config = {
  NEXT_APP_BACKEND_URL: backendUrl,
};

export default config;
