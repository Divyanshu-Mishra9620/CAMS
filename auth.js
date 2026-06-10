// ===== AUTHENTICATION MODULE =====
// Handles signup and login with backend API integration

class AuthService {
  constructor(apiBaseUrl = "http://localhost:5000/api") {
    this.apiBaseUrl = apiBaseUrl;
    this.token = localStorage.getItem("authToken");
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    this.tokenExpiry = localStorage.getItem("tokenExpiry");
  }

  /**
   * Check if token is still valid
   */
  isTokenValid() {
    if (!this.token || !this.tokenExpiry) return false;
    return Date.now() < parseInt(this.tokenExpiry);
  }

  /**
   * Sign up a new user
   */
  async signup(userData) {
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.name) {
        return {
          success: false,
          message: "Email, password, and name are required",
        };
      }

      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message || data.error || `Signup failed (${response.status})`,
        };
      }

      // Store token and user info
      if (data.token) {
        const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        this.token = data.token;
        this.tokenExpiry = expiryTime.toString();
      }

      if (data.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        this.currentUser = data.user;
      }

      return {
        success: true,
        message: "Signup successful!",
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: `Connection error: ${error.message}`,
      };
    }
  }

  /**
   * Login an existing user with validation
   */
  async login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        return {
          success: false,
          message: "Email and password are required",
        };
      }

      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message || data.error || `Login failed (${response.status})`,
        };
      }

      // Store token with expiry
      if (data.token) {
        const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        this.token = data.token;
        this.tokenExpiry = expiryTime.toString();
      }

      if (data.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        this.currentUser = data.user;
      }

      return {
        success: true,
        message: "Login successful!",
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: `Connection error: ${error.message}`,
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("currentUser");
    this.token = null;
    this.currentUser = null;
  }

  /**
   * Check if user is authenticated
   * @returns {Boolean}
   */
  isAuthenticated() {
    return !!this.currentUser && (!!this.token || this.currentUser.isDemo);
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get auth token
   * @returns {String|null}
   */
  getToken() {
    return this.token;
  }

  /**
   * Set auth token
   * @param {String} token
   */
  setToken(token) {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token);
      this.token = token;
    }
  }

  /**
   * Get authorization headers
   * @returns {Object}
   */
  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
  }

  /**
   * Verify token and get current user info from backend
   * @returns {Promise<Object>}
   */
  async verifyToken() {
    if (!this.token) {
      return { success: false, authenticated: false };
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/verify`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        // Token is invalid
        this.logout();
        return { success: false, authenticated: false };
      }

      // Update current user info
      if (data.user) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        this.currentUser = data.user;
      }

      return {
        success: true,
        authenticated: true,
        user: data.user,
      };
    } catch (error) {
      this.logout();
      return {
        success: false,
        authenticated: false,
        error: error.message,
      };
    }
  }
}

// Create global instance
const authService = new AuthService();
