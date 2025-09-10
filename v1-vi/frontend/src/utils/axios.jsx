import axios from "axios";
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

// Add a request interceptor to set the Authorization header for JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // Only set Content-Type to application/json if not sending FormData
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add error interceptor
axiosInstance.interceptors.response.use(
  (response) =>
    // Return successful response
    response,
  (error) => {
    // Handle error
    if (error.response) {
      console.log("Error response:", error.response);
      // The request was made and the server responded with a status code
      const { status } = error.response;
      if (status === 403) {
        console.log("Access forbidden");
      } else if (status === 401) {
        // Redirect to the login page
        // if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
        // window.location.href = "/auth/login";
        // }
      } else if (status === 404) {
        // window.localStorage.removeItem("accessToken");
        // window.location.href = "/404";
      } else if (status === 500) {
        // window.location.href = "/500";
      } else if (status === 503) {
        window.location.href = "/maintenance";
      } else {
        const errorMessage = error.response.data.message || "An error occurred";
        console.log(errorMessage);
      }
    } else if (error.request) {
      // window.location.href = "/500";
    } else {
      // Something happened in setting up the request that triggered an error
      console.log(`Error: ${error.message}`);
    }

    // Pass the error to the calling code
    throw error;
  }
);
export default axiosInstance;