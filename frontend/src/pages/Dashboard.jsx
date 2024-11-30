import React from "react";
import { Avatar, Typography, Spin, Row, Col } from "antd";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { email, name, avatar } = useSelector((state) => state.auth);
  

  return (
    <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
      {email ? (
        <Col>
          <Avatar src={avatar} size={64} style={{ marginBottom: "10px" }} />
          <Title level={3}>{name}</Title>
          <Text>{email}</Text>
        </Col>
      ) : (
        <Title level={3}>You are not logged in.</Title>
      )}
    </Row>
  );
};

export default Dashboard;
