let backendUrl;

if (process.env.NEXT_PUBLIC_STATUS === "development") {
  console.log("its in production");
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_LINK;
} else if (process.env.NEXT_PUBLIC_STATUS === "production") {
  console.log("its in production");
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_PRODUCTION_LINK;
} else {
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_LINK;
}

const config = {
  NEXT_APP_BACKEND_URL: backendUrl,
};

export default config;
