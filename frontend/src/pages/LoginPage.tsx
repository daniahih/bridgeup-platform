import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Checkbox } from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<"student" | "company">(
    "student"
  );
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await login(values.email, values.password, accountType);
      message.success("Login successful!");

      // Navigate based on role
      if (accountType === "student") {
        navigate("/dashboard");
      } else {
        navigate("/company-dashboard");
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo and Header */}
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">🎓</div>
          </div>
          <Title level={1} className="welcome-title">
            Welcome to Bridge Up
          </Title>
          <Text className="welcome-subtitle">
            Sign in to continue to your dashboard
          </Text>
        </div>

        {/* Account Type Toggle */}
        <div className="signin-section">
          <Title level={4} className="signin-title">
            Sign in to your account
          </Title>
          <Text className="signin-subtitle">
            Choose your account type to get started
          </Text>

          <div className="account-toggle">
            <button
              className={`toggle-btn ${
                accountType === "student" ? "active" : ""
              }`}
              onClick={() => setAccountType("student")}
            >
              <UserOutlined /> Student
            </button>
            <button
              className={`toggle-btn ${
                accountType === "company" ? "active" : ""
              }`}
              onClick={() => setAccountType("company")}
            >
              🏢 Company
            </button>
          </div>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="login-form"
        >
          <Form.Item
            name="email"
            label={
              accountType === "student"
                ? "Email Address"
                : "Company Email Address"
            }
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              size="large"
              placeholder={
                accountType === "student"
                  ? "student@university.edu"
                  : "recruiter@company.com"
              }
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
            extra={
              <div className="password-extra">
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>
            }
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
              className="login-input"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me for 30 days</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="login-button"
              block
            >
              {`Sign in as ${
                accountType === "student" ? "Student" : "Company"
              }`}
            </Button>
          </Form.Item>
        </Form>

        {/* Social Login */}
        <div className="social-login-section">
          <div className="divider">
            <Text className="divider-text">OR CONTINUE WITH</Text>
          </div>

          <div className="social-buttons">
            <Button
              size="large"
              icon={<GoogleOutlined />}
              className="social-button google-button"
              onClick={() => {
                const apiUrl = import.meta.env.VITE_API_URL || 
                  (window.location.hostname.includes('vercel.app') 
                    ? 'https://intuitive-insight-production.up.railway.app/api'
                    : 'http://localhost:5001/api');
                console.log('Google OAuth URL:', `${apiUrl}/auth/google?role=${accountType}`);
                window.location.href = `${apiUrl}/auth/google?role=${accountType}`;
              }}
            >
              Google
            </Button>
            <Button
              size="large"
              icon={
                accountType === "student" ? (
                  <GithubOutlined />
                ) : (
                  <div className="linkedin-icon">💼</div>
                )
              }
              className="social-button github-button"
              disabled
              onClick={() => message.info("OAuth not configured yet")}
            >
              {accountType === "student" ? "GitHub" : "LinkedIn"}
            </Button>
          </div>
        </div>

        {/* Register Link */}
        <div className="register-section">
          <Text>Don't have an account? </Text>
          <Link to="/signup" className="register-link">
            {accountType === "student"
              ? "Sign up for free"
              : "Register your company"}
          </Link>
        </div>

        {/* Trust Section */}
        <div className="trust-section">
          <Text className="trust-text">Trusted by leading institutions</Text>
          <div className="trust-logos">
            <span>Harvard</span>
            <span>MIT</span>
            <span>Stanford</span>
            <span>Google</span>
            <span>Microsoft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
