import React from "react";
import { Card, Row, Col, Statistic, Button, Typography, Progress } from "antd";
import {
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  RocketOutlined,
  EditOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import "./StudentDashboard.css";

const { Title, Text } = Typography;

const StudentDashboard: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;

  return (
    <div className="student-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <Title level={2}>Welcome back, {user?.name}! 👋</Title>
          <Text className="welcome-subtitle">
            Ready to take the next step in your career journey?
          </Text>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <Text strong>{user?.name}</Text>
            <Text className="user-role">{user?.track}</Text>
          </div>
        </div>
      </div>

      {/* Profile Completion Section */}
      <Card className="profile-completion-card" bordered={false}>
        <div className="profile-completion-header">
          <div>
            <Title level={4}>Complete Your Profile</Title>
            <Text>
              A complete profile increases your match score by up to 30%
            </Text>
          </div>
          <div className="completion-score">
            <Progress
              type="circle"
              percent={user?.profileCompletion || 85}
              width={80}
              strokeColor="#1a1a2e"
            />
          </div>
        </div>

        <div className="profile-actions">
          <Button icon={<PlusOutlined />} type="default">
            Add Projects
          </Button>
          <Button icon={<UploadOutlined />} type="default">
            Upload Resume
          </Button>
          <Button icon={<EditOutlined />} type="default">
            Add Skills
          </Button>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card blue-card">
            <Statistic
              title="Active Applications"
              value={12}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card green-card">
            <Statistic
              title="Interview Requests"
              value={4}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card purple-card">
            <Statistic
              title="Top Match Score"
              value={95}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card orange-card">
            <Statistic
              title="Recommended Jobs"
              value={28}
              prefix={<RocketOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]} className="main-content">
        {/* Top Matches */}
        <Col xs={24} lg={16}>
          <Card
            title="Top Matches For You"
            bordered={false}
            extra={<Button type="link">View All</Button>}
            className="matches-card"
          >
            <div className="match-item">
              <div className="match-header">
                <div>
                  <Title level={5}>Frontend Developer Intern</Title>
                  <Text>TechCorp Inc.</Text>
                </div>
                <div className="match-score green">95% Match</div>
              </div>
              <div className="match-details">
                <Text>📍 San Francisco, CA • Remote</Text>
                <Text>⏰ 3 months • 💰 $2,000/month</Text>
              </div>
              <Text className="match-description">
                Join our frontend team to build modern web applications
              </Text>
              <div className="match-skills">
                <span className="skill-tag">React</span>
                <span className="skill-tag">TypeScript</span>
                <span className="skill-tag">CSS</span>
              </div>
              <div className="match-breakdown">
                <Text strong>Match Score Breakdown:</Text>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-segment"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="match-item">
              <div className="match-header">
                <div>
                  <Title level={5}>Full Stack Intern</Title>
                  <Text>StartupXYZ</Text>
                </div>
                <div className="match-score blue">88% Match</div>
              </div>
              <div className="match-details">
                <Text>📍 New York, NY • Hybrid</Text>
                <Text>⏰ 6 months • 💰 $2,500/month</Text>
              </div>
              <Text className="match-description">
                Build scalable applications with our engineering team
              </Text>
              <div className="match-skills">
                <span className="skill-tag">React</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">MongoDB</span>
              </div>
              <div className="match-breakdown">
                <Text strong>Match Score Breakdown:</Text>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-segment"
                    style={{ width: "88%" }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card title="Quick Actions" bordered={false} className="actions-card">
            <div className="action-item">
              <BookOutlined className="action-icon" />
              <div>
                <Title level={5}>Find Internships</Title>
                <Text>Discover new opportunities</Text>
              </div>
              <Button type="primary" size="small">
                Go
              </Button>
            </div>

            <div className="action-item">
              <TeamOutlined className="action-icon" />
              <div>
                <Title level={5}>Mock Interviews</Title>
                <Text>Practice with AI feedback</Text>
              </div>
              <Button type="primary" size="small">
                Book
              </Button>
            </div>

            <div className="action-item">
              <TrophyOutlined className="action-icon" />
              <div>
                <Title level={5}>Skill Analysis</Title>
                <Text>Identify skill gaps</Text>
              </div>
              <Button type="primary" size="small">
                Analyze
              </Button>
            </div>

            <div className="action-item">
              <RocketOutlined className="action-icon" />
              <div>
                <Title level={5}>Project Gallery</Title>
                <Text>Showcase your work</Text>
              </div>
              <Button type="primary" size="small">
                Add
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
