// ===== AUTHENTICATION UI MODULE =====
// Handles UI logic for signup and login

class AuthUI {
  constructor() {
    this.selectedRole = null;
    this.isLoadingLogin = false;
    this.isLoadingSignup = false;
    this.initializeEventListeners();
    this.checkExistingAuth();
  }

  /**
   * Initialize all event listeners - Optimized with event delegation
   */
  initializeEventListeners() {
    // Single delegated listener for role buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("role-btn")) {
        this.selectRole(e.target);
      }
    });

    // Form submissions
    const handleFormSubmit = (formId, handler) => {
      const form = document.getElementById(formId);
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          handler.call(this, e);
        });
      }
    };

    handleFormSubmit("loginForm", this.handleLogin);
    handleFormSubmit("signupForm", this.handleSignup);

    // Navigation buttons
    const setupButton = (btnId, handler) => {
      const btn = document.getElementById(btnId);
      if (btn) btn.addEventListener("click", () => handler.call(this));
    };

    setupButton("switchToSignup", this.showSignupForm);
    setupButton("switchToLogin", this.showLoginForm);
    setupButton("backBtn", this.showRoleSelection);
    setupButton("backBtn2", this.showRoleSelection);
  }

  /**
   * Check if user is already authenticated
   */
  checkExistingAuth() {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      if (user && user.role) {
        // Redirect to appropriate dashboard
        setTimeout(() => {
          if (user.role === "teacher") {
            window.location.href = "teacher.html";
          } else if (user.role === "student") {
            window.location.href = "student.html";
          }
        }, 500);
      }
    }
  }

  /**
   * Select a role (teacher or student)
   */
  selectRole(btn) {
    // Update button states
    document.querySelectorAll(".role-btn").forEach((b) => {
      b.classList.remove("active");
    });
    btn.classList.add("active");

    this.selectedRole = btn.dataset.role;
    this.showLoginForm();
  }

  /**
   * Show login form
   */
  showLoginForm() {
    if (!this.selectedRole) {
      this.showMessage("Please select a role first", "error");
      return;
    }

    document.getElementById("roleSelection").style.display = "none";
    document.getElementById("loginFormContainer").style.display = "block";
    document.getElementById("signupFormContainer").style.display = "none";
    document.getElementById("demoInfo").style.display = "block";

    // Clear form
    document.getElementById("loginForm").reset();
  }

  /**
   * Show signup form
   */
  showSignupForm() {
    if (!this.selectedRole) {
      this.showMessage("Please select a role first", "error");
      return;
    }

    document.getElementById("roleSelection").style.display = "none";
    document.getElementById("loginFormContainer").style.display = "none";
    document.getElementById("signupFormContainer").style.display = "block";
    document.getElementById("demoInfo").style.display = "none";

    // Show role-specific fields
    if (this.selectedRole === "teacher") {
      document.getElementById("teacherFields").style.display = "block";
      document.getElementById("studentFields").style.display = "none";
    } else if (this.selectedRole === "student") {
      document.getElementById("teacherFields").style.display = "none";
      document.getElementById("studentFields").style.display = "block";
    }

    // Clear form
    document.getElementById("signupForm").reset();
  }

  /**
   * Show role selection
   */
  showRoleSelection() {
    document.getElementById("roleSelection").style.display = "block";
    document.getElementById("loginFormContainer").style.display = "none";
    document.getElementById("signupFormContainer").style.display = "none";
    document.getElementById("demoInfo").style.display = "block";

    // Clear selection
    document.querySelectorAll(".role-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    this.selectedRole = null;
  }

  /**
   * Handle login form submission - Optimized with better validation
   */
  async handleLogin(e) {
    e.preventDefault();

    if (!this.selectedRole) {
      this.showMessage("Please select a role", "error");
      return;
    }

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // Validate input
    if (!email || !password) {
      this.showMessage("Please fill in all fields", "error");
      return;
    }

    // Validate email format
    if (!email.includes("@")) {
      this.showMessage("Please enter a valid email address", "error");
      return;
    }

    // Show loading state
    this.isLoadingLogin = true;
    const loginBtn = document.getElementById("loginBtn");
    const originalText = loginBtn.textContent;
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
      // Try backend authentication
      const result = await authService.login(email, password);

      if (result.success) {
        this.showMessage(result.message || "Login successful!", "success");
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem("currentUser"));
          const redirectUrl =
            user?.role === "teacher" ? "teacher.html" : "student.html";
          globalThis.location.href = redirectUrl;
        }, 1000);
      } else {
        this.showMessage(result.message || "Login failed", "error");
        document.getElementById("loginPassword").value = "";
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showMessage(`Login failed: ${error.message}`, "error");
    } finally {
      this.isLoadingLogin = false;
      loginBtn.disabled = false;
      loginBtn.textContent = originalText;
    }
  }

  /**
   * Handle signup form submission - Optimized with better validation
   */
  async handleSignup(e) {
    e.preventDefault();

    if (!this.selectedRole) {
      this.showMessage("Please select a role", "error");
      return;
    }

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document
      .getElementById("signupConfirmPassword")
      .value.trim();

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      this.showMessage("Please fill in all fields", "error");
      return;
    }

    if (name.length < 2) {
      this.showMessage("Name must be at least 2 characters", "error");
      return;
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      this.showMessage("Please enter a valid email address", "error");
      return;
    }

    // Validate password
    if (password.length < 6) {
      this.showMessage("Password must be at least 6 characters", "error");
      return;
    }

    if (password !== confirmPassword) {
      this.showMessage("Passwords do not match", "error");
      return;
    }

    // Build user data
    const userData = {
      name,
      email,
      password,
      role: this.selectedRole,
    };

    // Add role-specific fields
    if (this.selectedRole === "teacher") {
      userData.department =
        document.getElementById("signupDepartment").value || "General";
      const subjectsInput = document
        .getElementById("signupSubjects")
        .value.trim();
      userData.subjects = subjectsInput
        ? subjectsInput.split(",").map((s) => s.trim())
        : [];
    } else if (this.selectedRole === "student") {
      userData.studentId =
        document.getElementById("signupStudentId").value.trim() ||
        `S${Date.now()}`;
      userData.semester =
        Number.parseInt(document.getElementById("signupSemester").value, 10) ||
        1;
    }

    // Show loading state
    this.isLoadingSignup = true;
    const signupBtn = document.getElementById("signupBtn");
    const originalText = signupBtn.textContent;
    signupBtn.disabled = true;
    signupBtn.textContent = "Creating account...";

    try {
      const result = await authService.signup(userData);

      if (result.success) {
        this.showMessage(
          result.message || "Account created successfully!",
          "success",
        );
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem("currentUser"));
          const redirectUrl =
            user?.role === "teacher" ? "teacher.html" : "student.html";
          globalThis.location.href = redirectUrl;
        }, 1000);
      } else {
        this.showMessage(result.message || "Signup failed", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      this.showMessage(`Signup failed: ${error.message}`, "error");
    } finally {
      this.isLoadingSignup = false;
      signupBtn.disabled = false;
      signupBtn.textContent = originalText;
    }
  }

  /**
   * Check hardcoded demo credentials
   */
  checkHardcodedCredentials(email, password) {
    if (this.selectedRole === "teacher") {
      return email === "teacher" && password === "teacher";
    } else if (this.selectedRole === "student") {
      return email === "student" && password === "student";
    }
    return false;
  }

  /**
   * Create mock user object for hardcoded credentials
   */
  createMockUser(email) {
    return {
      id: `${this.selectedRole}_${Date.now()}`,
      email,
      name: this.selectedRole === "teacher" ? "Teacher User" : "Student User",
      role: this.selectedRole,
      ...(this.selectedRole === "teacher" && {
        employeeId: "EMP001",
        department: "General",
      }),
      ...(this.selectedRole === "student" && {
        studentId: "S001",
        semester: 1,
      }),
    };
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Show message to user - Optimized with better type handling
   */
  showMessage(message, type = "info") {
    const container = document.getElementById("messageContainer");
    if (!container) return;

    // Map message type to CSS class
    const messageClassMap = {
      error: "error-message",
      success: "success-message",
      info: "info-message",
    };

    const messageClass = messageClassMap[type] || "info-message";

    const messageEl = document.createElement("div");
    messageEl.className = messageClass;
    messageEl.textContent = message;

    container.innerHTML = "";
    container.appendChild(messageEl);

    if (type !== "error") {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 5000);
    }
  }
}

// Initialize auth UI when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Global auth UI instance for form handling
  globalThis.authUI = new AuthUI();
});
