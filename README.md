## Frontend Usage: Login & Logout

This section shows how to call the backend authentication routes (`/login` and `/logout`) from the frontend using JavaScript.

---

### 1️⃣ Login Example

```js
// Login function
const handleLogin = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3500/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save access token and user info
      localStorage.setItem("accessToken", data.data.access.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      }));

      alert("Login successful!");
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
};

// Logout function
const handleLogout = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3500/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // send access token
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Clear token and user info
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      alert(data.message || "Logged out successfully!");
    } else {
      alert(data.message || "Logout failed!");
    }
  } catch (err) {
    console.error("Logout error:", err);
    alert("Something went wrong. Please try again.");
  }
};