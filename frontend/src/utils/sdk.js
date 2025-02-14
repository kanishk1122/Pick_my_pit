import axios from "axios";

class SDK {
  constructor(user) {
    if (!this.validateUser(user)) {
      throw new Error("Invalid user data");
    }

    this.user = user;
    this.initializeAxios(user);
  }

  validateUser(user) {
    if (!user || typeof user !== 'object') {
      console.error("User is not an object");
      return false;
    }
    if (!user.sessionToken) {
      console.error("No session token");
      return false;
    }
    if (!user._id) {
      console.error("No user ID");
      return false;
    }
    return true;
  }

  initializeAxios(user) {
    this.axios = axios.create({
      headers: {
        Authorization: `Bearer ${user.sessionToken}`,
        "Content-Type": "application/json",
        userid: user._id,
      },
    });

    // Add loading interceptor
    this.axios.interceptors.request.use(
      (config) => {
        document.body.classList.add("loading"); // Add loading state
        return config;
      },
      (error) => {
        document.body.classList.remove("loading"); // Remove loading state
        return Promise.reject(error);
      }
    );

    this.axios.interceptors.response.use(
      (response) => {
        document.body.classList.remove("loading"); // Remove loading state
        return response;
      },
      (error) => {
        document.body.classList.remove("loading"); // Remove loading state
        return Promise.reject(error);
      }
    );
  }

  async get(url) {
    try {
      if (!url) throw new Error("URL is required");
      console.log("Making GET request to:", url);
      const response = await this.axios.get(url);
      return response;
    } catch (error) {
      console.error("SDK GET Error:", {
        url,
        error: error.response?.data || error.message,
      });
      throw error;
    }
  }

  async post(url, data) {
    return await this.axios.post(url, data);
  }

  async put(url, data) {
    console.log("PUT request data:", data);

    return await this.axios.put(url, data, {
      headers: {
        ...this.axios.defaults.headers,
        "Content-Type": "application/json",
      },
    });
  }

  async delete(url) {
    return await this.axios.delete(url);
  }
}

export default SDK;
