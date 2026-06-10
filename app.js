// ===== APP INITIALIZATION & OPTIMIZATION MODULE =====
// Consolidated app logic with performance optimizations

class AppManager {
  constructor() {
    this.config = {
      apiBaseUrl: "http://localhost:5000/api",
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      debounceDelay: 300,
    };
    this.cache = new Map();
    this.debounceTimers = new Map();
  }

  /**
   * Get cached data or fetch from API
   */
  async getCachedData(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Clear cache for a key
   */
  clearCache(key) {
    this.cache.delete(key);
  }

  /**
   * Debounce function calls
   */
  debounce(key, fn, delay = this.config.debounceDelay) {
    clearTimeout(this.debounceTimers.get(key));
    const timer = setTimeout(fn, delay);
    this.debounceTimers.set(key, timer);
  }

  /**
   * Batch DOM queries
   */
  querySelector(selector) {
    return document.querySelector(selector);
  }

  querySelectorAll(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Add multiple event listeners efficiently
   */
  addEventListeners(selectors) {
    selectors.forEach(({ selector, event, handler }) => {
      const elements = this.querySelectorAll(selector);
      elements.forEach((el) => {
        el.addEventListener(event, handler.bind(this));
      });
    });
  }

  /**
   * Set multiple data attributes
   */
  setData(element, data) {
    Object.keys(data).forEach((key) => {
      element.dataset[key] = data[key];
    });
  }

  /**
   * Get multiple data attributes
   */
  getData(element, keys) {
    const result = {};
    keys.forEach((key) => {
      result[key] = element.dataset[key];
    });
    return result;
  }

  /**
   * Show/hide elements efficiently
   */
  show(selector) {
    const el = this.querySelector(selector);
    if (el) el.style.display = "";
  }

  hide(selector) {
    const el = this.querySelector(selector);
    if (el) el.style.display = "none";
  }

  toggle(selector) {
    const el = this.querySelector(selector);
    if (el) el.style.display = el.style.display === "none" ? "" : "none";
  }

  /**
   * Format date efficiently
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  /**
   * Safe JSON operations
   */
  parseJSON(str, fallback = null) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  stringifyJSON(obj) {
    try {
      return JSON.stringify(obj);
    } catch {
      return null;
    }
  }
}

// Create global instance
const appManager = new AppManager();

/**
 * Utility: Format percentage
 */
function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

/**
 * Utility: Format attendance status
 */
function formatStatus(status) {
  const statusMap = {
    present: "✅ Present",
    absent: "❌ Absent",
    late: "⏰ Late",
    excused: "ℹ️ Excused",
  };
  return statusMap[status] || status;
}

/**
 * Utility: Get status color
 */
function getStatusColor(status) {
  const colorMap = {
    present: "#28a745",
    absent: "#dc3545",
    late: "#ffc107",
    excused: "#17a2b8",
  };
  return colorMap[status] || "#999";
}

/**
 * Global error handler
 */
function handleError(error, context = "") {
  console.error(`[${context}] Error:`, error);

  // Check if it's a 500 error from server
  if (error.response?.status === 500) {
    console.error("Server error - check backend logs");
    return {
      success: false,
      message: "Server error. Please try again later.",
    };
  }

  return {
    success: false,
    message: error.message || "An error occurred",
  };
}

/**
 * Global success notification
 */
function showNotification(message, type = "success") {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Can be extended to show toast notifications
}
