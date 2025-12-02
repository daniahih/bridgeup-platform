import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Select } from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  GithubOutlined,
  MailOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css";

const { Title, Text } = Typography;
const { Option } = Select;

const SignupPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<"student" | "company">(
    "student"
  );
  const { register } = useAuth();
  const navigate = useNavigate();

  const studentTracks = ["Fullstack", "QA", "Data", "DevOps", "Cyber Security"];

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const userData = {
        ...values,
        role: accountType,
      };

      await register(userData);
      message.success("Account created successfully!");

      // Navigate based on role
      if (accountType === "student") {
        navigate("/dashboard");
      } else {
        navigate("/company-dashboard");
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      // Redirect to backend Google OAuth
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5001/api";
      window.location.href = `${apiUrl}/auth/google?role=${accountType}`;
    } catch (error) {
      message.error("Google signup failed");
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    message.info("GitHub OAuth not configured yet. Please use email signup.");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Logo and Header */}
        <div className="signup-header">
          <div className="logo">
            <div className="logo-icon">
              <BuildOutlined />
            </div>
          </div>
          <Title level={2} className="welcome-title">
            Join BridgeUp
          </Title>
          <Text className="welcome-subtitle">
            {accountType === "student"
              ? "Start your internship journey"
              : "Find talented interns"}
          </Text>
        </div>

        {/* Account Type Toggle */}
        <div className="account-toggle">
          <button
            className={`toggle-btn ${
              accountType === "student" ? "active" : ""
            }`}
            onClick={() => setAccountType("student")}
          >
            <UserOutlined />
            Student
          </button>
          <button
            className={`toggle-btn ${
              accountType === "company" ? "active" : ""
            }`}
            onClick={() => setAccountType("company")}
          >
            <BuildOutlined />
            Company
          </button>
        </div>

        {/* Social Signup Buttons */}
        <div className="social-signup-section">
          <div className="social-buttons">
            <Button
              size="large"
              icon={<GoogleOutlined />}
              className="social-button google-button"
              onClick={handleGoogleSignup}
              loading={loading}
              block
            >
              Continue with Google
            </Button>
            <Button
              size="large"
              icon={<GithubOutlined />}
              className="social-button github-button"
              onClick={handleGithubSignup}
              loading={loading}
              block
            >
              Continue with GitHub
            </Button>
          </div>

          <div className="divider">
            <Text className="divider-text">OR SIGN UP WITH EMAIL</Text>
          </div>
        </div>

        {/* Signup Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="signup-form"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter your full name!" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input
              size="large"
              placeholder="John Doe"
              className="form-input"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
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
              className="form-input"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          {accountType === "company" && (
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[
                { required: true, message: "Please enter your company name!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Google Inc."
                className="form-input"
                prefix={<BuildOutlined />}
              />
            </Form.Item>
          )}

          {accountType === "student" && (
            <Form.Item
              name="track"
              label="Track"
              rules={[{ required: true, message: "Please select your track!" }]}
            >
              <Select
                size="large"
                placeholder="Select your track"
                className="form-select"
              >
                {studentTracks.map((track) => (
                  <Option key={track} value={track}>
                    {track}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain uppercase, lowercase, and number",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Create a strong password"
              className="form-input"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Confirm your password"
              className="form-input"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="signup-button"
              block
            >
              {`Create ${
                accountType === "student" ? "Student" : "Company"
              } Account`}
            </Button>
          </Form.Item>
        </Form>

        {/* Login Link */}
        <div className="login-section">
          <Text>Already have an account? </Text>
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
