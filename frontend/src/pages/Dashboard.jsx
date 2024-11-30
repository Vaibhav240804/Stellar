import React, { useEffect, useState } from "react";
import { Avatar, Typography, Spin, Row, Col } from "antd";
import { fetchUserData } from "../utils/api";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        console.log(data);
        if (data) {
          setUser(data);
        } else {
          throw new Error("User not authenticated");
        }
      } catch (error) {
        console.log(error);
        window.location.href = `${backendURL}/api/auth/google`;
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return (
      <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Row>
    );
  }

  return (
    <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
      {user ? (
        <Col>
          <Avatar
            src={user.avatar}
            size={64}
            style={{ marginBottom: "10px" }}
          />
          <Title level={3}>{user.name}</Title>
          <Text>{user.email}</Text>
        </Col>
      ) : (
        <Title level={3}>You are not logged in.</Title>
      )}
    </Row>
  );
};

export default Dashboard;
