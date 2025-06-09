"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import CryptoJS from "crypto-js";
import { setCookie } from "@/utils/cookieUtils";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log("Already authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login for:", email);
      
      // Validate locally first
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (password.length > 20) {
        throw new Error("Password must be less than or equal to 20 characters");
      }

      // Safe API call with proper URL construction
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.NEXT_PUBLIC_CRYPTO_KEY || "fallback_key"
      ).toString();

      console.log("Making API request to:", `${baseUrl}/api/admin/login`);
      
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: encryptedPassword }),
      });

      const data = await response.json();
      console.log("Login response received:", { success: response.ok, status: response.status });

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // Verify admin role
      if (!data.userdata || data.userdata.role !== "admin") {
        throw new Error("Unauthorized access");
      }

      console.log("Login successful, setting cookies...");
      
      // Store in cookies
      setCookie("adminToken", data.userdata.sessionToken, 7);
      setCookie("adminUser", data.userdata, 7);

      console.log("Redirecting to dashboard...");
      // Navigate to dashboard
      router.push("/dashboard");
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-800/50 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-zinc-100">Admin Login</h1>
            <p className="text-zinc-400 mt-2">
              Welcome back! Please login to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-zinc-300">
                Email
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-zinc-300">
                Password
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => {
                  if (e.target.value.length <= 20) {
                    setPassword(e.target.value);
                  }
                }}
                maxLength={20}
                toggleMask
                className="w-full"
                required
                feedback={false}
              />
            </div>

            {error && (
              <Message severity="error" text={error} className="w-full" />
            )}

            <Button
              type="submit"
              label={loading ? "Logging in..." : "Login"}
              disabled={loading}
              className="w-full"
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
