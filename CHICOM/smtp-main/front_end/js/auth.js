// front_end/js/auth.js
const API_BASE = "http://localhost:8000/v1";

// Gửi request API có tự động refresh token
async function apiFetch(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";
  if (accessToken) headers["Authorization"] = "Bearer " + accessToken;

  const res = await fetch(API_BASE + url, {
    ...options,
    headers,
    credentials: "include"
  });

  if (res.status === 401) {
    // Token có thể hết hạn → thử refresh
    const success = await refreshAccessToken();
    if (!success) {
      console.warn("Refresh token failed. Redirect to login...");
      logout();
      return;
    }
    // Gọi lại request cũ sau khi refresh
    return await apiFetch(url, options);
  }

  return res;
}

// Hàm refresh access token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const res = await fetch(API_BASE + "/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return true;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return false;
  }
}

// Hàm logout
function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "D:\Larry\IC&AIOT_LAB\CHICOM\smtp-main\front_end\login.html";
}
