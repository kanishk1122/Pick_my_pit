import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

// Base URL from environment variable
const BASE_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

/**
 * Create an Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Get user data from cookies
 */
const getUserFromCookie = () => {
  try {
    const userdata = Cookies.get("Userdata");
    if (!userdata) return null;

    const decryptdata = CryptoJS.AES.decrypt(
      userdata,
      import.meta.env.VITE_REACT_APP_CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptdata);
  } catch (error) {
    console.error("Error parsing user data from cookie:", error);
    return null;
  }
};

/**
 * Request interceptor to add auth headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get user data from cookie
    const user = getUserFromCookie();

    // If user exists, add authentication headers
    if (user) {
      config.headers["Authorization"] = `Bearer ${user.sessionToken}`;
      config.headers["userid"] = user.id;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Could redirect to login page or trigger token refresh
      console.warn("Authentication error:", error.response.data);
      // Optional: clear invalid session
      // Cookies.remove('Userdata');
    }

    return Promise.reject(error);
  }
);

/**
 * API Service with wrapped methods
 */
const apiService = {
  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {object} params - URL parameters
   * @param {object} options - Additional axios options
   * @returns {Promise} - Axios promise
   */
  get: (url, params = {}, options = {}) => {
    return apiClient.get(url, {
      params,
      ...options,
    });
  },

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {object} data - Request payload
   * @param {object} options - Additional axios options
   * @returns {Promise} - Axios promise
   */
  post: (url, data = {}, options = {}) => {
    return apiClient.post(url, data, options);
  },

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {object} data - Request payload
   * @param {object} options - Additional axios options
   * @returns {Promise} - Axios promise
   */
  put: (url, data = {}, options = {}) => {
    return apiClient.put(url, data, options);
  },

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {object} options - Additional axios options
   * @returns {Promise} - Axios promise
   */
  delete: (url, options = {}) => {
    return apiClient.delete(url, options);
  },

  /**
   * Upload files with automatic content type
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data with files
   * @param {function} onProgress - Progress callback
   * @returns {Promise} - Axios promise
   */
  upload: (url, formData, onProgress = null) => {
    return apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        : undefined,
    });
  },
};

export default apiService;
