"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "../redux/slices/authSlice";
import { getCookie } from "../utils/cookieUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, loading: reduxLoading } = useSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Initial auth check on mount with timeout
  useEffect(() => {
    console.log("AuthProvider mounted, checking authentication...");

    dispatch(setLoading(true));

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error("Authentication check timeout - forcing completion");
      setLoadingTimeout(true);
      dispatch(setLoading(false));
      setInitialized(true);
    }, 5000); // 5 seconds timeout

    const checkAuth = async () => {
      try {
        console.log("Running authentication check...");

        const token = getCookie("adminToken");
        const userData = getCookie("adminUser", true);

        console.log("Auth check results:", {
          hasToken: !!token,
          hasUserData: !!userData,
          userRole: userData?.role,
        });

        if (!token || !userData || userData.role !== "admin") {
          console.log("Not authenticated, clearing user");
          dispatch(clearUser());
          if (pathname !== "/login") {
            router.push("/login");
          }
        } else {
          console.log("Authentication successful, setting user");
          dispatch(setUser(userData));
          if (pathname === "/login") {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch(clearUser());
      } finally {
        console.log("Auth check completed, finishing initialization");
        clearTimeout(timeoutId);
        dispatch(setLoading(false));
        setInitialized(true);
      }
    };

    checkAuth();

    return () => clearTimeout(timeoutId);
  }, []);

  // Debug any changes to loading or initialized state
  useEffect(() => {
    console.log("Auth state changed:", {
      reduxLoading,
      initialized,
      loadingTimeout,
      user: user ? `${user.email} (${user.role})` : "none",
    });
  }, [reduxLoading, initialized, loadingTimeout, user]);

  const logout = () => {
    console.log("Logging out user");
    dispatch(clearUser());
    router.push("/login");
  };

  // Force render after timeout even if still loading
  const isActuallyLoading = reduxLoading && !loadingTimeout;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isActuallyLoading,
        logout,
        initialized,
        isAuthenticated: !!user,
      }}
    >
      {initialized || loadingTimeout ? (
        children
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900">
          <div className="text-white text-xl mb-4">
            Initializing application...
          </div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
