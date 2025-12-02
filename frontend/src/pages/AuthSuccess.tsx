import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin, Result } from "antd";

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        navigate("/login?error=" + error);
        return;
      }

      if (token) {
        // Store token and redirect based on user role
        localStorage.setItem("token", token);

        try {
          // Get user info from token or make API call
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5001/api";
          const response = await fetch(`${apiUrl}/auth/profile`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const user = data.user;

            localStorage.setItem("user", JSON.stringify(user));

            // Redirect based on role
            if (user.role === "student") {
              navigate("/dashboard");
            } else {
              navigate("/company-dashboard");
            }
          } else {
            navigate("/login?error=auth_failed");
          }
        } catch (error) {
          console.error("Auth success error:", error);
          navigate("/login?error=auth_failed");
        }
      } else {
        navigate("/login");
      }
    };

    const timer = setTimeout(handleAuthSuccess, 1000);
    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Result
        icon={<Spin size="large" />}
        title="Completing Authentication..."
        subTitle="Please wait while we log you in"
      />
    </div>
  );
};

export default AuthSuccess;
